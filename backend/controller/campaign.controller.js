import pool from '../config/db.js';

export const createCampaign = async (req, res) => {
    const client = await pool.connect();

    try {
        const { name, objective, description, team, startDate, endDate } = req.body;
        const creatorId = req.user.internalId;

        await client.query('BEGIN');

        // 1. Create Campaign
        const campaignQuery = `
            INSERT INTO campaigns (name, objective, description, start_date, end_date, created_by)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id;
        `;
        const campaignResult = await client.query(campaignQuery, [
            name,
            objective,
            description || null,
            startDate || null,
            endDate || null,
            creatorId
        ]);
        const campaignId = campaignResult.rows[0].id;

        // 2. Fetch Admin Role ID
        const adminRoleQuery = "SELECT id FROM roles WHERE name = 'admin'";
        const adminRoleResult = await client.query(adminRoleQuery);
        const adminRoleId = adminRoleResult.rows[0].id;

        // 3. Assign Creator as Admin
        const memberQuery = `
            INSERT INTO campaign_members (campaign_id, user_id, role_id)
            VALUES ($1, $2, $3);
        `;
        await client.query(memberQuery, [campaignId, creatorId, adminRoleId]);

        // 4. Assign other team members (if any)
        if (team && Array.isArray(team)) {
            for (const member of team) {
                // member structure: { userId: 'uuid', roles: ['editor', 'marketer'] }
                if (member.userId && member.roles && Array.isArray(member.roles)) {
                    for (const roleName of member.roles) {
                        const roleQuery = "SELECT id FROM roles WHERE name = $1";
                        const roleResult = await client.query(roleQuery, [roleName]);

                        if (roleResult.rows.length > 0) {
                            await client.query(memberQuery, [campaignId, member.userId, roleResult.rows[0].id])
                                .catch(err => {
                                    if (err.code !== '23505') throw err;
                                });
                        }
                    }
                }
            }
        }

        await client.query('COMMIT');

        res.status(201).json({
            message: "Campaign created successfully",
            campaignId: campaignId
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Create Campaign Error:", error);
        res.status(500).json({ message: "Failed to create campaign" });
    } finally {
        client.release();
    }
};

export const listCampaigns = async (req, res) => {
    try {
        const userId = req.user.internalId;

        // Fetch campaigns where user is a member
        // DISTINCT to avoid duplicates if user has multiple roles in same campaign
        const query = `
            SELECT DISTINCT c.*
            FROM campaigns c
            JOIN campaign_members cm ON c.id = cm.campaign_id
            WHERE cm.user_id = $1
            ORDER BY c.created_at DESC;
        `;

        // TODO: specific logic for super_admin to see ALL? 
        // For now, let's stick to "my campaigns" logic as per Dashboard requirement.

        const result = await pool.query(query, [userId]);
        res.json(result.rows);

    } catch (error) {
        console.error("List Campaigns Error:", error);
        res.status(500).json({ message: "Failed to fetch campaigns" });
    }
};

export const getCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM campaigns WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Campaign not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Get Campaign Error:", error);
        res.status(500).json({ message: "Failed to fetch campaign details" });
    }
};

export const getCampaignTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT u.id, u.name, u.email, array_agg(r.name) as roles
            FROM campaign_members cm
            JOIN users u ON cm.user_id = u.id
            JOIN roles r ON cm.role_id = r.id
            WHERE cm.campaign_id = $1
            GROUP BY u.id, u.name, u.email;
        `;
        const result = await pool.query(query, [id]);
        res.json(result.rows);
    } catch (error) {
        console.error("Get Team Error:", error);
        res.status(500).json({ message: "Failed to fetch team" });
    }
};

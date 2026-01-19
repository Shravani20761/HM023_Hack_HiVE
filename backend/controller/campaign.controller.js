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
                            // Check for duplicates before inserting or just catch error?
                            // Simple way: just try insert, if unique violation, ignore.
                            // But cleaner:
                            await client.query(memberQuery, [campaignId, member.userId, roleResult.rows[0].id])
                                .catch(err => {
                                    if (err.code !== '23505') throw err; // Ignore unique violation
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

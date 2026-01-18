import pool from '../config/db.js';

// Create schedule
export const createSchedule = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { contentId, channel, scheduledTime } = req.body;
        const userId = req.user.internalId;

        const query = `
            INSERT INTO schedules (campaign_id, content_id, channel, scheduled_time, created_by, status)
            VALUES ($1, $2, $3, $4, $5, 'pending')
            RETURNING *
        `;

        const result = await pool.query(query, [
            campaignId,
            contentId,
            channel,
            scheduledTime,
            userId
        ]);

        res.status(201).json({
            message: "Schedule created successfully",
            schedule: result.rows[0]
        });

    } catch (error) {
        console.error("Create Schedule Error:", error);
        res.status(500).json({ message: "Failed to create schedule" });
    }
};

// List schedules
export const listSchedules = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { status, channel } = req.query;

        let query = `
            SELECT
                s.*,
                c.title as content_title,
                u.name as created_by_name
            FROM schedules s
            LEFT JOIN content c ON s.content_id = c.id
            LEFT JOIN users u ON s.created_by = u.id
            WHERE s.campaign_id = $1
        `;

        const params = [campaignId];

        if (status) {
            query += ` AND s.status = $${params.length + 1}`;
            params.push(status);
        }

        if (channel) {
            query += ` AND s.channel = $${params.length + 1}`;
            params.push(channel);
        }

        query += ` ORDER BY s.scheduled_time ASC`;

        const result = await pool.query(query, params);
        res.json(result.rows);

    } catch (error) {
        console.error("List Schedules Error:", error);
        res.status(500).json({ message: "Failed to fetch schedules" });
    }
};

// Get schedule
export const getSchedule = async (req, res) => {
    try {
        const { campaignId, scheduleId } = req.params;

        const query = `
            SELECT
                s.*,
                c.title as content_title,
                u.name as created_by_name
            FROM schedules s
            LEFT JOIN content c ON s.content_id = c.id
            LEFT JOIN users u ON s.created_by = u.id
            WHERE s.id = $1 AND s.campaign_id = $2
        `;

        const result = await pool.query(query, [scheduleId, campaignId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Schedule not found" });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Get Schedule Error:", error);
        res.status(500).json({ message: "Failed to fetch schedule" });
    }
};

// Update schedule
export const updateSchedule = async (req, res) => {
    try {
        const { campaignId, scheduleId } = req.params;
        const { scheduledTime, channel } = req.body;

        const query = `
            UPDATE schedules
            SET scheduled_time = COALESCE($1, scheduled_time),
                channel = COALESCE($2, channel)
            WHERE id = $3 AND campaign_id = $4
            RETURNING *
        `;

        const result = await pool.query(query, [scheduledTime || null, channel || null, scheduleId, campaignId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Schedule not found" });
        }

        res.json({
            message: "Schedule updated successfully",
            schedule: result.rows[0]
        });

    } catch (error) {
        console.error("Update Schedule Error:", error);
        res.status(500).json({ message: "Failed to update schedule" });
    }
};

// Delete schedule
export const deleteSchedule = async (req, res) => {
    try {
        const { campaignId, scheduleId } = req.params;

        const query = `DELETE FROM schedules WHERE id = $1 AND campaign_id = $2 RETURNING *`;
        const result = await pool.query(query, [scheduleId, campaignId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Schedule not found" });
        }

        res.json({ message: "Schedule deleted successfully" });

    } catch (error) {
        console.error("Delete Schedule Error:", error);
        res.status(500).json({ message: "Failed to delete schedule" });
    }
};

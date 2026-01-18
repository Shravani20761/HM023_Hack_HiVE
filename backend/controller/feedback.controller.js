import pool from '../config/db.js';
import { analyzeSentiment } from '../services/ai.service.js';

// Create/ingest feedback
export const createFeedback = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { source, authorName, authorId, message, contentId } = req.body;

        // Analyze sentiment
        const sentiment = await analyzeSentiment(message);

        const query = `
            INSERT INTO feedback (campaign_id, content_id, source, author_name, author_id, message, sentiment, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'unread')
            RETURNING *
        `;

        const result = await pool.query(query, [
            campaignId,
            contentId || null,
            source,
            authorName,
            authorId,
            message,
            sentiment
        ]);

        res.status(201).json({
            message: "Feedback created successfully",
            feedback: result.rows[0]
        });

    } catch (error) {
        console.error("Create Feedback Error:", error);
        res.status(500).json({ message: "Failed to create feedback" });
    }
};

// List feedback
export const listFeedback = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { status, sentiment, source } = req.query;

        let query = `
            SELECT
                f.*,
                c.title as content_title,
                assigned_user.name as assigned_to_name
            FROM feedback f
            LEFT JOIN content c ON f.content_id = c.id
            LEFT JOIN users assigned_user ON f.assigned_to = assigned_user.id
            WHERE f.campaign_id = $1
        `;

        const params = [campaignId];

        if (status) {
            query += ` AND f.status = $${params.length + 1}`;
            params.push(status);
        }

        if (sentiment) {
            query += ` AND f.sentiment = $${params.length + 1}`;
            params.push(sentiment);
        }

        if (source) {
            query += ` AND f.source = $${params.length + 1}`;
            params.push(source);
        }

        query += ` ORDER BY f.created_at DESC`;

        const result = await pool.query(query, params);
        res.json(result.rows);

    } catch (error) {
        console.error("List Feedback Error:", error);
        res.status(500).json({ message: "Failed to fetch feedback" });
    }
};

// Get feedback
export const getFeedback = async (req, res) => {
    try {
        const { campaignId, feedbackId } = req.params;

        const query = `
            SELECT
                f.*,
                c.title as content_title,
                assigned_user.name as assigned_to_name
            FROM feedback f
            LEFT JOIN content c ON f.content_id = c.id
            LEFT JOIN users assigned_user ON f.assigned_to = assigned_user.id
            WHERE f.id = $1 AND f.campaign_id = $2
        `;

        const result = await pool.query(query, [feedbackId, campaignId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Get Feedback Error:", error);
        res.status(500).json({ message: "Failed to fetch feedback" });
    }
};

// Update feedback status
export const updateFeedbackStatus = async (req, res) => {
    try {
        const { campaignId, feedbackId } = req.params;
        const { status } = req.body;

        const query = `
            UPDATE feedback
            SET status = $1, updated_at = NOW()
            WHERE id = $2 AND campaign_id = $3
            RETURNING *
        `;

        const result = await pool.query(query, [status, feedbackId, campaignId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.json({
            message: "Feedback status updated",
            feedback: result.rows[0]
        });

    } catch (error) {
        console.error("Update Feedback Status Error:", error);
        res.status(500).json({ message: "Failed to update feedback" });
    }
};

// Assign feedback to user
export const assignFeedback = async (req, res) => {
    try {
        const { campaignId, feedbackId } = req.params;
        const { assignedToId } = req.body;

        const query = `
            UPDATE feedback
            SET assigned_to = $1, updated_at = NOW()
            WHERE id = $2 AND campaign_id = $3
            RETURNING *
        `;

        const result = await pool.query(query, [assignedToId || null, feedbackId, campaignId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.json({
            message: "Feedback assigned",
            feedback: result.rows[0]
        });

    } catch (error) {
        console.error("Assign Feedback Error:", error);
        res.status(500).json({ message: "Failed to assign feedback" });
    }
};

// Get feedback stats
export const getFeedbackStats = async (req, res) => {
    try {
        const { campaignId } = req.params;

        const query = `
            SELECT
                COUNT(*) as total,
                COALESCE(COUNT(CASE WHEN sentiment = 'positive' THEN 1 END), 0) as positive,
                COALESCE(COUNT(CASE WHEN sentiment = 'neutral' THEN 1 END), 0) as neutral,
                COALESCE(COUNT(CASE WHEN sentiment = 'negative' THEN 1 END), 0) as negative,
                COALESCE(COUNT(CASE WHEN status = 'unread' THEN 1 END), 0) as unread,
                COALESCE(COUNT(CASE WHEN status = 'replied' THEN 1 END), 0) as replied
            FROM feedback
            WHERE campaign_id = $1
        `;

        const result = await pool.query(query, [campaignId]);
        res.json(result.rows[0]);

    } catch (error) {
        console.error("Get Feedback Stats Error:", error);
        res.status(500).json({ message: "Failed to fetch feedback stats" });
    }
};

import pool from '../config/db.js';

// Create content
export const createContent = async (req, res) => {
    const client = await pool.connect();
    try {
        const { campaignId } = req.params;
        const { title, body, contentType } = req.body;
        const creatorId = req.user.internalId;

        const query = `
            INSERT INTO content (campaign_id, title, body, content_type, created_by, status)
            VALUES ($1, $2, $3, $4, $5, 'draft')
            RETURNING id, title, body, content_type, status, created_at, created_by;
        `;

        const result = await client.query(query, [
            campaignId,
            title,
            body || null,
            contentType || 'post',
            creatorId
        ]);

        res.status(201).json({
            message: "Content created successfully",
            content: result.rows[0]
        });

    } catch (error) {
        console.error("Create Content Error:", error);
        res.status(500).json({ message: "Failed to create content" });
    } finally {
        client.release();
    }
};

// List content for campaign
export const listContent = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { status } = req.query;

        let query = `
            SELECT
                c.*,
                u.name as created_by_name,
                COUNT(DISTINCT cc.id) as comment_count,
                COUNT(DISTINCT ca.id) as asset_count
            FROM content c
            LEFT JOIN users u ON c.created_by = u.id
            LEFT JOIN content_comments cc ON c.id = cc.content_id
            LEFT JOIN content_assets ca ON c.id = ca.content_id
            WHERE c.campaign_id = $1
        `;

        const params = [campaignId];

        if (status) {
            query += ` AND c.status = $2`;
            params.push(status);
        }

        query += ` GROUP BY c.id, u.name ORDER BY c.created_at DESC`;

        const result = await pool.query(query, params);
        res.json(result.rows);

    } catch (error) {
        console.error("List Content Error:", error);
        res.status(500).json({ message: "Failed to fetch content" });
    }
};

// Get single content
export const getContent = async (req, res) => {
    try {
        const { campaignId, contentId } = req.params;

        const query = `
            SELECT
                c.*,
                u.name as created_by_name,
                assigned_user.name as assigned_to_name
            FROM content c
            LEFT JOIN users u ON c.created_by = u.id
            LEFT JOIN users assigned_user ON c.assigned_to = assigned_user.id
            WHERE c.id = $1 AND c.campaign_id = $2
        `;

        const result = await pool.query(query, [contentId, campaignId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Content not found" });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Get Content Error:", error);
        res.status(500).json({ message: "Failed to fetch content" });
    }
};

// Update content
export const updateContent = async (req, res) => {
    const client = await pool.connect();
    try {
        const { campaignId, contentId } = req.params;
        const { title, body, contentType } = req.body;
        const userId = req.user.internalId;

        // First, save current version
        const getCurrentQuery = `SELECT * FROM content WHERE id = $1 AND campaign_id = $2`;
        const currentResult = await client.query(getCurrentQuery, [contentId, campaignId]);

        if (currentResult.rows.length === 0) {
            return res.status(404).json({ message: "Content not found" });
        }

        const current = currentResult.rows[0];

        await client.query('BEGIN');

        // Get next version number
        const versionQuery = `SELECT MAX(version_number) as max_version FROM content_versions WHERE content_id = $1`;
        const versionResult = await client.query(versionQuery, [contentId]);
        const nextVersion = (versionResult.rows[0].max_version || 0) + 1;

        // Save current version
        const saveVersionQuery = `
            INSERT INTO content_versions (content_id, version_number, title, body, created_by)
            VALUES ($1, $2, $3, $4, $5)
        `;
        await client.query(saveVersionQuery, [
            contentId,
            nextVersion,
            current.title,
            current.body,
            userId
        ]);

        // Update content
        const updateQuery = `
            UPDATE content
            SET title = $1, body = $2, content_type = $3, updated_at = NOW()
            WHERE id = $4 AND campaign_id = $5
            RETURNING *
        `;
        const updateResult = await client.query(updateQuery, [
            title || current.title,
            body || current.body,
            contentType || current.content_type,
            contentId,
            campaignId
        ]);

        await client.query('COMMIT');

        res.json({
            message: "Content updated successfully",
            content: updateResult.rows[0]
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Update Content Error:", error);
        res.status(500).json({ message: "Failed to update content" });
    } finally {
        client.release();
    }
};

// Submit content for review
export const submitForReview = async (req, res) => {
    try {
        const { campaignId, contentId } = req.params;
        const userId = req.user.internalId;

        const query = `
            UPDATE content
            SET status = 'review', submitted_at = NOW(), updated_at = NOW()
            WHERE id = $1 AND campaign_id = $2 AND status = 'draft'
            RETURNING *
        `;

        const result = await pool.query(query, [contentId, campaignId]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Content must be in draft status to submit for review" });
        }

        res.json({
            message: "Content submitted for review",
            content: result.rows[0]
        });

    } catch (error) {
        console.error("Submit for Review Error:", error);
        res.status(500).json({ message: "Failed to submit content for review" });
    }
};

// Approve content
export const approveContent = async (req, res) => {
    try {
        const { campaignId, contentId } = req.params;
        const userId = req.user.internalId;

        const query = `
            UPDATE content
            SET status = 'approved', approved_at = NOW(), assigned_to = $1, updated_at = NOW()
            WHERE id = $2 AND campaign_id = $3 AND status = 'review'
            RETURNING *
        `;

        const result = await pool.query(query, [userId, contentId, campaignId]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Content must be in review status to approve" });
        }

        res.json({
            message: "Content approved",
            content: result.rows[0]
        });

    } catch (error) {
        console.error("Approve Content Error:", error);
        res.status(500).json({ message: "Failed to approve content" });
    }
};

// Reject content
export const rejectContent = async (req, res) => {
    try {
        const { campaignId, contentId } = req.params;
        const { reason } = req.body;

        const query = `
            UPDATE content
            SET status = 'draft', updated_at = NOW()
            WHERE id = $1 AND campaign_id = $2 AND status = 'review'
            RETURNING *
        `;

        const result = await pool.query(query, [contentId, campaignId]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Content must be in review status to reject" });
        }

        // Add rejection comment
        if (reason) {
            const commentQuery = `
                INSERT INTO content_comments (content_id, user_id, comment, is_internal)
                VALUES ($1, $2, $3, true)
            `;
            await pool.query(commentQuery, [contentId, req.user.internalId, `Rejected: ${reason}`]);
        }

        res.json({
            message: "Content rejected",
            content: result.rows[0]
        });

    } catch (error) {
        console.error("Reject Content Error:", error);
        res.status(500).json({ message: "Failed to reject content" });
    }
};

// Publish content
export const publishContent = async (req, res) => {
    try {
        const { campaignId, contentId } = req.params;

        const query = `
            UPDATE content
            SET status = 'published', published_at = NOW(), updated_at = NOW()
            WHERE id = $1 AND campaign_id = $2 AND status = 'approved'
            RETURNING *
        `;

        const result = await pool.query(query, [contentId, campaignId]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Content must be in approved status to publish" });
        }

        res.json({
            message: "Content published",
            content: result.rows[0]
        });

    } catch (error) {
        console.error("Publish Content Error:", error);
        res.status(500).json({ message: "Failed to publish content" });
    }
};

// Add comment to content
export const addComment = async (req, res) => {
    try {
        const { campaignId, contentId } = req.params;
        const { comment, isInternal } = req.body;
        const userId = req.user.internalId;

        const query = `
            INSERT INTO content_comments (content_id, user_id, comment, is_internal)
            VALUES ($1, $2, $3, $4)
            RETURNING id, content_id, user_id, comment, is_internal, created_at
        `;

        const result = await pool.query(query, [
            contentId,
            userId,
            comment,
            isInternal !== false
        ]);

        res.status(201).json({
            message: "Comment added",
            comment: result.rows[0]
        });

    } catch (error) {
        console.error("Add Comment Error:", error);
        res.status(500).json({ message: "Failed to add comment" });
    }
};

// Get comments for content
export const getComments = async (req, res) => {
    try {
        const { campaignId, contentId } = req.params;

        const query = `
            SELECT
                cc.*,
                u.name as user_name,
                u.email as user_email
            FROM content_comments cc
            JOIN users u ON cc.user_id = u.id
            WHERE cc.content_id = $1
            ORDER BY cc.created_at DESC
        `;

        const result = await pool.query(query, [contentId]);
        res.json(result.rows);

    } catch (error) {
        console.error("Get Comments Error:", error);
        res.status(500).json({ message: "Failed to fetch comments" });
    }
};

// Get version history
export const getVersionHistory = async (req, res) => {
    try {
        const { campaignId, contentId } = req.params;

        const query = `
            SELECT
                cv.*,
                u.name as created_by_name
            FROM content_versions cv
            LEFT JOIN users u ON cv.created_by = u.id
            WHERE cv.content_id = $1
            ORDER BY cv.version_number DESC
        `;

        const result = await pool.query(query, [contentId]);
        res.json(result.rows);

    } catch (error) {
        console.error("Get Version History Error:", error);
        res.status(500).json({ message: "Failed to fetch version history" });
    }
};

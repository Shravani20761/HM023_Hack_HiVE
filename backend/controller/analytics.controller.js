import pool from '../config/db.js';

// Record analytics metric
export const recordMetric = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { contentId, channel, metricType, metricValue, date } = req.body;

        const query = `
            INSERT INTO analytics (content_id, campaign_id, channel, metric_type, metric_value, date)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const result = await pool.query(query, [
            contentId,
            campaignId,
            channel || null,
            metricType,
            metricValue || 0,
            date || new Date()
        ]);

        res.status(201).json({
            message: "Metric recorded successfully",
            metric: result.rows[0]
        });

    } catch (error) {
        console.error("Record Metric Error:", error);
        res.status(500).json({ message: "Failed to record metric" });
    }
};

// Get campaign analytics
export const getCampaignAnalytics = async (req, res) => {
    try {
        const { campaignId } = req.params;

        const query = `
            SELECT
                metric_type,
                SUM(metric_value) as total,
                COUNT(*) as count,
                AVG(metric_value) as average
            FROM analytics
            WHERE campaign_id = $1
            GROUP BY metric_type
        `;

        const result = await pool.query(query, [campaignId]);
        res.json(result.rows);

    } catch (error) {
        console.error("Get Campaign Analytics Error:", error);
        res.status(500).json({ message: "Failed to fetch analytics" });
    }
};

// Get content analytics
export const getContentAnalytics = async (req, res) => {
    try {
        const { contentId } = req.params;

        const query = `
            SELECT
                metric_type,
                channel,
                SUM(metric_value) as total,
                AVG(metric_value) as average,
                MAX(metric_value) as max_value
            FROM analytics
            WHERE content_id = $1
            GROUP BY metric_type, channel
            ORDER BY metric_type, channel
        `;

        const result = await pool.query(query, [contentId]);
        res.json(result.rows);

    } catch (error) {
        console.error("Get Content Analytics Error:", error);
        res.status(500).json({ message: "Failed to fetch content analytics" });
    }
};

// Get channel performance
export const getChannelPerformance = async (req, res) => {
    try {
        const { campaignId } = req.params;

        const query = `
            SELECT
                channel,
                metric_type,
                SUM(metric_value) as total,
                COUNT(DISTINCT date) as days,
                AVG(metric_value) as daily_average
            FROM analytics
            WHERE campaign_id = $1 AND channel IS NOT NULL
            GROUP BY channel, metric_type
            ORDER BY channel, metric_type
        `;

        const result = await pool.query(query, [campaignId]);
        res.json(result.rows);

    } catch (error) {
        console.error("Get Channel Performance Error:", error);
        res.status(500).json({ message: "Failed to fetch channel performance" });
    }
};

// Get metrics over time
export const getMetricsOverTime = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { metricType, days } = req.query;

        let query = `
            SELECT
                DATE(date) as date,
                metric_type,
                SUM(metric_value) as total
            FROM analytics
            WHERE campaign_id = $1
        `;

        const params = [campaignId];

        if (metricType) {
            query += ` AND metric_type = $${params.length + 1}`;
            params.push(metricType);
        }

        if (days) {
            query += ` AND date >= NOW() - INTERVAL '${parseInt(days)} days'`;
        }

        query += ` GROUP BY DATE(date), metric_type
                   ORDER BY date DESC`;

        const result = await pool.query(query, params);
        res.json(result.rows);

    } catch (error) {
        console.error("Get Metrics Over Time Error:", error);
        res.status(500).json({ message: "Failed to fetch metrics over time" });
    }
};

// Get top content
export const getTopContent = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { metricType, limit } = req.query;

        let query = `
            SELECT
                c.id,
                c.title,
                a.metric_type,
                SUM(a.metric_value) as total_metric,
                COUNT(DISTINCT a.date) as days_recorded
            FROM analytics a
            JOIN content c ON a.content_id = c.id
            WHERE a.campaign_id = $1
        `;

        const params = [campaignId];

        if (metricType) {
            query += ` AND a.metric_type = $${params.length + 1}`;
            params.push(metricType);
        }

        query += ` GROUP BY c.id, c.title, a.metric_type
                   ORDER BY total_metric DESC
                   LIMIT ${parseInt(limit) || 10}`;

        const result = await pool.query(query, params);
        res.json(result.rows);

    } catch (error) {
        console.error("Get Top Content Error:", error);
        res.status(500).json({ message: "Failed to fetch top content" });
    }
};

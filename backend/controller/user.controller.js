import pool from '../config/db.js';

export const listUsers = async (req, res) => {
    try {
        const query = "SELECT id, name, email FROM users ORDER BY name ASC";
        const result = await pool.query(query);

        res.json({ users: result.rows });
    } catch (error) {
        console.error("List Users Error:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

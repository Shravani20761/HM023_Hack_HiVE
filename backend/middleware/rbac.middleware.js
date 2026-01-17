import pool from '../config/db.js';
import { checkPermission, checkSystemPermission } from '../utils/rbac.js';

// Middleware to resolve roles for a specific campaign
export const campaignRoleMiddleware = async (req, res, next) => {
    try {
        const userId = req.user?.$id; // Appwrite User ID from auth.middleware
        // Check params, body, or query for campaignId
        const campaignId = req.params.id || req.body.campaignId || req.query.campaignId;

        if (!campaignId) {
            // If no campaign context, proceed without roles (or handle as error depending on route)
            // For now, allow proceeding but user has no campaign roles
            req.user.roles = [];
            return next();
        }

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // 1. Get Internal User ID from Appwrite ID
        const userQuery = 'SELECT id FROM users WHERE appwrite_user_id = $1';
        const userResult = await pool.query(userQuery, [userId]);

        if (userResult.rows.length === 0) {
            // User might need to be synced to internal DB
            req.user.roles = [];
            return next();
        }

        const internalUserId = userResult.rows[0].id;

        // 2. Fetch roles for this user in this campaign
        const query = `
            SELECT r.name 
            FROM campaign_members cm
            JOIN roles r ON cm.role_id = r.id
            WHERE cm.user_id = $1 AND cm.campaign_id = $2
        `;

        const result = await pool.query(query, [internalUserId, campaignId]);

        req.user.roles = result.rows.map(row => row.name);
        req.user.internalId = internalUserId;

        next();
    } catch (error) {
        console.error("RBAC Middleware Error:", error);
        res.status(500).json({ message: "Internal Server Error during Role Resolution" });
    }
};

// Middleware to resolve System Roles
export const systemRoleMiddleware = async (req, res, next) => {
    try {
        // Ensure we have the internal ID. If authMiddleware ran, we might have it if we put it there.
        // But authMiddleware currently puts sync logic in index.js or modified auth.middleware. 
        // Let's rely on req.user.internalId if available, or fetch it.
        // Wait, the previous authMiddleware I wrote UPDATES req.user.internalId.

        if (!req.user || !req.user.internalId) {
            // If not authenticated or not synced, no roles
            req.user.systemRoles = [];
            return next();
        }

        const query = `
            SELECT sr.name 
            FROM user_system_roles usr
            JOIN system_roles sr ON usr.system_role_id = sr.id
            WHERE usr.user_id = $1
        `;

        const result = await pool.query(query, [req.user.internalId]);
        req.user.systemRoles = result.rows.map(row => row.name);

        next();
    } catch (error) {
        console.error("System Role Middleware Error:", error);
        req.user.systemRoles = []; // Fallback to safe state
        next();
    }
};

// Middleware Factory to check System permissions
export const requireSystemPermission = (action) => {
    return (req, res, next) => {
        const userSystemRoles = req.user?.systemRoles || [];

        if (checkSystemPermission(userSystemRoles, action)) {
            next();
        } else {
            res.status(403).json({
                error: "FORBIDDEN",
                message: "You do not have permission to perform this system action"
            });
        }
    };
};

// Middleware Factory to check permissions
export const requirePermission = (action) => {
    return (req, res, next) => {
        const userRoles = req.user?.roles || [];

        if (checkPermission(userRoles, action)) {
            next();
        } else {
            res.status(403).json({
                error: "FORBIDDEN",
                message: "You do not have permission to perform this action"
            });
        }
    };
};

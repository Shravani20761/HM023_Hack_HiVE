import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authMiddleware from './middleware/auth.middleware.js';
import { campaignRoleMiddleware, systemRoleMiddleware, requirePermission, requireSystemPermission } from './middleware/rbac.middleware.js';
import { checkPermission, PERMISSIONS } from './utils/rbac.js';
import { createCampaign } from './controller/campaign.controller.js';
import { getSystemCapabilities } from './controller/system.controller.js';
import { listUsers } from './controller/user.controller.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
    res.send('HackMatrix Backend is running!');
});

// Protected Route Example
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({
        message: "You have accessed a protected route!",
        user: req.user
    });
});

// --- System RBAC Routes ---

// 1. System Capabilities Endpoint
app.get('/api/system/capabilities', authMiddleware, systemRoleMiddleware, getSystemCapabilities);

// 2. Create Campaign (System Level Permission)
app.post('/api/campaigns',
    authMiddleware,
    systemRoleMiddleware,
    requireSystemPermission('CREATE_CAMPAIGN'),
    createCampaign
);

// 3. List Users (For assignments) - Protected
app.get('/api/users', authMiddleware, listUsers);

// --- Campaign RBAC Routes ---

// 4. Campaign Capabilities Endpoint
app.get('/api/campaigns/:id/capabilities', authMiddleware, campaignRoleMiddleware, (req, res) => {
    const userRoles = req.user.roles || [];

    // Dynamically build capabilities object based on PERMISSIONS constant
    const capabilities = {};
    for (const [action, allowedRoles] of Object.entries(PERMISSIONS)) {
        // Convert ACTION_NAME to canActionName (e.g., CREATE_CONTENT -> canCreateContent)
        const camelCaseAction = 'can' + action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');
        capabilities[camelCaseAction] = checkPermission(userRoles, action);
    }

    res.json(capabilities);
});

// 5. Protected Action Example (Create Content)
app.post('/api/campaigns/:id/content',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('CREATE_CONTENT'),
    (req, res) => {
        res.json({
            message: "Content created successfully",
            campaignId: req.params.id,
            user: req.user.email
        });
    }
);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

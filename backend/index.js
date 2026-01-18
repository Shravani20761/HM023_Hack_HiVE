import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authMiddleware from './middleware/auth.middleware.js';
import { campaignRoleMiddleware, systemRoleMiddleware, requirePermission, requireSystemPermission } from './middleware/rbac.middleware.js';
import { checkPermission, PERMISSIONS } from './utils/rbac.js';
import { createCampaign, listCampaigns, getCampaign, getCampaignTeam } from './controller/campaign.controller.js';
import { getSystemCapabilities } from './controller/system.controller.js';
import { listUsers } from './controller/user.controller.js';
import {
    createContent,
    listContent,
    getContent,
    updateContent,
    submitForReview,
    approveContent,
    rejectContent,
    publishContent,
    addComment,
    getComments,
    getVersionHistory
} from './controller/content.controller.js';
import {
    getImageKitAuth,
    createAsset,
    listAssets,
    getAsset,
    deleteAsset,
    linkAssetToContent,
    unlinkAssetFromContent,
    getContentAssets
} from './controller/asset.controller.js';
import {
    createScript,
    createCaption,
    analyzeFeedbackSentiment
} from './controller/ai.controller.js';
import {
    createSchedule,
    listSchedules,
    getSchedule,
    updateSchedule,
    deleteSchedule
} from './controller/schedule.controller.js';
import {
    createFeedback,
    listFeedback,
    getFeedback,
    updateFeedbackStatus,
    assignFeedback,
    getFeedbackStats
} from './controller/feedback.controller.js';
import {
    recordMetric,
    getCampaignAnalytics,
    getContentAnalytics,
    getChannelPerformance,
    getMetricsOverTime,
    getTopContent
} from './controller/analytics.controller.js';
import {
    getOAuthUrl,
    handleOAuthCallback,
    getConnectionStatus,
    disconnectYouTube,
    getChannelDetails,
    listVideos,
    getVideo,
    updateVideo,
    createScheduledUpload,
    listScheduledUploads,
    getScheduledUpload,
    updateScheduledUpload,
    deleteScheduledUpload,
    getYouTubeAnalytics,
    getVideoCategories
} from './controller/youtube.controller.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://hackmatrixhackhive.pages.dev'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
    res.send('HackMatrix Backend is running!');
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
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

// 2a. List Campaigns
app.get('/api/campaigns', authMiddleware, listCampaigns);

// 2b. Get Single Campaign
app.get('/api/campaigns/:id', authMiddleware, getCampaign);

// 2c. Get Campaign Team
app.get('/api/campaigns/:id/team', authMiddleware, getCampaignTeam);

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

// --- Content Workflow Routes ---

// 5. Create Content
app.post('/api/campaigns/:id/content',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('CREATE_CONTENT'),
    (req, res) => {
        // Rename param from 'id' to 'campaignId' for controller
        req.params.campaignId = req.params.id;
        createContent(req, res);
    }
);

// 6. List Content
app.get('/api/campaigns/:id/content',
    authMiddleware,
    campaignRoleMiddleware,
    (req, res) => {
        req.params.campaignId = req.params.id;
        listContent(req, res);
    }
);

// 7. Get Single Content
app.get('/api/campaigns/:id/content/:contentId',
    authMiddleware,
    campaignRoleMiddleware,
    (req, res) => {
        req.params.campaignId = req.params.id;
        getContent(req, res);
    }
);

// 8. Update Content
app.patch('/api/campaigns/:id/content/:contentId',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('EDIT_CONTENT'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        updateContent(req, res);
    }
);

// 9. Submit Content for Review
app.patch('/api/campaigns/:id/content/:contentId/submit-review',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('SUBMIT_REVIEW'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        submitForReview(req, res);
    }
);

// 10. Approve Content
app.patch('/api/campaigns/:id/content/:contentId/approve',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('APPROVE_CONTENT'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        approveContent(req, res);
    }
);

// 11. Reject Content
app.patch('/api/campaigns/:id/content/:contentId/reject',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('REJECT_CONTENT'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        rejectContent(req, res);
    }
);

// 12. Publish Content
app.patch('/api/campaigns/:id/content/:contentId/publish',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('PUBLISH_CONTENT'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        publishContent(req, res);
    }
);

// 13. Add Comment
app.post('/api/campaigns/:id/content/:contentId/comments',
    authMiddleware,
    campaignRoleMiddleware,
    (req, res) => {
        req.params.campaignId = req.params.id;
        addComment(req, res);
    }
);

// 14. Get Comments
app.get('/api/campaigns/:id/content/:contentId/comments',
    authMiddleware,
    campaignRoleMiddleware,
    (req, res) => {
        req.params.campaignId = req.params.id;
        getComments(req, res);
    }
);

// 15. Get Version History
app.get('/api/campaigns/:id/content/:contentId/versions',
    authMiddleware,
    campaignRoleMiddleware,
    (req, res) => {
        req.params.campaignId = req.params.id;
        getVersionHistory(req, res);
    }
);

// --- Asset Management Routes ---

// 16. Get ImageKit Auth
app.get('/api/campaigns/:id/assets/auth',
    authMiddleware,
    campaignRoleMiddleware,
    (req, res) => {
        req.params.campaignId = req.params.id;
        getImageKitAuth(req, res);
    }
);

// 17. Create Asset
app.post('/api/campaigns/:id/assets',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('UPLOAD_ASSET'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        createAsset(req, res);
    }
);

// 18. List Assets
app.get('/api/campaigns/:id/assets',
    authMiddleware,
    campaignRoleMiddleware,
    (req, res) => {
        req.params.campaignId = req.params.id;
        listAssets(req, res);
    }
);

// 19. Get Single Asset
app.get('/api/campaigns/:id/assets/:assetId',
    authMiddleware,
    campaignRoleMiddleware,
    (req, res) => {
        req.params.campaignId = req.params.id;
        getAsset(req, res);
    }
);

// 20. Delete Asset
app.delete('/api/campaigns/:id/assets/:assetId',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('DELETE_ASSET'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        deleteAsset(req, res);
    }
);

// 21. Link Asset to Content
app.post('/api/campaigns/:id/assets/:assetId/link',
    authMiddleware,
    campaignRoleMiddleware,
    (req, res) => {
        req.params.campaignId = req.params.id;
        linkAssetToContent(req, res);
    }
);

// 22. Unlink Asset from Content
app.delete('/api/campaigns/:id/assets/:assetId/unlink',
    authMiddleware,
    campaignRoleMiddleware,
    (req, res) => {
        req.params.campaignId = req.params.id;
        unlinkAssetFromContent(req, res);
    }
);

// 23. Get Content Assets
app.get('/api/content/:contentId/assets',
    authMiddleware,
    (req, res) => {
        getContentAssets(req, res);
    }
);

// --- AI Routes ---

// 24. Generate Script
app.post('/api/campaigns/:id/ai/script-writer',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('USE_AI_CREATOR'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        createScript(req, res);
    }
);

// 25. Generate Caption
app.post('/api/campaigns/:id/ai/caption-helper',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('USE_AI_CREATOR'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        createCaption(req, res);
    }
);

// 26. Analyze Sentiment
app.post('/api/campaigns/:id/ai/sentiment-analysis',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('USE_AI_MANAGER'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        analyzeFeedbackSentiment(req, res);
    }
);

// --- Schedule Routes ---

// 27. Create Schedule
app.post('/api/campaigns/:id/schedules',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('CREATE_SCHEDULE'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        createSchedule(req, res);
    }
);

// 28. List Schedules
app.get('/api/campaigns/:id/schedules',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('VIEW_SCHEDULE'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        listSchedules(req, res);
    }
);

// 29. Get Schedule
app.get('/api/campaigns/:id/schedules/:scheduleId',
    authMiddleware,
    campaignRoleMiddleware,
    (req, res) => {
        req.params.campaignId = req.params.id;
        getSchedule(req, res);
    }
);

// 30. Update Schedule
app.patch('/api/campaigns/:id/schedules/:scheduleId',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('CREATE_SCHEDULE'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        updateSchedule(req, res);
    }
);

// 31. Delete Schedule
app.delete('/api/campaigns/:id/schedules/:scheduleId',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('CREATE_SCHEDULE'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        deleteSchedule(req, res);
    }
);

// --- Feedback Routes ---

// 32. Create Feedback
app.post('/api/campaigns/:id/feedback',
    authMiddleware,
    campaignRoleMiddleware,
    (req, res) => {
        req.params.campaignId = req.params.id;
        createFeedback(req, res);
    }
);

// 33. List Feedback
app.get('/api/campaigns/:id/feedback',
    authMiddleware,
    campaignRoleMiddleware,
    (req, res) => {
        req.params.campaignId = req.params.id;
        listFeedback(req, res);
    }
);

// 34. Get Feedback
app.get('/api/campaigns/:id/feedback/:feedbackId',
    authMiddleware,
    campaignRoleMiddleware,
    (req, res) => {
        req.params.campaignId = req.params.id;
        getFeedback(req, res);
    }
);

// 35. Update Feedback Status
app.patch('/api/campaigns/:id/feedback/:feedbackId/status',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('REPLY_FEEDBACK'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        updateFeedbackStatus(req, res);
    }
);

// 36. Assign Feedback
app.patch('/api/campaigns/:id/feedback/:feedbackId/assign',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('ASSIGN_FEEDBACK'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        assignFeedback(req, res);
    }
);

// 37. Get Feedback Stats
app.get('/api/campaigns/:id/feedback/stats/summary',
    authMiddleware,
    campaignRoleMiddleware,
    (req, res) => {
        req.params.campaignId = req.params.id;
        getFeedbackStats(req, res);
    }
);

// --- Analytics Routes ---

// 38. Record Metric
app.post('/api/campaigns/:id/analytics/metrics',
    authMiddleware,
    campaignRoleMiddleware,
    (req, res) => {
        req.params.campaignId = req.params.id;
        recordMetric(req, res);
    }
);

// 39. Get Campaign Analytics
app.get('/api/campaigns/:id/analytics',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('VIEW_ANALYTICS'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        getCampaignAnalytics(req, res);
    }
);

// 40. Get Content Analytics
app.get('/api/content/:contentId/analytics',
    authMiddleware,
    (req, res) => {
        getContentAnalytics(req, res);
    }
);

// 41. Get Channel Performance
app.get('/api/campaigns/:id/analytics/channels',
    authMiddleware,
    campaignRoleMiddleware,
    (req, res) => {
        req.params.campaignId = req.params.id;
        getChannelPerformance(req, res);
    }
);

// 42. Get Metrics Over Time
app.get('/api/campaigns/:id/analytics/timeline',
    authMiddleware,
    campaignRoleMiddleware,
    (req, res) => {
        req.params.campaignId = req.params.id;
        getMetricsOverTime(req, res);
    }
);

// 43. Get Top Content
app.get('/api/campaigns/:id/analytics/top-content',
    authMiddleware,
    campaignRoleMiddleware,
    (req, res) => {
        req.params.campaignId = req.params.id;
        getTopContent(req, res);
    }
);

// --- YouTube Integration Routes ---

// 44. Get YouTube OAuth URL
app.get('/api/campaigns/:id/youtube/auth',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('CONNECT_YOUTUBE'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        getOAuthUrl(req, res);
    }
);

// 45. YouTube OAuth Callback (No auth middleware - handles its own state)
app.get('/auth/youtube/callback', handleOAuthCallback);

// 46. Get YouTube Connection Status
app.get('/api/campaigns/:id/youtube/status',
    authMiddleware,
    campaignRoleMiddleware,
    (req, res) => {
        req.params.campaignId = req.params.id;
        getConnectionStatus(req, res);
    }
);

// 47. Disconnect YouTube
app.delete('/api/campaigns/:id/youtube/disconnect',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('DISCONNECT_YOUTUBE'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        disconnectYouTube(req, res);
    }
);

// 48. Get YouTube Channel Details
app.get('/api/campaigns/:id/youtube/channel',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('VIEW_YOUTUBE'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        getChannelDetails(req, res);
    }
);

// 49. List YouTube Videos
app.get('/api/campaigns/:id/youtube/videos',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('VIEW_YOUTUBE'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        listVideos(req, res);
    }
);

// 50. Get Single YouTube Video
app.get('/api/campaigns/:id/youtube/videos/:videoId',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('VIEW_YOUTUBE'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        getVideo(req, res);
    }
);

// 51. Update YouTube Video
app.patch('/api/campaigns/:id/youtube/videos/:videoId',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('MANAGE_YOUTUBE_VIDEOS'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        updateVideo(req, res);
    }
);

// 52. Get Video Categories
app.get('/api/campaigns/:id/youtube/categories',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('VIEW_YOUTUBE'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        getVideoCategories(req, res);
    }
);

// 53. Create Scheduled Upload
app.post('/api/campaigns/:id/youtube/scheduled-uploads',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('SCHEDULE_YOUTUBE'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        createScheduledUpload(req, res);
    }
);

// 54. List Scheduled Uploads
app.get('/api/campaigns/:id/youtube/scheduled-uploads',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('VIEW_YOUTUBE'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        listScheduledUploads(req, res);
    }
);

// 55. Get Single Scheduled Upload
app.get('/api/campaigns/:id/youtube/scheduled-uploads/:uploadId',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('VIEW_YOUTUBE'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        getScheduledUpload(req, res);
    }
);

// 56. Update Scheduled Upload
app.patch('/api/campaigns/:id/youtube/scheduled-uploads/:uploadId',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('SCHEDULE_YOUTUBE'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        updateScheduledUpload(req, res);
    }
);

// 57. Delete Scheduled Upload
app.delete('/api/campaigns/:id/youtube/scheduled-uploads/:uploadId',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('SCHEDULE_YOUTUBE'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        deleteScheduledUpload(req, res);
    }
);

// 58. Get YouTube Analytics
app.get('/api/campaigns/:id/youtube/analytics',
    authMiddleware,
    campaignRoleMiddleware,
    requirePermission('VIEW_YOUTUBE_ANALYTICS'),
    (req, res) => {
        req.params.campaignId = req.params.id;
        getYouTubeAnalytics(req, res);
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

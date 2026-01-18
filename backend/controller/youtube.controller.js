import pool from '../config/db.js';
import { google } from 'googleapis';

// Initialize OAuth2 client
const getOAuth2Client = () => {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
};

// Scopes needed for YouTube operations
const YOUTUBE_SCOPES = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'https://www.googleapis.com/auth/yt-analytics.readonly'
];

// ============================================
// OAuth Flow
// ============================================

// Generate OAuth URL for YouTube connection
export const getOAuthUrl = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const oauth2Client = getOAuth2Client();

        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: YOUTUBE_SCOPES,
            prompt: 'consent',
            state: JSON.stringify({ campaignId, userId: req.user.id })
        });

        res.json({ authUrl });
    } catch (error) {
        console.error('Get OAuth URL Error:', error);
        res.status(500).json({ message: 'Failed to generate OAuth URL' });
    }
};

// Handle OAuth callback
export const handleOAuthCallback = async (req, res) => {
    try {
        const { code, state } = req.query;

        if (!code) {
            return res.redirect(`${process.env.FRONTEND_URL}/youtube/error?message=Authorization denied`);
        }

        const { campaignId, userId } = JSON.parse(state);
        const oauth2Client = getOAuth2Client();

        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Get channel info
        const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
        const channelResponse = await youtube.channels.list({
            part: 'snippet,statistics',
            mine: true
        });

        if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
            return res.redirect(`${process.env.FRONTEND_URL}/youtube/error?message=No YouTube channel found`);
        }

        const channel = channelResponse.data.items[0];

        // Store connection in database
        await pool.query(`
            INSERT INTO youtube_connections (
                campaign_id, channel_id, channel_title, channel_thumbnail,
                subscriber_count, video_count, view_count,
                access_token, refresh_token, token_expiry, connected_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            ON CONFLICT (campaign_id) DO UPDATE SET
                channel_id = EXCLUDED.channel_id,
                channel_title = EXCLUDED.channel_title,
                channel_thumbnail = EXCLUDED.channel_thumbnail,
                subscriber_count = EXCLUDED.subscriber_count,
                video_count = EXCLUDED.video_count,
                view_count = EXCLUDED.view_count,
                access_token = EXCLUDED.access_token,
                refresh_token = EXCLUDED.refresh_token,
                token_expiry = EXCLUDED.token_expiry,
                updated_at = NOW()
        `, [
            campaignId,
            channel.id,
            channel.snippet.title,
            channel.snippet.thumbnails?.default?.url || '',
            parseInt(channel.statistics.subscriberCount) || 0,
            parseInt(channel.statistics.videoCount) || 0,
            parseInt(channel.statistics.viewCount) || 0,
            tokens.access_token,
            tokens.refresh_token,
            new Date(tokens.expiry_date),
            userId
        ]);

        res.redirect(`${process.env.FRONTEND_URL}/campaigns/${campaignId}/youtube?connected=true`);
    } catch (error) {
        console.error('OAuth Callback Error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/youtube/error?message=Connection failed`);
    }
};

// Get connection status
export const getConnectionStatus = async (req, res) => {
    try {
        const { campaignId } = req.params;

        const result = await pool.query(`
            SELECT
                yc.id, yc.channel_id, yc.channel_title, yc.channel_thumbnail,
                yc.subscriber_count, yc.video_count, yc.view_count,
                yc.connected_at, yc.updated_at,
                u.name as connected_by_name
            FROM youtube_connections yc
            LEFT JOIN users u ON yc.connected_by = u.id
            WHERE yc.campaign_id = $1
        `, [campaignId]);

        if (result.rows.length === 0) {
            return res.json({ connected: false });
        }

        res.json({
            connected: true,
            ...result.rows[0]
        });
    } catch (error) {
        console.error('Get Connection Status Error:', error);
        res.status(500).json({ message: 'Failed to get connection status' });
    }
};

// Disconnect YouTube
export const disconnectYouTube = async (req, res) => {
    try {
        const { campaignId } = req.params;

        await pool.query('DELETE FROM youtube_connections WHERE campaign_id = $1', [campaignId]);
        await pool.query('DELETE FROM youtube_videos WHERE campaign_id = $1', [campaignId]);
        await pool.query('DELETE FROM youtube_scheduled_uploads WHERE campaign_id = $1', [campaignId]);
        await pool.query('DELETE FROM youtube_analytics WHERE campaign_id = $1', [campaignId]);

        res.json({ message: 'YouTube disconnected successfully' });
    } catch (error) {
        console.error('Disconnect YouTube Error:', error);
        res.status(500).json({ message: 'Failed to disconnect YouTube' });
    }
};

// ============================================
// Helper: Get authenticated YouTube client
// ============================================

const getAuthenticatedClient = async (campaignId) => {
    const result = await pool.query(`
        SELECT access_token, refresh_token, token_expiry
        FROM youtube_connections
        WHERE campaign_id = $1
    `, [campaignId]);

    if (result.rows.length === 0) {
        throw new Error('YouTube not connected');
    }

    const { access_token, refresh_token, token_expiry } = result.rows[0];
    const oauth2Client = getOAuth2Client();

    oauth2Client.setCredentials({
        access_token,
        refresh_token,
        expiry_date: new Date(token_expiry).getTime()
    });

    // Check if token needs refresh
    if (new Date(token_expiry) <= new Date()) {
        const { credentials } = await oauth2Client.refreshAccessToken();

        // Update tokens in database
        await pool.query(`
            UPDATE youtube_connections
            SET access_token = $1, token_expiry = $2, updated_at = NOW()
            WHERE campaign_id = $3
        `, [credentials.access_token, new Date(credentials.expiry_date), campaignId]);

        oauth2Client.setCredentials(credentials);
    }

    return google.youtube({ version: 'v3', auth: oauth2Client });
};

// ============================================
// Channel Management
// ============================================

// Get channel details (refresh from YouTube)
export const getChannelDetails = async (req, res) => {
    try {
        const { campaignId } = req.params;

        const youtube = await getAuthenticatedClient(campaignId);

        const response = await youtube.channels.list({
            part: 'snippet,statistics,contentDetails',
            mine: true
        });

        if (!response.data.items || response.data.items.length === 0) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        const channel = response.data.items[0];

        // Update cached data
        await pool.query(`
            UPDATE youtube_connections SET
                channel_title = $1,
                channel_thumbnail = $2,
                subscriber_count = $3,
                video_count = $4,
                view_count = $5,
                updated_at = NOW()
            WHERE campaign_id = $6
        `, [
            channel.snippet.title,
            channel.snippet.thumbnails?.medium?.url || '',
            parseInt(channel.statistics.subscriberCount) || 0,
            parseInt(channel.statistics.videoCount) || 0,
            parseInt(channel.statistics.viewCount) || 0,
            campaignId
        ]);

        res.json({
            id: channel.id,
            title: channel.snippet.title,
            description: channel.snippet.description,
            customUrl: channel.snippet.customUrl,
            thumbnail: channel.snippet.thumbnails?.medium?.url,
            subscriberCount: parseInt(channel.statistics.subscriberCount) || 0,
            videoCount: parseInt(channel.statistics.videoCount) || 0,
            viewCount: parseInt(channel.statistics.viewCount) || 0,
            uploadsPlaylistId: channel.contentDetails?.relatedPlaylists?.uploads
        });
    } catch (error) {
        console.error('Get Channel Details Error:', error);
        res.status(500).json({ message: error.message || 'Failed to get channel details' });
    }
};

// ============================================
// Video Management
// ============================================

// List videos from YouTube
export const listVideos = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { pageToken, maxResults = 20 } = req.query;

        const youtube = await getAuthenticatedClient(campaignId);

        // First get uploads playlist ID
        const channelResponse = await youtube.channels.list({
            part: 'contentDetails',
            mine: true
        });

        const uploadsPlaylistId = channelResponse.data.items[0]?.contentDetails?.relatedPlaylists?.uploads;

        if (!uploadsPlaylistId) {
            return res.json({ videos: [], nextPageToken: null });
        }

        // Get videos from uploads playlist
        const playlistResponse = await youtube.playlistItems.list({
            part: 'snippet,contentDetails',
            playlistId: uploadsPlaylistId,
            maxResults: parseInt(maxResults),
            pageToken
        });

        const videoIds = playlistResponse.data.items.map(item => item.contentDetails.videoId);

        // Get detailed video info
        const videosResponse = await youtube.videos.list({
            part: 'snippet,statistics,status,contentDetails',
            id: videoIds.join(',')
        });

        const videos = videosResponse.data.items.map(video => ({
            id: video.id,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnail: video.snippet.thumbnails?.medium?.url,
            publishedAt: video.snippet.publishedAt,
            privacyStatus: video.status.privacyStatus,
            duration: video.contentDetails.duration,
            viewCount: parseInt(video.statistics.viewCount) || 0,
            likeCount: parseInt(video.statistics.likeCount) || 0,
            commentCount: parseInt(video.statistics.commentCount) || 0,
            tags: video.snippet.tags || [],
            categoryId: video.snippet.categoryId
        }));

        // Cache videos in database
        for (const video of videos) {
            await pool.query(`
                INSERT INTO youtube_videos (
                    campaign_id, youtube_video_id, title, description, thumbnail_url,
                    privacy_status, publish_date, duration, view_count, like_count,
                    comment_count, tags, category_id, synced_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
                ON CONFLICT (campaign_id, youtube_video_id) DO UPDATE SET
                    title = EXCLUDED.title,
                    description = EXCLUDED.description,
                    thumbnail_url = EXCLUDED.thumbnail_url,
                    privacy_status = EXCLUDED.privacy_status,
                    view_count = EXCLUDED.view_count,
                    like_count = EXCLUDED.like_count,
                    comment_count = EXCLUDED.comment_count,
                    tags = EXCLUDED.tags,
                    synced_at = NOW(),
                    updated_at = NOW()
            `, [
                campaignId, video.id, video.title, video.description, video.thumbnail,
                video.privacyStatus, video.publishedAt, video.duration,
                video.viewCount, video.likeCount, video.commentCount,
                video.tags, video.categoryId
            ]);
        }

        res.json({
            videos,
            nextPageToken: playlistResponse.data.nextPageToken,
            totalResults: playlistResponse.data.pageInfo?.totalResults
        });
    } catch (error) {
        console.error('List Videos Error:', error);
        res.status(500).json({ message: error.message || 'Failed to list videos' });
    }
};

// Get single video details
export const getVideo = async (req, res) => {
    try {
        const { campaignId, videoId } = req.params;

        const youtube = await getAuthenticatedClient(campaignId);

        const response = await youtube.videos.list({
            part: 'snippet,statistics,status,contentDetails',
            id: videoId
        });

        if (!response.data.items || response.data.items.length === 0) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const video = response.data.items[0];

        res.json({
            id: video.id,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnail: video.snippet.thumbnails?.maxres?.url || video.snippet.thumbnails?.high?.url,
            publishedAt: video.snippet.publishedAt,
            privacyStatus: video.status.privacyStatus,
            duration: video.contentDetails.duration,
            viewCount: parseInt(video.statistics.viewCount) || 0,
            likeCount: parseInt(video.statistics.likeCount) || 0,
            commentCount: parseInt(video.statistics.commentCount) || 0,
            tags: video.snippet.tags || [],
            categoryId: video.snippet.categoryId
        });
    } catch (error) {
        console.error('Get Video Error:', error);
        res.status(500).json({ message: error.message || 'Failed to get video' });
    }
};

// Update video metadata
export const updateVideo = async (req, res) => {
    try {
        const { campaignId, videoId } = req.params;
        const { title, description, tags, privacyStatus, categoryId } = req.body;

        const youtube = await getAuthenticatedClient(campaignId);

        // First get current video data
        const currentVideo = await youtube.videos.list({
            part: 'snippet,status',
            id: videoId
        });

        if (!currentVideo.data.items || currentVideo.data.items.length === 0) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const snippet = currentVideo.data.items[0].snippet;

        const response = await youtube.videos.update({
            part: 'snippet,status',
            requestBody: {
                id: videoId,
                snippet: {
                    title: title || snippet.title,
                    description: description !== undefined ? description : snippet.description,
                    tags: tags || snippet.tags,
                    categoryId: categoryId || snippet.categoryId
                },
                status: {
                    privacyStatus: privacyStatus || currentVideo.data.items[0].status.privacyStatus
                }
            }
        });

        // Update cache
        await pool.query(`
            UPDATE youtube_videos SET
                title = $1, description = $2, tags = $3,
                privacy_status = $4, category_id = $5, updated_at = NOW()
            WHERE campaign_id = $6 AND youtube_video_id = $7
        `, [
            response.data.snippet.title,
            response.data.snippet.description,
            response.data.snippet.tags || [],
            response.data.status.privacyStatus,
            response.data.snippet.categoryId,
            campaignId,
            videoId
        ]);

        res.json({
            id: response.data.id,
            title: response.data.snippet.title,
            description: response.data.snippet.description,
            tags: response.data.snippet.tags,
            privacyStatus: response.data.status.privacyStatus
        });
    } catch (error) {
        console.error('Update Video Error:', error);
        res.status(500).json({ message: error.message || 'Failed to update video' });
    }
};

// ============================================
// Scheduled Uploads
// ============================================

// Create scheduled upload
export const createScheduledUpload = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { title, description, tags, categoryId, privacyStatus, scheduledTime, contentId, assetId } = req.body;

        if (!title || !scheduledTime) {
            return res.status(400).json({ message: 'Title and scheduled time are required' });
        }

        const result = await pool.query(`
            INSERT INTO youtube_scheduled_uploads (
                campaign_id, content_id, asset_id, title, description,
                tags, category_id, privacy_status, scheduled_time, created_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `, [
            campaignId, contentId || null, assetId || null,
            title, description || '', tags || [],
            categoryId || '22', privacyStatus || 'private',
            new Date(scheduledTime), req.user.id
        ]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create Scheduled Upload Error:', error);
        res.status(500).json({ message: 'Failed to create scheduled upload' });
    }
};

// List scheduled uploads
export const listScheduledUploads = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { status } = req.query;

        let query = `
            SELECT
                ysu.*,
                u.name as created_by_name,
                c.title as content_title,
                a.file_name as asset_name,
                a.file_url as asset_url
            FROM youtube_scheduled_uploads ysu
            LEFT JOIN users u ON ysu.created_by = u.id
            LEFT JOIN content c ON ysu.content_id = c.id
            LEFT JOIN assets a ON ysu.asset_id = a.id
            WHERE ysu.campaign_id = $1
        `;

        const params = [campaignId];

        if (status) {
            query += ' AND ysu.status = $2';
            params.push(status);
        }

        query += ' ORDER BY ysu.scheduled_time ASC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('List Scheduled Uploads Error:', error);
        res.status(500).json({ message: 'Failed to list scheduled uploads' });
    }
};

// Get single scheduled upload
export const getScheduledUpload = async (req, res) => {
    try {
        const { campaignId, uploadId } = req.params;

        const result = await pool.query(`
            SELECT
                ysu.*,
                u.name as created_by_name,
                c.title as content_title,
                a.file_name as asset_name,
                a.file_url as asset_url
            FROM youtube_scheduled_uploads ysu
            LEFT JOIN users u ON ysu.created_by = u.id
            LEFT JOIN content c ON ysu.content_id = c.id
            LEFT JOIN assets a ON ysu.asset_id = a.id
            WHERE ysu.id = $1 AND ysu.campaign_id = $2
        `, [uploadId, campaignId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Scheduled upload not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get Scheduled Upload Error:', error);
        res.status(500).json({ message: 'Failed to get scheduled upload' });
    }
};

// Update scheduled upload
export const updateScheduledUpload = async (req, res) => {
    try {
        const { campaignId, uploadId } = req.params;
        const { title, description, tags, categoryId, privacyStatus, scheduledTime } = req.body;

        const result = await pool.query(`
            UPDATE youtube_scheduled_uploads SET
                title = COALESCE($1, title),
                description = COALESCE($2, description),
                tags = COALESCE($3, tags),
                category_id = COALESCE($4, category_id),
                privacy_status = COALESCE($5, privacy_status),
                scheduled_time = COALESCE($6, scheduled_time),
                updated_at = NOW()
            WHERE id = $7 AND campaign_id = $8 AND status = 'pending'
            RETURNING *
        `, [
            title, description, tags, categoryId, privacyStatus,
            scheduledTime ? new Date(scheduledTime) : null,
            uploadId, campaignId
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Scheduled upload not found or cannot be modified' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update Scheduled Upload Error:', error);
        res.status(500).json({ message: 'Failed to update scheduled upload' });
    }
};

// Delete scheduled upload
export const deleteScheduledUpload = async (req, res) => {
    try {
        const { campaignId, uploadId } = req.params;

        const result = await pool.query(`
            DELETE FROM youtube_scheduled_uploads
            WHERE id = $1 AND campaign_id = $2 AND status = 'pending'
            RETURNING id
        `, [uploadId, campaignId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Scheduled upload not found or cannot be deleted' });
        }

        res.json({ message: 'Scheduled upload deleted successfully' });
    } catch (error) {
        console.error('Delete Scheduled Upload Error:', error);
        res.status(500).json({ message: 'Failed to delete scheduled upload' });
    }
};

// ============================================
// Analytics
// ============================================

// Get YouTube analytics
export const getYouTubeAnalytics = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { startDate, endDate, videoId } = req.query;

        // Get connection to check channel ID
        const connectionResult = await pool.query(
            'SELECT channel_id FROM youtube_connections WHERE campaign_id = $1',
            [campaignId]
        );

        if (connectionResult.rows.length === 0) {
            return res.status(404).json({ message: 'YouTube not connected' });
        }

        // For now, return cached analytics from database
        // In production, you would call YouTube Analytics API here
        let query = `
            SELECT * FROM youtube_analytics
            WHERE campaign_id = $1
        `;
        const params = [campaignId];

        if (startDate) {
            query += ' AND date >= $' + (params.length + 1);
            params.push(startDate);
        }

        if (endDate) {
            query += ' AND date <= $' + (params.length + 1);
            params.push(endDate);
        }

        if (videoId) {
            query += ' AND youtube_video_id = $' + (params.length + 1);
            params.push(videoId);
        }

        query += ' ORDER BY date DESC';

        const result = await pool.query(query, params);

        // Also get aggregated stats
        const aggregateResult = await pool.query(`
            SELECT
                SUM(views) as total_views,
                SUM(watch_time_minutes) as total_watch_time,
                AVG(average_view_duration) as avg_view_duration,
                SUM(likes) as total_likes,
                SUM(comments) as total_comments,
                SUM(shares) as total_shares,
                SUM(subscribers_gained - subscribers_lost) as net_subscribers,
                AVG(ctr) as avg_ctr
            FROM youtube_analytics
            WHERE campaign_id = $1
            ${startDate ? 'AND date >= $2' : ''}
            ${endDate ? 'AND date <= $' + (startDate ? 3 : 2) : ''}
        `, params.slice(0, startDate && endDate ? 3 : (startDate || endDate ? 2 : 1)));

        res.json({
            daily: result.rows,
            aggregate: aggregateResult.rows[0] || {}
        });
    } catch (error) {
        console.error('Get YouTube Analytics Error:', error);
        res.status(500).json({ message: error.message || 'Failed to get analytics' });
    }
};

// Get video categories (for upload form)
export const getVideoCategories = async (req, res) => {
    try {
        const { campaignId } = req.params;

        const youtube = await getAuthenticatedClient(campaignId);

        const response = await youtube.videoCategories.list({
            part: 'snippet',
            regionCode: 'US'
        });

        const categories = response.data.items
            .filter(cat => cat.snippet.assignable)
            .map(cat => ({
                id: cat.id,
                title: cat.snippet.title
            }));

        res.json(categories);
    } catch (error) {
        console.error('Get Video Categories Error:', error);
        res.status(500).json({ message: error.message || 'Failed to get categories' });
    }
};

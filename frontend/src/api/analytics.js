const API_BASE = '/api';

// Toggle this to false to attempt real network calls
const USE_MOCK = true;
const STORAGE_KEY = 'hackhive_analytics_data';

const MOCK_ANALYTICS = {
    metrics: {
        likes: 12450,
        comments: 2830,
        views: 54200,
        shares: 1920
    },
    trends: {
        daily: [
            { date: '2026-01-11', likes: 850, comments: 120, views: 3200 },
            { date: '2026-01-12', likes: 1200, comments: 180, views: 4100 },
            { date: '2026-01-13', likes: 980, comments: 150, views: 3800 },
            { date: '2026-01-14', likes: 1450, comments: 220, views: 5200 },
            { date: '2026-01-15', likes: 1820, comments: 310, views: 6100 },
            { date: '2026-01-16', likes: 2100, comments: 380, views: 7200 },
            { date: '2026-01-17', likes: 2350, comments: 420, views: 7800 }
        ]
    },
    platforms: [
        { name: 'Instagram', likes: 5200, comments: 1100, views: 22000, color: 'bg-pink-500' },
        { name: 'YouTube', likes: 4800, comments: 980, views: 19500, color: 'bg-red-500' },
        { name: 'Twitter', likes: 2450, comments: 750, views: 12700, color: 'bg-blue-400' }
    ],
    insights: [
        { type: 'positive', text: 'Videos performed 35% better than images in engagement' },
        { type: 'neutral', text: 'Peak engagement occurred on Jan 16 at 7 PM' },
        { type: 'positive', text: 'Instagram Stories had the highest conversion rate' }
    ]
};

const getStoredAnalytics = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : MOCK_ANALYTICS;
};

export const analyticsService = {
    async getAnalytics(campaignId, timeRange = '7days') {
        if (USE_MOCK) {
            return new Promise(resolve => {
                const data = getStoredAnalytics();
                // Adjust data based on time range
                let filteredTrends = data.trends.daily;
                if (timeRange === '7days') {
                    filteredTrends = data.trends.daily.slice(-7);
                } else if (timeRange === '30days') {
                    // For demo, just repeat the pattern
                    filteredTrends = data.trends.daily;
                }

                setTimeout(() => resolve({
                    ...data,
                    trends: { daily: filteredTrends }
                }), 600);
            });
        }
        const res = await fetch(`${API_BASE}/analytics?campaignId=${campaignId}&timeRange=${timeRange}`);
        if (!res.ok) throw new Error('Failed to fetch analytics');
        return res.json();
    }
};

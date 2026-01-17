const API_BASE = '/api';

// Toggle this to false to attempt real network calls
const USE_MOCK = true;
const STORAGE_KEY = 'hackhive_scheduling_data';

const MOCK_EVENTS = [
    { id: 1, title: 'Campaign Launch', date: '2026-01-20', type: 'milestone', status: 'published' },
    { id: 2, title: 'Teaser Video', date: '2026-01-18', type: 'content', status: 'scheduled' },
    { id: 3, title: 'Blog Post Draft', date: '2026-01-22', type: 'content', status: 'draft' },
    { id: 4, title: 'Social Blast', date: '2026-01-25', type: 'content', status: 'scheduled' },
];

const getStoredEvents = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : MOCK_EVENTS;
};

const saveStoredEvents = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const schedulingService = {
    async listEvents(campaignId) {
        if (USE_MOCK) {
            return new Promise(resolve => {
                const data = getStoredEvents();
                setTimeout(() => resolve({ events: [...data] }), 400);
            });
        }
        const res = await fetch(`${API_BASE}/campaigns/${campaignId}/events`);
        if (!res.ok) throw new Error('Failed to fetch events');
        return res.json();
    },

    async createEvent(data) {
        if (USE_MOCK) {
            return new Promise(resolve => {
                const newEvent = {
                    id: Date.now(),
                    title: data.title,
                    date: data.date,
                    type: data.type,
                    status: 'draft'
                };

                const currentData = getStoredEvents();
                saveStoredEvents([...currentData, newEvent]);

                setTimeout(() => resolve(newEvent), 300);
            });
        }
        const res = await fetch(`${API_BASE}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create event');
        return res.json();
    },

    async scheduleContent(data) {
        if (USE_MOCK) {
            return new Promise(resolve => {
                const newEvent = {
                    id: Date.now(),
                    title: `${data.contentTitle} [${data.platform}]`,
                    date: data.scheduledAt.split('T')[0], // Extract YYYY-MM-DD
                    type: data.platform, // 'instagram', 'youtube', etc
                    status: 'scheduled',
                    contentId: data.contentId
                };

                const currentData = getStoredEvents();
                saveStoredEvents([...currentData, newEvent]);

                setTimeout(() => resolve(newEvent), 500);
            });
        }
        const res = await fetch(`${API_BASE}/schedule`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to schedule content');
        return res.json();
    }
};

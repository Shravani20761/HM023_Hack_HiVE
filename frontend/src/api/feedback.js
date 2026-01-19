const API_BASE = '/api';

// Toggle this to false to attempt real network calls
const USE_MOCK = true;
const STORAGE_KEY = 'hackhive_feedback_data';

const MOCK_FEEDBACK = [
    { id: 1, platform: 'youtube', text: "Love the production quality on this one! 🔥", sentiment: 'positive', user: 'Alex G.', date: '2h ago', status: 'new' },
    { id: 2, platform: 'instagram', text: "Audio seems a bit low in the second half.", sentiment: 'neutral', user: 'Sarah123', date: '5h ago', status: 'new' },
    { id: 3, platform: 'twitter', text: "Why was the pricing not mentioned?? 😡", sentiment: 'negative', user: 'Customer_Support_Hater', date: '1d ago', status: 'reviewed' },
    { id: 4, platform: 'youtube', text: "Can't wait for the next drop!", sentiment: 'positive', user: 'Fanboi', date: '1d ago', status: 'new' },
    { id: 5, platform: 'linkedin', text: "Great insights on the B2B angle.", sentiment: 'positive', user: 'Professional Guy', date: '2d ago', status: 'reviewed' },
];

const getStoredFeedback = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : MOCK_FEEDBACK;
};

const saveStoredFeedback = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const feedbackService = {
    async listFeedback(campaignId) {
        if (USE_MOCK) {
            return new Promise(resolve => {
                const data = getStoredFeedback();
                setTimeout(() => resolve({ feedback: [...data] }), 500);
            });
        }
        const res = await fetch(`${API_BASE}/campaigns/${campaignId}/feedback`);
        if (!res.ok) throw new Error('Failed to fetch feedback');
        return res.json();
    },

    async updateFeedback(id, updates) {
        if (USE_MOCK) {
            return new Promise(resolve => {
                const currentData = getStoredFeedback();
                const updatedData = currentData.map(item =>
                    item.id === id ? { ...item, ...updates } : item
                );
                saveStoredFeedback(updatedData);
                setTimeout(() => resolve({ success: true }), 300);
            });
        }
        const res = await fetch(`${API_BASE}/feedback/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        if (!res.ok) throw new Error('Failed to update feedback');
        return res.json();
    }
};

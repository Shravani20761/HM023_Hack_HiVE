const API_BASE = '/api';

// Toggle this to false to attempt real network calls
const USE_MOCK = true;
const STORAGE_KEY = 'hackhive_content_data';

const MOCK_DATA = [
    { id: 1, type: 'video', title: 'Main Promo Video', status: 'draft', stage: 'creator', version: 1, author: 'You' },
    { id: 2, type: 'image', title: 'Instagram Story #1', status: 'review', stage: 'editor', version: 2, author: 'Sarah M.' },
    { id: 3, type: 'text', title: 'Ad Copy Variant A', status: 'approved', stage: 'marketer', version: 3, author: 'David K.' },
];

const getStoredData = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : MOCK_DATA;
};

const saveStoredData = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const contentService = {
    async listContent(campaignId) {
        if (USE_MOCK) {
            return new Promise(resolve => {
                const data = getStoredData();
                setTimeout(() => resolve({ content: [...data] }), 500)
            });
        }
        const res = await fetch(`${API_BASE}/campaigns/${campaignId}/content`);
        if (!res.ok) throw new Error('Failed to fetch content');
        return res.json();
    },

    async createContent(data) {
        if (USE_MOCK) {
            return new Promise(resolve => {
                const newItem = {
                    id: Date.now(),
                    type: data.type,
                    title: data.metadata.title || 'New Content',
                    status: 'draft',
                    stage: 'creator',
                    version: 1,
                    author: 'You'
                };
                const currentData = getStoredData();
                saveStoredData([newItem, ...currentData]);

                setTimeout(() => resolve(newItem), 600);
            });
        }
        const res = await fetch(`${API_BASE}/content`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create content');
        return res.json();
    },

    async updateStatus(contentId, status, stage) {
        if (USE_MOCK) {
            return new Promise(resolve => {
                const currentData = getStoredData();
                const updatedData = currentData.map(item =>
                    item.id === contentId
                        ? { ...item, status, stage, version: item.version + 1 }
                        : item
                );
                saveStoredData(updatedData);
                setTimeout(() => resolve({ success: true }), 300)
            });
        }
        const res = await fetch(`${API_BASE}/content/${contentId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, stage })
        });
        if (!res.ok) throw new Error('Failed to update status');
        return res.json();
    }
};

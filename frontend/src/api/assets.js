const API_BASE = '/api';

// Toggle this to false to attempt real network calls
const USE_MOCK = true;
const STORAGE_KEY = 'hackhive_assets_data';

const MOCK_ASSETS = [
    { id: 1, type: 'image', name: 'Campaign_Banner_v1.jpg', size: '2.4 MB', uploadedBy: 'You', date: '2h ago', url: '', status: 'approved' },
    { id: 2, type: 'video', name: 'Social_Teaser_Draft.mp4', size: '14.2 MB', uploadedBy: 'Sarah M.', date: '4h ago', url: '', status: 'review' },
    { id: 3, type: 'document', name: 'Brief_Requirements.pdf', size: '450 KB', uploadedBy: 'David K.', date: '1d ago', url: '', status: 'approved' },
    { id: 4, type: 'image', name: 'Product_Shot_04.png', size: '1.8 MB', uploadedBy: 'You', date: '1d ago', url: '', status: 'draft' },
];

const getStoredAssets = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : MOCK_ASSETS;
};

const saveStoredAssets = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const assetsService = {
    async listAssets(campaignId) {
        if (USE_MOCK) {
            return new Promise(resolve => {
                const data = getStoredAssets();
                setTimeout(() => resolve({ assets: [...data] }), 600);
            });
        }
        const res = await fetch(`${API_BASE}/assets?campaignId=${campaignId}`);
        if (!res.ok) throw new Error('Failed to fetch assets');
        return res.json();
    },

    async uploadAsset(formData) {
        if (USE_MOCK) {
            return new Promise(resolve => {
                const file = formData.get('file');
                const newAsset = {
                    id: Date.now(),
                    type: file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'document',
                    name: file.name,
                    size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                    uploadedBy: 'You',
                    date: 'Just now',
                    url: URL.createObjectURL(file), // Local preview url, works until refresh
                    status: 'draft'
                };

                const currentData = getStoredAssets();
                saveStoredAssets([newAsset, ...currentData]);

                setTimeout(() => resolve(newAsset), 1500);
            });
        }
        const res = await fetch(`${API_BASE}/assets`, {
            method: 'POST',
            body: formData
        });
        if (!res.ok) throw new Error('Failed to upload asset');
        return res.json();
    }
};

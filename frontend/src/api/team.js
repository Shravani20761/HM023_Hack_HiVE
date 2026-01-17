const API_BASE = '/api';

// Toggle this to false to attempt real network calls
const USE_MOCK = true;
const STORAGE_KEY = 'hackhive_team_data';

const MOCK_TEAM = [
    { id: 1, name: 'You', email: 'admin@hackhive.com', role: 'admin', avatar: '', isActive: true, lastSeen: 'now' },
    { id: 2, name: 'Sarah Mitchell', email: 'sarah.m@hackhive.com', role: 'editor', avatar: '', isActive: true, lastSeen: '5m ago' },
    { id: 3, name: 'David Kim', email: 'david.k@hackhive.com', role: 'manager', avatar: '', isActive: false, lastSeen: '2h ago' },
    { id: 4, name: 'Emma Rodriguez', email: 'emma.r@hackhive.com', role: 'creator', avatar: '', isActive: true, lastSeen: '1m ago' },
    { id: 5, name: 'Alex Thompson', email: 'alex.t@hackhive.com', role: 'marketer', avatar: '', isActive: false, lastSeen: '1d ago' },
];

const getStoredTeam = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : MOCK_TEAM;
};

const saveStoredTeam = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const teamService = {
    async getTeamMembers(campaignId) {
        if (USE_MOCK) {
            return new Promise(resolve => {
                const data = getStoredTeam();
                setTimeout(() => resolve({ members: [...data] }), 400);
            });
        }
        const res = await fetch(`${API_BASE}/campaigns/${campaignId}/team`);
        if (!res.ok) throw new Error('Failed to fetch team members');
        return res.json();
    },

    async assignRole(campaignId, userId, role) {
        if (USE_MOCK) {
            return new Promise(resolve => {
                const currentData = getStoredTeam();
                const updatedData = currentData.map(member =>
                    member.id === userId ? { ...member, role } : member
                );
                saveStoredTeam(updatedData);
                setTimeout(() => resolve({ success: true }), 300);
            });
        }
        const res = await fetch(`${API_BASE}/campaigns/${campaignId}/assign-role`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, role })
        });
        if (!res.ok) throw new Error('Failed to assign role');
        return res.json();
    }
};

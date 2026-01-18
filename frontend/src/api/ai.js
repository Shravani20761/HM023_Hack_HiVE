import api from '../services/api.service';

export const aiService = {
    generateScript: async (token, campaignId, prompt, context = {}) => {
        const response = await api.post(
            `/api/campaigns/${campaignId}/ai/script-writer`,
            { prompt, context },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    generateCaption: async (token, campaignId, title, body, platform) => {
        const response = await api.post(
            `/api/campaigns/${campaignId}/ai/caption-helper`,
            { title, body, platform },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    analyzeSentiment: async (token, campaignId, text, feedbackId) => {
        const response = await api.post(
            `/api/campaigns/${campaignId}/ai/sentiment-analysis`,
            { text, feedbackId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    }
};

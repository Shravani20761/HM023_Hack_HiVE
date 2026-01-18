import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const aiService = {
    generateScript: async (token, campaignId, prompt, context = {}) => {
        const response = await axios.post(
            `${API_BASE_URL}/campaigns/${campaignId}/ai/script-writer`,
            { prompt, context },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    generateCaption: async (token, campaignId, title, body, platform) => {
        const response = await axios.post(
            `${API_BASE_URL}/campaigns/${campaignId}/ai/caption-helper`,
            { title, body, platform },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    analyzeSentiment: async (token, campaignId, text, feedbackId) => {
        const response = await axios.post(
            `${API_BASE_URL}/campaigns/${campaignId}/ai/sentiment-analysis`,
            { text, feedbackId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    }
};

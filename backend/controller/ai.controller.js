import {
    generateScript,
    generateCaption,
    analyzeSentiment,
    logAIUsage
} from '../services/ai.service.js';

// Generate script
export const createScript = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { prompt, context } = req.body;
        const userId = req.user.internalId;

        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        const script = await generateScript(prompt, context);

        // Log AI usage
        await logAIUsage(campaignId, userId, 'script_writer', 0, 0, 0);

        res.status(201).json({
            message: "Script generated successfully",
            script
        });

    } catch (error) {
        console.error("Create Script Error:", error);
        res.status(500).json({ message: "Failed to generate script" });
    }
};

// Generate caption
export const createCaption = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { title, body, platform } = req.body;
        const userId = req.user.internalId;

        if (!title || !platform) {
            return res.status(400).json({ message: "Title and platform are required" });
        }

        const caption = await generateCaption(title, body || '', platform);

        // Log AI usage
        await logAIUsage(campaignId, userId, 'caption_helper', 0, 0, 0);

        res.status(201).json({
            message: "Caption generated successfully",
            caption
        });

    } catch (error) {
        console.error("Create Caption Error:", error);
        res.status(500).json({ message: "Failed to generate caption" });
    }
};

// Analyze sentiment
export const analyzeFeedbackSentiment = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { text, feedbackId } = req.body;
        const userId = req.user.internalId;

        if (!text) {
            return res.status(400).json({ message: "Text is required for sentiment analysis" });
        }

        const sentiment = await analyzeSentiment(text);

        // Log AI usage
        await logAIUsage(campaignId, userId, 'sentiment_analysis', 0, 0, 0);

        res.status(201).json({
            message: "Sentiment analyzed successfully",
            sentiment
        });

    } catch (error) {
        console.error("Analyze Sentiment Error:", error);
        res.status(500).json({ message: "Failed to analyze sentiment" });
    }
};

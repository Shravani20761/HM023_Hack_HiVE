import pool from '../config/db.js';

import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateScript = async (prompt, context) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a creative video script writer for marketing campaigns. Format the output with clear Scene headings, Visual descriptions, and Audio/Dialogue lines.'
                },
                {
                    role: 'user',
                    content: `Context: ${JSON.stringify(context || {})}\n\nTask: ${prompt}`
                }
            ],
            max_tokens: 1000
        });
        return response.choices[0].message.content;

    } catch (error) {
        console.error("Generate Script Error:", error);
        throw new Error("Failed to generate script: " + error.message);
    }
};

export const generateCaption = async (contentTitle, contentBody, platform) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are a social media caption writer. Generate a ${platform}-appropriate caption with emojis and hashtags.`
                },
                {
                    role: 'user',
                    content: `Title: ${contentTitle}\nContent: ${contentBody}`
                }
            ],
            max_tokens: platform === 'instagram' ? 300 : 500
        });
        return response.choices[0].message.content;

    } catch (error) {
        console.error("Generate Caption Error:", error);
        throw new Error("Failed to generate caption: " + error.message);
    }
};

export const analyzeSentiment = async (text) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'Analyze the sentiment of the following text. Respond with EXATCLY one word: "positive", "neutral", or "negative".'
                },
                {
                    role: 'user',
                    content: text
                }
            ]
        });

        const sentiment = response.choices[0].message.content.toLowerCase().trim();
        // Validate output
        if (['positive', 'neutral', 'negative'].includes(sentiment)) {
            return sentiment;
        }
        return 'neutral'; // Fallback

    } catch (error) {
        console.error("Analyze Sentiment Error:", error);
        throw new Error("Failed to analyze sentiment: " + error.message);
    }
};

export const logAIUsage = async (campaignId, userId, featureType, inputTokens = 0, outputTokens = 0, cost = 0) => {
    try {
        const query = `
            INSERT INTO ai_usage (campaign_id, user_id, feature_type, input_tokens, output_tokens, cost)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const result = await pool.query(query, [
            campaignId,
            userId,
            featureType,
            inputTokens,
            outputTokens,
            cost
        ]);

        return result.rows[0];

    } catch (error) {
        console.error("Log AI Usage Error:", error);
        // Don't throw - logging should be non-blocking
        return null;
    }
};

import pool from '../config/db.js';

// Mock OpenAI integration - can be replaced with real OpenAI SDK
// import OpenAI from 'openai';
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateScript = async (prompt, context) => {
    try {
        // For now, return a mock script
        // When OpenAI is fully integrated:
        // const response = await openai.chat.completions.create({
        //   model: 'gpt-4o-mini',
        //   messages: [
        //     {
        //       role: 'system',
        //       content: 'You are a creative video script writer for marketing campaigns...'
        //     },
        //     {
        //       role: 'user',
        //       content: prompt
        //     }
        //   ],
        //   max_tokens: 1000
        // });
        // return response.choices[0].message.content;

        // Mock implementation
        return `
Here's a creative video script based on your request:

[Opening Scene - Vibrant Background]
"Ready to transform your ${context?.campaignType || 'business'}?"

[Main Message]
${prompt}

[Call to Action]
"Join thousands of satisfied customers today!"

[Closing]
"Your success is our mission."
        `.trim();

    } catch (error) {
        console.error("Generate Script Error:", error);
        throw new Error("Failed to generate script");
    }
};

export const generateCaption = async (contentTitle, contentBody, platform) => {
    try {
        // For now, return platform-specific captions
        // When OpenAI is integrated:
        // const response = await openai.chat.completions.create({
        //   model: 'gpt-4o-mini',
        //   messages: [
        //     {
        //       role: 'system',
        //       content: `You are a social media caption writer. Generate a ${platform}-appropriate caption...`
        //     },
        //     {
        //       role: 'user',
        //       content: `Title: ${contentTitle}\nContent: ${contentBody}`
        //     }
        //   ],
        //   max_tokens: platform === 'instagram' ? 300 : 500
        // });
        // return response.choices[0].message.content;

        // Mock implementation
        const captions = {
            instagram: `✨ ${contentTitle}\n\n${contentBody.substring(0, 100)}...\n\n#marketing #digital #socialmedia 🚀`,
            facebook: `${contentTitle}\n\n${contentBody}\n\nLearn more in the comments! 👇`,
            youtube: `${contentTitle}\n\nWatch to learn: ${contentBody.substring(0, 80)}...\n\nDon't forget to like and subscribe!`,
            email: `Subject: ${contentTitle}\n\nHey!\n\n${contentBody}\n\nBest regards!`
        };

        return captions[platform] || captions.instagram;

    } catch (error) {
        console.error("Generate Caption Error:", error);
        throw new Error("Failed to generate caption");
    }
};

export const analyzeSentiment = async (text) => {
    try {
        // For now, use simple heuristics
        // When OpenAI is integrated:
        // const response = await openai.chat.completions.create({
        //   model: 'gpt-4o-mini',
        //   messages: [
        //     {
        //       role: 'system',
        //       content: 'Analyze the sentiment of the following text. Respond with only: positive, neutral, or negative'
        //     },
        //     {
        //       role: 'user',
        //       content: text
        //     }
        //   ]
        // });
        // return response.choices[0].message.content.toLowerCase().trim();

        // Mock implementation using simple heuristics
        const positiveWords = ['love', 'great', 'awesome', 'amazing', 'excellent', 'wonderful', 'fantastic', 'good', 'best'];
        const negativeWords = ['hate', 'terrible', 'awful', 'bad', 'horrible', 'worst', 'poor', 'useless', 'waste'];

        const lowerText = text.toLowerCase();
        const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
        const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

        if (positiveCount > negativeCount) {
            return 'positive';
        } else if (negativeCount > positiveCount) {
            return 'negative';
        } else {
            return 'neutral';
        }

    } catch (error) {
        console.error("Analyze Sentiment Error:", error);
        throw new Error("Failed to analyze sentiment");
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

// server/index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ✅ Google GenAI setup
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

// ✅ Summary route
app.post('/api/summary', async (req, res) => {
    const { fileType, fileData } = req.body;

    try {
        const contents = [
            {
                text: `
                Summarize the document in one short
                paragraph (less than 100 words)
                use plain text only. No markdowns or html tags.
                `
            },
            {
                inlineData: {
                    mimeType: fileType,
                    data: fileData
                }
            }
        ];

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents
        });

        res.json({ summary: response.text });
    } catch (error) {
        console.error('Error in /api/summary:', error.message);
        res.status(500).json({ error: 'Failed to summarize document.' });
    }
});

// ✅ Chat route
app.post('/api/chat', async (req, res) => {
    const { fileType, fileData, question, chatHistory } = req.body;

    try {
        const contents = [
            {
                text: `
Answer this question about the attached document: ${question}.
Reply as a chat bot with short plain text (no markdowns, tags or symbols).
Chat history: ${JSON.stringify(chatHistory)}
                `
            },
            {
                inlineData: {
                    mimeType: fileType,
                    data: fileData
                }
            }
        ];

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents
        });

        res.json({ answer: response.text });
    } catch (error) {
        console.error('Error in /api/chat:', error.message);
        res.status(500).json({ error: 'Failed to get chat response.' });
    }
});

// ✅ PORT fix for Railway
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));

// ai.js - Node.js server for RevStudy AI questions

// 1️⃣ Load environment variables
require('dotenv').config();

const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 3000;

// 2️⃣ Serve static files (ambient.html and other assets)
app.use(express.static(path.join(__dirname, 'public')));

// 3️⃣ Endpoint to generate AI questions
app.get('/generate-question', async (req, res) => {
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'OpenAI API key not provided' });
        }

        // Example: simple prompt for question generation
        const prompt = "Generate a random study question with a topic and a short task.";

        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'text-davinci-003', // or 'gpt-3.5-turbo' if using chat API
                prompt: prompt,
                max_tokens: 60,
            }),
        });

        const data = await response.json();
        const question = data.choices?.[0]?.text?.trim() || "No question generated.";

        res.json({ question });
    } catch (error) {
        console.error("Error generating question:", error);
        res.status(500).json({ error: 'Error generating question' });
    }
});

// 4️⃣ Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

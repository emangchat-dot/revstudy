import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // loads your .env file

const app = express();
app.use(express.json());
app.use(express.static('public')); // serves ambient.html from public folder

// AI question endpoint
app.post('/generate-question', async (req, res) => {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: "Topic is required" });

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are a helpful study assistant." },
                    { role: "user", content: `Generate a concise study question about "${topic}".` }
                ],
                max_tokens: 100
            })
        });

        const result = await response.json();
        const question = result.choices[0].message.content;
        res.json({ question });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "AI request failed" });
    }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

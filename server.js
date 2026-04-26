import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const HF_TOKEN = process.env.HF_TOKEN;

app.post("/ask", async (req, res) => {
  const question = req.body.question;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs:
            "You are a helpful tutor. Explain step by step clearly:\n\n" +
            question
        })
      }
    );

    const data = await response.json();

    const answer =
      data?.[0]?.generated_text ||
      data?.generated_text ||
      data?.error ||
      "No response";

    res.json({ answer });

  } catch (err) {
    res.json({ answer: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("🚀 AI backend running on http://localhost:3000");
});

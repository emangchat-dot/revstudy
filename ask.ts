import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question, level } = req.body;

    const prompt = `
You are a helpful AI tutor.
Level: ${level || "beginner"}

Explain clearly and step-by-step.

Question: ${question}
`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7
          }
        })
      }
    );

    const data = await response.json();

    const answer =
      data?.[0]?.generated_text ||
      data?.generated_text ||
      "No response from model";

    res.status(200).json({ answer });

  } catch (err) {
    res.status(500).json({ error: "Hugging Face request failed" });
  }
}

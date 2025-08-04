import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const { goal } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `
You are an AI goal coach. Given the user's goal, return a gamified level plan like this:
[
  { "level": 1, "title": "Level 1 title", "tasks": ["Task 1", "Task 2"], "xp": 100 },
  ...
]

USER GOAL: "${goal}"
          `,
        },
      ],
      temperature: 0.8,
    });

    const text = response.choices[0].message.content;

    try {
      const plan = JSON.parse(text);
      res.status(200).json({ plan });
    } catch (parseErr) {
      res.status(200).json({
        plan: [
          {
            level: 1,
            title: "Could not parse response",
            tasks: [text],
            xp: 0,
          },
        ],
      });
    }
  } catch (err) {
    console.error("OpenAI Error:", err);
    res.status(500).json({ error: "Failed to generate plan" });
  }
}

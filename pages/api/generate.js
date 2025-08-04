import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,  // or your OpenAI key env var
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed, use POST" });
  }

  const { goal } = req.body;

  if (!goal || typeof goal !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'goal' in request body" });
  }

  const userGoal = goal.trim();

  console.log("API received goal:", userGoal);

  try {
    const response = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",  // or whichever model you are using
      messages: [
        {
          role: "user",
          content: `
You are an AI goal coach. Given the user's goal, return a gamified level plan in this JSON format exactly:
[
  { "level": 1, "title": "Level 1 title", "tasks": ["Task 1", "Task 2"], "xp": 100 },
  ...
]

USER GOAL: "${userGoal}"
          `,
        },
      ],
      temperature: 0.8,
    });

    const text = response.choices[0].message.content;
    console.log("OpenAI response:", text);

    // CLEAN UP MARKDOWN CODE BLOCKS BEFORE PARSING
    const cleanedText = text
      .replace(/```json/g, '')  // remove ```json if present
      .replace(/```/g, '')      // remove ```
      .trim();

    try {
      const plan = JSON.parse(cleanedText);
      return res.status(200).json({ plan });
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      return res.status(200).json({
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
    console.error("OpenAI API error:", err);
    return res.status(500).json({ error: "Failed to generate plan" });
  }
}

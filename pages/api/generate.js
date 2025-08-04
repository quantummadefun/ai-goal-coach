import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,  // store your key securely in environment variables
  defaultHeaders: {
    "HTTP-Referer": "https://your-site-url.com",  // Optional: your site URL
    "X-Title": "Your Site Name",                   // Optional: your site name
  },
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
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        {
          role: "user",
          content: `
You are an AI goal coach. Given the user's goal, return a gamified level plan in this exact JSON format:
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

    const text = completion.choices[0].message.content;
    console.log("OpenRouter response:", text);

    try {
      const plan = JSON.parse(text);
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
    console.error("OpenRouter API error:", err);
    return res.status(500).json({ error: "Failed to generate plan" });
  }
}

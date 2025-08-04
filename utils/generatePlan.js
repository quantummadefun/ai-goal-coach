import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function generatePlan(goal) {
  const prompt = `
You are an AI goal coach. Given the user's goal, return a gamified level plan like this:
[
  { "level": 1, "title": "Level 1 title", "tasks": ["Task 1", "Task 2"], "xp": 100 },
  ...
]

USER GOAL: "${goal}"
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
  });

  const text = response.choices[0].message.content;

  try {
    return JSON.parse(text);
  } catch (err) {
    return [
      {
        level: 1,
        title: "Could not parse plan",
        tasks: [text],
        xp: 0,
      },
    ];
  }
}

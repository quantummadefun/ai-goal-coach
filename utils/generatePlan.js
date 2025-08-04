import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export default async function generatePlan(goal) {
  const prompt = `
You are an AI goal coach. Given the user's goal, return a gamified level plan like this:
[
  { "level": 1, "title": "Level 1 title", "tasks": ["Task 1", "Task 2"], "xp": 100 },
  ...
]

USER GOAL: "${goal}"
`;

  const res = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
  });

  const text = res.data.choices[0].message.content;

  try {
    return JSON.parse(text);
  } catch (e) {
    return [];
  }
}

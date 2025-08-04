export default async function generatePlan(goal) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ goal }),
  });

  const data = await res.json();
  return data.plan || [];
}

export default async function generatePlan(goal) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goal }),
  });

  if (!res.ok) {
    let errorMsg = "Failed to fetch plan";
    try {
      const errorData = await res.json();
      if (errorData?.error) errorMsg = errorData.error;
    } catch {
      // Ignore JSON parse errors on error responses
    }
    throw new Error(errorMsg);
  }

  const data = await res.json();
  if (!data.plan) {
    throw new Error("No plan returned from API");
  }
  return data.plan;
}

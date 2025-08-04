import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import generatePlan from "../utils/generatePlan";

export default function Result() {
  const router = useRouter();
  const { goal } = router.query;
  const [plan, setPlan] = useState([]);

  useEffect(() => {
    if (goal) {
      generatePlan(goal).then(setPlan);
    }
  }, [goal]);

  if (!plan.length) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Your Gamified Plan</h1>
      {plan.map((level, idx) => (
        <div key={idx} style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "1rem" }}>
          <h2>Level {level.level}: {level.title}</h2>
          <ul>
            {level.tasks.map((task, tIdx) => (
              <li key={tIdx}>{task}</li>
            ))}
          </ul>
          <p><strong>XP:</strong> {level.xp}</p>
        </div>
      ))}
    </div>
  );
}

import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [goal, setGoal] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/result?goal=${encodeURIComponent(goal)}`);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎯 Enter Your Goal</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="e.g. Become a YouTuber"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          required
        />
        <button type="submit">Generate Plan</button>
      </form>
    </div>
  );
}

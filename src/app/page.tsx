"use client";

import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState("");

  async function runFlow(isCorrect: boolean) {
    try {
      let learnerState: any = null;

      const sessionRes = await fetch("/api/session", {
        method: "POST",
      });
      const session = await sessionRes.json();

      const attemptRes = await fetch("/api/attempt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: session.id,
        }),
      });
      const attempt = await attemptRes.json();

      if (!window.localStorage.getItem("learnerStateId")) {
        const learnerStateRes = await fetch("/api/learner-state", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            attemptId: attempt.id,
          }),
        });

        learnerState = await learnerStateRes.json();

        window.localStorage.setItem("learnerStateId", learnerState.id);
      } else {
        learnerState = {
          id: window.localStorage.getItem("learnerStateId"),
        };
      }

      const decisionRes = await fetch("/api/decision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          learnerStateId: learnerState.id,
          correct: isCorrect,
        }),
      });

      let decision;

      try {
        decision = await decisionRes.json();
      } catch (e) {
        console.error("Backend returned invalid JSON");
        return;
      }

      setResult(
        JSON.stringify(
          {
            action: decision.action,
            mastery: decision.mastery,
            learnerStateId: decision.learnerStateId,
          },
          null,
          2
        )
      );
    } catch (error) {
      console.error("FLOW ERROR:", error);
    }
  }

  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>StudyEdge V1</h1>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => runFlow(false)}
          style={{ marginRight: "10px", padding: "10px" }}
        >
          I got it WRONG
        </button>

        <button
          onClick={() => runFlow(true)}
          style={{ padding: "10px" }}
        >
          I got it RIGHT
        </button>
      </div>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Decision</h3>
          <p>
            <strong>Action:</strong> {JSON.parse(result).action}
          </p>
          <p>
            <strong>Mastery:</strong> {JSON.parse(result).mastery}
          </p>
        </div>
      )}
    </main>
  );
}
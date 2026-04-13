"use client";

import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState<string>("");

  async function runFlow() {
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

    let learnerState = null;

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
      }),
    });
    const decision = await decisionRes.json();

    setResult(
      JSON.stringify(
        {
          session,
          attempt,
          learnerState,
          decision,
        },
        null,
        2
      )
    );
  }

  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>StudyEdge V1</h1>

      <button
        onClick={runFlow}
        style={{
          padding: "10px 16px",
          fontSize: "16px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Run Full Flow
      </button>

      <pre
        style={{
          marginTop: "20px",
          background: "#f4f4f4",
          padding: "16px",
          borderRadius: "8px",
          whiteSpace: "pre-wrap",
        }}
      >
        {result}
      </pre>
    </main>
  );
}
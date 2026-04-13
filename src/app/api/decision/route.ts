import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { learnerStateId, correct } = await req.json();

    const learnerState = await prisma.learnerState.findUnique({
      where: { id: learnerStateId },
    });

    if (!learnerState) {
      return Response.json(
        { error: "Learner state not found" },
        { status: 404 }
      );
    }

    let newMastery = learnerState.mastery ?? 0;

    if (correct === true) {
      newMastery += 1;
    } else {
      newMastery = Math.max(0, newMastery - 1);
    }

    let action = "repeat";

    if (newMastery >= 4) {
      action = "review";
    } else if (newMastery >= 2) {
      action = "next_step";
    } else {
      action = "repeat";
    }

    await prisma.learnerState.update({
      where: { id: learnerStateId },
      data: { mastery: newMastery },
    });

    const decision = await prisma.decision.create({
      data: {
        learnerStateId,
        action,
      },
    });

    return Response.json({
      ...decision,
      mastery: newMastery,
      correct,
    });
  } catch (error) {
    console.error("DECISION_ROUTE_ERROR:", error);

    return Response.json(
      {
        error: "Decision route failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
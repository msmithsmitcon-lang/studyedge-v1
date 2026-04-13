import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { learnerStateId } = await req.json();

    const learnerState = await prisma.learnerState.findUnique({
      where: { id: learnerStateId },
    });

    if (!learnerState) {
      return Response.json(
        { error: "Learner state not found" },
        { status: 404 }
      );
    }

    let action = "next_step";
    let newMastery = learnerState.mastery ?? 0;

    if (newMastery < 2) {
      action = "repeat";
      newMastery += 1;
    } else if (newMastery < 4) {
      action = "next_step";
      newMastery += 1;
    } else {
      action = "review";
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
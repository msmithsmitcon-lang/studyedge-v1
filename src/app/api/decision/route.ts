import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { learnerStateId } = await req.json();

  // Count previous decisions for this learner state
  const previousDecisions = await prisma.decision.count({
    where: {
      learnerStateId,
    },
  });

  let action = "next_step";

  if (previousDecisions === 0) {
    action = "next_step";
  } else if (previousDecisions === 1) {
    action = "repeat";
  } else {
    action = "review";
  }

  const decision = await prisma.decision.create({
    data: {
      learnerStateId,
      action,
    },
  });

  return Response.json(decision);
}
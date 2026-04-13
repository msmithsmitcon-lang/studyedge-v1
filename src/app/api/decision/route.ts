import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { learnerStateId } = await req.json();

  // VERY SIMPLE DECISION ENGINE (V1)
  const actions = ["next_step", "repeat", "review"];

  const action = actions[Math.floor(Math.random() * actions.length)];

  const decision = await prisma.decision.create({
    data: {
      learnerStateId,
      action,
    },
  });

  return Response.json(decision);
}
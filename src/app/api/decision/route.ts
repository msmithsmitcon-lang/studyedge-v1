import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { learnerStateId, action } = await req.json();

  const decision = await prisma.decision.create({
    data: {
      learnerStateId,
      action,
    },
  });

  return Response.json(decision);
}
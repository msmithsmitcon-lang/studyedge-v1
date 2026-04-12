import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { attemptId } = await req.json();

  const learnerState = await prisma.learnerState.create({
    data: {
      attemptId,
    },
  });

  return Response.json(learnerState);
}

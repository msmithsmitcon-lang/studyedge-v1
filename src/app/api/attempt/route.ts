import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { sessionId } = await req.json();

  const attempt = await prisma.attempt.create({
    data: {
      sessionId,
    },
  });

  return Response.json(attempt);
}
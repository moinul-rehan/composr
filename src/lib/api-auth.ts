import { NextRequest } from "next/server";
import { auth } from "./auth";
import { prisma } from "./prisma";

export async function resolveUserId(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const key = authHeader.slice("Bearer ".length).trim();
    const apiKey = await prisma.apiKey.findUnique({ where: { key } });
    return apiKey?.userId ?? null;
  }

  const session = await auth();
  return session?.user?.id ?? null;
}

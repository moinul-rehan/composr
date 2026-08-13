import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = await prisma.apiKey.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ key: apiKey?.key ?? null });
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = randomBytes(24).toString("base64url");

  const apiKey = await prisma.apiKey.upsert({
    where: { userId: session.user.id },
    update: { key },
    create: { userId: session.user.id, key },
  });

  return NextResponse.json({ key: apiKey.key });
}

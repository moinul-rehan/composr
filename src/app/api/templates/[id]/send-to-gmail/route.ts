import { NextRequest, NextResponse } from "next/server";
import { resolveUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { createGmailDraft } from "@/lib/gmail";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await resolveUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const template = await prisma.template.findUnique({ where: { id } });
  if (!template || template.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const draft = await createGmailDraft(userId, template.subject, template.html);
    return NextResponse.json({ draftId: draft.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

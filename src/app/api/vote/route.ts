import { NextResponse } from "next/server";
import { BROWNIES } from "@/brownies";
import { changeVote, clearVote, getVoterChoice, recordVote } from "@/lib/kv";
import { getClientIpFromRequest } from "@/lib/ip";

export const runtime = "edge";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { brownieId?: string } | null;
  const brownieId = body?.brownieId;

  if (!brownieId || !BROWNIES.some((b) => b.id === brownieId)) {
    return NextResponse.json(
      { success: false, message: "Invalid brownie id." },
      { status: 400 }
    );
  }

  const ip = getClientIpFromRequest(req);
  if (ip === "unknown") {
    return NextResponse.json(
      { success: false, message: "Could not identify voter." },
      { status: 400 }
    );
  }

  const existing = await getVoterChoice(ip);
  if (existing === brownieId) {
    return NextResponse.json({ success: true, votedFor: brownieId, changed: false });
  }

  if (existing) {
    await changeVote(ip, existing, brownieId);
    return NextResponse.json({
      success: true,
      votedFor: brownieId,
      changed: true,
      previousVote: existing,
    });
  }

  await recordVote(ip, brownieId);
  return NextResponse.json({ success: true, votedFor: brownieId, changed: false });
}

export async function DELETE(req: Request) {
  const ip = getClientIpFromRequest(req);
  if (ip === "unknown") {
    return NextResponse.json(
      { success: false, message: "Could not identify voter." },
      { status: 400 }
    );
  }

  const existing = await getVoterChoice(ip);
  if (!existing) {
    return NextResponse.json({ success: true, votedFor: null });
  }

  await clearVote(ip, existing);
  return NextResponse.json({ success: true, votedFor: null, previousVote: existing });
}

import { NextResponse } from "next/server";
import { BROWNIES } from "@/brownies";
import { changeVote, clearVote, getVoterChoice, recordVote } from "@/lib/kv";
import { getOrCreateVoterId } from "@/lib/voter-id";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { brownieId?: string } | null;
  const brownieId = body?.brownieId;

  if (!brownieId || !BROWNIES.some((b) => b.id === brownieId)) {
    return NextResponse.json(
      { success: false, message: "Invalid brownie id." },
      { status: 400 }
    );
  }

  const voterId = await getOrCreateVoterId();

  const existing = await getVoterChoice(voterId);
  if (existing === brownieId) {
    return NextResponse.json({ success: true, votedFor: brownieId, changed: false });
  }

  if (existing) {
    await changeVote(voterId, existing, brownieId);
    return NextResponse.json({
      success: true,
      votedFor: brownieId,
      changed: true,
      previousVote: existing,
    });
  }

  await recordVote(voterId, brownieId);
  return NextResponse.json({ success: true, votedFor: brownieId, changed: false });
}

export async function DELETE() {
  const voterId = await getOrCreateVoterId();

  const existing = await getVoterChoice(voterId);
  if (!existing) {
    return NextResponse.json({ success: true, votedFor: null });
  }

  await clearVote(voterId, existing);
  return NextResponse.json({ success: true, votedFor: null, previousVote: existing });
}

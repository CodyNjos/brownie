import { kv } from "@vercel/kv";
import { BROWNIES } from "@/brownies";

const VOTES_KEY = "brownie:votes";
const voterKey = (ip: string) => `brownie:voter:${ip}`;

export type VoteCounts = Record<string, number>;

export async function getVoteCounts(): Promise<VoteCounts> {
  const raw = await kv.hgetall<Record<string, number | string>>(VOTES_KEY);
  const counts: VoteCounts = {};
  for (const brownie of BROWNIES) {
    const value = raw?.[brownie.id];
    counts[brownie.id] = typeof value === "number" ? value : Number(value ?? 0);
  }
  return counts;
}

export async function getVoterChoice(ip: string): Promise<string | null> {
  return kv.get<string>(voterKey(ip));
}

export async function recordVote(ip: string, brownieId: string): Promise<void> {
  await kv.set(voterKey(ip), brownieId);
  await kv.hincrby(VOTES_KEY, brownieId, 1);
}

export async function changeVote(
  ip: string,
  previousBrownieId: string,
  nextBrownieId: string
): Promise<void> {
  if (previousBrownieId === nextBrownieId) return;
  await kv.hincrby(VOTES_KEY, previousBrownieId, -1);
  await kv.hincrby(VOTES_KEY, nextBrownieId, 1);
  await kv.set(voterKey(ip), nextBrownieId);
}

export async function clearVote(ip: string, brownieId: string): Promise<void> {
  await kv.hincrby(VOTES_KEY, brownieId, -1);
  await kv.del(voterKey(ip));
}

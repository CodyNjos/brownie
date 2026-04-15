import { BROWNIES } from "@/brownies";
import { getVoteCounts, getVoterChoice } from "@/lib/kv";
import { getClientIp } from "@/lib/ip";
import VoteList from "./VoteList";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const ip = await getClientIp();
  const [counts, existingVote] = await Promise.all([
    getVoteCounts(),
    ip === "unknown" ? Promise.resolve(null) : getVoterChoice(ip),
  ]);

  return (
    <main>
      <h1>Brownie Vote</h1>
      <p className="subtitle">Pick your favorite. One vote per person.</p>
      <VoteList brownies={BROWNIES} initialCounts={counts} initialVote={existingVote} />
    </main>
  );
}

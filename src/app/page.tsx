import { BROWNIES } from "@/brownies";
import { getVoteCounts, getVoterChoice } from "@/lib/kv";
import { getVoterId } from "@/lib/voter-id";
import VoteList from "./VoteList";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const voterId = await getVoterId();
  const [counts, existingVote] = await Promise.all([
    getVoteCounts(),
    voterId === "unknown" ? Promise.resolve(null) : getVoterChoice(voterId),
  ]);

  return (
    <main>
      <h1><span className="scheels">SCHEELS™</span> Official Brownie Vote</h1>
      <p className="subtitle">Pick your favorite. One vote per person.</p>
      <VoteList brownies={BROWNIES} initialCounts={counts} initialVote={existingVote} />
    </main>
  );
}

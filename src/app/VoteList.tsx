"use client";

import { useState } from "react";
import type { Brownie } from "@/brownies";

type Props = {
  brownies: Brownie[];
  initialCounts: Record<string, number>;
  initialVote: string | null;
};

type VoteResponse = {
  success: boolean;
  message?: string;
  votedFor?: string;
};

export default function VoteList({ brownies, initialCounts, initialVote }: Props) {
  const [counts, setCounts] = useState(initialCounts);
  const [votedFor, setVotedFor] = useState<string | null>(initialVote);
  const [status, setStatus] = useState<string>("");
  const [pending, setPending] = useState<string | null>(null);

  async function vote(brownieId: string) {
    setPending(brownieId);
    setStatus("");
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brownieId }),
      });
      const data: VoteResponse = await res.json();
      if (res.ok && data.success) {
        setCounts((prev) => ({ ...prev, [brownieId]: (prev[brownieId] ?? 0) + 1 }));
        setVotedFor(brownieId);
        setStatus("Thanks for voting!");
      } else if (res.status === 409 && data.votedFor) {
        setVotedFor(data.votedFor);
        setStatus("You've already voted from this network.");
      } else {
        setStatus(data.message ?? "Something went wrong.");
      }
    } catch {
      setStatus("Network error. Try again.");
    } finally {
      setPending(null);
    }
  }

  return (
    <>
      <div className="grid">
        {brownies.map((b) => {
          const isVoted = votedFor === b.id;
          return (
            <div key={b.id} className={`card${isVoted ? " voted" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.image} alt={b.name} />
              <div className="body">
                <h2>{b.name}</h2>
                <p>{b.description}</p>
                <div className="footer">
                  <span className="votes">{counts[b.id] ?? 0} votes</span>
                  <button
                    onClick={() => vote(b.id)}
                    disabled={votedFor !== null || pending !== null}
                  >
                    {isVoted ? "Your pick" : "Vote"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="status">{status}</div>
    </>
  );
}

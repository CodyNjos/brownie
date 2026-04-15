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
  votedFor?: string | null;
  previousVote?: string;
  changed?: boolean;
};

export default function VoteList({ brownies, initialCounts, initialVote }: Props) {
  const [counts, setCounts] = useState(initialCounts);
  const [votedFor, setVotedFor] = useState<string | null>(initialVote);
  const [status, setStatus] = useState<string>("");
  const [pending, setPending] = useState<string | null>(null);

  async function castVote(brownieId: string) {
    if (votedFor === brownieId) return;
    setPending(brownieId);
    setStatus("");
    const previousVote = votedFor;
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brownieId }),
      });
      const data: VoteResponse = await res.json();
      if (res.ok && data.success) {
        setCounts((prev) => {
          const next = { ...prev };
          if (previousVote && previousVote !== brownieId) {
            next[previousVote] = Math.max(0, (next[previousVote] ?? 0) - 1);
          }
          if (previousVote !== brownieId) {
            next[brownieId] = (next[brownieId] ?? 0) + 1;
          }
          return next;
        });
        setVotedFor(brownieId);
        setStatus(previousVote ? "Vote updated." : "Thanks for voting!");
      } else {
        setStatus(data.message ?? "Something went wrong.");
      }
    } catch {
      setStatus("Network error. Try again.");
    } finally {
      setPending(null);
    }
  }

  async function removeVote() {
    if (!votedFor) return;
    const previousVote = votedFor;
    setPending(previousVote);
    setStatus("");
    try {
      const res = await fetch("/api/vote", { method: "DELETE" });
      const data: VoteResponse = await res.json();
      if (res.ok && data.success) {
        setCounts((prev) => ({
          ...prev,
          [previousVote]: Math.max(0, (prev[previousVote] ?? 0) - 1),
        }));
        setVotedFor(null);
        setStatus("Vote removed. Pick another brownie if you like.");
      } else {
        setStatus(data.message ?? "Something went wrong.");
      }
    } catch {
      setStatus("Network error. Try again.");
    } finally {
      setPending(null);
    }
  }

  if (brownies.length === 0) {
    return (
      <div className="empty">
        No brownies yet. Drop image files into <code>public/brownies/</code> and
        restart the dev server.
      </div>
    );
  }

  return (
    <>
      <div className="grid">
        {brownies.map((b) => {
          const isVoted = votedFor === b.id;
          const isBusy = pending !== null;
          return (
            <div key={b.id} className={`card${isVoted ? " voted" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.image} alt={b.name} />
              <div className="body">
                <h2>{b.name}</h2>
                <div className="footer">
                  <span className="votes">{counts[b.id] ?? 0} votes</span>
                  {isVoted ? (
                    <button onClick={removeVote} disabled={isBusy}>
                      Remove vote
                    </button>
                  ) : (
                    <button onClick={() => castVote(b.id)} disabled={isBusy}>
                      {votedFor ? "Switch to this" : "Vote"}
                    </button>
                  )}
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

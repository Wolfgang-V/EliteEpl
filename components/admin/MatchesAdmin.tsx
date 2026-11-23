"use client";

import { useState } from "react";
import { groupBy, roundNumber, shortDate } from "@/lib/format";
import type { Match, Player } from "@/lib/types";
import Badge from "../Badge";
import MatchEditor from "./MatchEditor";

export default function MatchesAdmin({
  matches,
  players,
  reload,
}: {
  matches: Match[];
  players: Player[];
  reload: () => Promise<void>;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = matches.find((m) => m.id === selectedId);

  if (selected) {
    return <MatchEditor key={selected.id} match={selected} players={players} onSaved={reload} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="space-y-6">
      {groupBy(matches, (m) => m.matchday.number).map(([number, dayMatches]) => (
        <section key={number}>
          <h2 className="mb-2 flex items-baseline gap-3">
            <span className="font-display text-xl uppercase text-ink">Matchday {number}</span>
            <span className="text-sm font-semibold text-zinc-500">{shortDate(dayMatches[0].matchday.date)}</span>
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dayMatches.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedId(m.id)}
                className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-left text-sm shadow-sm ring-1 ring-black/5 transition hover:ring-ink"
              >
                <span className="w-8 text-xs font-bold text-zinc-400">R{roundNumber(m)}</span>
                <Badge team={m.home} size={22} />
                <span className="font-semibold">{m.home.short_name}</span>
                <span className={`mx-auto rounded px-2 py-0.5 font-bold ${m.status === "played" ? "bg-ink text-white" : "text-zinc-400"}`}>
                  {m.status === "played" ? `${m.home_score} - ${m.away_score}` : "vs"}
                </span>
                <span className="font-semibold">{m.away.short_name}</span>
                <Badge team={m.away} size={22} />
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

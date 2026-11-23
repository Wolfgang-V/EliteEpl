import { groupBy, longDate, roundNumber } from "@/lib/format";
import { VENUE } from "@/lib/matches";
import type { Match } from "@/lib/types";
import MatchRow from "./MatchRow";

// Matches grouped by matchday, then by round — like the EPL fixtures page
export default function MatchList({ matches }: { matches: Match[] }) {
  if (matches.length === 0) {
    return <p className="rounded-xl bg-white p-8 text-center text-zinc-500">No matches here yet.</p>;
  }

  return (
    <div className="space-y-8">
      {groupBy(matches, (m) => m.matchday.number).map(([number, dayMatches]) => (
        <section key={number}>
          <h2 className="mb-3 flex flex-wrap items-baseline gap-x-3">
            <span className="font-display text-2xl uppercase text-ink">Matchday {number}</span>
            <span className="text-sm font-semibold text-zinc-500">{longDate(dayMatches[0].matchday.date)} · {VENUE}</span>
          </h2>

          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
            <Rounds matches={dayMatches} />
          </div>
        </section>
      ))}
    </div>
  );
}

// Matches split into "Round N" blocks
export function Rounds({ matches }: { matches: Match[] }) {
  return groupBy(matches, roundNumber).map(([round, roundMatches]) => (
    <div key={round}>
      <div className="bg-zinc-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-600">
        Round {round}
      </div>
      <div className="divide-y divide-zinc-100">
        {roundMatches.map((m) => (
          <MatchRow key={m.id} match={m} />
        ))}
      </div>
    </div>
  ));
}

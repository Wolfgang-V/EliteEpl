import type { Match } from "@/lib/types";
import { shortName } from "@/lib/format";
import Badge from "./Badge";

export default function MatchRow({ match: m }: { match: Match }) {
  const played = m.status === "played";

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-3 sm:gap-3 sm:px-4 transition hover:bg-zinc-50">
      <div className="flex items-center justify-end gap-2.5 text-right text-sm font-semibold sm:text-base">
        <span className="hidden sm:inline">{m.home.name}</span>
        <span className="sm:hidden">{shortName(m.home.name)}</span>
        <Badge team={m.home} />
      </div>

      {played ? (
        <div className="min-w-[64px] rounded-md bg-ink px-3 py-1.5 text-center font-display text-lg tracking-widest text-white">
          {m.home_score} - {m.away_score}
        </div>
      ) : (
        <div className="min-w-[64px] rounded-md border border-zinc-300 px-3 py-1.5 text-center text-sm font-bold text-zinc-600">
          {m.kickoff ?? "vs"}
        </div>
      )}

      <div className="flex items-center gap-2.5 text-sm font-semibold sm:text-base">
        <Badge team={m.away} />
        <span className="hidden sm:inline">{m.away.name}</span>
        <span className="sm:hidden">{shortName(m.away.name)}</span>
      </div>
    </div>
  );
}

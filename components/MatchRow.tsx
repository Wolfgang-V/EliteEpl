import type { Match } from "@/lib/types";
import { shortName } from "@/lib/format";
import Badge from "./Badge";

export default function MatchRow({ match: m }: { match: Match }) {
  const played = m.status === "played";

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1.5 px-2 py-3 transition hover:bg-zinc-50 sm:gap-3 sm:px-4">
      <div className="flex min-w-0 items-center justify-end gap-2 text-right text-sm font-semibold sm:gap-2.5 sm:text-base">
        <span className="hidden truncate sm:inline">{m.home.name}</span>
        <span className="truncate sm:hidden">{shortName(m.home.name)}</span>
        <Badge team={m.home} />
      </div>

      {played ? (
        <div className="min-w-14.5 rounded-md bg-ink px-2 py-1.5 text-center font-display text-lg tracking-widest text-white sm:min-w-16 sm:px-3">
          {m.home_score} - {m.away_score}
        </div>
      ) : (
        <div className="min-w-14.5 whitespace-nowrap rounded-md border border-zinc-300 px-2 py-1.5 text-center text-xs font-bold text-zinc-600 sm:min-w-16 sm:px-3 sm:text-sm">
          {m.kickoff ?? "vs"}
        </div>
      )}

      <div className="flex min-w-0 items-center gap-2 text-sm font-semibold sm:gap-2.5 sm:text-base">
        <Badge team={m.away} />
        <span className="hidden truncate sm:inline">{m.away.name}</span>
        <span className="truncate sm:hidden">{shortName(m.away.name)}</span>
      </div>
    </div>
  );
}

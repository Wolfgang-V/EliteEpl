import Link from "next/link";
import Countdown from "@/components/Countdown";
import { Rounds } from "@/components/MatchList";
import StandingsTable from "@/components/StandingsTable";
import { getMatches, getTeams } from "@/lib/data";
import { longDate } from "@/lib/format";
import { kickoffTime, VENUE } from "@/lib/matches";
import { getStandings } from "@/lib/standings";

export default async function Home() {
  const [teams, matches] = await Promise.all([getTeams(), getMatches()]);
  const table = getStandings(teams, matches);

  const upcoming = matches.filter((m) => m.status === "scheduled");
  const nextDay = upcoming[0]?.matchday;
  const nextMatches = upcoming.filter((m) => m.matchday.number === nextDay?.number);

  const played = matches.filter((m) => m.status === "played");
  const lastDay = played.at(-1)?.matchday;
  const lastResults = played.filter((m) => m.matchday.number === lastDay?.number).reverse();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-8">
        {/* Next matchday hero */}
        {nextDay && (
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            <div className="relative overflow-hidden bg-ink px-6 py-8 text-white">
              {/* Night photo of our turf, darkened on the left so the text stays readable */}
              <img src="/pitch-night.jpg" alt="" aria-hidden className="absolute inset-0 size-full object-cover" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/20" />
              <div className="relative">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-mint">Next up</span>
                  {nextDay.date && <Countdown date={nextDay.date} />}
                </div>
                <h1 className="mt-2 font-display text-4xl uppercase sm:text-5xl">Matchday {nextDay.number}</h1>
                <p className="mt-1 font-semibold text-white/75">{longDate(nextDay.date)} · First kick-off {kickoffTime(0)} · {VENUE}</p>
              </div>
            </div>
            <Rounds matches={nextMatches} />
            <Link href="/fixtures" className="block border-t border-zinc-100 py-3 text-center text-sm font-bold text-ink hover:bg-zinc-50">
              All fixtures →
            </Link>
          </section>
        )}

        {/* Latest results */}
        {lastDay && (
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            <div className="flex items-baseline justify-between px-6 pb-2 pt-5">
              <h2 className="font-display text-2xl uppercase text-ink">Latest results</h2>
              <span className="text-sm font-semibold text-zinc-500">Matchday {lastDay.number}</span>
            </div>
            <Rounds matches={lastResults} />
            <Link href="/results" className="block border-t border-zinc-100 py-3 text-center text-sm font-bold text-ink hover:bg-zinc-50">
              All results →
            </Link>
          </section>
        )}
      </div>

      {/* Mini table */}
      <aside className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl uppercase text-ink">Table</h2>
          <Link href="/table" className="text-sm font-bold text-ink hover:underline">
            Full table →
          </Link>
        </div>
        <StandingsTable rows={table} compact />
      </aside>
    </div>
  );
}

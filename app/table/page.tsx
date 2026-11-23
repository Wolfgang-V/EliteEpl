import StandingsTable from "@/components/StandingsTable";
import { getMatches, getTeams } from "@/lib/data";
import { getStandings } from "@/lib/standings";

export const metadata = { title: "Table" };

export default async function TablePage() {
  const [teams, matches] = await Promise.all([getTeams(), getMatches()]);
  const table = getStandings(teams, matches);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-4xl uppercase text-ink">Table</h1>
      <StandingsTable rows={table} />
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-zinc-500">
        <span className="flex items-center gap-2"><i className="h-3 w-1 bg-amber-400" /> Champions</span>
        <span className="flex items-center gap-2"><i className="h-3 w-1 bg-zinc-300" /> Runners-up</span>
        <span className="flex items-center gap-2"><i className="h-3 w-1 bg-orange-400" /> Third place</span>
        <span>Tiebreakers: points, goal difference, goals scored, head-to-head</span>
      </div>
    </div>
  );
}

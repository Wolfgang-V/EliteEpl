import Badge from "@/components/Badge";
import PlayerAvatar from "@/components/PlayerAvatar";
import { getSeasonStats, type StatRow } from "@/lib/data";
import { shortName } from "@/lib/format";

export const metadata = { title: "Stats" };

type Stat = "goals" | "assists" | "yellows";

// Highest first, ties share a rank (1, 2, 2, 4…)
function leaderboard(rows: StatRow[], stat: Stat) {
  const sorted = rows.filter((r) => r[stat] > 0).sort((a, b) => b[stat] - a[stat] || a.name.localeCompare(b.name));
  return sorted.map((r) => ({ row: r, rank: sorted.findIndex((x) => x[stat] === r[stat]) + 1 }));
}

function ClubLabel({ row }: { row: StatRow }) {
  if (!row.team) return <span className="text-xs font-semibold text-zinc-500">On loan</span>;
  return (
    <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
      <Badge team={row.team} size={16} />
      {shortName(row.team.name)}
    </span>
  );
}

function Board({ title, stat, unit, rows }: { title: string; stat: Stat; unit: string; rows: StatRow[] }) {
  const board = leaderboard(rows, stat);
  const leader = board[0]?.row;

  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <h2 className="px-5 pb-2 pt-4 font-display text-2xl uppercase text-ink">{title}</h2>

      {leader && (
        <div
          className="relative mx-3 mb-2 flex items-center gap-3 overflow-hidden rounded-xl p-3 text-white sm:gap-4 sm:p-4"
          style={{ background: `linear-gradient(120deg, #2a0f33 30%, ${leader.team?.colour ?? "#3d1a4a"} 140%)` }}
        >
          <PlayerAvatar name={leader.name} team={leader.team} size={72} />
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-mint">Leader</p>
            <p className="truncate text-xl font-extrabold">{leader.name}</p>
            <p className="text-sm text-white/70">{leader.team ? leader.team.name : "On loan"}</p>
          </div>
          <p className="ml-auto text-right">
            <span className="block font-display text-5xl leading-none">{leader[stat]}</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">{unit}</span>
          </p>
        </div>
      )}

      {board.length === 0 && <p className="px-5 pb-5 text-sm text-zinc-500">Nothing yet.</p>}

      {/* Top 10 on show, the rest one tap away */}
      <ol className="divide-y divide-zinc-100">
        {board.slice(1, TOP).map(({ row, rank }) => (
          <Row key={`${row.team?.short_name}:${row.name}`} row={row} rank={rank} stat={stat} />
        ))}
      </ol>
      {board.length > TOP && (
        <details className="group border-t border-zinc-100">
          <summary className="cursor-pointer list-none py-3 text-center text-sm font-bold text-ink hover:bg-zinc-50 [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Show all {board.length} →</span>
            <span className="hidden group-open:inline">Show fewer ↑</span>
          </summary>
          <ol className="divide-y divide-zinc-100 border-t border-zinc-100">
            {board.slice(TOP).map(({ row, rank }) => (
              <Row key={`${row.team?.short_name}:${row.name}`} row={row} rank={rank} stat={stat} />
            ))}
          </ol>
        </details>
      )}
    </section>
  );
}

const TOP = 10;

function Row({ row, rank, stat }: { row: StatRow; rank: number; stat: Stat }) {
  return (
    <li className="flex items-center gap-3 px-4 py-2.5 sm:px-5">
      <span className="w-5 text-right text-sm font-bold text-zinc-400">{rank}</span>
      <PlayerAvatar name={row.name} team={row.team} size={36} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-ink">
          {row.name}
          {stat === "yellows" && row.finePaid && (
            <span className="ml-2 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
              Fine paid
            </span>
          )}
        </p>
        <ClubLabel row={row} />
      </div>
      <span className="text-lg font-extrabold text-ink">{row[stat]}</span>
    </li>
  );
}

export default async function StatsPage() {
  const rows = await getSeasonStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl uppercase text-ink">Stats</h1>
        <p className="text-sm font-semibold text-zinc-500">Season 1 · updated after every matchday</p>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <Board title="Top scorers" stat="goals" unit="Goals" rows={rows} />
        <Board title="Most assists" stat="assists" unit="Assists" rows={rows} />
        <Board title="Yellow cards" stat="yellows" unit="Cards" rows={rows} />
      </div>
    </div>
  );
}

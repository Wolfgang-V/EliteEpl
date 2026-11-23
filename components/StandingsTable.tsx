import type { Result, Row } from "@/lib/standings";
import { shortName } from "@/lib/format";
import Badge from "./Badge";

const formStyle: Record<Result, string> = {
  W: "bg-emerald-600",
  D: "bg-zinc-400",
  L: "bg-red-600",
};

// Medal places (1st, 2nd, 3rd) get a coloured marker
const medal = ["bg-amber-400", "bg-zinc-300", "bg-orange-400"];

export default function StandingsTable({ rows, compact = false }: { rows: Row[]; compact?: boolean }) {
  const full = compact ? "hidden" : "hidden md:table-cell";

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-black/5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-500">
            <th className="w-12 py-3 pl-4 text-left">Pos</th>
            <th className="py-3 text-left">Club</th>
            <th className="px-2 py-3" title="Played">Pl</th>
            <th className={`${full} px-2 py-3`} title="Won">W</th>
            <th className={`${full} px-2 py-3`} title="Drawn">D</th>
            <th className={`${full} px-2 py-3`} title="Lost">L</th>
            <th className={`${full} px-2 py-3`} title="Goals for">GF</th>
            <th className={`${full} px-2 py-3`} title="Goals against">GA</th>
            <th className="px-2 py-3" title="Goal difference">GD</th>
            <th className="px-3 py-3" title="Points">Pts</th>
            <th className={`${compact ? "hidden" : "hidden sm:table-cell"} py-3 pr-4 text-left`}>Form</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.team.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
              <td className="relative py-3 pl-4 font-bold">
                {r.pos <= 3 && r.p > 0 && <span className={`absolute inset-y-0 left-0 w-1 ${medal[r.pos - 1]}`} />}
                {r.pos}
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2.5 font-semibold">
                  <Badge team={r.team} size={24} />
                  <span className="hidden sm:inline">{r.team.name}</span>
                  <span className="sm:hidden">{shortName(r.team.name)}</span>
                </div>
              </td>
              <td className="px-2 text-center">{r.p}</td>
              <td className={`${full} px-2 text-center`}>{r.w}</td>
              <td className={`${full} px-2 text-center`}>{r.d}</td>
              <td className={`${full} px-2 text-center`}>{r.l}</td>
              <td className={`${full} px-2 text-center`}>{r.gf}</td>
              <td className={`${full} px-2 text-center`}>{r.ga}</td>
              <td className="px-2 text-center">{r.gd > 0 ? `+${r.gd}` : r.gd}</td>
              <td className="px-3 text-center text-base font-extrabold text-ink">{r.pts}</td>
              <td className={`${compact ? "hidden" : "hidden sm:table-cell"} py-3 pr-4`}>
                <div className="flex gap-1">
                  {r.form.map((f, i) => (
                    <span
                      key={i}
                      className={`flex size-6 items-center justify-center rounded-full text-[11px] font-bold text-white ${formStyle[f]}`}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

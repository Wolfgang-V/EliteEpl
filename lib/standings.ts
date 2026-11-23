import type { Match, Team } from "./types";

export type Result = "W" | "D" | "L";

export type Row = {
  pos: number;
  team: Team;
  p: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  form: Result[]; // last 5, oldest → newest
};

export function getStandings(teams: Team[], matches: Match[]): Row[] {
  const played = matches.filter((m) => m.status === "played");
  const rows = new Map<number, Row>(
    teams.map((team) => [
      team.id,
      { pos: 0, team, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] },
    ])
  );

  // Add one team's side of a match to its row
  function add(row: Row | undefined, scored: number, conceded: number) {
    if (!row) return;
    const result: Result = scored > conceded ? "W" : scored === conceded ? "D" : "L";
    row.p++;
    row.gf += scored;
    row.ga += conceded;
    row.gd = row.gf - row.ga;
    if (result === "W") (row.w++, (row.pts += 3));
    if (result === "D") (row.d++, (row.pts += 1));
    if (result === "L") row.l++;
    row.form = [...row.form, result].slice(-5);
  }

  for (const m of played) {
    add(rows.get(m.home.id), m.home_score!, m.away_score!);
    add(rows.get(m.away.id), m.away_score!, m.home_score!);
  }

  // Head-to-head: positive when `a` did better against `b`
  function headToHead(a: Team, b: Team) {
    return played
      .filter((m) => [m.home.id, m.away.id].includes(a.id) && [m.home.id, m.away.id].includes(b.id))
      .reduce((sum, m) => {
        const aScore = m.home.id === a.id ? m.home_score! : m.away_score!;
        const bScore = m.home.id === a.id ? m.away_score! : m.home_score!;
        return sum + Math.sign(aScore - bScore);
      }, 0);
  }

  // Tiebreakers: points → goal difference → goals scored → head-to-head
  const compare = (a: Row, b: Row) =>
    b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || headToHead(b.team, a.team);

  const table = [...rows.values()].sort(
    (a, b) => compare(a, b) || a.team.name.localeCompare(b.team.name)
  );

  // Teams level on every tiebreaker share a position
  table.forEach((row, i) => {
    row.pos = i > 0 && compare(table[i - 1], row) === 0 ? table[i - 1].pos : i + 1;
  });

  return table;
}

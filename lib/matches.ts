import type { Match } from "./types";

// What to fetch for each match: the match, its matchday and both teams
export const MATCH_SELECT = `
  id, round, leg, home_score, away_score, home_gk_id, away_gk_id, status,
  matchday:matchdays(number, date),
  home:teams!matches_home_team_id_fkey(*),
  away:teams!matches_away_team_id_fkey(*)
`;

// Season order: matchday → leg → round → match id
export function sortMatches(matches: Match[]) {
  return [...matches].sort(
    (a, b) =>
      a.matchday.number - b.matchday.number ||
      a.leg - b.leg ||
      a.round - b.round ||
      a.id - b.id
  );
}

// Matchday schedule: one pitch, games back to back
export const VENUE = "Crescendo Turf";
export const FIRST_KICKOFF = "08:00"; // Lagos time
// 10 min half + 5 min break + 10 min half + 10 min changeover
export const SLOT_MINUTES = 35;

// "8:00am", "8:35am", "1:25pm"… from the game's place in the matchday
export function kickoffTime(slot: number) {
  const [h, m] = FIRST_KICKOFF.split(":").map(Number);
  const total = h * 60 + m + slot * SLOT_MINUTES;
  const hour = Math.floor(total / 60);
  const min = String(total % 60).padStart(2, "0");
  return `${hour % 12 || 12}:${min}${hour < 12 ? "am" : "pm"}`;
}

// Attach each match's kick-off time (matches must already be in season order)
export function withKickoffs(matches: Match[]) {
  const slots = new Map<number, number>();
  return matches.map((m) => {
    const slot = slots.get(m.matchday.number) ?? 0;
    slots.set(m.matchday.number, slot + 1);
    return { ...m, kickoff: kickoffTime(slot) };
  });
}

import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import { MATCH_SELECT, sortMatches, withKickoffs } from "./matches";
import { TALLIES } from "./tallies";
import type { Match, Player, Team } from "./types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = url && key ? createClient(url, key) : null;

// Cached for a few minutes, and refreshed instantly when the admin saves
export async function getTeams(): Promise<Team[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("league");
  if (!supabase) return [];

  const { data, error } = await supabase.from("teams").select("*").order("name");
  if (error) throw error;
  return data;
}

export async function getMatches(): Promise<Match[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("league");
  if (!supabase) return [];

  const { data, error } = await supabase.from("matches").select(MATCH_SELECT);
  if (error) throw error;
  return withKickoffs(sortMatches(data as unknown as Match[]));
}

export async function getPlayers(): Promise<Player[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("league");
  if (!supabase) return [];

  const { data, error } = await supabase.from("players").select("*").order("shirt_number");
  if (error) throw error;
  return data;
}

export type PlayerStats = { goals: number; assists: number; motm: number; yellows: number; reds: number };

export type StatRow = PlayerStats & {
  name: string;
  team: Team | null; // null = played on loan
  playerId: number | null;
  finePaid: boolean;
};

// Season totals per player: Matchday 1 tallies plus every event logged in admin
export async function getSeasonStats(): Promise<StatRow[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("league");
  if (!supabase) return [];

  const [teams, players, events] = await Promise.all([
    getTeams(),
    getPlayers(),
    supabase.from("match_events").select("player_id, type"),
  ]);
  if (events.error) throw events.error;

  const teamById = new Map(teams.map((t) => [t.id, t]));
  const teamByShort = new Map(teams.map((t) => [t.short_name, t]));
  const rows = new Map<string, StatRow>();

  function row(team: Team | null, name: string, playerId: number | null = null) {
    const key = `${team?.short_name ?? ""}:${name.trim().toLowerCase()}`;
    let r = rows.get(key);
    if (!r) {
      r = { name, team, playerId, finePaid: false, goals: 0, assists: 0, motm: 0, yellows: 0, reds: 0 };
      rows.set(key, r);
    }
    r.playerId ??= playerId;
    return r;
  }

  // Squad players first, so database names and ids win
  const byId = new Map(players.map((p) => [p.id, row(teamById.get(p.team_id ?? -1) ?? null, p.name, p.id)]));

  for (const t of TALLIES) {
    const r = row(t.club ? teamByShort.get(t.club) ?? null : null, t.name);
    r.goals += t.goals ?? 0;
    r.assists += t.assists ?? 0;
    r.yellows += t.yellows ?? 0;
    r.finePaid ||= !!t.finePaid;
  }

  for (const e of events.data) {
    const r = byId.get(e.player_id);
    if (!r) continue;
    if (e.type === "goal") r.goals++;
    if (e.type === "assist") r.assists++;
    if (e.type === "motm") r.motm++;
    if (e.type === "yellow") r.yellows++;
    if (e.type === "red") r.reds++;
  }

  return [...rows.values()];
}

// The same totals, keyed by player id for the squad cards
export async function getPlayerStats(): Promise<Record<number, PlayerStats>> {
  const rows = await getSeasonStats();
  return Object.fromEntries(rows.filter((r) => r.playerId !== null).map((r) => [r.playerId, r]));
}

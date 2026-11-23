import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import { MATCH_SELECT, sortMatches, withKickoffs } from "./matches";
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

export type PlayerStats = { goals: number; assists: number; motm: number };

// Season totals per player, counted from match events
export async function getPlayerStats(): Promise<Record<number, PlayerStats>> {
  "use cache";
  cacheLife("minutes");
  cacheTag("league");
  if (!supabase) return {};

  const { data, error } = await supabase.from("match_events").select("player_id, type");
  if (error) throw error;

  const stats: Record<number, PlayerStats> = {};
  for (const e of data) {
    const s = (stats[e.player_id] ??= { goals: 0, assists: 0, motm: 0 });
    if (e.type === "goal") s.goals++;
    if (e.type === "assist") s.assists++;
    if (e.type === "motm") s.motm++;
  }
  return stats;
}

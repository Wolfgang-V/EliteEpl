"use client";

import type { Session } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import Login from "@/components/admin/Login";
import MatchesAdmin from "@/components/admin/MatchesAdmin";
import PlayersAdmin from "@/components/admin/PlayersAdmin";
import { MATCH_SELECT, sortMatches } from "@/lib/matches";
import { supabase } from "@/lib/supabase-browser";
import type { Match, Player, Team } from "@/lib/types";

export default function AdminPage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [tab, setTab] = useState<"matches" | "players">("matches");
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  // Keep track of whether the admin is logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  // Fresh data straight from the database (no cache in admin)
  const reload = useCallback(async () => {
    const [t, p, m] = await Promise.all([
      supabase.from("teams").select("*").order("name"),
      supabase.from("players").select("*").order("shirt_number"),
      supabase.from("matches").select(MATCH_SELECT),
    ]);
    setTeams(t.data ?? []);
    setPlayers(p.data ?? []);
    setMatches(sortMatches((m.data ?? []) as unknown as Match[]));
  }, []);

  useEffect(() => {
    if (session) reload();
  }, [session, reload]);

  if (session === undefined) return <p className="text-center text-zinc-500">Loading…</p>;
  if (!session) return <Login />;

  const tabClass = (t: string) =>
    `rounded-lg px-4 py-2 text-sm font-bold ${tab === t ? "bg-ink text-white" : "bg-white text-zinc-700 ring-1 ring-black/10"}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="mr-auto font-display text-4xl uppercase text-ink">Admin</h1>
        <button className={tabClass("matches")} onClick={() => setTab("matches")}>Matches</button>
        <button className={tabClass("players")} onClick={() => setTab("players")}>Players</button>
        <button className="text-sm font-bold text-zinc-500 hover:text-ink" onClick={() => supabase.auth.signOut()}>
          Sign out
        </button>
      </div>

      {tab === "matches" ? (
        <MatchesAdmin matches={matches} players={players} reload={reload} />
      ) : (
        <PlayersAdmin teams={teams} players={players} reload={reload} />
      )}
    </div>
  );
}

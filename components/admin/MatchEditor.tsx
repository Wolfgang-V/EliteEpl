"use client";

import { useCallback, useEffect, useState } from "react";
import { refreshSite } from "@/app/admin/actions";
import { roundNumber } from "@/lib/format";
import { supabase } from "@/lib/supabase-browser";
import type { EventType, Match, MatchEvent, Player } from "@/lib/types";
import Badge from "../Badge";
import { button, buttonLight, card, input } from "./ui";

const eventLabels: Record<EventType, string> = {
  goal: "⚽ Goal",
  own_goal: "⚽ Own goal",
  assist: "👟 Assist",
  yellow: "🟨 Yellow card",
  red: "🟥 Red card",
  motm: "⭐ Man of the match",
};

export default function MatchEditor({
  match: m,
  players,
  onSaved,
  onBack,
}: {
  match: Match;
  players: Player[];
  onSaved: () => Promise<void>;
  onBack: () => void;
}) {
  // Score and goalkeepers
  const [homeScore, setHomeScore] = useState(m.home_score?.toString() ?? "");
  const [awayScore, setAwayScore] = useState(m.away_score?.toString() ?? "");
  const [homeGk, setHomeGk] = useState(m.home_gk_id?.toString() ?? "");
  const [awayGk, setAwayGk] = useState(m.away_gk_id?.toString() ?? "");
  const [message, setMessage] = useState("");

  // Events (goals, assists, cards, MOTM)
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [type, setType] = useState<EventType>("goal");
  const [side, setSide] = useState<"home" | "away">("home");
  const [playerId, setPlayerId] = useState("");
  const [minute, setMinute] = useState("");

  const squad = (teamId: number) => players.filter((p) => p.team_id === teamId);
  const playerName = (id: number) => players.find((p) => p.id === id)?.name ?? "Unknown";
  const sideTeam = side === "home" ? m.home : m.away;

  const loadEvents = useCallback(async () => {
    const { data } = await supabase.from("match_events").select("*").eq("match_id", m.id).order("minute");
    setEvents(data ?? []);
  }, [m.id]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  async function saveResult() {
    const { error } = await supabase
      .from("matches")
      .update({
        home_score: Number(homeScore),
        away_score: Number(awayScore),
        home_gk_id: homeGk ? Number(homeGk) : null,
        away_gk_id: awayGk ? Number(awayGk) : null,
        status: "played",
      })
      .eq("id", m.id);
    if (error) return setMessage(error.message);

    await refreshSite();
    await onSaved();
    setMessage("Result saved ✓");
  }

  async function markNotPlayed() {
    if (!confirm("Clear the score and mark this match as not played?")) return;
    await supabase.from("matches").update({ home_score: null, away_score: null, status: "scheduled" }).eq("id", m.id);
    setHomeScore("");
    setAwayScore("");
    await refreshSite();
    await onSaved();
    setMessage("Marked as not played");
  }

  async function addEvent(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("match_events").insert({
      match_id: m.id,
      player_id: Number(playerId),
      team_id: sideTeam.id, // the team he played for in THIS match
      type,
      minute: minute ? Number(minute) : null,
    });
    if (error) return setMessage(error.message);

    setPlayerId("");
    setMinute("");
    await loadEvents();
    await refreshSite();
  }

  async function deleteEvent(id: number) {
    await supabase.from("match_events").delete().eq("id", id);
    await loadEvents();
    await refreshSite();
  }

  // Goals entered so far — an own goal counts for the other team
  const goalsFor = (teamId: number) =>
    events.filter((ev) => (ev.type === "goal" && ev.team_id === teamId) || (ev.type === "own_goal" && ev.team_id !== teamId)).length;

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="text-sm font-bold text-ink hover:underline">
        ← All matches
      </button>

      {/* Result */}
      <section className={card}>
        <p className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-zinc-500">
          Matchday {m.matchday.number} · Round {roundNumber(m)}
        </p>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex flex-col items-center gap-2 text-center font-bold">
            <Badge team={m.home} size={44} /> {m.home.name}
          </div>
          <div className="flex items-center gap-2">
            <input aria-label={`${m.home.name} score`} className={`${input} w-16 text-center text-2xl font-bold`} type="number" min={0} value={homeScore} onChange={(e) => setHomeScore(e.target.value)} />
            <span className="font-bold text-zinc-400">–</span>
            <input aria-label={`${m.away.name} score`} className={`${input} w-16 text-center text-2xl font-bold`} type="number" min={0} value={awayScore} onChange={(e) => setAwayScore(e.target.value)} />
          </div>
          <div className="flex flex-col items-center gap-2 text-center font-bold">
            <Badge team={m.away} size={44} /> {m.away.name}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            { team: m.home, value: homeGk, set: setHomeGk },
            { team: m.away, value: awayGk, set: setAwayGk },
          ].map(({ team, value, set }) => (
            <label key={team.id} className="space-y-1 text-sm font-semibold">
              <span>{team.name} goalkeeper</span>
              <select className={input} value={value} onChange={(e) => set(e.target.value)}>
                <option value="">Not set</option>
                {squad(team.id).map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.position})</option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button className={button} disabled={homeScore === "" || awayScore === ""} onClick={saveResult}>
            Save result
          </button>
          {m.status === "played" && (
            <button className={buttonLight} onClick={markNotPlayed}>
              Mark as not played
            </button>
          )}
          {message && <span className="text-sm font-semibold text-emerald-700">{message}</span>}
        </div>
      </section>

      {/* Events */}
      <section className={card}>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-2xl uppercase text-ink">Match events</h2>
          <span className="text-xs font-semibold text-zinc-500">
            Scorers entered: {m.home.short_name} {goalsFor(m.home.id)}/{homeScore || 0} · {m.away.short_name} {goalsFor(m.away.id)}/{awayScore || 0}
          </span>
        </div>

        <form onSubmit={addEvent} className="grid gap-3 sm:grid-cols-[1.4fr_1fr_1.6fr_0.7fr_auto] sm:items-end">
          <label className="space-y-1 text-sm font-semibold">
            <span>What happened</span>
            <select className={input} value={type} onChange={(e) => setType(e.target.value as EventType)}>
              {Object.entries(eventLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm font-semibold">
            <span>Club</span>
            <select className={input} value={side} onChange={(e) => (setSide(e.target.value as "home" | "away"), setPlayerId(""))}>
              <option value="home">{m.home.name}</option>
              <option value="away">{m.away.name}</option>
            </select>
          </label>
          <label className="space-y-1 text-sm font-semibold">
            <span>Player</span>
            <select className={input} required value={playerId} onChange={(e) => setPlayerId(e.target.value)}>
              <option value="">Choose…</option>
              {squad(sideTeam.id).map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm font-semibold">
            <span>Minute</span>
            <input className={input} type="number" min={1} max={20} value={minute} onChange={(e) => setMinute(e.target.value)} />
          </label>
          <button className={button}>Add</button>
        </form>

        {type === "own_goal" && (
          <p className="mt-2 text-xs text-zinc-500">For an own goal, pick the club of the player who scored it. The goal counts for the other team.</p>
        )}
        {squad(sideTeam.id).length === 0 && (
          <p className="mt-2 text-xs font-semibold text-amber-700">No players for {sideTeam.name} yet. Add them in the Players tab.</p>
        )}

        <ul className="mt-5 divide-y divide-zinc-100">
          {events.length === 0 && <li className="py-2 text-sm text-zinc-500">No events yet.</li>}
          {events.map((ev) => (
            <li key={ev.id} className="flex items-center gap-3 py-2.5 text-sm">
              <span className="w-10 font-bold text-zinc-500">{ev.minute ? `${ev.minute}'` : "–"}</span>
              <span className="w-40">{eventLabels[ev.type]}</span>
              <span className="flex-1 font-semibold">{playerName(ev.player_id)}</span>
              <span className="text-xs font-bold text-zinc-500">{ev.team_id === m.home.id ? m.home.short_name : m.away.short_name}</span>
              <button onClick={() => deleteEvent(ev.id)} className="text-xs font-bold text-red-600 hover:underline">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { refreshSite } from "@/app/admin/actions";
import { supabase } from "@/lib/supabase-browser";
import type { Player, Team } from "@/lib/types";
import Badge from "../Badge";
import { button, card, input } from "./ui";

const positions = ["GK", "DEF", "MID", "FWD"];

export default function PlayersAdmin({
  teams,
  players,
  reload,
}: {
  teams: Team[];
  players: Player[];
  reload: () => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [position, setPosition] = useState("MID");
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");

  async function addPlayer(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("players").insert({
      name: name.trim(),
      team_id: Number(teamId),
      position,
      shirt_number: number ? Number(number) : null,
    });
    if (error) return setError(error.message);

    setName("");
    setNumber("");
    setError("");
    await reload();
    await refreshSite();
  }

  async function removePlayer(p: Player) {
    if (!confirm(`Remove ${p.name}?`)) return;
    const { error } = await supabase.from("players").delete().eq("id", p.id);
    // A player who already has goals or cards can't be removed
    if (error) return alert(`Can't remove ${p.name}: they already have match stats.`);
    await reload();
    await refreshSite();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={addPlayer} className={`${card} grid gap-3 sm:grid-cols-[2fr_2fr_1fr_1fr_auto] sm:items-end`}>
        <label className="space-y-1 text-sm font-semibold">
          <span>Name</span>
          <input className={input} required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="space-y-1 text-sm font-semibold">
          <span>Club</span>
          <select className={input} required value={teamId} onChange={(e) => setTeamId(e.target.value)}>
            <option value="">Choose…</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm font-semibold">
          <span>Position</span>
          <select className={input} value={position} onChange={(e) => setPosition(e.target.value)}>
            {positions.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm font-semibold">
          <span>Shirt #</span>
          <input className={input} type="number" min={1} max={99} value={number} onChange={(e) => setNumber(e.target.value)} />
        </label>
        <button className={button}>Add player</button>
        {error && <p className="text-sm font-semibold text-red-600 sm:col-span-5">{error}</p>}
      </form>

      {/* Squads */}
      <div className="grid gap-4 sm:grid-cols-2">
        {teams.map((t) => {
          const squad = players.filter((p) => p.team_id === t.id);
          return (
            <section key={t.id} className={card}>
              <h2 className="mb-3 flex items-center gap-2 font-bold">
                <Badge team={t} size={26} /> {t.name}
                <span className="ml-auto text-xs text-zinc-500">{squad.length} players</span>
              </h2>
              {squad.length === 0 && <p className="text-sm text-zinc-500">No players yet.</p>}
              <ul className="divide-y divide-zinc-100">
                {squad.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 py-2 text-sm">
                    <span className="w-6 text-right font-bold text-zinc-500">{p.shirt_number ?? "–"}</span>
                    <span className="flex-1 font-semibold">{p.name}</span>
                    <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-bold text-zinc-600">{p.position}</span>
                    <button onClick={() => removePlayer(p)} className="text-xs font-bold text-red-600 hover:underline">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

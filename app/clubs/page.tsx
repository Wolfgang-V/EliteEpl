import Badge from "@/components/Badge";
import PlayerCard from "@/components/PlayerCard";
import { getPlayers, getPlayerStats, getTeams } from "@/lib/data";

export const metadata = { title: "Clubs" };

const positionOrder = { GK: 0, DEF: 1, MID: 2, FWD: 3 };

export default async function ClubsPage() {
  const [teams, players, stats] = await Promise.all([getTeams(), getPlayers(), getPlayerStats()]);

  // Only clubs whose squads have been added so far
  const squads = teams
    .map((team) => ({
      team,
      players: players
        .filter((p) => p.team_id === team.id)
        .sort(
          (a, b) =>
            positionOrder[a.position ?? "FWD"] - positionOrder[b.position ?? "FWD"] ||
            (a.shirt_number ?? 99) - (b.shirt_number ?? 99)
        ),
    }))
    .filter((s) => s.players.length > 0);

  return (
    <div className="space-y-10">
      <h1 className="font-display text-4xl uppercase text-ink">Clubs</h1>

      {squads.length === 0 && <p className="font-semibold text-zinc-500">Squads will appear here once they&apos;re added.</p>}

      {squads.map(({ team, players }) => (
        <section key={team.id} id={team.short_name.toLowerCase()} className="scroll-mt-4 space-y-4">
          <h2 className="flex items-center gap-3 font-display text-2xl uppercase text-ink">
            <Badge team={team} size={36} />
            {team.name}
            <span className="ml-auto font-sans text-sm font-semibold normal-case text-zinc-500">
              {players.length} players
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {players.map((p) => (
              <PlayerCard key={p.id} player={p} team={team} stats={stats[p.id]} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

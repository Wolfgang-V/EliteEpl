import type { PlayerStats } from "@/lib/data";
import { playerPhoto } from "@/lib/photos";
import type { Player, Team } from "@/lib/types";
import Badge, { textColour } from "./Badge";

const positionNames = { GK: "Goalkeeper", DEF: "Defender", MID: "Midfielder", FWD: "Forward" };

// Stand-in until real player photos are added
function Silhouette({ colour }: { colour: string }) {
  return (
    <svg viewBox="0 0 200 220" aria-hidden className="absolute bottom-0 left-1/2 h-[88%] -translate-x-1/2">
      <circle cx="100" cy="72" r="42" fill={colour} />
      <path d="M18 220c4-62 40-96 82-96s78 34 82 96z" fill={colour} />
    </svg>
  );
}

export default function PlayerCard({
  player,
  team,
  stats,
}: {
  player: Player;
  team: Team;
  stats?: PlayerStats;
}) {
  const colour = team.colour ?? "#6b5a75";
  const ink = textColour(colour);
  const { goals = 0, assists = 0, motm = 0 } = stats ?? {};
  const photo = playerPhoto(player, team);

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg">
      {/* Photo area in club colours */}
      <div
        className="relative aspect-[4/4.4] overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${colour} 0%, ${colour} 45%, #2a0f33 140%)` }}
      >
        <span
          className="absolute right-2 top-1 z-10 font-display text-6xl leading-none opacity-25 sm:right-3 sm:text-7xl"
          style={{ color: ink }}
        >
          {player.shirt_number ?? ""}
        </span>
        <div className="absolute left-3 top-3 z-10">
          <Badge team={team} size={30} />
        </div>

        {photo ? (
          <img
            src={photo.src}
            alt={player.name}
            className="absolute inset-0 size-full object-cover"
            style={{ objectPosition: photo.position ?? "50% 20%" }}
          />
        ) : (
          <Silhouette colour={ink === "#ffffff" ? "rgba(255,255,255,0.28)" : "rgba(26,10,34,0.22)"} />
        )}

        {player.position && (
          <span className="absolute bottom-3 left-3 rounded bg-ink/85 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-mint">
            {player.position}
          </span>
        )}
      </div>

      {/* Name and season stats */}
      <div className="px-3 pb-3 pt-3 sm:px-4 sm:pb-4">
        <div className="flex items-baseline gap-1.5 sm:gap-2">
          <span className="font-display text-xl text-zinc-400 sm:text-2xl">{player.shirt_number ?? "–"}</span>
          <h3 className="line-clamp-2 break-words text-base font-extrabold leading-tight text-ink sm:text-lg">{player.name}</h3>
        </div>
        <p className="text-xs font-semibold text-zinc-500">
          {player.position ? positionNames[player.position] : "Player"}
        </p>

        <dl className="mt-3 grid grid-cols-3 divide-x divide-zinc-100 rounded-lg bg-zinc-50 py-2 text-center">
          {[
            ["Goals", goals],
            ["Assists", assists],
            ["MOTM", motm],
          ].map(([label, value]) => (
            <div key={label}>
              <dd className="text-lg font-extrabold text-ink">{value}</dd>
              <dt className="text-[9px] font-bold uppercase tracking-wide text-zinc-500 sm:text-[10px] sm:tracking-wider">{label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

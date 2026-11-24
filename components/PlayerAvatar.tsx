import { photoFor } from "@/lib/photos";
import type { Team } from "@/lib/types";
import { textColour } from "./Badge";

// Round player photo, or a silhouette in club colours when there's no photo yet
export default function PlayerAvatar({ name, team, size = 40 }: { name: string; team: Team | null; size?: number }) {
  const photo = photoFor(team?.short_name, name);
  const bg = team?.colour ?? "#6b5a75";
  const ink = textColour(bg) === "#ffffff" ? "rgba(255,255,255,0.45)" : "rgba(26,10,34,0.3)";

  return (
    <span
      className="relative inline-block shrink-0 overflow-hidden rounded-full ring-2 ring-white"
      style={{ width: size, height: size, background: bg }}
    >
      {photo ? (
        <img
          src={photo.src}
          alt={name}
          className="size-full object-cover"
          style={{ objectPosition: photo.position ?? "50% 20%" }}
        />
      ) : (
        <svg viewBox="0 0 40 40" aria-hidden className="absolute inset-0 size-full">
          <circle cx="20" cy="15.5" r="7" fill={ink} />
          <path d="M6 40c1-10 7-15.5 14-15.5S33 30 34 40z" fill={ink} />
        </svg>
      )}
    </span>
  );
}

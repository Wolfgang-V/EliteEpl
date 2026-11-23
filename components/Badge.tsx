import type { Team } from "@/lib/types";

// Light club colours (City blue, Madrid gold) get dark text
export function textColour(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return r * 0.299 + g * 0.587 + b * 0.114 > 150 ? "#1a0a22" : "#ffffff";
}

export default function Badge({ team, size = 28 }: { team: Team; size?: number }) {
  const bg = team.colour ?? "#6b5a75";
  return (
    <span
      title={team.name}
      className="inline-flex shrink-0 items-center justify-center rounded-full font-extrabold ring-2 ring-white/70"
      style={{ width: size, height: size, background: bg, color: textColour(bg), fontSize: size * 0.32 }}
    >
      {team.short_name}
    </span>
  );
}

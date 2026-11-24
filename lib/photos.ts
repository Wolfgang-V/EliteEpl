import type { Player, Team } from "./types";

// Player photos live in public/players. Add a line per photo:
// "<club short name>:<player name>": { src, position? }
// `position` is the CSS object-position for framing the face in the card.
const photos: Record<string, { src: string; position?: string }> = {
  "MUN:lumi": { src: "/players/mun-lumi.jpg", position: "50% 75%" },
  "MUN:marcus aurelius": { src: "/players/mun-marcus-aurelius.jpg", position: "50% 72%" },
  "MUN:david bush": { src: "/players/mun-david-bush.jpg", position: "50% 75%" },
  "MUN:skillful cubrasi": { src: "/players/mun-skillful-cubrasi.jpg", position: "50% 38%" },
  "MUN:mohammed": { src: "/players/mun-mohammed.jpg", position: "50% 40%" },
  "MUN:teejay bright": { src: "/players/mun-teejay-bright.jpg", position: "50% 5%" },
  "MUN:adebayo": { src: "/players/mun-adebayo.jpg", position: "50% 55%" },

  "MCI:salawu": { src: "/players/mci-salawu.jpg", position: "50% 30%" },
  "MCI:sam dee": { src: "/players/mci-sam-dee.jpg", position: "50% 0%" },
  "MCI:gucci": { src: "/players/mci-gucci.jpg", position: "50% 30%" },
  "MCI:cash": { src: "/players/mci-cash.jpg", position: "50% 95%" },
  "MCI:wolfgang": { src: "/players/mci-wolfgang.jpg", position: "50% 0%" },
};

export function photoFor(club: string | null | undefined, name: string) {
  return photos[`${club ?? ""}:${name.trim().toLowerCase()}`];
}

export function playerPhoto(player: Player, team: Team) {
  return photoFor(team.short_name, player.name);
}

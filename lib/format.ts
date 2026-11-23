import type { Match } from "./types";

// "Saturday 28 November 2026"
export function longDate(date: string | null) {
  if (!date) return "Date to be confirmed";
  return new Date(date + "T12:00:00").toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// "Sat 28 Nov"
export function shortDate(date: string | null) {
  if (!date) return "TBC";
  return new Date(date + "T12:00:00").toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

// Rounds run 1–14 across the season (leg 2 continues from 8)
export function roundNumber(m: Match) {
  return (m.leg - 1) * 7 + m.round;
}

// Group items by a key, keeping their order
export function groupBy<T, K>(items: T[], key: (item: T) => K) {
  const groups = new Map<K, T[]>();
  for (const item of items) {
    const k = key(item);
    groups.set(k, [...(groups.get(k) ?? []), item]);
  }
  return [...groups.entries()];
}

// "Man Utd", "Man City" on small screens
export function shortName(name: string) {
  return name.replace("Manchester United", "Man Utd").replace("Manchester City", "Man City");
}

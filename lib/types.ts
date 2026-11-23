export type Team = {
  id: number;
  name: string;
  short_name: string;
  colour: string | null;
};

export type Player = {
  id: number;
  name: string;
  team_id: number | null;
  position: "GK" | "DEF" | "MID" | "FWD" | null;
  shirt_number: number | null;
};

export type Match = {
  id: number;
  round: number;
  leg: 1 | 2;
  home_score: number | null;
  away_score: number | null;
  home_gk_id: number | null;
  away_gk_id: number | null;
  status: "scheduled" | "played";
  matchday: { number: number; date: string | null };
  home: Team;
  away: Team;
  kickoff?: string; // "8:35am", worked out from the matchday schedule
};

export type EventType = "goal" | "own_goal" | "assist" | "yellow" | "red" | "motm";

export type MatchEvent = {
  id: number;
  match_id: number;
  player_id: number;
  team_id: number;
  type: EventType;
  minute: number | null;
};

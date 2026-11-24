// Season totals that weren't logged match by match (Matchday 1, from the G/A chart
// and the yellow card list). Goals and cards logged per match in admin add on top.
// `club` is the team's short name; null = played on loan, club not recorded.
// Use the exact database name for players who are in a squad, so the numbers land on their card.

export type Tally = {
  club: string | null;
  name: string;
  goals?: number;
  assists?: number;
  yellows?: number;
  finePaid?: boolean;
};

export const TALLIES: Tally[] = [
  // Manchester United
  { club: "MUN", name: "David Bush", goals: 1 },
  { club: "MUN", name: "Adebayo", goals: 1 },
  { club: "MUN", name: "Lumi", goals: 1, assists: 1 },
  { club: "MUN", name: "Ope Small", yellows: 1 },
  { club: "MUN", name: "Baleba", yellows: 1 },

  // Barcelona
  { club: "BAR", name: "Gtee", goals: 1 },
  { club: "BAR", name: "Ola", goals: 1 },
  { club: "BAR", name: "Pedri", goals: 1 },
  { club: "BAR", name: "Tanny", assists: 1 },
  { club: "BAR", name: "Taiwo", yellows: 1 },

  // Liverpool
  { club: "LIV", name: "Darmlarhk", goals: 4, assists: 1 },
  { club: "LIV", name: "Flawless", goals: 1 },
  { club: "LIV", name: "Beejayy", assists: 3 },
  { club: "LIV", name: "Ori Owo", assists: 1 },

  // Bayern
  { club: "BAY", name: "Ajanbadan", goals: 3, yellows: 1 },
  { club: "BAY", name: "Dada", goals: 1 },
  { club: "BAY", name: "Maka", goals: 1, assists: 3, yellows: 2 },

  // Real Madrid
  { club: "RMA", name: "Kenny", goals: 4, yellows: 1 },
  { club: "RMA", name: "Deji", goals: 1, assists: 4, yellows: 1 },
  { club: "RMA", name: "Sheriff", goals: 1, yellows: 2 },
  { club: "RMA", name: "Flames", yellows: 2 },

  // Chelsea
  { club: "CHE", name: "Oju", goals: 1, assists: 2 },
  { club: "CHE", name: "Muller", goals: 1, assists: 1 },
  { club: "CHE", name: "Walexzy", goals: 1, assists: 1 },
  { club: "CHE", name: "Opeyemi", goals: 1, assists: 1 }, // "Ope" on the G/A chart
  { club: "CHE", name: "Kay", goals: 2, assists: 1 }, // listed under "scored on loan"
  { club: "CHE", name: "Sam", yellows: 1, finePaid: true },

  // Arsenal
  { club: "ARS", name: "Mr Tolu", goals: 2, assists: 1 },
  { club: "ARS", name: "Sir Denis", goals: 2, yellows: 1 },
  { club: "ARS", name: "Bash", goals: 2, yellows: 1 },
  { club: "ARS", name: "Showon", goals: 1 },
  { club: "ARS", name: "Ozil", goals: 1, assists: 3, yellows: 1 },
  { club: "ARS", name: "Marcos", assists: 1 },

  // Manchester City
  { club: "MCI", name: "Salawu", goals: 2 }, // "Wissa" on the G/A chart
  { club: "MCI", name: "Sam Dee", goals: 1 },
  { club: "MCI", name: "Cash", goals: 1, assists: 2, yellows: 1 },
  { club: "MCI", name: "Fawazzy", goals: 1 },
  { club: "MCI", name: "Wolfgang", yellows: 1 },
  { club: "MCI", name: "City keeper", yellows: 1 },
];

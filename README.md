# Elite Premier League

Fixtures, results and the league table for the Elite Premier League, built with Next.js and Supabase.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and add your Supabase URL and anon key.
3. Run `supabase/seed.sql` once in the Supabase SQL Editor. It adds the season, the 5 matchdays and all 56 fixtures, with the Matchday 1 results.
4. `npm run dev` and open http://localhost:3000

## Where things live
- `lib/data.ts`: reads teams and matches from Supabase
- `lib/standings.ts`: works out the table (points, goal difference, goals scored, head-to-head)
- `components/`: badges, match rows, the table
- `app/`: the pages (home, fixtures, results, table)

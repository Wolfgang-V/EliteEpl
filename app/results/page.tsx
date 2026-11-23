import MatchList from "@/components/MatchList";
import { getMatches } from "@/lib/data";

export const metadata = { title: "Results" };

export default async function ResultsPage() {
  // Newest first
  const matches = (await getMatches()).filter((m) => m.status === "played").reverse();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl uppercase text-ink">Results</h1>
      <MatchList matches={matches} />
    </div>
  );
}

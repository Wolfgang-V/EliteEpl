import MatchList from "@/components/MatchList";
import { getMatches } from "@/lib/data";

export const metadata = { title: "Fixtures" };

export default async function FixturesPage() {
  const matches = (await getMatches()).filter((m) => m.status === "scheduled");

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl uppercase text-ink">Fixtures</h1>
      <MatchList matches={matches} />
    </div>
  );
}

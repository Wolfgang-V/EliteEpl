import Link from "next/link";
import { getTeams } from "@/lib/data";
import Badge from "./Badge";
import NavLinks from "./NavLinks";

export default async function Header() {
  const teams = await getTeams();

  return (
    <header>
      {/* Club strip, like the badges along the top of premierleague.com */}
      <div className="bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto px-4 py-2">
          <span className="whitespace-nowrap text-[11px] font-bold uppercase tracking-widest text-zinc-500">Clubs</span>
          {teams.map((t) => (
            <Badge key={t.id} team={t} size={26} />
          ))}
        </div>
      </div>

      <div className="bg-ink">
        <div className="mx-auto max-w-6xl px-4">
          <Link href="/" className="flex items-center gap-3 pt-4">
            <img src="/crest.svg" alt="" className="h-12 w-11" />
            <span className="leading-tight">
              <span className="block font-display text-xl uppercase tracking-wide text-white">Elite Premier League</span>
              <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-mint">Same game · Same passion</span>
            </span>
          </Link>
          <NavLinks />
        </div>
      </div>
    </header>
  );
}

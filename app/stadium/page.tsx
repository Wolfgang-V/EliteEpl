import Link from "next/link";
import Countdown from "@/components/Countdown";
import { getMatches } from "@/lib/data";
import { longDate } from "@/lib/format";
import { kickoffTime, SLOT_MINUTES, VENUE } from "@/lib/matches";

export const metadata = { title: "Stadium" };

const photos = [
  { src: "/stadium/match.jpg", alt: "A match in progress at Crescendo Turf" },
  { src: "/stadium/squad.jpg", alt: "Players gathering on the pitch before kick-off" },
  { src: "/stadium/night.jpg", alt: "Crescendo Turf under the floodlights at night" },
];

const facts = [
  ["Surface", "Artificial turf"],
  ["Format", "10 min · 5 min break · 10 min"],
  ["First kick-off", kickoffTime(0)],
  ["New game every", `${SLOT_MINUTES} minutes`],
];

export default async function StadiumPage() {
  const matches = await getMatches();
  const upcoming = matches.filter((m) => m.status === "scheduled");
  const nextDay = upcoming[0]?.matchday;
  const nextCount = upcoming.filter((m) => m.matchday.number === nextDay?.number).length;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-ink text-white shadow-sm">
        <img src="/stadium/match.jpg" alt="" aria-hidden className="absolute inset-0 size-full object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
        <div className="relative flex min-h-[320px] flex-col justify-end p-6 sm:min-h-[420px] sm:p-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-mint">Home of the Elite Premier League</span>
          <h1 className="mt-2 font-display text-5xl uppercase sm:text-7xl">{VENUE}</h1>
          <p className="mt-2 max-w-xl font-semibold text-white/80">
            Every matchday is played here: eight clubs and one pitch, with games back to back from morning kick-off.
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Gallery */}
        <section className="space-y-3">
          <h2 className="font-display text-2xl uppercase text-ink">Gallery</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {photos.map((p, i) => (
              <figure
                key={p.src}
                className={`overflow-hidden rounded-xl bg-zinc-200 shadow-sm ring-1 ring-black/5 ${i === 0 ? "sm:col-span-2" : ""}`}
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className={`w-full object-cover transition duration-500 hover:scale-[1.03] ${i === 0 ? "aspect-[16/8]" : "aspect-[4/3]"}`}
                />
              </figure>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          {/* Next matchday at the venue */}
          {nextDay && (
            <section className="rounded-2xl bg-ink p-5 text-white shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-mint">Next here</span>
                {nextDay.date && <Countdown date={nextDay.date} />}
              </div>
              <p className="mt-2 font-display text-3xl uppercase">Matchday {nextDay.number}</p>
              <p className="font-semibold text-white/75">{longDate(nextDay.date)}</p>
              <p className="mt-1 text-sm text-white/60">
                {nextCount} games · {kickoffTime(0)} to {kickoffTime(nextCount - 1)}
              </p>
              <Link href="/fixtures" className="mt-4 inline-block text-sm font-bold text-mint hover:underline">
                See the fixtures →
              </Link>
            </section>
          )}

          {/* Pitch facts */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="mb-3 font-display text-2xl uppercase text-ink">The pitch</h2>
            <dl className="divide-y divide-zinc-100">
              {facts.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-2.5 text-sm">
                  <dt className="font-semibold text-zinc-500">{label}</dt>
                  <dd className="text-right font-bold text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}

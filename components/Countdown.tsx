"use client";

import { useEffect, useState } from "react";
import { FIRST_KICKOFF } from "@/lib/matches";

// "4 days to go" — counts down to the morning of the matchday (first kick-off, Lagos time)
export default function Countdown({ date }: { date: string }) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const kickoff = new Date(`${date}T${FIRST_KICKOFF}:00+01:00`).getTime();
    setDays(Math.ceil((kickoff - Date.now()) / 86_400_000));
  }, [date]);

  if (days === null || days < 0) return null;
  return (
    <span className="rounded-full bg-mint px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-ink">
      {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days} days to go`}
    </span>
  );
}

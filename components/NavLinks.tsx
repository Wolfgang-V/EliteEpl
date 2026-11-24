"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/results", label: "Results" },
  { href: "/table", label: "Table" },
  { href: "/stats", label: "Stats" },
  { href: "/clubs", label: "Clubs" },
  { href: "/stadium", label: "Stadium" },
];

export default function NavLinks() {
  const path = usePathname();
  const active = useRef<HTMLAnchorElement>(null);

  // On phones the bar scrolls sideways: keep the current page's tab in view
  useEffect(() => {
    active.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [path]);

  return (
    <div className="relative -mx-4 sm:mx-0">
      <nav className="-mb-px flex overflow-x-auto px-2 [scrollbar-width:none] sm:gap-1 sm:px-0 [&::-webkit-scrollbar]:hidden">
        {links.map((l) => {
          const isActive = path === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              ref={isActive ? active : undefined}
              aria-current={isActive ? "page" : undefined}
              className={`whitespace-nowrap border-b-4 px-3 py-3 text-sm font-bold transition sm:px-4 ${
                isActive ? "border-mint text-white" : "border-transparent text-white/70 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      {/* Fade on the right hints that there are more tabs to scroll to */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-ink sm:hidden" />
    </div>
  );
}

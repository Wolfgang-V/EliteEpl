"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/results", label: "Results" },
  { href: "/table", label: "Table" },
  { href: "/clubs", label: "Clubs" },
  { href: "/stadium", label: "Stadium" },
];

export default function NavLinks() {
  const path = usePathname();

  return (
    <nav className="-mb-px flex gap-1 overflow-x-auto">
      {links.map((l) => {
        const active = path === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`whitespace-nowrap border-b-4 px-4 py-3 text-sm font-bold transition ${
              active ? "border-mint text-white" : "border-transparent text-white/70 hover:text-white"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
      <span className="whitespace-nowrap px-4 py-3 text-sm font-bold text-white/35">Stats · soon</span>
    </nav>
  );
}

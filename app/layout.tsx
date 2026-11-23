import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource/anton";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Elite Premier League", template: "%s | Elite Premier League" },
  description: "Fixtures, results, table and stats from the Elite Premier League.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased">
      <body className="flex min-h-screen flex-col bg-zinc-100 font-sans text-zinc-900">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
        <footer className="bg-ink py-6 text-center text-xs font-semibold uppercase tracking-widest text-white/60">
          Elite Premier League · Official site
        </footer>
      </body>
    </html>
  );
}

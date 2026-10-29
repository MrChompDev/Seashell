"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLockup, DiscordMark } from "./brand";

const PUBLIC_NAV = [
  { label: "Home", href: "/" },
  { label: "Order", href: "/order" },
  { label: "Seashell+", href: "/#seashell-plus" },
  { label: "Legal", href: "/legal" },
  { label: "Contact", href: "https://discord.gg/seashell" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
          <BrandLockup compact />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {PUBLIC_NAV.map((item) =>
            item.href.startsWith("http") ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-stone-400 transition-colors hover:text-copper-300"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={
                  "text-sm font-medium transition-colors " +
                  (pathname === item.href
                    ? "text-copper-300"
                    : "text-stone-400 hover:text-copper-300")
                }
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden md:block">
          <a href="https://discord.gg/seashell" target="_blank" rel="noreferrer" className="btn-gold text-sm">
            <DiscordMark className="h-4 w-4" />
            Join Discord
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-stone-300 md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-panel px-4 pb-4 pt-2 md:hidden">
          {PUBLIC_NAV.map((item) =>
            item.href.startsWith("http") ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-stone-300 hover:bg-white/5"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-stone-300 hover:bg-white/5"
              >
                {item.label}
              </Link>
            )
          )}
          <a
            href="https://discord.gg/seashell"
            target="_blank"
            rel="noreferrer"
            className="btn-gold mt-3 w-full"
          >
            <DiscordMark className="h-4 w-4" />
            Join Discord
          </a>
        </div>
      )}
    </header>
  );
}

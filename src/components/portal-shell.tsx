"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  PenLine,
  CalendarClock,
  Calculator,
  ShieldCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Shell, DiscordMark } from "./brand";
import { Year } from "./year";
import type { Profile } from "@/lib/types";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/agreements", label: "Agreements", icon: PenLine },
  { href: "/dashboard/loa", label: "LOA Requests", icon: CalendarClock },
  { href: "/dashboard/tax-calculator", label: "Tax Calculator", icon: Calculator },
] as const;

export function PortalShell({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const isAdmin = profile.role === "Admin";
  const nav: Array<{ href: string; label: string; icon: typeof LayoutDashboard }> = isAdmin
    ? [...NAV, { href: "/dashboard/admin", label: "Admin", icon: ShieldCheck }]
    : [...NAV];
  const displayName = profile.discord_name ?? "Staff Member";
  const initial = displayName.charAt(0).toUpperCase();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  async function signOut() {
    setBusy(true);
    try {
      await (await import("@/lib/supabase/client")).createClient().auth.signOut();
      router.push("/staff?reason=signin");
      router.refresh();
    } finally {
      setBusy(false);
      setOpen(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Shell className="h-6 w-6" />
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-stone-300">
              Seashell Customs
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors " +
                  (isActive(n.href)
                    ? "bg-copper-400/15 text-copper-100"
                    : "text-stone-400 hover:bg-white/5 hover:text-stone-200")
                }
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-copper-400/30 bg-copper-400/10">
                {profile.discord_avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.discord_avatar_url ?? ""} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-copper-300">
                    {initial}
                  </span>
                )}
              </div>
              <div className="leading-tight">
                <div className="max-w-[10rem] truncate text-sm font-medium text-cream">
                  {displayName}
                </div>
                <div className="text-[0.65rem] font-semibold uppercase tracking-widest text-copper-300">
                  {profile.role}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={signOut}
              disabled={busy}
              className="hidden items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-stone-300 transition-colors hover:border-red-400/40 hover:text-red-300 sm:flex"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-stone-300 lg:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-72 flex-col border-l border-white/10 bg-panel p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shell className="h-5 w-5" />
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-stone-300">
                  Seashell Customs
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-stone-400"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-copper-400/20 bg-ink/60 p-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-copper-400/30 bg-copper-400/10">
                {profile.discord_avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.discord_avatar_url ?? ""} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-copper-300">{initial}</span>
                )}
              </div>
              <div className="leading-tight">
                <div className="truncate text-sm font-medium text-cream">{displayName}</div>
                <div className="text-[0.65rem] font-semibold uppercase tracking-widest text-copper-300">
                  {profile.role}
                </div>
              </div>
            </div>
            <nav className="mt-4 flex flex-col gap-1">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium " +
                    (isActive(n.href)
                      ? "bg-copper-400/15 text-copper-100"
                      : "text-stone-400 hover:bg-white/5")
                  }
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </Link>
              ))}
            </nav>
            <button
              type="button"
              onClick={signOut}
              disabled={busy}
              className="mt-auto flex items-center justify-center gap-2 rounded-lg border border-white/10 py-2.5 text-sm text-stone-300 hover:border-red-400/40 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
            <a
              href="https://discord.gg/seashell"
              target="_blank"
              rel="noreferrer"
              className="btn-outline mt-3 justify-center text-sm"
            >
              <DiscordMark className="h-4 w-4" />
              Support
            </a>
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">{children}</main>

      <footer className="border-t border-white/5 py-6">
        <p className="text-center text-xs text-stone-600">
          © <Year /> Seashell Customs — Staff Portal
        </p>
      </footer>
    </div>
  );
}

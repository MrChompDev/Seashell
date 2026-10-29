import Link from "next/link";
import { Mail } from "lucide-react";
import { DiscordMark, Shell } from "./brand";

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Order", href: "/order" },
  { label: "Seashell+", href: "/#seashell-plus" },
  { label: "Legal", href: "/legal" },
  { label: "Staff Portal", href: "/staff" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-panel">
      {/* watermark shells */}
      <Shell className="pointer-events-none absolute -right-8 -top-8 h-44 w-44 rotate-12 opacity-[0.05]" />
      <Shell className="pointer-events-none absolute -left-10 bottom-0 h-24 w-24 -rotate-12 opacity-[0.05]" />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Shell className="h-9 w-9" />
            <div>
              <div className="text-sm font-semibold tracking-wide text-cream">
                SEASHELL CUSTOMS
              </div>
              <div className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-stone-500">
                Designs · Bots · Websites · Uniforms
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-stone-400">
            Home of the premades. Premium designs, made easy — for communities
            that want more than the ordinary.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-copper-300">
            Quick Links
          </h3>
          <ul className="mt-5 space-y-3">
            {FOOTER_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-sm text-stone-400 transition-colors hover:text-copper-300"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-copper-300">
            Join Our Community
          </h3>
          <p className="mt-5 text-sm leading-relaxed text-stone-400">
            Hang out with the team, see new previews and get the latest
            releases first.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a href="https://discord.gg/seashell" target="_blank" rel="noreferrer" className="btn-gold text-sm">
              <DiscordMark className="h-4 w-4" />
              Join Discord
            </a>
            <a
              href="mailto:support@seashellcustoms.com"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-copper-400/30 text-stone-300 transition-colors hover:border-copper-400/60 hover:text-copper-300"
              aria-label="Email Seashell Customs"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
          <p className="script mt-6 text-2xl">Seashell Customs</p>
        </div>
      </div>

      <div className="border-t border-white/5 py-5 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} Seashell Customs — All Rights Reserved
      </div>
    </footer>
  );
}

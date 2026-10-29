import Link from "next/link";
import { Shell, DiscordMark } from "./brand";
import { Year } from "./year";

const STAFF_SUPPORT = [
  { label: "Staff Documents", href: "/dashboard/documents" },
  { label: "Agreements", href: "/dashboard/agreements" },
  { label: "Policies & Procedures", href: "/dashboard/documents?category=Handbooks" },
  { label: "LOA Request", href: "/dashboard/loa" },
  { label: "Support", href: "https://discord.gg/seashell", external: true },
];

export function PortalFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-panel">
      <Shell className="pointer-events-none absolute -right-8 -top-10 h-44 w-44 rotate-12 opacity-[0.05]" />
      <Shell className="pointer-events-none absolute -left-10 bottom-0 h-24 w-24 -rotate-12 opacity-[0.05]" />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div className="flex items-start gap-3">
          <Shell className="h-9 w-9" />
          <div>
            <div className="text-sm font-semibold tracking-wide text-cream">
              SEASHELL CUSTOMS
            </div>
            <div className="script mt-1 text-xl text-copper-300">
              Home of the Premades
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-copper-300">
            Staff Support
          </h3>
          <ul className="mt-5 space-y-3">
            {STAFF_SUPPORT.map((l) => (
              <li key={l.label}>
                {l.external ? (
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-stone-400 transition-colors hover:text-copper-300"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    href={l.href}
                    className="text-sm text-stone-400 transition-colors hover:text-copper-300"
                  >
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-copper-300">
            Join Our Community
          </h3>
          <p className="mt-5 text-sm leading-relaxed text-stone-400">
            Questions about the portal, documents or LOA requests? The team is
            one message away on our Discord.
          </p>
          <a href="https://discord.gg/seashell" target="_blank" rel="noreferrer" className="btn-gold mt-5 text-sm">
            <DiscordMark className="h-4 w-4" />
            Join Discord
          </a>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 border-t border-white/5 py-6">
        <Shell className="h-7 w-7 opacity-80" />
        <p className="text-xs text-stone-500">
          © <Year /> Seashell Customs — All Rights Reserved
        </p>
      </div>
    </footer>
  );
}

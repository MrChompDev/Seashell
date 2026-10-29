import {
  AlertTriangle,
  Ban,
  BadgeCheck,
  CircleAlert,
  Copyright,
  FileText,
  Info,
  Lock,
  Scale,
  ShieldCheck,
  ShoppingCart,
  Squirrel,
} from "lucide-react";
import { Shell } from "@/components/brand";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroMarkSide, SectionEyebrow, SectionTitle } from "@/components/ui";

export const metadata = { title: "Legal & Terms" };

export default function LegalPage() {
  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <SiteHeader />

      <main className="flex-1">
        {/* ------------------------------------------------ hero */}
        <section className="relative overflow-hidden border-b border-white/5">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(40rem 24rem at 15% 90%, rgba(214,166,140,0.10), transparent 60%)," +
                "radial-gradient(30rem 18rem at 80% -10%, rgba(244,221,208,0.06), transparent 60%)",
            }}
          />
          <Shell className="pointer-events-none absolute -left-10 top-1/3 h-40 w-40 rotate-12 opacity-[0.04]" />

          <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-14 px-4 py-24 sm:px-6 lg:flex-row lg:gap-10 lg:py-28">
            <div className="flex-1">
              <SectionEyebrow>Legal & Terms</SectionEyebrow>
              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-cream sm:text-5xl">
                Our{" "}
                <span className="bg-gradient-to-b from-copper-100 to-copper-500 bg-clip-text text-transparent">
                  Legal
                </span>{" "}
                Information
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-400">
                Before ordering or working with us, take a moment to read the
                terms and policies below. By purchasing anything from Seashell
                Customs you agree to them in full.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a href="#terms" className="btn-gold">
                  <FileText className="h-4 w-4" />
                  Read the Terms
                </a>
                <a href="#copyright" className="btn-outline">
                  Copyright & Ownership
                </a>
              </div>
            </div>
            <HeroMarkSide
              tags={[
                { label: "Copyright & Ownership" },
                { label: "Terms of Service" },
                { label: "Ordering Rules" },
              ]}
            />
          </div>
        </section>

        {/* ------------------------------------------------ copyright */}
        <section id="copyright" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <SectionEyebrow>Copyright & Ownership</SectionEyebrow>
          <SectionTitle>
            Everything We Make,{" "}
            <span className="bg-gradient-to-b from-copper-100 to-copper-500 bg-clip-text text-transparent">
              Belongs To Us
            </span>
          </SectionTitle>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card-dark p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-copper-400/25 bg-copper-400/10 text-copper-300">
                <Copyright className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-lg font-semibold text-cream">All Rights Reserved</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-400">
                All assets, templates, source builds and brand marks produced by
                Seashell Customs are property of Seashell Customs. Anything you
                purchase is licensed to you for use where intended, not
                ownership.
              </p>
            </div>
            <div className="card-dark p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-copper-400/25 bg-copper-400/10 text-copper-300">
                <Ban className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-lg font-semibold text-cream">No Reuse or Reselling</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-400">
                Do not resell, re-upload, trade or share your ordered work as
                your own or to others. Templates and assets are for the paying
                customer only.
              </p>
            </div>
            <div className="card-dark p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-copper-400/25 bg-copper-400/10 text-copper-300">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-lg font-semibold text-cream">Third-Party Content</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-400">
                Any third-party brand, platform or game references (including
                ER:LC) are the property of their owners. We are not affiliated
                with, endorsed by or sponsored by them.
              </p>
            </div>
            <div className="card-dark p-7 sm:col-span-2 lg:col-span-3">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-4">
                    <Scale className="h-6 w-6 text-copper-300" />
                    <h3 className="text-lg font-semibold text-cream">Claims & DMCA</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-stone-400">
                    Found our work being used, reposted or resold without
                    correct permission? Report it directly to us with evidence
                    through our Discord and we'll take proper action.
                  </p>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-copper-400/20 bg-ink/60 px-5 py-4">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-copper-300" />
                  <p className="text-sm text-stone-300">
                    Credit should be given for work that is remade, inspired by
                    or adapted from our designs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ terms of service */}
        <section id="terms" className="border-y border-white/5 bg-panel/60">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
            <SectionEyebrow>Terms of Service</SectionEyebrow>
            <SectionTitle>
              The{" "}
              <span className="bg-gradient-to-b from-copper-100 to-copper-500 bg-clip-text text-transparent">
                Rules
              </span>{" "}
              of Business
            </SectionTitle>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-400">
              Clear terms, so there are no surprises on either side. By
              ordering from Seashell Customs you agree to all of the following.
            </p>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {TERMS.map((t) => (
                <div key={t.title} className="card-dark p-8">
                  <span className="text-3xl font-bold text-stone-700">{t.num}</span>
                  <h3 className="mt-3 text-lg font-semibold text-cream">{t.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {t.points.map((p) => (
                      <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-stone-400">
                        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-copper-400/80" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ ordering rules */}
        <section id="rules" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <SectionEyebrow>Ordering Rules</SectionEyebrow>
          <SectionTitle>
            How{" "}
            <span className="bg-gradient-to-b from-copper-100 to-copper-500 bg-clip-text text-transparent">
              Ordering
            </span>{" "}
            Works
          </SectionTitle>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            <div className="card-dark p-8">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-copper-300" />
                <h3 className="text-lg font-semibold text-cream">Order Process</h3>
              </div>
              <ol className="mt-5 space-y-3 text-sm leading-relaxed text-stone-400">
                <li>1. Join our Discord server.</li>
                <li>2. Open an order ticket.</li>
                <li>3. Detail exactly what you want.</li>
                <li>4. Wait for a team member to confirm the specs.</li>
              </ol>
            </div>
            <div className="card-dark p-8">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-copper-300" />
                <h3 className="text-lg font-semibold text-cream">Timelines</h3>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-stone-400">
                Orders are delivered within the time window agreed in your
                ticket — usually 24 to 48 hours. Let us know immediately if
                you have a deadline so we can plan for it.
              </p>
            </div>
            <div className="card-dark p-8">
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-5 w-5 text-copper-300" />
                <h3 className="text-lg font-semibold text-cream">Premade Orders</h3>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-stone-400">
                Premades carry fair, fixed pricing. When you buy one, you
                receive it ready to roll — small tweaks may be possible for a
                discounted fee.
              </p>
            </div>
            <div className="card-dark p-8">
              <div className="flex items-center gap-3">
                <Squirrel className="h-5 w-5 text-copper-300" />
                <h3 className="text-lg font-semibold text-cream">Custom Orders</h3>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-stone-400">
                Fully tailored commissions. A down payment secures your spot
                in the queue, and revisions are included until the final design
                is approved.
              </p>
            </div>
          </div>

          {/* breaking rules band */}
          <div className="card-dark mt-10 overflow-hidden p-10">
            <div className="flex flex-col items-center gap-6 text-center">
              <AlertTriangle className="h-10 w-10 text-copper-300" />
              <h3 className="text-2xl font-bold text-cream">Breaking These Rules</h3>
              <p className="max-w-xl text-sm leading-relaxed text-stone-400">
                Violating our terms or ordering rules may result in your order
                being cancelled with or without refund, blacklisting from the
                server and further actions if necessary. Respect the process —
                it keeps orders quick and quality high.
              </p>
              <p className="script text-3xl">Thanks for respecting our rules!</p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

const TERMS = [
  {
    num: "01",
    title: "General",
    points: [
      "These terms apply to every order, purchase, service or product from Seashell Customs.",
      "We reserve the right to change, update or withhold anything we've produced at our discretion.",
      "Breaking these terms can end with removal and blacklisting across our platforms.",
    ],
  },
  {
    num: "02",
    title: "Orders & Payment",
    points: [
      "All orders require confirmed pricing before any work starts — no work starts otherwise.",
      "Payment is completed upfront unless a written payment plan is agreed.",
      "Orders cannot be transferred between customers; timing starts from when payment lands.",
    ],
  },
  {
    num: "03",
    title: "Revisions & Delivery",
    points: [
      "Revision requests are free within reason — the first set that define the original brief.",
      "Development or delivery time can never be rushed beyond what we promise; feel free to check in politely.",
      "We are not obligated to deliver until the specs in your ticket are fully confirmed.",
    ],
  },
  {
    num: "04",
    title: "Conduct",
    points: [
      "No chargebacks or disputes after delivery — raise issues in the same ticket first.",
      "Kindness goes both ways; harassment towards staff gets orders cancelled, void, no refund.",
      "Privacy is mutual — staff conversations, previews and work-in-progress stay private.",
    ],
  },
];

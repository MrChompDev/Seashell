import Link from "next/link";
import {
  CarFront,
  CodeXml,
  Crown,
  Eye,
  Image as ImageIcon,
  PaintPalette,
  Percent,
  Tag,
  Plus,
} from "lucide-react";
import { Shell, SMark, DiscordMark, BrandLockup } from "@/components/brand";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroMarkSide, SectionEyebrow, SectionTitle } from "@/components/ui";

export const metadata = { title: "Home" };

type IconComponent = (props: { className?: string }) => React.ReactNode;

const SERVICES: Array<{ icon: IconComponent; title: string; text: string }> = [
  {
    icon: (p) => <PaintPalette {...p} />,
    title: "Graphic Designing",
    text: "Logos, banners, thumbnails and complete brand kits — the premades we're known for.",
  },
  {
    icon: (p) => <DiscordMark {...p} />,
    title: "Discord Bot Development",
    text: "Moderation, tickets, leveling and custom server tooling, pre-built or made to order.",
  },
  {
    icon: (p) => <CodeXml {...p} />,
    title: "Website Development",
    text: "Fast, modern websites just like this one — built to fit your community.",
  },
  {
    icon: (p) => <CarFront {...p} />,
    title: "ERLC Liveries & Uniforms",
    text: "High quality vehicle liveries and uniform packs for your ER:LC community.",
  },
];

const PLUS_PERKS = [
  { icon: ImageIcon, label: "Exclusive premades" },
  { icon: Percent, label: "Member discounts" },
  { icon: Tag, label: "Special member offers" },
  { icon: Crown, label: "Priority queue access" },
  { icon: Eye, label: "Early previews" },
];

const TEAM = [
  {
    name: "Seashell",
    role: "Owner & Lead Designer",
    text: "Bringing your ideas to life with quality.",
    owner: true,
  },
  { name: "Tide", role: "Lead Developer", text: "Building the future, one line at a time." },
  { name: "Coral", role: "Head of Graphics", text: "Clean designs, real impact." },
  { name: "Reef", role: "Livery & Uniform Specialist", text: "Your fleet, our signature." },
  { name: "Wave", role: "Support Manager", text: "Here to help, around the clock." },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <SiteHeader />

      <main className="flex-1">
        {/* ------------------------------------------------ hero */}
        <section className="relative overflow-hidden border-b border-white/5">
          {/* blurred bonfire-style glow (matches ref mood, no external asset) */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(42rem 26rem at 78% 88%, rgba(214,120,60,0.16), transparent 65%)," +
                "radial-gradient(36rem 22rem at 20% 100%, rgba(214,166,140,0.10), transparent 60%)," +
                "radial-gradient(30rem 18rem at 50% -10%, rgba(244,221,208,0.07), transparent 60%)",
            }}
          />
          <Shell className="pointer-events-none absolute -left-12 top-1/2 h-56 w-56 -rotate-45 opacity-[0.04]" />
          <Shell className="pointer-events-none absolute right-1/3 -bottom-20 h-40 w-40 rotate-12 opacity-[0.04]" />

          <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-14 px-4 py-24 sm:px-6 lg:flex-row lg:gap-10 lg:py-32">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <span className="eyebrow text-copper-300">Welcome To</span>
              </div>
              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-cream sm:text-6xl">
                Seashell{" "}
                <span className="bg-gradient-to-b from-copper-100 to-copper-500 bg-clip-text text-transparent">
                  Customs
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-400">
                Home of the premades. Premium designs, bots, websites and
                liveries — made easy, for communities that want more than the
                ordinary.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a href="#services" className="btn-gold">
                  Our Services
                </a>
                <Link href="/order" className="btn-outline">
                  Order With Us
                </Link>
              </div>
            </div>

            <HeroMarkSide
              tags={[
                { label: "Designs" },
                { label: "Bots" },
                { label: "Websites" },
                { label: "Liveries & Uniforms" },
              ]}
            />
          </div>
        </section>

        {/* ------------------------------------------------ services */}
        <section id="services" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <SectionEyebrow>What We Offer</SectionEyebrow>
          <SectionTitle>
            Services Built Around{" "}
            <span className="bg-gradient-to-b from-copper-100 to-copper-500 bg-clip-text text-transparent">
              You
            </span>
          </SectionTitle>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card-dark group p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-copper-400/25 bg-copper-400/10 text-copper-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-cream">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-400">{text}</p>
                <Link
                  href="/order"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-copper-300 opacity-80 transition group-hover:opacity-100"
                >
                  Order now <Icon className="h-4 w-4 opacity-70" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------ seashell+ */}
        <section id="seashell-plus" className="border-y border-white/5 bg-panel/60">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="card-dark relative overflow-hidden p-10 sm:p-14">
              <Shell className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rotate-12 opacity-[0.05]" />
              <div className="grid gap-12 lg:grid-cols-2">
                <div>
                  <SectionEyebrow>Membership</SectionEyebrow>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="text-5xl">
                      <SMark className="text-5xl" />
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight text-cream sm:text-5xl">
                      Seashell
                      <span className="text-copper-300">+</span>
                    </h2>
                  </div>
                  <p className="mt-5 max-w-md text-sm leading-relaxed text-stone-400">
                    MORE FOR OUR MOST LOYAL MEMBERS. Seashell+ members get
                    exclusive premades, discounts and priority access —
                    everything bigger, better and earlier.
                  </p>
                  <a href="https://discord.gg/seashell" target="_blank" rel="noreferrer" className="btn-gold mt-8">
                    <Plus className="h-4 w-4" />
                    Get Seashell+
                  </a>
                </div>
                <div className="flex flex-col justify-center">
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {PLUS_PERKS.map(({ icon: Icon, label }) => (
                      <li
                        key={label}
                        className="flex items-center gap-3 rounded-xl border border-copper-400/15 bg-ink/60 px-4 py-3.5"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-copper-400/12 text-copper-300">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-medium text-stone-200">{label}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="script mt-6 text-right text-2xl hidden sm:block">
                    Level up, your experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ team */}
        <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <SectionEyebrow>Meet The Team</SectionEyebrow>
          <SectionTitle>
            The Faces Behind{" "}
            <span className="bg-gradient-to-b from-copper-100 to-copper-500 bg-clip-text text-transparent">
              Seashell Customs
            </span>
          </SectionTitle>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {TEAM.map((member) => (
              <div key={member.name} className="card-dark flex flex-col items-center p-7 text-center">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-copper-400/35 bg-gradient-to-b from-card-hi to-panel">
                    <span
                      className="bg-gradient-to-b from-copper-100 to-copper-500 bg-clip-text text-3xl text-transparent"
                      style={{ fontWeight: 800, transform: "skewX(-7deg)" }}
                    >
                      {member.name[0]}
                    </span>
                  </div>
                  {member.owner && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-copper-400/50 bg-ink text-copper-300">
                      <Crown className="h-3 w-3" />
                    </span>
                  )}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-cream">{member.name}</h3>
                <div className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-copper-300/90">
                  {member.role}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-stone-400">{member.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------ cta strip */}
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="card-dark flex flex-col items-center justify-between gap-6 px-8 py-10 text-center sm:flex-row sm:text-left">
            <div>
              <h3 className="text-2xl font-semibold text-cream sm:text-3xl">
                Ready for something{" "}
                <span className="bg-gradient-to-b from-copper-100 to-copper-500 bg-clip-text text-transparent">
                  premium?
                </span>
              </h3>
              <p className="mt-3 max-w-lg text-sm text-stone-400">
                Browse our premades or commission something one of a kind — either
                way, it'll be worth it.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/order" className="btn-gold">
                Order With Us
              </Link>
              <Link href="/legal" className="btn-outline">
                Our Legal
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

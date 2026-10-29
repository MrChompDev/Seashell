import Link from "next/link";
import {
  BadgeCheck,
  CarFront,
  ClipboardList,
  CodeXml,
  CreditCard,
  Crown,
  Eye,
  Image as ImageIcon,
  MessageCircle,
  Palette,
  Percent,
  ShoppingCart,
  Clock,
  Tag,
  CircleCheck,
} from "lucide-react";
import { DiscordMark, Shell, SMark } from "@/components/brand";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroMarkSide, SectionEyebrow, SectionTitle } from "@/components/ui";

export const metadata = { title: "Order" };

const STEPS = [
  {
    icon: MessageCircle,
    title: "Contact Us",
    text: "Join our Discord and open a ticket — or message us directly.",
  },
  {
    icon: ClipboardList,
    title: "Share The Details",
    text: "Tell us exactly what you're looking for: style, colors, references.",
  },
  {
    icon: CreditCard,
    title: "Handle Payment",
    text: "Secure payment once you're happy with the terms and pricing.",
  },
  {
    icon: CircleCheck,
    title: "Receive Your Order",
    text: "Sit back! We'll deliver and revise until it's perfect.",
  },
];

const PREMADES = [
  {
    icon: (p: { className?: string }) => <Palette {...p} />,
    title: "Graphic Designing",
    price: "From $5.00",
  },
  {
    icon: (p: { className?: string }) => <DiscordMark {...p} />,
    title: "Discord Bot Development",
    price: "From $10.00",
  },
  {
    icon: (p: { className?: string }) => <CodeXml {...p} />,
    title: "Website Development",
    price: "From $25.00",
  },
  {
    icon: (p: { className?: string }) => <CarFront {...p} />,
    title: "ERLC Liveries & Uniforms",
    price: "From $10.00",
  },
];

const PL_CHECKS = [
  {
    icon: BadgeCheck,
    text: "Fully custom designs, made just for you",
  },
  {
    icon: CircleCheck,
    text: "Unlimited revisions (within reason)",
  },
  {
    icon: (p: { className?: string }) => <DiscordMark {...p} />,
    text: "Clear communication the whole way",
  },
  {
    icon: (p: { className?: string }) => <Clock {...p} />,
    text: "High quality, delivered on time",
  },
];

const PL_PERKS = [
  { icon: ImageIcon, label: "Exclusive premades" },
  { icon: Percent, label: "Member discounts" },
  { icon: Tag, label: "Special member offers" },
  { icon: Crown, label: "Priority queue access" },
  { icon: Eye, label: "Early previews" },
];

export default function OrderPage() {
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
          <Shell className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 -rotate-12 opacity-[0.04]" />

          <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-14 px-4 py-24 sm:px-6 lg:flex-row lg:gap-10 lg:py-28">
            <div className="flex-1">
              <SectionEyebrow>Order With Us</SectionEyebrow>
              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-cream sm:text-5xl">
                Premium Designs,{" "}
                <span className="bg-gradient-to-b from-copper-100 to-copper-500 bg-clip-text text-transparent">
                  Made Easy.
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-400">
                Whether you're looking for a ready-made design or something
                custom of your own, Seashell Customs has you covered. Order in
                minutes, and we handle the rest.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a href="#premades" className="btn-gold">
                  <ShoppingCart className="h-4 w-4" />
                  Browse Premades
                </a>
                <a href="#custom-orders" className="btn-outline">
                  Request a Custom Order
                </a>
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

        {/* ------------------------------------------------ how it works */}
        <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <SectionEyebrow>How It Works</SectionEyebrow>
          <SectionTitle>
            Ordering Made{" "}
            <span className="bg-gradient-to-b from-copper-100 to-copper-500 bg-clip-text text-transparent">
              Easy
            </span>
          </SectionTitle>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-400">
            Four simple steps and one picture perfect result. Average delivery
            under 24-48 hours.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="card-dark p-7">
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold tracking-tight text-stone-700">
                    {`0${i + 1}`}
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-copper-400/25 bg-copper-400/10 text-copper-300">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-cream">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-400">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-xl border border-copper-400/15 bg-panel px-5 py-4">
            <Clock className="h-5 w-5 shrink-0 text-copper-300" />
            <p className="text-sm text-stone-300">
              Our average turn-around is{" "}
              <span className="font-semibold text-copper-300">24 - 48 hours</span>,
              with revisions delivered even faster.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------ premades */}
        <section id="premades" className="border-y border-white/5 bg-panel/60">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <SectionEyebrow>Our Premades</SectionEyebrow>
                <SectionTitle>
                  Ready When{" "}
                  <span className="bg-gradient-to-b from-copper-100 to-copper-500 bg-clip-text text-transparent">
                    You Are
                  </span>
                </SectionTitle>
              </div>
              <a href="https://discord.gg/seashell" target="_blank" rel="noreferrer" className="btn-outline">
                View All Premades
              </a>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PREMADES.map(({ icon: Icon, title, price }) => (
                <div key={title} className="card-dark flex flex-col p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-copper-400/25 bg-copper-400/10 text-copper-300">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-cream">{title}</h3>
                  <p className="mt-1 text-sm text-stone-400">One-time payment</p>
                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone-500">
                      From
                    </span>
                    <span className="text-xl font-bold text-copper-300">{price}</span>
                  </div>
                  <a
                    href="https://discord.gg/seashell"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-gold mt-6 text-sm"
                  >
                    Order Now
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ custom orders */}
        <section id="custom-orders" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <SectionEyebrow>Custom Orders</SectionEyebrow>
          <SectionTitle>
            Have Something{" "}
            <span className="bg-gradient-to-b from-copper-100 to-copper-500 bg-clip-text text-transparent">
              Specific
            </span>{" "}
            in Mind?
          </SectionTitle>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-400">
            Beyond the premades, we craft fully custom designs shaped around
            your brand, your colors and your community.
          </p>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <div className="card-dark p-10">
              <h3 className="text-xl font-semibold text-cream">
                Custom Order Process
              </h3>
              <ul className="mt-6 grid gap-4">
                {PL_CHECKS.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3">
                    <span className="text-copper-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm text-stone-300">{text}</span>
                  </li>
                ))}
              </ul>
              <a href="https://discord.gg/seashell" target="_blank" rel="noreferrer" className="btn-gold mt-8">
                <MessageCircle className="h-4 w-4" />
                Request a Custom Order
              </a>
            </div>
            <div className="card-dark relative flex flex-col justify-between overflow-hidden p-10">
              <Shell className="pointer-events-none absolute -right-8 -bottom-10 h-44 w-44 rotate-12 opacity-[0.05]" />
              <div>
                <div className="flex items-center gap-4">
                  <div className="text-5xl">
                    <SMark className="text-5xl" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
                    Seashell Customs
                  </p>
                </div>
                <p className="script mt-8 text-4xl leading-snug sm:text-5xl">
                  Your ideas,
                  <br />
                  our creativity.
                </p>
              </div>
              <p className="mt-10 text-sm leading-relaxed text-stone-400">
                From single logos to full community makeovers our team takes
                your idea from sketch to webhook. Pitch it, and watch it come
                to life.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ seashell+ band */}
        <section className="border-t border-white/5 bg-panel/60">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="card-dark relative overflow-hidden p-10 sm:p-14">
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
                    Unlock more for less: exclusive premade drops, discounted
                    orders and priority in our queue.
                  </p>
                  <a href="https://discord.gg/seashell" target="_blank" rel="noreferrer" className="btn-gold mt-8">
                    Join Seashell+
                  </a>
                </div>
                <ul className="grid gap-4 sm:grid-cols-2 self-center">
                  {PL_PERKS.map(({ icon: Icon, label }) => (
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
              </div>
            </div>
          </div>
        </section>

        <div className="px-4 pb-2" />
      </main>

      <SiteFooter />
    </div>
  );
}

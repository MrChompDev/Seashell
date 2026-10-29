import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  FileText,
  PenLine,
  CalendarClock,
  Home,
  Scale,
} from "lucide-react";
import { Shell, SMark } from "@/components/brand";
import { createClient } from "@/lib/supabase/server";
import type { AgreementRow, AgreementSignature, DocumentRow, LoaRequest, QuickLink } from "@/lib/types";

type IconComponent = React.ComponentType<{ className?: string }>;

const LINK_ICONS: Record<string, IconComponent> = {
  home: Home,
  "book-open": BookOpen,
  signature: PenLine,
  calculator: Calculator,
  scales: Scale,
  file: FileText,
};

export default async function DashboardOverviewPage() {
  const supabase = await createClient();

  const [links, docs, sigs, overdue, loa] = await Promise.all([
    supabase.from("quick_links").select("*").order("sort").returns<QuickLink[]>(),
    supabase
      .from("documents")
      .select("id, title, slug, description, url, category, size, doc_type, is_important")
      .limit(4)
      .returns<DocumentRow[]>(),
    supabase
      .from("agreement_signatures")
      .select("signed_at")
      .order("signed_at", { ascending: false })
      .limit(1)
      .returns<AgreementSignature[]>(),
    supabase.auth.getUser().then(({ data }) =>
      supabase
        .from("loa_requests")
        .select("*")
        .eq("requested_by", data.user?.id ?? "")
        .in("status", ["Pending", "Approved"])
        .returns<LoaRequest[]>()
    ),
  ]);

  const totalAgreements = await supabase
    .from("agreements")
    .select("id", { count: "exact", head: true })
    .eq("active", true)
    .then(({ count }) => count ?? 0);

  const lastSigned = sigs.data?.[0]?.signed_at ?? null;
  const pendingLoa = (loa.data ?? []).filter((l) => l.status === "Pending").length;

  return (
    <div className="space-y-10">
      {/* heading + action pills */}
      <div>
        <div className="eyebrow text-copper-300">Staff Dashboard</div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-cream sm:text-4xl">
            Welcome back, <span className="text-copper-300">seashell</span>
          </h1>
          <div className="flex gap-2">
            <Link href="/dashboard/documents" className="btn-outline text-sm">
              <FileText className="h-4 w-4" />
              Documents
            </Link>
            <Link href="/dashboard/agreements" className="btn-outline text-sm">
              <PenLine className="h-4 w-4" />
              Agreements
            </Link>
          </div>
        </div>
      </div>

      {/* quick access row (reference: two full-width pill cards) */}
      <section id="quick-access">
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/dashboard/documents?category=Handbooks"
            className="group card-dark flex items-center justify-between gap-4 p-7 transition-colors hover:border-copper-400/40"
          >
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-copper-300">
                Quick Access
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-cream">Staff Documents</h2>
              <p className="mt-1.5 text-sm text-stone-400">
                Handbooks, policies & procedures in one place.
              </p>
            </div>
            <BookOpen className="h-9 w-9 shrink-0 text-copper-300/70 transition-transform group-hover:scale-110" />
          </Link>
          <Link
            href="/dashboard/agreements"
            className="group card-dark flex items-center justify-between gap-4 p-7 transition-colors hover:border-copper-400/40"
          >
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-copper-300">
                Quick Access
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-cream">Staff Agreements</h2>
              <p className="mt-1.5 text-sm text-stone-400">
                Read, review and sign the latest versions.
              </p>
            </div>
            <PenLine className="h-9 w-9 shrink-0 text-copper-300/70 transition-transform group-hover:scale-110" />
          </Link>
        </div>
        <p className="mt-4 text-center text-xs text-stone-600">
          View and download all your staff documents, complete agreements,
          review pending LOA requests and more.
        </p>
      </section>

      {/* grid: quick links / documents / time off / tax */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* quick links */}
        <section className="card-dark flex flex-col p-7">
          <h2 className="text-lg font-semibold text-cream">Quick Links</h2>
          <ul className="mt-5 flex-1 space-y-3">
            {(links.data ?? []).map((l) => (
              <li key={l.id}>
                <Link
                  href={l.href}
                  className="group flex items-center gap-3 rounded-xl border border-white/5 bg-ink/50 px-4 py-3 transition-colors hover:border-copper-400/40"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-copper-400/12 text-copper-300">
                    {(() => {
                      const Icon = LINK_ICONS[l.icon] ?? FileText;
                      return <Icon className="h-4 w-4" />;
                    })()}
                  </span>
                  <span className="flex-1 text-sm font-medium text-stone-200">{l.label}</span>
                  <ArrowRight className="h-4 w-4 text-stone-600 transition-transform group-hover:translate-x-0.5 group-hover:text-copper-300" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* recently updated */}
        <section className="card-dark flex flex-col p-7">
          <h2 className="text-lg font-semibold text-cream">Recently Updated</h2>
          <ul className="mt-5 flex-1 space-y-3">
            {(docs.data ?? []).map((d) => (
              <li key={d.id}>
                <Link
                  href={`/dashboard/documents?category=${encodeURIComponent(d.category)}`}
                  className="group flex items-center gap-3 rounded-xl border border-white/5 bg-ink/50 px-4 py-3 transition-colors hover:border-copper-400/40"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-copper-400/12 text-copper-300">
                    {d.is_important ? <BookOpen className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-stone-200">
                      {d.title}
                    </span>
                    <span className="block text-[0.7rem] text-stone-500">{d.category}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-stone-600 transition-transform group-hover:translate-x-0.5 group-hover:text-copper-300" />
                </Link>
              </li>
            ))}
            {docs.error && (
              <li className="text-xs text-red-300">Couldn't load documents.</li>
            )}
          </ul>
          <Link
            href="/dashboard/documents"
            className="mt-4 text-center text-xs font-medium text-stone-500 transition-colors hover:text-copper-300"
          >
            View all documents →
          </Link>
        </section>

        {/* status column */}
        <div className="flex flex-col gap-6">
          <section className="card-dark p-7">
            <h2 className="text-lg font-semibold text-cream">Time Off</h2>
            <p className="mt-2 text-sm text-stone-400">
              Review pending LOA requests and recent activity.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <CalendarClock className="h-5 w-5 text-copper-300" />
              {pendingLoa > 0 ? (
                <span className="text-sm text-amber-200">
                  {pendingLoa} request{pendingLoa > 1 ? "s" : ""} in queue
                </span>
              ) : (
                <span className="text-sm text-stone-400">All caught up!</span>
              )}
            </div>
            <Link href="/dashboard/loa" className="btn-outline mt-5 w-full justify-center text-sm">
              View My LOA Requests
            </Link>
          </section>

          <section className="card-dark relative flex flex-1 flex-col overflow-hidden p-7">
            <Shell className="pointer-events-none absolute -right-6 -top-8 h-32 w-32 rotate-12 opacity-[0.06]" />
            <h2 className="text-lg font-semibold text-cream">Status</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-400">Agreements signed</span>
                <span className="font-semibold text-copper-300">
                  {lastSigned ? "Active" : "None yet"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-400">Total agreements</span>
                <span className="font-semibold text-stone-200">{totalAgreements}</span>
              </div>
            </div>
            <Link href="/dashboard/tax-calculator" className="btn-gold mt-5 text-sm">
              <Calculator className="h-4 w-4" />
              Open Tax Calculator
            </Link>
          </section>
        </div>
      </div>

      {/* bottom brand strip */}
      <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-panel px-8 py-7">
        <div className="flex items-center gap-4">
          <div className="text-4xl">
            <SMark className="text-4xl" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-stone-200">
              Seashell Customs
            </p>
            <p className="script text-2xl text-copper-300">Home of the Premades</p>
          </div>
        </div>
        <p className="max-w-xs text-right text-xs leading-relaxed text-stone-500">
          Keep your agreements up to date so nothing is lost to a version
          mismatch.
        </p>
      </div>
    </div>
  );
}

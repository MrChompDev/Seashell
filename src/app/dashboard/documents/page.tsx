import Link from "next/link";
import { ArrowLeft, BookOpen, ExternalLink, FileText, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { DocumentRow } from "@/lib/types";
import { cx } from "@/lib/utils";

const CATEGORIES = [
  "Handbooks",
  "Policies",
  "Procedures",
  "Templates",
  "Integrations",
] as const;

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("documents").select("*").order("category").order("title");
  if (category) query = query.eq("category", category);
  if (q) query = query.ilike("title", `%${q}%`);

  const { data, error } = await query.returns<DocumentRow[]>();
  const docs = data ?? [];

  const active = category ?? "All";

  return (
    <div className="space-y-8">
      <div>
        <div className="eyebrow text-copper-300">Staff Resources</div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-cream sm:text-4xl">Staff Documents</h1>
          <div className="flex gap-2">
            <Link href="/dashboard" className="btn-outline text-sm">
              <ArrowLeft className="h-4 w-4" />
              Overview
            </Link>
          </div>
        </div>
      </div>

      <section className="card-dark p-7">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-cream">Filter Documents</h2>
          <ExternalLink className="h-5 w-5 text-copper-300/60" />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <FilterPill label="All" active={active === "All"} />
          {CATEGORIES.map((c) => (
            <FilterPill key={c} label={c} active={active === c} />
          ))}
        </div>
        <form className="mt-5 flex items-center gap-2" action="/dashboard/documents">
          {category && <input type="hidden" name="category" value={category} />}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search documents…"
              className="input-dark pl-10"
            />
          </div>
          <button type="submit" className="btn-gold text-sm">
            Search
          </button>
        </form>
        {(category || q) && (
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-stone-500">
            {category && (
              <span className="rounded-full bg-copper-400/10 px-2.5 py-1 text-copper-300">
                {category}
              </span>
            )}
            {q && (
              <span className="rounded-full bg-copper-400/10 px-2.5 py-1 text-copper-300">
                “{q}”
              </span>
            )}
            <Link href="/dashboard/documents" className="hover:text-copper-300">
              Clear filters
            </Link>
          </div>
        )}
      </section>

      <section>
        {error ? (
          <p className="card-dark p-8 text-center text-sm text-red-300">
            Couldn't load documents: {error.message}
          </p>
        ) : docs.length === 0 ? (
          <div className="card-dark flex flex-col items-center gap-3 p-12 text-center">
            <FileText className="h-8 w-8 text-copper-300/70" />
            <p className="text-sm text-stone-400">
              No documents found for this filter yet.
            </p>
            <Link href="/dashboard/admin" className="btn-gold text-sm">
              Add in Admin
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {docs.map((d) => (
              <a
                key={d.id}
                href={d.url}
                target="_blank"
                rel="noreferrer"
                className="group card-dark flex items-center justify-between gap-4 p-6 transition-colors hover:border-copper-400/40"
              >
                <div className="flex items-start gap-4">
                  <span
                    className={cx(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-copper-300",
                      d.is_important
                        ? "border-copper-400/40 bg-copper-400/15"
                        : "border-white/10 bg-white/5"
                    )}
                  >
                    {d.doc_type === "spreadsheet" ? (
                      <BookOpen className="h-5 w-5" />
                    ) : (
                      <FileText className="h-5 w-5" />
                    )}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-cream">{d.title}</h3>
                      {d.is_important && (
                        <span className="rounded bg-copper-400/15 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-copper-300">
                          Important
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-stone-500">{d.category}</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-stone-600 transition-transform group-hover:scale-110 group-hover:text-copper-300" />
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FilterPill({ label, active }: { label: string; active?: boolean }) {
  return (
    <Link
      href={
        label === "All"
          ? "/dashboard/documents"
          : `/dashboard/documents?category=${encodeURIComponent(label)}`
      }
      className={cx(
        "rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-colors",
        active
          ? "bg-copper-400 text-ink shadow-[0_0_20px_rgba(214,166,140,0.35)]"
          : "border border-white/10 text-stone-300 hover:border-copper-400/50 hover:text-copper-200"
      )}
    >
      {label}
    </Link>
  );
}

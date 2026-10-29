"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  Check,
  FileText,
  Loader2,
  PenLine,
  Plus,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { AgreementRow, DocumentRow, LoaRequest, Profile } from "@/lib/types";
import { cx, formatDate } from "@/lib/utils";

const TABS = [
  { id: "documents", label: "Documents", icon: FileText },
  { id: "agreements", label: "Agreements", icon: PenLine },
  { id: "loa", label: "LOA Requests", icon: CalendarClock },
  { id: "staff", label: "Staff Roster", icon: Users },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminClient({
  documents,
  agreements,
  pendingLoa,
  roster,
}: {
  documents: DocumentRow[];
  agreements: AgreementRow[];
  pendingLoa: LoaRequest[];
  roster: Profile[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("documents");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    router.refresh();
  }

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    try {
      await fn();
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cx(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              tab === t.id
                ? "bg-copper-400/15 text-copper-100"
                : "text-stone-400 hover:bg-white/5 hover:text-stone-200"
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
            {t.id === "loa" && pendingLoa.length > 0 && (
              <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[0.6rem] font-bold text-amber-300">
                {pendingLoa.length}
              </span>
            )}
          </button>
        ))}
        {busy && <Loader2 className="ml-2 h-4 w-4 animate-spin text-copper-300" />}
      </div>

      {tab === "documents" && <DocsTab documents={documents} run={run} />}
      {tab === "agreements" && <AgreementsTab agreements={agreements} run={run} />}
      {tab === "loa" && <LoaTab pendingLoa={pendingLoa} run={run} />}
      {tab === "staff" && <StaffTab roster={roster} run={run} />}
    </div>
  );
}

/* ------------------------------------------------------------------ documents */

function DocsTab({
  documents,
  run,
}: {
  documents: DocumentRow[];
  run: (fn: () => Promise<void>) => void;
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    url: "",
    category: "Handbooks",
    quick_access: false,
  });
  const [error, setError] = useState<string | null>(null);

  async function addDoc() {
    setError(null);
    const supabase = createClient();
    if (!form.title.trim() || !form.url.trim()) {
      setError("Title and URL are required.");
      return;
    }
    const { error: err } = await supabase.from("documents").insert({
      title: form.title.trim(),
      description: form.description.trim() || null,
      url: form.url.trim(),
      category: form.category,
      quick_access: form.quick_access,
    });
    if (err) {
      setError(err.message);
      return;
    }
    setForm((f) => ({ ...f, title: "", description: "", url: "" }));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <section className="card-dark p-7 lg:col-span-2">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-cream">
          <Plus className="h-5 w-5 text-copper-300" />
          Add Document
        </h3>
        <div className="mt-5 space-y-4">
          <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <Input
            label="Description"
            value={form.description}
            onChange={(v) => setForm({ ...form, description: v })}
          />
          <Input label="URL (Google Doc, Drive…)" value={form.url} onChange={(v) => setForm({ ...form, url: v })} />
          <Select
            label="Category"
            value={form.category}
            onChange={(v) => setForm({ ...form, category: v })}
            options={["Handbooks", "Policies", "Forms", "Guides", "General"]}
          />
          <Checkline
            checked={form.quick_access}
            onChange={(v) => setForm({ ...form, quick_access: v })}
            label="Show in Quick Access"
          />
          {error && <p className="text-xs text-red-300">{error}</p>}
          <button type="button" onClick={() => run(addDoc)} className="btn-gold w-full justify-center text-sm">
            Add Document
          </button>
        </div>
      </section>

      <section className="lg:col-span-3">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-stone-500">
          All Documents ({documents.length})
        </h3>
        <ul className="flex flex-col gap-3">
          {documents.map((d) => (
            <li key={d.id} className="card-dark flex items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-cream">{d.title}</p>
                <p className="text-xs text-stone-500">
                  {d.category} · v1 · {new Date(d.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => run(async () => {
                  await createClient().from("documents").delete().eq("id", d.id);
                })}
                className="text-stone-600 transition-colors hover:text-red-400"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
          {documents.length === 0 && (
            <li className="card-dark p-8 text-center text-sm text-stone-500">No documents yet.</li>
          )}
        </ul>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ agreements */

function AgreementsTab({
  agreements,
  run,
}: {
  agreements: AgreementRow[];
  run: (fn: () => Promise<void>) => void;
}) {
  const [form, setForm] = useState({ title: "", content: "", version: "1" });
  const [error, setError] = useState<string | null>(null);

  async function addAgreement() {
    setError(null);
    const { error: err } = await createClient().from("agreements").insert({
      title: form.title,
      content: form.content,
      version: Number(form.version) || 1,
    });
    if (err) {
      setError(err.message);
      return;
    }
    setForm({ title: "", content: "", version: "1" });
  }

  async function bumpVersion(id: string, version: number) {
    const { error: err } = await createClient()
      .from("agreements")
      .update({ version: version + 1 })
      .eq("id", id);
    if (err) {
      setError(err.message);
      return;
    }
    // signatures for the previous version are removed; staff must re-sign
    await createClient().from("agreement_signatures").delete().eq("agreement_id", id);
  }

  async function deactivate(id: string) {
    await createClient().from("agreements").delete().eq("id", id);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <section className="card-dark p-7 lg:col-span-2">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-cream">
          <Plus className="h-5 w-5 text-copper-300" />
          Add Agreement
        </h3>
        <div className="mt-5 space-y-4">
          <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <div>
            <Label>Body</Label>
            <textarea
              rows={5}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="input-dark resize-none"
            />
          </div>
          <Input label="Version" value={form.version} onChange={(v) => setForm({ ...form, version: v })} />
          {error && <p className="text-xs text-red-300">{error}</p>}
          <button type="button" onClick={() => run(addAgreement)} className="btn-gold w-full justify-center text-sm">
            Add Agreement
          </button>
          <p className="text-xs leading-relaxed text-stone-500">
            Bumping a version signs everyone out of the current one — staff must
            re-sign.
          </p>
        </div>
      </section>

      <section className="lg:col-span-3">
        <ul className="flex flex-col gap-3">
          {agreements.map((a) => (
            <li key={a.id} className="card-dark px-5 py-4">
              <div className="flex items-center gap-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-cream">{a.title}</p>
                  <p className="text-xs text-stone-500">Version {a.version}</p>
                </div>
                <button
                  type="button"
                  onClick={() => run(() => bumpVersion(a.id, a.version))}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-stone-300 hover:border-copper-400/50 hover:text-copper-200"
                >
                  New version
                </button>
                <button
                  type="button"
                  onClick={() => run(() => deactivate(a.id))}
                  className="text-stone-600 transition-colors hover:text-red-400"
                  aria-label="Remove agreement"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {a.content && (
                <p className="mt-2 line-clamp-2 text-xs text-stone-500">{a.content}</p>
              )}
            </li>
          ))}
          {agreements.length === 0 && (
            <li className="card-dark p-8 text-center text-sm text-stone-500">
              No agreements yet.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ LOA review */

function LoaTab({
  pendingLoa,
  run,
}: {
  pendingLoa: LoaRequest[];
  run: (fn: () => Promise<void>) => void;
}) {
  async function review(id: string, status: "Approved" | "Denied", notes: string) {
    await createClient().from("loa_requests").update({ status, review_notes: notes || null }).eq("id", id);
  }

  return (
    <div className="space-y-4">
      {pendingLoa.map((l) => (
        <LoaReviewRow key={l.id} request={l} run={run} onReview={review} />
      ))}
      {pendingLoa.length === 0 && (
        <div className="card-dark p-10 text-center">
          <CalendarClock className="mx-auto h-8 w-8 text-copper-300/70" />
          <p className="mt-3 text-sm text-stone-400">No pending LOA requests.</p>
        </div>
      )}
    </div>
  );
}

function LoaReviewRow({
  request,
  run,
  onReview,
}: {
  request: LoaRequest;
  run: (fn: () => Promise<void>) => void;
  onReview: (id: string, status: "Approved" | "Denied", notes: string) => Promise<void>;
}) {
  const [notes, setNotes] = useState("");

  return (
    <div className="card-dark p-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-cream">
            {request.type ?? "Other"} —{" "}
            {formatDate(request.start_date)} → {formatDate(request.end_date)}
          </p>
          <p className="text-xs text-stone-500">Submitted {formatDate(request.created_at)}</p>
        </div>
      </div>
      {request.reason && (
        <p className="mt-3 rounded-lg border border-white/5 bg-ink/60 px-4 py-3 text-sm text-stone-400">
          {request.reason}
        </p>
      )}
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional note to the requester…"
          className="input-dark"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => run(() => onReview(request.id, "Approved", notes))}
            className="btn-gold text-xs"
          >
            <Check className="h-3.5 w-3.5" />
            Approve
          </button>
          <button
            type="button"
            onClick={() => run(() => onReview(request.id, "Denied", notes))}
            className="btn-outline text-xs hover:!border-red-400/50 hover:!text-red-300"
          >
            <X className="h-3.5 w-3.5" />
            Deny
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ staff roster */

function StaffTab({
  roster,
  run,
}: {
  roster: Profile[];
  run: (fn: () => Promise<void>) => void;
}) {
  async function setRole(id: string, role: Profile["role"] | null, isStaff: boolean | null) {
    await createClient().from("staff_profiles").update({ role, is_staff: isStaff }).eq("id", id);
  }

  async function removeMembership(id: string) {
    await createClient().from("staff_profiles").delete().eq("id", id);
  }

  return (
    <ul className="flex flex-col gap-3">
      {roster.map((p) => (
        <li key={p.id} className="card-dark flex flex-wrap items-center gap-4 px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-copper-400/30 bg-copper-400/10">
            {p.discord_avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.discord_avatar_url ?? ""} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-copper-300">{(p.discord_name ?? "S").charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-cream">{p.discord_name ?? "Staff Member"}</p>
            <p className="text-xs text-stone-500">
              {p.is_staff ? p.role : "Inactive"} · joined {formatDate(p.created_at)}
            </p>
          </div>
          <div className="flex gap-2">
            {p.is_staff && p.role !== "Admin" ? (
              <>
                <button
                  type="button"
                  onClick={() => run(() => setRole(p.id, "Manager", true))}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-stone-300 hover:border-copper-400/50 hover:text-copper-200"
                >
                  Make Manager
                </button>
                <button
                  type="button"
                  onClick={() => run(() => setRole(p.id, "Admin", true))}
                  className="rounded-lg border border-copper-400/30 bg-copper-400/10 px-3 py-1.5 text-xs font-semibold text-copper-200 hover:bg-copper-400/20"
                >
                  <ShieldCheck className="mr-1 inline h-3 w-3" />
                  Make Admin
                </button>
              </>
            ) : null}
            {p.id !== roster.find((r) => r.role === "Admin" && r.is_staff)?.id && (
              <button
                type="button"
                onClick={() => run(() => removeMembership(p.id))}
                className="text-stone-600 transition-colors hover:text-red-400"
                aria-label="Remove staff"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </li>
      ))}
      {roster.length === 0 && (
        <li className="card-dark p-8 text-center text-sm text-stone-500">No staff members yet.</li>
      )}
    </ul>
  );
}

/* ------------------------------------------------------------------ inputs */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-widest text-stone-500">
      {children}
    </span>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="input-dark" />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <Label>{label}</Label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input-dark">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function Checkline({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#d6a68c]"
      />
      <span className="text-sm text-stone-300">{label}</span>
    </label>
  );
}

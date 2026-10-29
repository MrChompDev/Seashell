"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  Check,
  Clock,
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
import type {
  AgreementRow,
  DocumentRow,
  LoaRequest,
  PendingInvite,
  Profile,
} from "@/lib/types";
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
  invites,
}: {
  documents: DocumentRow[];
  agreements: AgreementRow[];
  pendingLoa: LoaRequest[];
  roster: Profile[];
  invites: PendingInvite[];
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
      {tab === "staff" && <StaffTab roster={roster} invites={invites} run={run} />}
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

const ROLES: Profile["role"][] = ["Staff", "Manager", "Admin"];

function StaffTab({
  roster,
  invites,
  run,
}: {
  roster: Profile[];
  invites: PendingInvite[];
  run: (fn: () => Promise<void>) => void;
}) {
  const [meId, setMeId] = useState<string | null>(null);
  const [form, setForm] = useState({ discordId: "", name: "", role: "Staff" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // identify the signed-in admin so we can block self-edits on the roster
    createClient()
      .from("staff_profiles")
      .select("id")
      .then(({ data }) => setMeId(data?.[0]?.id ?? null));
  }, []);

  const activeAdmins = roster.filter((p) => p.is_staff && p.role === "Admin");
  const lastAdminId = activeAdmins.length === 1 ? activeAdmins[0].id : null;

  async function sendInvite() {
    setError(null);
    const id = form.discordId.trim();
    if (!/^\d{15,21}$/.test(id)) {
      setError(
        "Discord ID must be the numeric user ID — right-click the member in Discord and choose 'Copy User ID'."
      );
      return;
    }
    const { error: err } = await createClient().from("pending_invites").insert({
      discord_user_id: id,
      invitee_name: form.name.trim() || null,
      role: form.role as Profile["role"],
    });
    if (err) {
      setError(err.message);
      return;
    }
    setForm({ discordId: "", name: "", role: "Staff" });
  }

  async function setRole(id: string, role: Profile["role"]) {
    const { error: err } = await createClient()
      .from("staff_profiles")
      .update({ role, is_staff: true })
      .eq("id", id);
    if (err) setError(err.message);
  }

  async function setStaffStatus(id: string, isStaff: boolean) {
    const { error: err } = await createClient()
      .from("staff_profiles")
      .update({ is_staff: isStaff })
      .eq("id", id);
    if (err) setError(err.message);
  }

  async function removeMembership(id: string) {
    const { error: err } = await createClient()
      .from("staff_profiles")
      .delete()
      .eq("id", id);
    if (err) setError(err.message);
  }

  async function cancelInvite(id: string) {
    const { error: err } = await createClient()
      .from("pending_invites")
      .delete()
      .eq("id", id);
    if (err) setError(err.message);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* add / invite staff */}
      <section className="card-dark p-7 lg:col-span-2">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-cream">
          <Plus className="h-5 w-5 text-copper-300" />
          Add Staff
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-stone-500">
          Invites a Discord member. Their role activates the moment they sign in
          — no manual upgrading needed.
        </p>
        <div className="mt-5 space-y-4">
          <Input
            label="Discord User ID"
            value={form.discordId}
            onChange={(v) => setForm({ ...form, discordId: v })}
            placeholder="1173859826432..."
          />
          <Input
            label="Name (optional)"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            placeholder="Shown before their first sign-in"
          />
          <Select
            label="Role"
            value={form.role}
            onChange={(v) => setForm({ ...form, role: v })}
            options={ROLES}
          />
          {error && <p className="text-xs text-red-300">{error}</p>}
          <button
            type="button"
            onClick={() => run(sendInvite)}
            className="btn-gold w-full justify-center text-sm"
          >
            Send Invite
          </button>
        </div>
      </section>

      {/* roster + pending invites */}
      <section className="space-y-6 lg:col-span-3">
        {invites.length > 0 && (
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-stone-500">
              <Clock className="h-4 w-4 text-amber-300" />
              Pending Invites ({invites.length})
            </h3>
            <ul className="flex flex-col gap-2">
              {invites.map((i) => (
                <li
                  key={i.id}
                  className="card-dark flex flex-wrap items-center gap-3 px-5 py-3"
                >
                  <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-amber-300">
                    {i.role}
                  </span>
                  <span className="text-sm font-medium text-cream">
                    {i.invitee_name ?? "Discord member"}
                  </span>
                  <span className="truncate font-mono text-xs text-stone-500">
                    {i.discord_user_id}
                  </span>
                  <button
                    type="button"
                    onClick={() => run(() => cancelInvite(i.id))}
                    className="ml-auto text-stone-600 transition-colors hover:text-red-400"
                    aria-label="Cancel invite"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-stone-500">
            <Users className="h-4 w-4 text-copper-400/70" />
            Staff Roster ({roster.length})
          </h3>
          <ul className="flex flex-col gap-3">
            {roster.map((p) => {
              const isSelf = p.id === meId;
              const isLastAdmin = p.id === lastAdminId;
              const locked = isSelf || isLastAdmin;
              return (
                <li
                  key={p.id}
                  className="card-dark flex flex-wrap items-center gap-4 px-5 py-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-copper-400/30 bg-copper-400/10">
                    {p.discord_avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.discord_avatar_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-copper-300">
                        {(p.discord_name ?? "S").charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-cream">
                      {p.discord_name ?? "Staff Member"}
                      {p.role === "Admin" && p.is_staff && (
                        <ShieldCheck className="ml-1.5 inline h-3.5 w-3.5 text-copper-300" />
                      )}
                    </p>
                    <p className="text-xs text-stone-500">
                      {p.is_staff ? p.role : "Inactive"} · joined{" "}
                      {formatDate(p.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.is_staff ? (
                      <select
                        value={p.role}
                        disabled={locked}
                        onChange={(e) =>
                          run(() => setRole(p.id, e.target.value as Profile["role"]))
                        }
                        className="input-dark w-28 px-2 py-1.5 text-xs disabled:opacity-60"
                      >
                        {ROLES.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    ) : (
                      <button
                        type="button"
                        onClick={() => run(() => setStaffStatus(p.id, true))}
                        className="btn-outline text-xs"
                      >
                        Activate
                      </button>
                    )}
                    {p.is_staff && !locked && (
                      <button
                        type="button"
                        onClick={() => run(() => setStaffStatus(p.id, false))}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-stone-400 hover:!border-amber-400/50 hover:!text-amber-300"
                      >
                        Deactivate
                      </button>
                    )}
                    {!locked ? (
                      <button
                        type="button"
                        onClick={() => run(() => removeMembership(p.id))}
                        className="text-stone-600 transition-colors hover:text-red-400"
                        aria-label="Remove staff"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : (
                      <span
                        title={isSelf ? "You can't manage your own account" : "The last Admin can't be removed"}
                        className="text-stone-700"
                        aria-label="Locked"
                      >
                        <X className="h-4 w-4 opacity-40" />
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
            {roster.length === 0 && (
              <li className="card-dark p-8 text-center text-sm text-stone-500">
                No staff members yet.
              </li>
            )}
          </ul>
        </div>
      </section>
    </div>
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
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-dark"
      />
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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const TYPES = ["Vacation", "Illness", "School / Work", "Other"] as const;

export function LoaClient() {
  const router = useRouter();
  const [type, setType] = useState<(typeof TYPES)[number]>("Vacation");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const valid = start && end && new Date(end) >= new Date(start);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setError("Session expired — sign in again.");
        return;
      }
      const { error: insertError } = await supabase.from("loa_requests").insert({
        requested_by: data.user.id,
        type,
        start_date: start,
        end_date: end,
        reason: reason.trim() || null,
      });
      if (insertError) {
        setError(insertError.message);
        return;
      }
      setDone(true);
      setStart("");
      setEnd("");
      setReason("");
      router.refresh();
      setTimeout(() => setDone(false), 2500);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-5 space-y-4">
      <div>
        <Label>Type of LOA</Label>
        <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="input-dark">
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>From</Label>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="input-dark" />
        </div>
        <div>
          <Label>To</Label>
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="input-dark" />
        </div>
      </div>
      <div>
        <Label>Reason</Label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="Short, kindly explanation…"
          className="input-dark resize-none"
        />
      </div>
      {error && <p className="text-xs text-red-300">{error}</p>}
      {done && (
        <p className="rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
          Request submitted! Status shows below.
        </p>
      )}
      <button
        type="button"
        onClick={submit}
        disabled={!valid || busy}
        className="btn-gold w-full justify-center text-sm disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Submit LOA Request
      </button>
      {!valid && start && end && (
        <p className="text-center text-xs text-stone-500">End date can't be before start date.</p>
      )}
    </div>
  );
}

function LoaWithdraw({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function withdraw() {
    setBusy(true);
    try {
      const supabase = createClient();
      await supabase.from("loa_requests").delete().eq("id", id);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={withdraw}
      disabled={busy}
      className="text-xs font-medium text-stone-500 underline-offset-2 transition-colors hover:text-red-300 hover:underline disabled:opacity-50"
    >
      {busy ? "Withdrawing…" : "Withdraw this request"}
    </button>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-widest text-stone-500">
      {children}
    </span>
  );
}

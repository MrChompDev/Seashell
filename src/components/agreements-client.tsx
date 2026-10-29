"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronDown, Loader2, PenLine, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cx } from "@/lib/utils";

type AgreementsAgreement = {
  id: string;
  title: string;
  version: number;
  content: string;
};

export function AgreementsClient({
  agreement,
  signed,
}: {
  agreement: AgreementsAgreement;
  signed: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSign = name.trim().length >= 2;

  async function sign() {
    setError(null);
    setBusy(true);
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setError("Session expired — sign in again.");
        return;
      }
      const { error: insertError } = await supabase
        .from("agreement_signatures")
        .insert({
          agreement_id: agreement.id,
          signed_by: data.user.id,
          signed_name: name.trim(),
          agreement_version: agreement.version,
        });
      if (insertError) {
        setError(insertError.message);
        return;
      }
      setOpen(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card-dark overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-white/[0.03]"
      >
        <span
          className={cx(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-copper-300",
            signed ? "border-copper-400/40 bg-copper-400/15" : "bg-copper-400/10 border-copper-400/25"
          )}
        >
          {signed ? <CheckCircle2 className="h-4.5 w-4.5" /> : <PenLine className="h-4.5 w-4.5" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-cream">{agreement.title}</h3>
            <span className="rounded bg-white/5 px-1.5 py-0.5 text-[0.6rem] font-semibold text-stone-400">
              v{agreement.version}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-stone-500">
            {signed
              ? "Signed — tap to read or review."
              : "Read before signing. Your signature is legally recorded."}
          </p>
        </div>
        {signed && (
          <span className="hidden rounded-full bg-copper-400/15 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-copper-300 sm:inline-block">
            Signed
          </span>
        )}
        <ChevronDown
          className={cx("h-5 w-5 shrink-0 text-stone-400 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="border-t border-white/5 px-6 pb-6 pt-5">
          <div className="nice-scroll max-h-64 rounded-xl border border-white/5 bg-ink/70 p-4">
            {agreement.content.split("\n").map((p, i) => (
              <p key={i} className={cx("text-sm leading-relaxed text-stone-400", i > 0 && "mt-3")}>
                {p}
              </p>
            ))}
          </div>

          {!signed ? (
            <div className="mt-5">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <ShieldCheck className="h-3.5 w-3.5 text-copper-400/70" />
                Type your full name to confirm you've read and agree:
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="input-dark mt-2 max-w-xs"
              />
              {error && (
                <p className="mt-2 text-xs text-red-300">{error}</p>
              )}
              <button
                type="button"
                onClick={sign}
                disabled={!canSign || busy}
                className="btn-gold mt-4 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <PenLine className="h-4 w-4" />}
                Sign Agreement
              </button>
            </div>
          ) : (
            <div className="mt-5 flex items-center gap-2 text-sm text-stone-400">
              <CheckCircle2 className="h-4 w-4 text-copper-300" />
              Signature recorded for version {agreement.version}.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

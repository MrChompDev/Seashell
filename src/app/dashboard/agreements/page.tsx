import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft, PenLine, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { AgreementRow, AgreementSignature } from "@/lib/types";
import { AgreementsClient } from "@/components/agreements-client";

// Auth gate + user data: render this route at request time.
export const instant = false;

type SignatureRow = Pick<AgreementSignature, "agreement_id" | "agreement_version">;

export default async function AgreementsPage() {
  // Auth gate + user data: render at request time.
  await connection();

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/staff?reason=signin");
  }

  const [agreementsRes, sigsRes] = await Promise.all([
    supabase.from("agreements").select("*").eq("active", true).order("title"),
    supabase
      .from("agreement_signatures")
      .select("agreement_id, agreement_version")
      .eq("signed_by", userData.user.id),
  ]);

  const agreements = (agreementsRes.data ?? []) as AgreementRow[];
  const sigs = (sigsRes.data ?? []) as SignatureRow[];
  if (agreementsRes.error || !sigs) {
    throw new Error("Failed to load agreements");
  }

  const signedKeys = new Set(sigs.map((s) => `${s.agreement_id}`));

  return (
    <div className="space-y-8">
      <div>
        <div className="eyebrow text-copper-300">Compliance</div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-cream sm:text-4xl">
            Staff Agreements
          </h1>
          <div className="flex gap-2">
            <Link href="/dashboard" className="btn-outline text-sm">
              <ArrowLeft className="h-4 w-4" />
              Overview
            </Link>
          </div>
        </div>
      </div>

      {/* progress band */}
      <div className="card-dark flex items-center gap-4 px-7 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-copper-400/25 bg-copper-400/10 text-copper-300">
          <PenLine className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-cream">
            Sign In Progress
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 w-44 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-copper-400"
                style={{
                  width: `${agreements.length === 0 ? 0 : (signedKeys.size / agreements.length) * 100}%`,
                }}
              />
            </div>
            <span className="text-xs text-stone-400">
              {signedKeys.size}/{agreements.length} signed
            </span>
          </div>
        </div>
      </div>

      <p className="max-w-xl text-xs leading-relaxed text-stone-500">
        <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-copper-400/70" />
        Your information is kept securely and separately for each agreement. If
        there are any changes to an agreement, it may need to be signed again.
      </p>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-cream">All Agreements</h2>
        <div className="flex flex-col gap-4">
          {agreements.map((a) => (
            <AgreementsClient
              key={a.id}
              agreement={a}
              signed={signedKeys.has(`${a.id}`)}
            />
          ))}
          {agreements.length === 0 && (
            <p className="card-dark p-10 text-center text-sm text-stone-400">
              No active agreements right now.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

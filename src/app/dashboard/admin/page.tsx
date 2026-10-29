import { redirect } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { AgreementRow, DocumentRow, LoaRequest, PendingInvite, Profile } from "@/lib/types";
import { AdminClient } from "@/components/admin-client";

// Auth gate + user data: render this route at request time.
export const instant = false;

export const metadata = { title: "Admin Console" };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  // Auth gate + user data: render at request time.
  await connection();

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/staff?reason=signin");
  }

  const { data: me } = await supabase
    .from("staff_profiles")
    .select("role, is_staff")
    .eq("id", userData.user.id)
    .maybeSingle<Profile>();
  if (me?.role !== "Admin" || !me.is_staff) {
    redirect("/dashboard");
  }

  const [docsRes, agreementsRes, loaRes, rosterRes, invitesRes] = await Promise.all([
    supabase.from("documents").select("*").order("category").order("title"),
    supabase.from("agreements").select("*").order("title"),
    supabase.from("loa_requests").select("*").eq("status", "Pending").order("created_at"),
    supabase.from("staff_profiles").select("*").order("created_at"),
    supabase.from("pending_invites").select("*").order("created_at"),
  ]);

  const documents = (docsRes.data ?? []) as DocumentRow[];
  const agreements = (agreementsRes.data ?? []) as AgreementRow[];
  const pendingLoa = (loaRes.data ?? []) as LoaRequest[];
  const roster = (rosterRes.data ?? []) as Profile[];
  const invites = (invitesRes.data ?? []) as PendingInvite[];

  const failed = [docsRes, agreementsRes, loaRes, rosterRes, invitesRes].find((r) => r.error);
  if (failed) {
    throw new Error(
      `Admin data load failed: ${failed.error.code} — ${failed.error.message}`
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="eyebrow text-copper-300">Admin Console</div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-cream sm:text-4xl">
            Admin Dashboard
          </h1>
          <div className="flex gap-2">
            <Link href="/dashboard" className="btn-outline text-sm">
              <ArrowLeft className="h-4 w-4" />
              Overview
            </Link>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-400">
          Manage keys, documents, agreements, LOA requests and performance from
          a central spot for the whole team.
        </p>
      </div>

      <AdminClient
        documents={documents}
        agreements={agreements}
        pendingLoa={pendingLoa}
        roster={roster}
        invites={invites}
      />
    </div>
  );
}

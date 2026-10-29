import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal-shell";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/config";
import type { Profile } from "@/lib/types";

export const metadata = { title: "Staff Dashboard" };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { configured } = getSupabaseEnv();

  const supabase = await createClient();
  if (!supabase) {
    redirect("/staff?reason=config");
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/staff?reason=signin");
  }

  const { data: profileData, error: profileError } = await supabase
    .from("staff_profiles")
    .select("*")
    .eq("id", userData.user.id)
    .maybeSingle<Profile>();

  if (!configured || profileError || !profileData) {
    redirect("/staff?reason=signin");
  }

  return (
    <PortalShell profile={profileData}>{children}</PortalShell>
  );
}

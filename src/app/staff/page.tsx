import Link from "next/link";
import { ShieldCheck, LogOut } from "lucide-react";
import { Shell, BrandLockup } from "@/components/brand";
import { PortalFooter } from "@/components/portal-footer";
import { StaffAuthButton } from "@/components/staff-auth-button";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/config";

// Auth gate + user data: render this route at request time.
export const instant = false;

export const metadata = { title: "Staff Portal" };

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const { configured } = getSupabaseEnv();

  let signedIn = false;
  if (configured) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    signedIn = Boolean(data.user);
  }

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      {/* staff-portal top bar (matches the dashboard reference header) */}
      <header className="border-b border-white/5 bg-ink/85">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Shell className="h-6 w-6" />
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-stone-300">
              Seashell Customs
            </span>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-stone-400 transition-colors hover:text-copper-300"
          >
            Home
          </Link>
          <StaffTopBadge signedIn={signedIn} />
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(38rem 22rem at 20% 90%, rgba(214,166,140,0.10), transparent 60%)," +
                "radial-gradient(26rem 16rem at 85% -10%, rgba(244,221,208,0.06), transparent 60%)",
            }}
          />
          <Shell className="pointer-events-none absolute -right-16 top-10 h-56 w-56 rotate-12 opacity-[0.045]" />

          <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-14 px-4 py-24 sm:px-6 lg:flex-row lg:gap-12 lg:py-28">
            <div className="flex-1">
              <div className="eyebrow text-copper-300">Welcome To The</div>
              <h1 className="mt-4 text-4xl font-bold leading-snug tracking-tight text-cream sm:text-5xl">
                Seashell Customs{" "}
                <span className="block bg-gradient-to-b from-copper-100 to-copper-500 bg-clip-text text-transparent lg:inline lg:pl-2">
                  Staff Portal
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-stone-400">
                View and download all your staff documents, complete agreements,
                review pending LOA requests and more — everything you need,
                all in one place.
              </p>
              <div className="mt-9">
                <StaffAuthButton signedIn={signedIn} configured={configured} />
              </div>

              {reason === "signin" && (
                <p className="mt-6 max-w-sm rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-200">
                  Sign in with Discord to reach the staff dashboard.
                </p>
              )}
              {reason === "oauth" && (
                <p className="mt-6 max-w-sm rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-xs leading-relaxed text-red-200">
                  Discord sign-in didn't complete. Make sure the Discord
                  provider is enabled in Supabase, then try again.
                </p>
              )}
              {reason === "config" && (
                <p className="mt-6 max-w-sm rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-200">
                  Supabase is not configured yet — environment variables are
                  missing.
                </p>
              )}

              <div className="mt-10 flex items-center gap-3 text-xs text-stone-500">
                <ShieldCheck className="h-4 w-4 text-copper-400/70" />
                Secured with Discord OAuth through Supabase Auth.
              </div>
            </div>

            {/* divider + brand column (reference right side) */}
            <div className="flex items-stretch gap-10">
              <div className="hidden sm:block">
                <div className="h-full w-px bg-gradient-to-b from-transparent via-copper-400/40 to-transparent" />
              </div>
              <div className="flex flex-col items-center justify-center gap-6 text-center">
                <Shell className="h-14 w-14" />
                <div>
                  <div className="text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-stone-300">
                    Seashell Customs
                  </div>
                  <p className="script mt-3 text-3xl text-copper-300">
                    Home of the
                    <br />
                    Premades
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PortalFooter />
    </div>
  );
}

function StaffTopBadge({ signedIn }: { signedIn: boolean }) {
  if (!signedIn) {
    return (
      <span className="hidden rounded-full border border-copper-400/30 bg-copper-400/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-copper-300 sm:inline-block">
        Staff Login
      </span>
    );
  }
  return (
    <Link
      href="/dashboard"
      className="hidden items-center gap-2 text-sm font-medium text-stone-300 transition-colors hover:text-copper-300 sm:flex"
    >
      <LogOut className="h-4 w-4 rotate-180 text-copper-400" />
      Back to Dashboard
    </Link>
  );
}

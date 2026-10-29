"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogIn, Loader2, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DiscordMark } from "./brand";

export function StaffAuthButton({
  signedIn,
  configured,
}: {
  signedIn: boolean;
  configured: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setError(null);
    setBusy(true);
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (oauthError) {
        setError(oauthError.message);
      }
    } catch {
      setError("Could not start sign-in. Is the Discord provider enabled?");
    } finally {
      setBusy(false);
    }
  }

  if (!configured) {
    return (
      <div className="w-full max-w-sm">
        <div className="btn-gold w-full cursor-not-allowed opacity-60">
          <DiscordMark className="h-5 w-5" />
          Staff Login (Discord)
        </div>
        <p className="mt-3 text-center text-xs leading-relaxed text-stone-500">
          Supabase environment is not configured. Add{" "}
          <code className="text-copper-300/80">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          and{" "}
          <code className="text-copper-300/80">
            NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
          </code>{" "}
          to <code className="text-copper-300/80">.env.local</code>.
        </p>
      </div>
    );
  }

  if (signedIn) {
    return (
      <div className="flex w-full max-w-sm flex-col items-center gap-3">
        <Link href="/dashboard" className="btn-gold w-full">
          <LayoutDashboard className="h-4 w-4" />
          Access Your Resources
        </Link>
        <p className="text-xs text-stone-500">
          Signed in. Head straight to the staff dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <button type="button" onClick={signIn} disabled={busy} className="btn-gold w-full">
        {busy ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <DiscordMark className="h-5 w-5" />
        )}
        {busy ? "Redirecting to Discord…" : "Staff Login (Discord)"}
      </button>
      {error && (
        <p className="mt-3 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-center text-xs text-red-300">
          {error}
          <span className="mt-1 block text-stone-500">
            <LogIn className="mr-1 inline h-3 w-3" />
            Tip: enable the Discord provider in the Supabase dashboard.
          </span>
        </p>
      )}
    </div>
  );
}

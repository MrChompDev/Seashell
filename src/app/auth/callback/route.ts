import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Discord OAuth returns here with a ?code= — exchange it for a session cookie.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const oauthError =
    request.nextUrl.searchParams.get("error_description") ??
    request.nextUrl.searchParams.get("error");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  const url = new URL("/staff", request.url);
  url.searchParams.set("reason", oauthError ? "oauth" : "signin");
  return NextResponse.redirect(url);
}

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/config";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  const { url, anonKey, configured } = getSupabaseEnv();

  if (configured) {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              request.cookies.set(name, value);
            }
          } catch {
            // ignore - response cookies below still apply
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    });

    // getUser() also refreshes the session when the access token expired.
    await supabase.auth.getUser();

    if (pathname.startsWith("/dashboard")) {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        const redirect = request.nextUrl.clone();
        redirect.pathname = "/staff";
        redirect.search = "";
        redirect.searchParams.set("reason", "signin");
        return NextResponse.redirect(redirect);
      }
    }
  } else if (pathname.startsWith("/dashboard")) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/staff";
    redirect.search = "";
    redirect.searchParams.set("reason", "config");
    return NextResponse.redirect(redirect);
  }

  return response;
}

export const config = {
  matcher: [
    // Skip static assets and image optimizations.
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|css|js|map)$).*)",
  ],
};

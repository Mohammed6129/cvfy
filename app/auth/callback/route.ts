import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getRedirectOrigin } from "@/lib/auth";

const DEFAULT_POST_AUTH_PATH = "/create";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const origin = getRedirectOrigin(request, requestUrl);
  const code = requestUrl.searchParams.get("code");
  const oauthError = requestUrl.searchParams.get("error");
  const oauthErrorDescription =
    requestUrl.searchParams.get("error_description");
  let next = requestUrl.searchParams.get("next") ?? DEFAULT_POST_AUTH_PATH;

  if (!next.startsWith("/") || next.startsWith("//")) {
    next = DEFAULT_POST_AUTH_PATH;
  }

  if (oauthError) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", "oauth_error");
    if (oauthErrorDescription) {
      loginUrl.searchParams.set("error_description", oauthErrorDescription);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (code) {
    let response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.redirect(`${origin}${next}`);
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return response;
    }
  }

  const loginUrl = new URL("/login", origin);
  loginUrl.searchParams.set("error", "auth_callback_error");
  return NextResponse.redirect(loginUrl);
}

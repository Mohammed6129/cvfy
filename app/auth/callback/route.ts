import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_POST_AUTH_PATH, getRedirectOrigin } from "@/lib/auth";
import { getSupabaseEnvStatus } from "@/lib/supabase/env";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

export const dynamic = "force-dynamic";

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
    console.error("[auth/callback] OAuth error:", oauthError, oauthErrorDescription);
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", "oauth_error");
    if (oauthErrorDescription) {
      loginUrl.searchParams.set("error_description", oauthErrorDescription);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    console.error("[auth/callback] Missing code parameter");
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", "auth_callback_error");
    return NextResponse.redirect(loginUrl);
  }

  const envStatus = getSupabaseEnvStatus();
  if (!envStatus.urlPresent || !envStatus.keyPresent) {
    console.error("[auth/callback] Supabase env missing:", envStatus);
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", "auth_callback_error");
    return NextResponse.redirect(loginUrl);
  }

  let response = NextResponse.redirect(new URL(next, origin));

  const supabase = createRouteHandlerClient(request, {
    getAll() {
      return request.cookies.getAll();
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value }) =>
        request.cookies.set(name, value)
      );
      response = NextResponse.redirect(new URL(next, origin));
      cookiesToSet.forEach(({ name, value, options }) =>
        response.cookies.set(name, value, options)
      );
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error(
      "[auth/callback] exchangeCodeForSession failed:",
      error.message,
      error.status,
      "key:",
      envStatus.keyPrefix
    );
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", "auth_callback_error");
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

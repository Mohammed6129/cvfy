import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

type CookieMethods = {
  getAll: () => ReturnType<NextRequest["cookies"]["getAll"]>;
  setAll: (
    cookiesToSet: {
      name: string;
      value: string;
      options?: Parameters<NextResponse["cookies"]["set"]>[2];
    }[]
  ) => void;
};

/** Supabase SSR client for Route Handlers — cookies must be written to the response. */
export function createRouteHandlerClient(
  request: NextRequest,
  cookies: CookieMethods
) {
  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies,
  });
}

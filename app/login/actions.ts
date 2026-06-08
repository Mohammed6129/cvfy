"use server";

import {
  DEFAULT_POST_AUTH_PATH,
  getAuthCallbackUrl,
  mapAuthError,
} from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function signInWithGoogle(next = DEFAULT_POST_AUTH_PATH) {
  const supabase = await createClient();
  const redirectTo = getAuthCallbackUrl(next);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    throw new Error(mapAuthError(error.message));
  }

  if (data.url) {
    return { url: data.url };
  }

  throw new Error("تعذر بدء تسجيل الدخول عبر Google.");
}

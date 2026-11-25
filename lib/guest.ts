/**
 * Browser-side: make sure the visitor has a session before we save anything.
 * Nobody is asked to sign in to build and preview a CV — they get a guest
 * (anonymous) session instead, and sign in later only to keep their CVs.
 */
import { createClient } from "@/lib/supabase/client";
import { getTurnstileToken } from "@/lib/turnstile";

let pending: Promise<boolean> | null = null;

async function start(mock: boolean): Promise<boolean> {
  if (mock) {
    const res = await fetch("/api/dev/guest", { method: "POST" }).catch(() => null);
    return Boolean(res?.ok);
  }
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    if (data.session) return true;
    const captchaToken = await getTurnstileToken();
    const { error } = await supabase.auth.signInAnonymously(captchaToken ? { options: { captchaToken } } : undefined);
    if (error) console.warn("[guest] anonymous sign-in unavailable:", error.message);
    return !error;
  } catch (error) {
    console.warn("[guest] could not start a guest session:", error);
    return false;
  }
}

/** Starts a guest session once; concurrent callers share the same attempt. */
export function startGuestSession(mock: boolean): Promise<boolean> {
  pending ??= start(mock).finally(() => {
    pending = null;
  });
  return pending;
}

/**
 * fetch() that, on 401, starts a guest session and tries once more.
 * Still 401 afterwards (guest sessions switched off) → the caller sends the
 * visitor to sign in, as before.
 */
export async function fetchAsGuest(mock: boolean, input: string, init?: RequestInit): Promise<Response> {
  const first = await fetch(input, init);
  if (first.status !== 401) return first;
  const ok = await startGuestSession(mock);
  if (!ok) return first;
  return fetch(input, init);
}

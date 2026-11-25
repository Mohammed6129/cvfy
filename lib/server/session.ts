import { cookies } from "next/headers";
import { isMockMode } from "@/lib/ai/client";
import { createClient } from "@/lib/supabase/server";
import { isTestUserEmail } from "@/lib/test-user";
import { getUserProfile } from "@/lib/user";

export type SessionUser = {
  id: string;
  email: string | null;
  name: string;
  avatarUrl: string | null;
  /** Internal QA account: bypasses payment so the full flow can be tested. */
  isTester: boolean;
  /**
   * A guest session: the visitor started a CV without signing in. They can
   * preview and pay; signing in later moves their CVs to the real account.
   */
  isAnonymous: boolean;
};

export const MOCK_USER_COOKIE = "cvfy_mock_user";

/** The signed-in user (or guest), or null. Safe to call from pages, layouts and route handlers. */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (isMockMode()) {
    const jar = await cookies();
    const value = jar.get(MOCK_USER_COOKIE)?.value;
    if (!value) return null;
    if (value.startsWith("guest-")) {
      return { id: value, email: null, name: "زائر", avatarUrl: null, isTester: false, isAnonymous: true };
    }
    return { id: "mock-user", email: "dev@cvfy.local", name: "مستخدم تجريبي", avatarUrl: null, isTester: false, isAnonymous: false };
  }

  // cookies() must be reached outside try/catch so Next can mark the route dynamic.
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const profile = getUserProfile(user);
    return {
      id: user.id,
      email: user.email || null,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      isTester: isTestUserEmail(user.email),
      isAnonymous: Boolean(user.is_anonymous),
    };
  } catch (error) {
    console.error("[session] failed to read user:", error);
    return null;
  }
}

/** Signed in with a real account (not a guest). */
export function isMember(user: SessionUser | null): user is SessionUser {
  return Boolean(user && !user.isAnonymous);
}

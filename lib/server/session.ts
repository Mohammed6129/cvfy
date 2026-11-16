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
};

export const MOCK_USER_COOKIE = "cvfy_mock_user";

/** The signed-in user, or null. Safe to call from pages, layouts and route handlers. */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (isMockMode()) {
    const jar = await cookies();
    if (!jar.get(MOCK_USER_COOKIE)) return null;
    return { id: "mock-user", email: "dev@cvfy.local", name: "مستخدم تجريبي", avatarUrl: null, isTester: false };
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
      email: user.email ?? null,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      isTester: isTestUserEmail(user.email),
    };
  } catch (error) {
    console.error("[session] failed to read user:", error);
    return null;
  }
}

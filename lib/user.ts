import type { User } from "@supabase/supabase-js";

export type UserProfile = {
  name: string;
  avatarUrl: string | null;
  email: string | null;
};

export function getUserProfile(user: User): UserProfile {
  const metadata = user.user_metadata ?? {};

  const name =
    (typeof metadata.full_name === "string" && metadata.full_name) ||
    (typeof metadata.name === "string" && metadata.name) ||
    user.email?.split("@")[0] ||
    "مستخدم";

  const avatarUrl =
    (typeof metadata.avatar_url === "string" && metadata.avatar_url) ||
    (typeof metadata.picture === "string" && metadata.picture) ||
    null;

  return {
    name,
    avatarUrl,
    email: user.email ?? null,
  };
}

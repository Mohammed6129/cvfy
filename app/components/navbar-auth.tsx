import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/user";
import UserMenu from "./user-menu";

export default async function NavbarAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const profile = getUserProfile(user);
    return <UserMenu name={profile.name} avatarUrl={profile.avatarUrl} />;
  }

  return (
    <Link
      href="/login?next=/create"
      className="shrink-0 rounded-lg bg-[#378ADD] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2a6bb8]"
    >
      ابدأ الآن
    </Link>
  );
}

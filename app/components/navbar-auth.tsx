import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/user";
import UserMenu from "./user-menu";

type NavbarAuthProps = {
  loginHref?: string;
  loginLabel?: string;
};

export default async function NavbarAuth({
  loginHref = "/login",
  loginLabel = "ابدأ الآن",
}: NavbarAuthProps) {
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
      href={loginHref}
      className="shrink-0 rounded-full bg-[#378ADD] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#378ADD]/25 transition-colors hover:bg-[#2a6bb8]"
    >
      {loginLabel}
    </Link>
  );
}

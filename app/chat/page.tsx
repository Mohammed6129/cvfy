import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import NavbarAuth from "@/app/components/navbar-auth";
import ChatBuilder from "./chat-builder";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/user";

export const metadata: Metadata = {
  title: "بناء السيرة بالمحادثة — CVfy",
  description:
    "أنشئ سيرتك الذاتية بمحادثة بسيطة خطوة بخطوة مع CVfy — سريع، احترافي، ومتوافق مع ATS.",
};

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/chat");
  }

  const profile = getUserProfile(user);
  const userEmail = profile.email ?? user.email ?? "";

  if (!userEmail) {
    redirect("/login?next=/chat&error=email_required");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-gradient-to-b from-[#378ADD]/5 to-white">
      <header className="border-b border-[#378ADD]/15 bg-white/80 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="group flex flex-col gap-0.5">
            <span className="text-2xl font-extrabold text-[#378ADD]">CVfy</span>
            <span className="text-xs font-medium text-slate-500 transition-colors group-hover:text-[#378ADD]">
              بناء السيرة بالمحادثة
            </span>
          </Link>
          <NavbarAuth />
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <ChatBuilder userEmail={userEmail} />
      </main>
    </div>
  );
}

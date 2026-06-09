import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AppHeader from "@/app/components/app-header";
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
      <AppHeader maxWidth="2xl" className="bg-white/80 backdrop-blur" />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <ChatBuilder userEmail={userEmail} />
      </main>
    </div>
  );
}

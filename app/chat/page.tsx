import type { Metadata } from "next";
import { redirect } from "next/navigation";
import GlassPageLayout from "@/app/components/glass-page-layout";
import ErrorBoundary from "@/app/components/error-boundary";
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
    <GlassPageLayout mainClassName="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-2xl">
        <ErrorBoundary fallbackHref="/create" fallbackLabel="العودة لإنشاء السيرة">
          <ChatBuilder userEmail={userEmail} />
        </ErrorBoundary>
      </div>
    </GlassPageLayout>
  );
}

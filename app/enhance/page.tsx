import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import GlassPageLayout from "@/app/components/glass-page-layout";
import LoadingSpinner from "@/app/components/loading-spinner";
import EnhanceContent from "./enhance-content";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/user";

export const metadata: Metadata = {
  title: "تحسين السيرة الذاتية — CVfy",
  description: "حسّن سيرتك الذاتية لتطابق نظام ATS واحصل على نسختين عربي وإنجليزي.",
};

export default async function EnhancePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/enhance");
  }

  const profile = getUserProfile(user);

  return (
    <GlassPageLayout mainClassName="px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-3xl">
        <Suspense fallback={<LoadingSpinner label="جاري التحميل..." />}>
          <EnhanceContent userName={profile.name} />
        </Suspense>
      </div>
    </GlassPageLayout>
  );
}

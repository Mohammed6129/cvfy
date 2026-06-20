import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import GlassPageLayout from "@/app/components/glass-page-layout";
import LoadingSpinner from "@/app/components/loading-spinner";
import DashboardContent from "@/app/dashboard/dashboard-content";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "سيرتي الذاتية — CVfy",
  description: "عرض وإدارة سيرك الذاتية المحفوظة.",
};

export default async function MyCvsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/my-cvs");
  }

  return (
    <GlassPageLayout mainClassName="px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-4xl">
        <Suspense fallback={<LoadingSpinner label="جاري التحميل..." />}>
          <DashboardContent />
        </Suspense>
      </div>
    </GlassPageLayout>
  );
}

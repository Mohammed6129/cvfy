import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import GlassPageLayout from "@/app/components/glass-page-layout";
import LoadingSpinner from "@/app/components/loading-spinner";
import CreateForm from "./create-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "إنشاء السيرة الذاتية — CVfy",
  description: "أنشئ سيرتك الذاتية خطوة بخطوة مع CVfy.",
};

export default async function CreatePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/create");
  }

  return (
    <GlassPageLayout mainClassName="px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-3xl">
        <Suspense fallback={<LoadingSpinner label="جاري التحميل..." />}>
          <CreateForm />
        </Suspense>
      </div>
    </GlassPageLayout>
  );
}

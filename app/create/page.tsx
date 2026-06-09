import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AppHeader from "@/app/components/app-header";
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
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <AppHeader maxWidth="3xl" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <Suspense fallback={<LoadingSpinner label="جاري التحميل..." />}>
          <CreateForm />
        </Suspense>
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import NavbarAuth from "@/app/components/navbar-auth";
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
      <header className="border-b border-[#378ADD]/15 bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="group flex flex-col gap-0.5">
            <span className="text-2xl font-extrabold text-[#378ADD]">CVfy</span>
            <span className="text-xs font-medium text-slate-500 transition-colors group-hover:text-[#378ADD]">
              هويتك المهنية
            </span>
          </Link>
          <NavbarAuth />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <Suspense fallback={<LoadingSpinner label="جاري التحميل..." />}>
          <CreateForm />
        </Suspense>
      </main>
    </div>
  );
}

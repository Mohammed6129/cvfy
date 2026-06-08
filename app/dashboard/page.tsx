import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import DashboardContent from "./dashboard-content";
import NavbarAuth from "@/app/components/navbar-auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "لوحة التحكم — CVfy",
  description: "إدارة سيرك الذاتية المحفوظة على CVfy.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="group flex flex-col gap-0.5">
            <span className="text-2xl font-extrabold text-[#378ADD]">CVfy</span>
            <span className="text-xs font-medium text-slate-500">لوحة التحكم</span>
          </Link>
          <NavbarAuth />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <DashboardContent />
      </main>
    </div>
  );
}

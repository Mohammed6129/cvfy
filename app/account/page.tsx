import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AppHeader from "@/app/components/app-header";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/user";

export const metadata: Metadata = {
  title: "معلومات الحساب — CVfy",
  description: "إدارة معلومات حسابك في CVfy.",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account");
  }

  const profile = getUserProfile(user);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <AppHeader maxWidth="2xl" />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="mb-6 text-2xl font-extrabold text-slate-900">
          معلومات الحساب
        </h1>

        <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div>
            <p className="mb-1 text-sm font-semibold text-slate-500">الاسم</p>
            <p className="text-base font-bold text-slate-900">{profile.name}</p>
          </div>
          <div>
            <p className="mb-1 text-sm font-semibold text-slate-500">
              البريد الإلكتروني
            </p>
            <p className="text-base text-slate-900" dir="ltr">
              {profile.email ?? "—"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

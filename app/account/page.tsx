import type { Metadata } from "next";
import { redirect } from "next/navigation";
import GlassPageLayout from "@/app/components/glass-page-layout";
import MyFilesSection from "@/app/components/my-files-section";
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
    <GlassPageLayout mainClassName="px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="mb-6 text-2xl font-extrabold text-white">
          معلومات الحساب
        </h1>

        <div className="space-y-6">
          <div className="glass-page-card p-6">
            <div>
              <p className="mb-1 text-sm font-semibold text-white/60">الاسم</p>
              <p className="text-base font-bold text-white">{profile.name}</p>
            </div>
            <div className="mt-6">
              <p className="mb-1 text-sm font-semibold text-white/60">
                البريد الإلكتروني
              </p>
              <p className="text-base text-white" dir="ltr">
                {profile.email ?? "—"}
              </p>
            </div>
          </div>

          <MyFilesSection />
        </div>
      </div>
    </GlassPageLayout>
  );
}

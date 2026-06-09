import type { Metadata } from "next";
import AppHeader from "@/app/components/app-header";

export const metadata: Metadata = {
  title: "سياسة الخصوصية — CVfy",
  description: "سياسة خصوصية منصة CVfy وكيفية التعامل مع بياناتك.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-full bg-white">
      <AppHeader maxWidth="3xl" />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="mb-6 text-3xl font-extrabold text-slate-900">
          سياسة الخصوصية
        </h1>
        <div className="space-y-4 text-slate-700">
          <p>
            نحن في CVfy نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية وفقاً
            لأنظمة المملكة العربية السعودية.
          </p>
          <p>
            نجمع فقط البيانات اللازمة لإنشاء سيرتك الذاتية: الاسم، البريد
            الإلكتروني، رقم الجوال، ومعلوماتك المهنية. لا نبيع بياناتك لأطراف
            ثالثة.
          </p>
          <p>
            نستخدم مزودي خدمات موثوقين (مثل Supabase للتخزين الآمن وAnthropic
            للذكاء الاصطناعي) مع تشفير البيانات أثناء النقل والتخزين.
          </p>
          <p>
            يمكنك حذف سيرك الذاتية من صفحة سيرتي الذاتية أو طلب حذف حسابك
            بالتواصل معنا عبر البريد الإلكتروني.
          </p>
          <p className="text-sm text-slate-500">
            آخر تحديث: يونيو 2026
          </p>
        </div>
      </main>
    </div>
  );
}

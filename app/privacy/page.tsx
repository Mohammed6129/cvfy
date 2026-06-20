import type { Metadata } from "next";
import GlassPageLayout from "@/app/components/glass-page-layout";

export const metadata: Metadata = {
  title: "سياسة الخصوصية — CVfy",
  description: "سياسة خصوصية منصة CVfy وكيفية التعامل مع بياناتك.",
};

export default function PrivacyPage() {
  return (
    <GlassPageLayout mainClassName="px-4 py-10 sm:px-6 sm:py-14">
      <div className="glass-page-card mx-auto max-w-3xl px-6 py-10 sm:px-8">
        <h1 className="mb-6 text-3xl font-extrabold text-white">
          سياسة الخصوصية
        </h1>
        <div className="space-y-4 text-white/80">
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
          <p className="text-sm text-white/55">آخر تحديث: يونيو 2026</p>
        </div>
      </div>
    </GlassPageLayout>
  );
}

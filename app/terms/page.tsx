import type { Metadata } from "next";
import Link from "next/link";
import GlassPageLayout from "@/app/components/glass-page-layout";

export const metadata: Metadata = {
  title: "شروط الاستخدام — CVfy",
  description: "شروط وأحكام استخدام منصة CVfy لإنشاء السير الذاتية.",
};

export default function TermsPage() {
  return (
    <GlassPageLayout mainClassName="px-4 py-10 sm:px-6 sm:py-14">
      <div className="glass-page-card mx-auto max-w-3xl px-6 py-10 sm:px-8">
        <h1 className="mb-6 text-3xl font-extrabold text-white">
          شروط الاستخدام
        </h1>
        <div className="max-w-none space-y-4 text-white/80">
          <p>مرحباً بك في CVfy. باستخدامك للمنصة، فإنك توافق على الشروط التالية:</p>
          <h2 className="text-xl font-bold text-white">1. الخدمة</h2>
          <p>
            CVfy منصة لإنشاء السير الذاتية باللغة العربية باستخدام الذكاء
            الاصطناعي. نقدم أدوات لإنشاء وتحسين وتصدير السير الذاتية.
          </p>
          <h2 className="text-xl font-bold text-white">2. الحساب</h2>
          <p>
            أنت مسؤول عن الحفاظ على سرية بيانات تسجيل الدخول وعن جميع الأنشطة
            التي تتم عبر حسابك.
          </p>
          <h2 className="text-xl font-bold text-white">3. الدفع</h2>
          <p>
            الخدمات المدفوعة تُعالج عبر مزود دفع خارجي. بعد الدفع الناجح، يمكنك
            تحميل سيرتك الذاتية بدون علامة مائية.
          </p>
          <h2 className="text-xl font-bold text-white">4. المحتوى</h2>
          <p>
            أنت مسؤول عن دقة المعلومات التي تدخلها. CVfy لا يضمن قبولك في أي
            وظيفة.
          </p>
          <h2 className="text-xl font-bold text-white">5. التعديلات</h2>
          <p>
            قد نقوم بتحديث هذه الشروط. استمرارك في استخدام المنصة يعني موافقتك
            على التحديثات.
          </p>
        </div>
        <p className="mt-10 text-sm text-white/55">
          <Link href="/" className="text-[#FAC775] hover:underline">
            العودة للرئيسية
          </Link>
        </p>
      </div>
    </GlassPageLayout>
  );
}

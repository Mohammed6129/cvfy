import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "شروط الاستخدام — CVfy",
  description: "شروط وأحكام استخدام منصة CVfy لإنشاء السير الذاتية.",
};

export default function TermsPage() {
  return (
    <div className="min-h-full bg-white">
      <header className="border-b border-slate-200 px-4 py-4 sm:px-6">
        <Link href="/" className="text-2xl font-extrabold text-[#378ADD]">
          CVfy
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="mb-6 text-3xl font-extrabold text-slate-900">
          شروط الاستخدام
        </h1>
        <div className="prose prose-slate max-w-none space-y-4 text-slate-700">
          <p>مرحباً بك في CVfy. باستخدامك للمنصة، فإنك توافق على الشروط التالية:</p>
          <h2 className="text-xl font-bold text-slate-900">1. الخدمة</h2>
          <p>
            CVfy منصة لإنشاء السير الذاتية باللغة العربية باستخدام الذكاء
            الاصطناعي. نقدم أدوات لإنشاء وتحسين وتصدير السير الذاتية.
          </p>
          <h2 className="text-xl font-bold text-slate-900">2. الحساب</h2>
          <p>
            أنت مسؤول عن الحفاظ على سرية بيانات تسجيل الدخول وعن جميع الأنشطة
            التي تتم عبر حسابك.
          </p>
          <h2 className="text-xl font-bold text-slate-900">3. الدفع</h2>
          <p>
            الخدمات المدفوعة تُعالج عبر مزود دفع خارجي. بعد الدفع الناجح، يمكنك
            تحميل سيرتك الذاتية بدون علامة مائية.
          </p>
          <h2 className="text-xl font-bold text-slate-900">4. المحتوى</h2>
          <p>
            أنت مسؤول عن دقة المعلومات التي تدخلها. CVfy لا يضمن قبولك في أي
            وظيفة.
          </p>
          <h2 className="text-xl font-bold text-slate-900">5. التعديلات</h2>
          <p>
            قد نقوم بتحديث هذه الشروط. استمرارك في استخدام المنصة يعني موافقتك
            على التحديثات.
          </p>
        </div>
        <p className="mt-10 text-sm text-slate-500">
          <Link href="/" className="text-[#378ADD] hover:underline">
            العودة للرئيسية
          </Link>
        </p>
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "سياسة الخصوصية — CVfy",
  description: "سياسة خصوصية منصة CVfy وكيفية التعامل مع بياناتك.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-full bg-white">
      <header className="border-b border-slate-200 px-4 py-4 sm:px-6">
        <Link href="/" className="text-2xl font-extrabold text-[#378ADD]">
          CVfy
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="mb-6 text-3xl font-extrabold text-slate-900">
          سياسة الخصوصية
        </h1>
        <div className="space-y-4 text-slate-700">
          <p>
            نحن في CVfy نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية وفقاً
            لأنظمة المملكة العربية السعودية.
          </p>
          <h2 className="text-xl font-bold text-slate-900">البيانات التي نجمعها</h2>
          <ul className="list-disc space-y-2 pr-6">
            <li>معلومات الحساب (البريد الإلكتروني، رقم الجوال عند استخدامه)</li>
            <li>بيانات السيرة الذاتية التي تدخلها</li>
            <li>سجلات الدفع (بدون تخزين بيانات البطاقة)</li>
          </ul>
          <h2 className="text-xl font-bold text-slate-900">كيف نستخدم بياناتك</h2>
          <ul className="list-disc space-y-2 pr-6">
            <li>إنشاء وتحسين سيرتك الذاتية بالذكاء الاصطناعي</li>
            <li>حفظ سيرك الذاتية في حسابك</li>
            <li>معالجة المدفوعات وتفعيل التحميل</li>
          </ul>
          <h2 className="text-xl font-bold text-slate-900">مشاركة البيانات</h2>
          <p>
            لا نبيع بياناتك. نشاركها فقط مع مزودي الخدمات الضروريين (Supabase
            للمصادقة والتخزين، Anthropic للذكاء الاصطناعي، Moyasar للدفع).
          </p>
          <h2 className="text-xl font-bold text-slate-900">حقوقك</h2>
          <p>
            يمكنك حذف سيرك الذاتية من لوحة التحكم أو طلب حذف حسابك بالتواصل
            معنا.
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

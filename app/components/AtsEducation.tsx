import Link from "next/link";

export default function AtsEducation() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="mb-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            ما هو <span className="text-[#378ADD]">ATS</span>؟
          </h2>
          <p className="mb-4 text-base leading-8 text-slate-600">
            تخيّل صندوقاً ذكياً عند الشركة يقرأ آلاف السير بسرعة. يبحث عن كلمات
            مثل مسمّاك الوظيفي وتواريخك ومهاراتك. إذا فهم سيرتك، يرفعها للموظف.
            إذا ما فهمها — قد تُتجاهل حتى لو أنت مؤهل!
          </p>
          <Link
            href="/about-ats"
            className="inline-flex font-semibold text-[#378ADD] hover:underline"
          >
            اقرأ الشرح الكامل ←
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 sm:p-8">
          <h3 className="mb-4 text-xl font-extrabold text-slate-900">
            لماذا السيرة بالأبيض والأسود أفضل؟
          </h3>
          <ul className="space-y-3 text-sm leading-relaxed text-slate-700 sm:text-base">
            <li className="flex gap-2">
              <span className="text-[#378ADD]">✓</span>
              الصندوق الذكي يقرأ النص فقط — لا يفهم الألوان والتصاميم
            </li>
            <li className="flex gap-2">
              <span className="text-[#378ADD]">✓</span>
              السيرة الرسمية (Times New Roman، أبيض وأسود) أوضح للقراءة
            </li>
            <li className="flex gap-2">
              <span className="text-[#378ADD]">✓</span>
              الشركات والجهات تفضّل النسخة الإنجليزية الاحترافية
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

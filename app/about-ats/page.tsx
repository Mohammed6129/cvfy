import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "ما هو ATS؟ — CVfy",
  description:
    "شرح مبسط لنظام ATS ولماذا سيرتك الذاتية الاحترافية بالأبيض والأسود أفضل.",
};

const BW_REASONS = [
  "الصندوق الذكي يقرأ النص فقط — لا يفهم الألوان والتصاميم",
  "السيرة الرسمية (Times New Roman، أبيض وأسود) أوضح للقراءة",
  "الشركات والجهات تفضّل النسخة الإنجليزية الاحترافية",
];

export default function AboutAtsPage() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="mb-6 text-3xl font-extrabold text-slate-900 sm:text-4xl">
          ما هو <span className="text-[#378ADD]">ATS</span>؟
        </h1>

        <p className="mb-10 text-base leading-8 text-slate-600">
          تخيّل صندوقاً ذكياً عند الشركة يقرأ آلاف السير بسرعة. يبحث عن كلمات
          مثل مسمّاك الوظيفي وتواريخك ومهاراتك. إذا فهم سيرتك، يرفعها للموظف.
          إذا ما فهمها — قد تُتجاهل حتى لو أنت مؤهل!
        </p>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 sm:p-8">
          <h2 className="mb-4 text-xl font-extrabold text-slate-900 sm:text-2xl">
            لماذا السيرة بالأبيض والأسود أفضل؟
          </h2>
          <ul className="space-y-3 text-sm leading-relaxed text-slate-700 sm:text-base">
            {BW_REASONS.map((reason) => (
              <li key={reason} className="flex gap-2">
                <span className="shrink-0 font-bold text-[#378ADD]">✓</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/create"
          className="mt-10 inline-block rounded-full bg-[#378ADD] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#378ADD]/25 transition-colors hover:bg-[#2a6bb8]"
        >
          ابدأ الآن
        </Link>
      </main>
      <Footer />
    </div>
  );
}

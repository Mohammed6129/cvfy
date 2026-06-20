import type { Metadata } from "next";
import Link from "next/link";
import GlassPageLayout from "@/app/components/glass-page-layout";

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
    <GlassPageLayout mainClassName="px-6 py-12 md:px-12 md:py-16">
      <div className="glass-page-card mx-auto max-w-3xl px-6 py-10 sm:px-8 sm:py-12">
        <h1 className="mb-6 text-3xl font-extrabold text-white sm:text-4xl">
          ما هو <span className="text-[#378ADD]">ATS</span>؟
        </h1>

        <p className="mb-10 text-base leading-8 text-white/75">
          تخيّل صندوقاً ذكياً عند الشركة يقرأ آلاف السير بسرعة. يبحث عن كلمات
          مثل مسمّاك الوظيفي وتواريخك ومهاراتك. إذا فهم سيرتك، يرفعها للموظف.
          إذا ما فهمها — قد تُتجاهل حتى لو أنت مؤهل!
        </p>

        <div className="glass-page-card-sm p-6 sm:p-8">
          <h2 className="mb-4 text-xl font-extrabold text-white sm:text-2xl">
            لماذا السيرة بالأبيض والأسود أفضل؟
          </h2>
          <ul className="space-y-3 text-sm leading-relaxed text-white/80 sm:text-base">
            {BW_REASONS.map((reason) => (
              <li key={reason} className="flex gap-2">
                <span className="shrink-0 font-bold text-[#FAC775]">✓</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/create"
          className="glass-btn-primary mt-10 px-8 py-3.5 text-base shadow-[0_4px_20px_rgba(255,255,255,0.2)]"
        >
          ابدأ الآن
        </Link>
      </div>
    </GlassPageLayout>
  );
}

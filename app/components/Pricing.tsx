import StartNowLink from "./start-now-link";
import { SINGLE_PLAN } from "@/lib/payment";

const features = [
  "نسختان كاملتان: عربي وإنجليزي",
  "قالب ATS رسمي أبيض وأسود",
  "فحص توافق ATS",
  "تحسين بالذكاء الاصطناعي",
  "تحميل PDF و Word",
  "بدون علامة مائية",
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-lg">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            باقة <span className="text-[#378ADD]">واحدة</span> شاملة
          </h2>
          <p className="text-base text-slate-600 sm:text-lg">
            نسختك الكاملة بالعربي والإنجليزي — سيرة رسمية احترافية
          </p>
        </div>

        <div className="rounded-2xl border-2 border-[#378ADD] bg-white p-8 shadow-lg shadow-[#378ADD]/15">
          <h3 className="mb-1 text-xl font-bold text-slate-900">{SINGLE_PLAN.title}</h3>
          <p className="mb-6 text-sm text-slate-500">{SINGLE_PLAN.description}</p>

          <div className="mb-6 flex items-baseline gap-1">
            <span className="text-5xl font-extrabold text-[#378ADD]">{SINGLE_PLAN.price}</span>
            <span className="text-lg font-semibold text-slate-600">ر.س</span>
          </div>

          <ul className="mb-8 space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                <span className="text-[#378ADD]">✓</span>
                {feature}
              </li>
            ))}
          </ul>

          <StartNowLink className="block rounded-full bg-[#378ADD] py-3 text-center text-sm font-semibold text-white shadow-md shadow-[#378ADD]/25 transition-colors hover:bg-[#2a6bb8]">
            ابدأ الآن
          </StartNowLink>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import StartNowLink from "./start-now-link";

const plans = [
  {
    name: "سيرة بلغة واحدة",
    price: 69,
    description: "تحميل سيرة احترافية بلغة واحدة",
    features: [
      "قالب ATS كلاسيكي",
      "فحص توافق ATS",
      "تحسين بالذكاء الاصطناعي",
      "تحميل PDF و Word",
      "بدون علامة مائية",
    ],
    highlighted: false,
  },
  {
    name: "عربية + إنجليزية",
    price: 99,
    description: "الأفضل للباحثين عن فرص محلية ودولية",
    features: [
      "كل مميزات الباقة الأساسية",
      "نسختان كاملتان",
      "عربية وإنجليزية",
      "فحص ATS لكل نسخة",
      "دعم أولوية",
    ],
    highlighted: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            باقات <span className="text-[#378ADD]">التحميل</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
            أنشئ سيرتك مجاناً، وادفع فقط عند التحميل بدون علامة مائية.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 sm:gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-xl sm:p-8 ${
                plan.highlighted
                  ? "border-[#378ADD] shadow-lg shadow-[#378ADD]/15 ring-2 ring-[#378ADD]/20"
                  : "border-slate-100"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 right-6 rounded-full bg-[#378ADD] px-4 py-1 text-xs font-semibold text-white">
                  الأكثر شعبية
                </span>
              )}

              <h3 className="mb-1 text-xl font-bold text-slate-900">
                {plan.name}
              </h3>
              <p className="mb-6 text-sm text-slate-500">{plan.description}</p>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#378ADD] sm:text-5xl">
                  {plan.price}
                </span>
                <span className="text-lg font-semibold text-slate-600">ر.س</span>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <span className="text-[#378ADD]">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <StartNowLink className="rounded-full bg-[#378ADD] py-3 text-center text-sm font-semibold text-white shadow-md shadow-[#378ADD]/25 transition-colors hover:bg-[#2a6bb8]">
                ابدأ الآن
              </StartNowLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

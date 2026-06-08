import Link from "next/link";

const plans = [
  {
    name: "أساسي",
    price: 69,
    description: "مثالي لمن يبدأ رحلته المهنية",
    features: [
      "سيرة ذاتية واحدة",
      "٣ قوالب احترافية",
      "تصدير PDF",
      "دعم عبر البريد الإلكتروني",
    ],
    highlighted: false,
  },
  {
    name: "احترافي",
    price: 99,
    description: "الخيار الأفضل للباحثين الجادين عن عمل",
    features: [
      "سير ذاتية غير محدودة",
      "جميع القوالب المميزة",
      "تحسين بالذكاء الاصطناعي",
      "تصدير PDF عالي الجودة",
      "دعم أولوية",
    ],
    highlighted: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-slate-900 md:text-4xl">
            خطط <span className="text-[#378ADD]">الأسعار</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            اختر الخطة المناسبة لك وابدأ في بناء هويتك المهنية اليوم.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-xl ${
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
                <span className="text-5xl font-extrabold text-[#378ADD]">
                  {plan.price}
                </span>
                <span className="text-lg font-semibold text-slate-600">
                  ر.س
                </span>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <svg
                      className="h-5 w-5 shrink-0 text-[#378ADD]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="#"
                className="rounded-full bg-[#378ADD] py-3 text-center text-sm font-semibold text-white shadow-md shadow-[#378ADD]/25 transition-colors hover:bg-[#2a6bb8]"
              >
                اشترك الآن
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

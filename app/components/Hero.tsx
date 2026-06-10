import StartNowLink from "./start-now-link";
import { SINGLE_PLAN } from "@/lib/payment";

const PRICE_FEATURES = [
  "نسختان عربي وإنجليزي",
  "PDF و Word",
  "تقرير ATS",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-20">
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-6 inline-block rounded-full border border-[#378ADD]/20 bg-white px-4 py-1.5 text-sm font-medium text-[#378ADD]">
            متوافق مع نظام ATS
          </span>

          <h1 className="mb-6 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
            أنشئ سيرتك الذاتية
            <span className="block text-[#378ADD]">الاحترافية في دقائق</span>
          </h1>

          <p className="mb-10 text-base leading-relaxed text-slate-600 sm:text-lg md:text-xl">
            CVfy يساعدك على بناء سيرة ذاتية رسمية متوافقة مع أنظمة التوظيف،
            مع تحسين بالذكاء الاصطناعي وفحص ATS — نسختان عربي وإنجليزي.
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <StartNowLink className="w-full rounded-full bg-[#378ADD] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#378ADD]/30 transition-all hover:bg-[#2a6bb8] sm:w-auto">
              ابدأ الآن
            </StartNowLink>

            <div
              className="inline-flex flex-col items-center gap-2 rounded-[12px] bg-white px-5 py-[10px]"
              style={{ border: "1.5px solid #378ADD" }}
            >
              <div className="flex items-baseline justify-center gap-1">
                <span
                  className="leading-none text-[#0C447C]"
                  style={{ fontSize: "28px", fontWeight: 900 }}
                >
                  {SINGLE_PLAN.price}
                </span>
                <span className="text-base font-semibold text-[#0C447C]">ر.س</span>
              </div>

              <ul className="flex flex-col gap-1">
                {PRICE_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-[12px] text-[#555]"
                  >
                    <span className="shrink-0 font-bold text-[#378ADD]">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import StartNowLink from "./start-now-link";
import { SINGLE_PLAN } from "@/lib/payment";

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
              className="inline-flex items-center gap-4 rounded-[12px] border border-[#378ADD] bg-white px-5 py-2.5 shadow-sm"
              dir="ltr"
            >
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold leading-none text-[#0C447C]">
                  {SINGLE_PLAN.price}
                </span>
                <span className="text-sm font-semibold text-[#378ADD]">ر.س</span>
              </div>

              <div className="h-10 w-px bg-[#378ADD]/30" aria-hidden />

              <div className="text-right leading-snug">
                <p className="text-sm font-semibold text-slate-800">
                  نسختان عربي وإنجليزي
                </p>
                <p className="text-xs text-slate-500">+ تقرير ATS + PDF و Word</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

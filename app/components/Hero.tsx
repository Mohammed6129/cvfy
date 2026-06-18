import Image from "next/image";
import { SINGLE_PLAN } from "@/lib/payment";
import StartNowLink from "./start-now-link";

const startNowClass =
  "inline-flex w-full items-center justify-center rounded-[10px] bg-[#378ADD] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#2a6bb8] sm:w-auto";

export default function Hero() {
  return (
    <section
      dir="rtl"
      className="bg-[linear-gradient(160deg,#F4F9FF_0%,#fff_60%)]"
    >
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-10 px-6 pb-12 pt-10 md:grid-cols-2 md:px-12 md:pt-16">
        <div className="text-right">
          <div className="mb-5 rounded-2xl border-2 border-[#378ADD] bg-white px-5 py-4">
            <div className="mb-1 flex items-baseline justify-start gap-1">
              <span
                className="leading-none text-[#0C447C]"
                style={{ fontSize: "36px", fontWeight: 800 }}
              >
                {SINGLE_PLAN.price}
              </span>
              <span className="text-sm font-semibold text-[#378ADD]">ر.س</span>
            </div>
            <p className="mb-4 text-[11px] text-[#666]">
              دفعة واحدة — نسختان + PDF و Word + تقرير ATS
            </p>
            <StartNowLink className={startNowClass}>ابدأ الآن ←</StartNowLink>
          </div>

          <span className="mb-4 inline-flex rounded-full bg-[#E6F1FB] px-3.5 py-1 text-xs font-semibold text-[#378ADD]">
            متوافق مع أنظمة ATS
          </span>

          <h1
            className="mb-4 leading-tight text-[#0C447C]"
            style={{ fontSize: "36px", fontWeight: 800 }}
          >
            سيرة تليق بطموحك —
            <span className="block text-[#378ADD]">نبنيها لك في دقائق</span>
          </h1>

          <p className="max-w-lg text-sm leading-relaxed text-[#555]">
            سيرة احترافية بالعربي والإنجليزي، محسّنة بالذكاء الاصطناعي.
          </p>
        </div>

        <div className="flex justify-center md:justify-start">
          <Image
            src="/illustrations/job-hunt.svg"
            alt="باحث عن عمل يبحث عن وظيفته القادمة"
            width={380}
            height={370}
            priority
            className="h-auto w-full max-w-[380px]"
          />
        </div>
      </div>
    </section>
  );
}

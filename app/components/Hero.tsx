import Image from "next/image";
import { SINGLE_PLAN } from "@/lib/payment";
import StartNowLink from "./start-now-link";

const FEATURES = [
  "📄 نسختان عربي وإنجليزي",
  "📁 PDF و Word",
  "✅ تقرير ATS",
];

function PriceIllustration() {
  return (
    <svg
      width="90"
      height="90"
      viewBox="0 0 90 90"
      fill="none"
      aria-hidden
      className="h-[70px] w-[70px] shrink-0 md:h-[90px] md:w-[90px]"
    >
      <circle cx="45" cy="45" r="45" fill="#E6F1FB" />
      <rect x="25" y="20" width="40" height="50" rx="4" fill="#fff" stroke="#378ADD" strokeWidth="1.5" />
      <rect x="32" y="30" width="24" height="5" rx="2.5" fill="#185FA5" />
      <rect x="32" y="40" width="24" height="3" rx="1.5" fill="#B5D4F4" />
      <rect x="32" y="46" width="16" height="3" rx="1.5" fill="#B5D4F4" />
      <circle cx="65" cy="60" r="14" fill="#639922" />
      <path
        d="M59 60l3.5 3.5 7-7"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Hero() {
  return (
    <section
      dir="rtl"
      className="bg-[linear-gradient(160deg,#F4F9FF_0%,#fff_60%)]"
    >
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-10 px-6 pb-12 pt-10 md:grid-cols-2 md:px-12 md:pt-16">
        <div className="text-right">
          <div className="mb-5 inline-flex items-center gap-5">
            <PriceIllustration />

            <div className="flex flex-col gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="leading-none text-[#0C447C] text-[32px] md:text-[38px]"
                  style={{ fontWeight: 800 }}
                >
                  {SINGLE_PLAN.price}
                </span>
                <span className="text-[13px] font-semibold text-[#378ADD] md:text-sm">ر.س</span>
                <span className="mr-2 rounded-full bg-[#D97706] px-2.5 py-0.5 text-[10px] font-semibold text-white">
                  دفعة واحدة
                </span>
              </div>

              <div className="flex flex-wrap gap-3.5">
                {FEATURES.map((item) => (
                  <span key={item} className="text-[10px] text-[#444] md:text-[11px]">
                    {item}
                  </span>
                ))}
              </div>

              <StartNowLink className="mt-1.5 inline-flex w-fit items-center rounded-[10px] bg-[#378ADD] px-[22px] py-[11px] text-sm font-bold text-white transition-colors hover:bg-[#2a6bb8]">
                ابدأ الآن ←
              </StartNowLink>
            </div>
          </div>

          <span className="mb-4 inline-flex rounded-full bg-[#E6F1FB] px-3.5 py-1 text-xs font-semibold text-[#378ADD]">
            متوافق مع أنظمة ATS
          </span>

          <h1
            className="mb-4 leading-tight text-[#0C447C] text-[30px] md:text-[36px]"
            style={{ fontWeight: 800 }}
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

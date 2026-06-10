import StartNowLink from "./start-now-link";
import { SINGLE_PLAN } from "@/lib/payment";

const PRICE_FEATURES = [
  "نسختان عربي وإنجليزي",
  "PDF و Word",
  "تقرير ATS",
];

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M6 1.2L7.545 4.38L11.1 4.86L8.55 7.26L9.09 10.8L6 9.12L2.91 10.8L3.45 7.26L0.9 4.86L4.455 4.38L6 1.2Z"
        fill="#378ADD"
      />
    </svg>
  );
}

function DownloadArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 2.5V10.5M8 10.5L5 7.5M8 10.5L11 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 12.5H13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TransitionArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M10.5 3.5H12.5V5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 11L12.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 3.5H12.5V7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroCvPreview() {
  return (
    <div className="overflow-hidden rounded-[14px] border border-[#D8E8F8] bg-white shadow-[0_8px_28px_rgba(12,68,124,0.1)]">
      <div className="border-b border-[#EEF5FC] bg-[#F8FBFE] px-4 py-3 text-center" dir="ltr">
        <p className="text-sm font-bold text-[#0C447C]">Sarah Al-Rashid</p>
        <p className="text-[11px] font-semibold text-[#378ADD]">Marketing Manager</p>
        <p className="mt-1 text-[9px] text-[#64748b]">
          sarah.rashid@email.com · Riyadh
        </p>
      </div>
      <div className="space-y-3 px-4 py-3" dir="ltr">
        <div>
          <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-[#0C447C]">
            Professional Summary
          </p>
          <div className="space-y-1">
            <div className="h-1.5 w-full rounded-full bg-[#E6F1FB]" />
            <div className="h-1.5 w-11/12 rounded-full bg-[#E6F1FB]" />
            <div className="h-1.5 w-4/5 rounded-full bg-[#E6F1FB]" />
          </div>
        </div>
        <div>
          <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-[#0C447C]">
            Work Experience
          </p>
          <div className="space-y-1.5">
            <div className="h-1.5 w-3/4 rounded-full bg-[#378ADD]/25" />
            <div className="h-1.5 w-full rounded-full bg-[#EEF5FC]" />
            <div className="h-1.5 w-5/6 rounded-full bg-[#EEF5FC]" />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["ATS", "Bilingual", "PDF"].map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-[#E6F1FB] px-2 py-0.5 text-[8px] font-semibold text-[#378ADD]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      className="bg-[#EEF5FC]"
      style={{ padding: "44px 32px 36px" }}
      dir="rtl"
    >
      <div
        className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-[28px] lg:grid-cols-2"
      >
        {/* العمود الأيمن — النص */}
        <div className="text-right">
          <span
            className="mb-4 inline-flex items-center gap-1.5 rounded-[50px] border border-[#B5D4F4] bg-[#E6F1FB] px-3.5 py-[5px] text-[12px] font-medium text-[#185FA5]"
          >
            <StarIcon />
            متوافق مع أنظمة ATS
          </span>

          <h1
            className="mb-3 leading-tight text-[#0C447C]"
            style={{ fontSize: "30px", fontWeight: 700 }}
          >
            سيرتك تفتح الأبواب —
            <span className="block text-[#378ADD]">نحن نبنيها لك</span>
          </h1>

          <p
            className="mb-5 max-w-xl text-[#4a5568]"
            style={{ fontSize: "13px", lineHeight: 1.75 }}
          >
            في دقائق تحصل على سيرة ذاتية احترافية بالعربي والإنجليزي، محسّنة
            بالذكاء الاصطناعي وجاهزة لسوق العمل السعودي.
          </p>

          <div className="mb-5 flex flex-wrap items-center gap-2.5">
            <StartNowLink className="inline-flex items-center gap-2 rounded-[9px] bg-[#378ADD] px-5 py-[11px] text-sm font-semibold text-white transition-colors hover:bg-[#2a6bb8]">
              <DownloadArrowIcon />
              ابدأ الآن
            </StartNowLink>

            <StartNowLink className="inline-flex items-center gap-2 rounded-[9px] border border-[#378ADD] bg-transparent px-5 py-[11px] text-sm font-semibold text-[#378ADD] transition-colors hover:bg-[#E6F1FB]">
              <TransitionArrowIcon />
              حسّن سيرتي الحالية
            </StartNowLink>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xl font-bold text-[#378ADD]">48%</p>
              <p className="text-[11px] text-[#4a5568]">
                أكثر حظاً في الحصول على المقابلة
              </p>
            </div>

            <div
              className="h-10 w-px shrink-0"
              style={{ background: "#C8DCF0" }}
              aria-hidden
            />

            <div className="text-right">
              <p className="text-xl font-bold text-[#F59E0B]">
                {SINGLE_PLAN.price} ر.س
              </p>
              <p className="text-[11px] text-[#4a5568]">
                نسختان + ATS + Word و PDF
              </p>
            </div>
          </div>
        </div>

        {/* العمود الأيسر — السيرة الذاتية */}
        <div>
          <div
            className="mb-[14px] flex items-center justify-between rounded-[12px] bg-[#0C447C] px-[18px] py-3.5"
          >
            <ul className="space-y-1">
              {PRICE_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-1.5 text-[11px] text-white/90"
                >
                  <span className="font-bold text-[#7EC8F8]">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex shrink-0 items-baseline gap-1 ps-3">
              <span
                className="leading-none text-white"
                style={{ fontSize: "34px", fontWeight: 700 }}
              >
                {SINGLE_PLAN.price}
              </span>
              <span className="text-sm text-white/85">ر.س</span>
            </div>
          </div>

          <HeroCvPreview />
        </div>
      </div>
    </section>
  );
}

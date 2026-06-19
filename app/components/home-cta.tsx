import StartNowLink from "./start-now-link";

function CtaWarningIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className="mx-auto mb-3"
    >
      <rect x="6" y="4" width="20" height="24" rx="2" stroke="white" strokeWidth="1.5" />
      <path
        d="M11 10h10M11 14h10M11 18h6"
        stroke="white"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="23" cy="23" r="7" fill="#0C447C" stroke="white" strokeWidth="1.5" />
      <path
        d="M20.5 23h5M23 20.5v5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        transform="rotate(45 23 23)"
      />
    </svg>
  );
}

export default function HomeCta() {
  return (
    <section className="px-6 py-14 text-center md:px-12 md:py-[56px]" dir="rtl">
      <div className="glass-surface mx-auto max-w-[1100px] rounded-[28px] px-6 py-10 md:px-12">
        <CtaWarningIcon />
        <h2 className="mb-3 text-2xl font-extrabold text-white">
          75% من السير تُتجاهل — لا تكن منهم
        </h2>
        <p className="mb-6 text-sm text-white/75">
          ابنِ سيرتك الآن بالذكاء الاصطناعي وضمان التوافق مع ATS
        </p>
        <StartNowLink className="inline-flex items-center rounded-full bg-white px-7 py-3.5 text-sm font-extrabold text-[#0C447C] shadow-[0_4px_20px_rgba(255,255,255,0.25)] transition-opacity hover:opacity-95">
          ابدأ الآن ←
        </StartNowLink>
      </div>
    </section>
  );
}

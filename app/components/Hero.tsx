import Image from "next/image";
import { SINGLE_PLAN } from "@/lib/payment";
import StartNowLink from "./start-now-link";

const PAYMENT_ICONS = [
  { src: "/payment-icons/visa.png", alt: "Visa" },
  { src: "/payment-icons/apple-pay.png", alt: "Apple Pay" },
  { src: "/payment-icons/rasaat.png", alt: "Rasaat" },
];

function PriceIllustration() {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" aria-hidden className="shrink-0">
      <circle cx="25" cy="25" r="25" fill="rgba(255,255,255,0.12)" />
      <rect
        x="14"
        y="11"
        width="22"
        height="28"
        rx="3"
        fill="rgba(255,255,255,0.22)"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.2"
      />
      <rect x="18" y="16" width="14" height="3" rx="1.5" fill="rgba(255,255,255,0.75)" />
      <rect x="18" y="21" width="14" height="2" rx="1" fill="rgba(255,255,255,0.35)" />
      <rect x="18" y="25" width="9" height="2" rx="1" fill="rgba(255,255,255,0.35)" />
      <circle cx="36" cy="33" r="8" fill="#639922" />
      <path
        d="M32 33l2.5 2.5 5-5"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Hero() {
  return (
    <section dir="rtl" className="relative overflow-hidden px-6 pb-16 pt-8 md:px-12 md:pb-20 md:pt-12">
      <div
        className="hero-blob"
        style={{
          width: 240,
          height: 240,
          background: "#85B7EB",
          top: -80,
          right: -60,
          opacity: 0.45,
        }}
      />
      <div
        className="hero-blob"
        style={{
          width: 200,
          height: 200,
          background: "#FAC775",
          bottom: 60,
          left: -70,
          opacity: 0.25,
        }}
      />
      <div
        className="hero-blob"
        style={{
          width: 160,
          height: 160,
          background: "#C0DD97",
          top: 280,
          right: 40,
          opacity: 0.2,
        }}
      />
      <div
        className="hero-blob"
        style={{
          width: 140,
          height: 140,
          background: "#7F77DD",
          top: 50,
          left: 30,
          opacity: 0.2,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[460px] text-center">
        <div className="glass-surface mx-auto rounded-[28px] px-7 py-9 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
          <div className="glass-surface-sm mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-white">
            <Image
              src="/icons/saudi-flag.png"
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 rounded-sm object-cover"
              aria-hidden
            />
            <span>مصمم لسوق العمل السعودي</span>
          </div>

          <h1
            className="mb-4 text-[28px] font-extrabold leading-tight text-white md:text-[34px]"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.15)" }}
          >
            سيرة تليق بطموحك
          </h1>

          <p className="mb-6 text-sm leading-relaxed text-white/85">
            سيرة احترافية بالعربي والإنجليزي، محسّنة بالذكاء الاصطناعي وجاهزة لسوق
            العمل السعودي.
          </p>

          <div className="glass-surface-lg mx-auto mb-6 flex w-fit items-center gap-4 rounded-[18px] px-5 py-4 text-right">
            <PriceIllustration />
            <div className="text-right">
              <div className="mb-0.5 flex items-baseline justify-start gap-1">
                <span className="text-[32px] font-extrabold leading-none text-white">
                  {SINGLE_PLAN.price}
                </span>
                <span className="text-sm font-semibold text-white/90">ر.س</span>
              </div>
              <p className="text-[10px] text-white/75">دفعة واحدة — نسختان + ATS</p>
            </div>
          </div>

          <StartNowLink className="inline-flex items-center rounded-full bg-white px-[34px] py-3.5 text-sm font-extrabold text-[#0C447C] shadow-[0_4px_20px_rgba(255,255,255,0.3)] transition-opacity hover:opacity-95">
            ابدأ الآن ←
          </StartNowLink>

          <div className="mx-auto mt-3.5 flex w-fit items-center justify-center gap-2.5 rounded-[14px] bg-white px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
            {PAYMENT_ICONS.map((icon) => (
              <div
                key={icon.alt}
                className="flex h-9 w-14 items-center justify-center"
              >
                <Image
                  src={icon.src}
                  alt={icon.alt}
                  width={56}
                  height={36}
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

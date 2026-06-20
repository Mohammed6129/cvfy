import Image from "next/image";
import { SINGLE_PLAN } from "@/lib/payment";
import StartNowLink from "./start-now-link";

const HERO_CONTAINER_MAX_WIDTH = "680px";

const PAYMENT_ICON_WRAP = {
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  borderRadius: "8px",
  padding: "5px 9px",
  display: "flex",
  alignItems: "center",
} as const;

const PAYMENT_ICONS = [
  { src: "/payment-icons/visa.png", alt: "Visa" },
  { src: "/payment-icons/apple-pay.png", alt: "Apple Pay" },
  { src: "/payment-icons/rasaat.png", alt: "Rasaat" },
];

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

      <div
        className="relative z-10 mx-auto w-full text-center"
        style={{ maxWidth: HERO_CONTAINER_MAX_WIDTH }}
      >
        <div className="glass-surface w-full rounded-[28px] px-7 py-9 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
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

          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              borderRadius: "18px",
              padding: "18px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                gap: "6px",
                marginBottom: "4px",
              }}
            >
              <span style={{ fontSize: "32px", fontWeight: 800, color: "#fff" }}>
                {SINGLE_PLAN.price}
              </span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>
                ر.س
              </span>
            </div>

            <div
              style={{
                fontSize: "10px",
                color: "rgba(255,255,255,0.6)",
                textAlign: "center",
                marginBottom: "14px",
              }}
            >
              دفعة واحدة — نسختان + ATS
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                borderTop: "1px solid rgba(255,255,255,0.15)",
                paddingTop: "14px",
              }}
            >
              {PAYMENT_ICONS.map((icon) => (
                <div key={icon.alt} style={PAYMENT_ICON_WRAP}>
                  <img
                    src={icon.src}
                    alt={icon.alt}
                    width={32}
                    height={20}
                    style={{ objectFit: "contain", display: "block" }}
                  />
                </div>
              ))}
            </div>
          </div>

          <StartNowLink className="flex w-full items-center justify-center rounded-full bg-white py-[13px] text-sm font-extrabold text-[#0C447C] shadow-[0_4px_20px_rgba(255,255,255,0.3)] transition-opacity hover:opacity-95">
            ابدأ الآن ←
          </StartNowLink>
        </div>
      </div>
    </section>
  );
}

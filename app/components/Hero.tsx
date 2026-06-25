import Image from "next/image";
import { SINGLE_PLAN } from "@/lib/payment";
import GlassBackgroundBlobs from "./glass-background-blobs";
import StartNowLink from "./start-now-link";

const HERO_CONTAINER_MAX_WIDTH = "1100px";

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
      <GlassBackgroundBlobs />

      <div
        className="relative z-10 mx-auto w-full"
        style={{ maxWidth: HERO_CONTAINER_MAX_WIDTH }}
      >
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-[1fr_360px]">
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
                  <Image
                    src={icon.src}
                    alt={icon.alt}
                    width={40}
                    height={24}
                    style={{ objectFit: "contain" }}
                  />
                </div>
              ))}
            </div>
          </div>

          <StartNowLink className="flex w-full items-center justify-center rounded-full bg-white py-[13px] text-sm font-extrabold text-[#0C447C] shadow-[0_4px_20px_rgba(255,255,255,0.3)] transition-opacity hover:opacity-95">
            ابدأ الآن ←
          </StartNowLink>
        </div>

        {/* CV preview mockup — visible on md+ screens */}
        <div className="hidden h-full md:flex md:items-stretch" aria-hidden>
          <div
            className="relative w-full rounded-[20px] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.25)]"
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Header */}
            <div className="mb-4 border-b border-gray-200 pb-4">
              <div className="mb-1.5 h-5 w-36 rounded bg-[#0C447C]" />
              <div className="mb-2 h-3 w-24 rounded bg-gray-300" />
              <div className="flex gap-2">
                <div className="h-2.5 w-20 rounded bg-gray-200" />
                <div className="h-2.5 w-16 rounded bg-gray-200" />
              </div>
            </div>
            {/* Sections */}
            {[
              { lines: [85, 70, 60, 75] },
              { lines: [70, 55] },
              { lines: [80, 65, 70] },
              { lines: [60, 75, 50] },
            ].map((section, si) => (
              <div key={si} className="mb-4">
                <div
                  className="mb-2 h-3 w-24 rounded"
                  style={{ background: "#0C447C", opacity: 0.85 }}
                />
                <div
                  className="mb-2 h-px w-full"
                  style={{ background: "#0C447C", opacity: 0.25 }}
                />
                {section.lines.map((w, i) => (
                  <div
                    key={i}
                    className="mb-1.5 h-2.5 rounded bg-gray-200"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            ))}
            {/* AI badge */}
            <div
              className="absolute -right-3 -top-3 flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold text-white shadow-md"
              style={{ background: "#378ADD" }}
            >
              ✨ AI
            </div>
            {/* ATS badge */}
            <div
              className="absolute -bottom-3 -left-3 flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold shadow-md"
              style={{ background: "#22C55E", color: "#fff" }}
            >
              ATS ✓ 94%
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

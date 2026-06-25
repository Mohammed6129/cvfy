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
            className="relative w-full overflow-hidden rounded-[20px] p-5 shadow-[0_8px_40px_rgba(0,0,0,0.25)]"
            style={{
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(12px)",
              fontFamily: "Arial, sans-serif",
              direction: "rtl",
            }}
          >
            {/* Name & title */}
            <div className="mb-3 border-b border-[#0C447C]/20 pb-3 text-right">
              <div className="text-[15px] font-extrabold text-[#0C447C]">فيصل علي الغامدي</div>
              <div className="mt-0.5 text-[9px] font-semibold text-[#378ADD]">مهندس برمجيات أول | تطوير الأنظمة والحلول التقنية</div>
              <div className="mt-1.5 flex flex-wrap justify-end gap-x-3 gap-y-0.5 text-[7.5px] text-gray-500">
                <span>📍 الرياض، المملكة العربية السعودية</span>
                <span>📞 +966 50 123 4567</span>
                <span>✉ faisal.ali@email.com</span>
              </div>
            </div>

            {/* الملخص المهني */}
            <div className="mb-3">
              <div className="mb-1 border-b border-[#0C447C]/20 pb-0.5 text-[9px] font-extrabold text-[#0C447C]">الملخص المهني</div>
              <p className="text-[7.5px] leading-relaxed text-gray-600">
                مهندس برمجيات بخبرة تزيد عن ٧ سنوات في تصميم وتطوير الأنظمة البرمجية المتكاملة.
                أتمتع بكفاءة عالية في تقنيات الويب الحديثة وإدارة قواعد البيانات وتحليل متطلبات الأعمال.
              </p>
            </div>

            {/* الخبرة العملية */}
            <div className="mb-3">
              <div className="mb-1 border-b border-[#0C447C]/20 pb-0.5 text-[9px] font-extrabold text-[#0C447C]">الخبرة العملية</div>
              <div className="mb-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-[8px] font-bold text-gray-700">مهندس برمجيات أول</span>
                  <span className="text-[7px] text-gray-400">٢٠٢١ — الحاضر</span>
                </div>
                <div className="text-[7.5px] font-semibold text-[#378ADD]">شركة stc للحلول</div>
                <p className="mt-0.5 text-[7px] leading-relaxed text-gray-500">
                  قيادة فريق من ٦ مطورين لتطوير منصة خدمات رقمية تخدم أكثر من ٢ مليون مستخدم.
                  تحسين أداء الأنظمة بنسبة ٤٠٪ وتقليل وقت الاستجابة.
                </p>
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-[8px] font-bold text-gray-700">مطور تطبيقات</span>
                  <span className="text-[7px] text-gray-400">٢٠١٨ — ٢٠٢١</span>
                </div>
                <div className="text-[7.5px] font-semibold text-[#378ADD]">أرامكو السعودية</div>
                <p className="mt-0.5 text-[7px] leading-relaxed text-gray-500">
                  تطوير وصيانة تطبيقات إدارة العمليات الداخلية وتكامل الأنظمة.
                </p>
              </div>
            </div>

            {/* المهارات */}
            <div className="mb-3">
              <div className="mb-1.5 border-b border-[#0C447C]/20 pb-0.5 text-[9px] font-extrabold text-[#0C447C]">المهارات التقنية</div>
              <div className="flex flex-wrap justify-end gap-1">
                {["Python","React","Node.js","SQL","AWS","Docker","TypeScript","Git"].map((s) => (
                  <span key={s} className="rounded px-1.5 py-0.5 text-[7px] font-bold" style={{ background: "#EAF4FE", color: "#0C447C" }}>{s}</span>
                ))}
              </div>
            </div>

            {/* التعليم */}
            <div>
              <div className="mb-1 border-b border-[#0C447C]/20 pb-0.5 text-[9px] font-extrabold text-[#0C447C]">التعليم</div>
              <div className="flex items-baseline justify-between">
                <span className="text-[8px] font-bold text-gray-700">بكالوريوس هندسة الحاسب</span>
                <span className="text-[7px] text-gray-400">٢٠١٨</span>
              </div>
              <div className="text-[7.5px] text-[#378ADD]">جامعة الملك عبدالله للعلوم والتقنية (كاوست)</div>
            </div>

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

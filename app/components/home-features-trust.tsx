import type { ReactNode } from "react";
import Image from "next/image";
import StartNowLink from "./start-now-link";

const UNIFIED_CARD_STYLE = {
  backdropFilter: "blur(16px)",
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "24px",
  padding: "32px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "0",
};

const SECTION_GRID_STYLE = {
  display: "grid",
  gap: "24px",
  alignItems: "center",
};

const TEXT_COLUMN_STYLE = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "flex-start",
  gap: "10px",
};

function SectionGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2" style={SECTION_GRID_STYLE}>
      {children}
    </div>
  );
}

export default function HomeFeaturesTrust() {
  return (
    <section className="px-6 py-12 md:px-12" dir="rtl">
      <div className="mx-auto max-w-[1100px]" style={UNIFIED_CARD_STYLE}>
        <SectionGrid>
          <div style={TEXT_COLUMN_STYLE}>
            <span className="glass-surface-sm inline-block rounded-full px-3 py-1 text-xs font-semibold text-white">
              تحسين بالذكاء الاصطناعي
            </span>
            <h2 className="text-xl font-extrabold text-white md:text-2xl">
              AI يصيغ خبراتك باحترافية تلقائياً
            </h2>
            <p className="text-sm leading-relaxed text-white/80">
              مو لازم تعرف تكتب بالإنجليزي باحتراف — الذكاء الاصطناعي يأخذ كلامك
              العادي ويحوّله لجمل قوية تلفت انتباه أصحاب العمل.
            </p>
          </div>

          <div>
            <Image
              src="/illustrations/resume.svg"
              alt="سيرة ذاتية احترافية منظمة"
              width={320}
              height={218}
              className="mx-auto h-auto w-full max-w-[320px] opacity-90 md:mx-0"
            />
          </div>
        </SectionGrid>

        <SectionGrid>
          <div style={TEXT_COLUMN_STYLE}>
            <span className="glass-surface-sm inline-block rounded-full px-3 py-1 text-xs font-semibold text-white">
              ثقة عملائنا
            </span>
            <h2 className="text-xl font-extrabold text-white md:text-2xl">
              آلاف الباحثين عن عمل اختاروا CVfy
            </h2>
            <p className="text-sm leading-relaxed text-white/80">
              سيرة ذاتية احترافية فتحت لعملائنا أبواب فرص حقيقية في أكبر الشركات
              السعودية.
            </p>
            <StartNowLink className="inline-flex items-center rounded-full bg-white px-7 py-3.5 text-sm font-extrabold text-[#0C447C] shadow-[0_4px_20px_rgba(255,255,255,0.25)] transition-opacity hover:opacity-95">
              ابدأ الآن ←
            </StartNowLink>
          </div>

          <div aria-hidden />
        </SectionGrid>
      </div>
    </section>
  );
}

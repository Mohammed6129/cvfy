import Image from "next/image";
import {
  HOME_GLASS_CONTAINER_CLASS,
  HOME_GLASS_SECTION_CLASS,
} from "./home-glass-shell";
import StartNowLink from "./start-now-link";

const UNIFIED_CARD_STYLE = {
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "24px",
  padding: "40px 32px",
};

const TEXT_COLUMN_STYLE = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "flex-start",
  gap: "12px",
};

const SECTION_GRID_STYLE = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  alignItems: "center",
  gap: "40px",
};

export default function HomeFeaturesTrust() {
  return (
    <section className={HOME_GLASS_SECTION_CLASS} dir="rtl">
      <div className={HOME_GLASS_CONTAINER_CLASS} style={UNIFIED_CARD_STYLE}>
        {/* Section 1: AI */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14"
          style={{ alignItems: "center" }}
        >
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

          <div className="flex items-center justify-center">
            <Image
              src="/illustrations/hiring.svg"
              alt="الذكاء الاصطناعي يصيغ خبراتك"
              width={320}
              height={240}
              className="h-auto w-full max-w-[300px] opacity-90"
            />
          </div>
        </div>

        {/* Divider */}
        <div
          className="mb-14"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        />

        {/* Section 2: Social Proof */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
          style={{ alignItems: "center" }}
        >
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

          <div className="flex items-center justify-center">
            <Image
              src="/illustrations/resume.svg"
              alt="سيرة ذاتية احترافية منظمة"
              width={320}
              height={240}
              className="h-auto w-full max-w-[300px] opacity-90"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

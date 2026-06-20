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

function CvSheet({
  background,
  left,
  top,
  zIndex,
}: {
  background: string;
  left: number;
  top: number;
  zIndex: number;
}) {
  return (
    <div
      className="absolute h-[168px] w-[124px] overflow-hidden rounded-[14px] border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
      style={{
        background,
        left: `${left}px`,
        top: `${top}px`,
        zIndex,
      }}
    >
      <div className="px-3.5 pt-3.5">
        <div className="mb-2 h-2.5 w-14 rounded-full bg-white/70" />
        <div className="mb-1.5 h-1.5 w-full rounded-full bg-white/35" />
        <div className="mb-1.5 h-1.5 w-[88%] rounded-full bg-white/35" />
        <div className="mb-1.5 h-1.5 w-[72%] rounded-full bg-white/35" />
        <div className="h-1.5 w-[56%] rounded-full bg-white/25" />
      </div>
    </div>
  );
}

function StackedCvIllustration() {
  const stackWidth = 124 + 30;
  const stackHeight = 168 + 40;

  return (
    <div
      className="relative mx-auto"
      style={{ width: `${stackWidth}px`, height: `${stackHeight}px` }}
      aria-hidden
    >
      <CvSheet background="#85B7EB" left={30} top={40} zIndex={1} />
      <CvSheet background="#FAC775" left={15} top={20} zIndex={2} />
      <CvSheet background="#ffffff" left={0} top={0} zIndex={3} />
    </div>
  );
}

export default function HomeFeaturesTrust() {
  return (
    <section className="px-6 py-12 md:px-12" dir="rtl">
      <div className="mx-auto max-w-[1100px]" style={UNIFIED_CARD_STYLE}>
        <div
          className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-6"
          style={{
            paddingBottom: "32px",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            marginBottom: "32px",
          }}
        >
          <div className="flex justify-center md:justify-start">
            <Image
              src="/illustrations/resume.svg"
              alt="سيرة ذاتية احترافية منظمة"
              width={320}
              height={218}
              className="h-auto w-full max-w-[320px] opacity-90"
            />
          </div>

          <div className="text-right">
            <span className="glass-surface-sm mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white">
              تحسين بالذكاء الاصطناعي
            </span>
            <h2 className="mb-3 text-xl font-extrabold text-white md:text-2xl">
              AI يصيغ خبراتك باحترافية تلقائياً
            </h2>
            <p className="text-sm leading-relaxed text-white/80">
              مو لازم تعرف تكتب بالإنجليزي باحتراف — الذكاء الاصطناعي يأخذ كلامك
              العادي ويحوّله لجمل قوية تلفت انتباه أصحاب العمل.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-6">
          <div className="flex items-center justify-center">
            <StackedCvIllustration />
          </div>

          <div className="text-right">
            <span className="glass-surface-sm mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white">
              ثقة عملائنا
            </span>
            <h2 className="mb-3 text-xl font-extrabold text-white md:text-2xl">
              آلاف الباحثين عن عمل اختاروا CVfy
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-white/80">
              سيرة ذاتية احترافية فتحت لعملائنا أبواب فرص حقيقية في أكبر الشركات
              السعودية.
            </p>
            <StartNowLink className="inline-flex items-center rounded-full bg-white px-7 py-3.5 text-sm font-extrabold text-[#0C447C] shadow-[0_4px_20px_rgba(255,255,255,0.25)] transition-opacity hover:opacity-95">
              ابدأ الآن ←
            </StartNowLink>
          </div>
        </div>
      </div>
    </section>
  );
}

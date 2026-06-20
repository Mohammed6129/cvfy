import StartNowLink from "./start-now-link";

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

      <div
        className="absolute flex h-11 w-11 items-center justify-center rounded-full bg-[#639922] shadow-[0_4px_14px_rgba(0,0,0,0.2)]"
        style={{ right: "-6px", bottom: "8px", zIndex: 4 }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M6 11.5l3.2 3.2 6.8-7.4"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

export default function HomeTrustSection() {
  return (
    <section className="px-6 py-12 md:px-12" dir="rtl">
      <div className="glass-feature-card mx-auto max-w-[1100px] rounded-3xl p-8">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
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

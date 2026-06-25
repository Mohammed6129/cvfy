import StartNowLink from "./start-now-link";
import {
  HOME_GLASS_CONTAINER_CLASS,
  HOME_GLASS_SECTION_CLASS,
} from "./home-glass-shell";

const PHASES = [
  {
    num: 1,
    title: "الفهم والتحليل",
    desc: "يحلل كلامك ويستخرج التفاصيل المهنية",
    icons: ["🧠", "📝"],
    color: "#FAC775",
    bg: "rgba(250,199,117,0.08)",
    border: "rgba(250,199,117,0.35)",
    iconBg1: "rgba(250,199,117,0.2)",
    iconBg2: "rgba(250,199,117,0.1)",
  },
  {
    num: 2,
    title: "الصياغة الاحترافية",
    desc: "يحوّل كلامك لجمل قوية بالعربي والإنجليزي",
    icons: ["✨", "🔤"],
    color: "#85B7EB",
    bg: "rgba(55,138,221,0.08)",
    border: "rgba(55,138,221,0.35)",
    iconBg1: "rgba(55,138,221,0.2)",
    iconBg2: "rgba(55,138,221,0.1)",
  },
  {
    num: 3,
    title: "تحسين ATS",
    desc: "يضمّن الكلمات المفتاحية التي تبحث عنها الأنظمة",
    icons: ["🎯", "🔍"],
    color: "#C0DD97",
    bg: "rgba(192,221,151,0.08)",
    border: "rgba(192,221,151,0.35)",
    iconBg1: "rgba(192,221,151,0.2)",
    iconBg2: "rgba(192,221,151,0.1)",
  },
  {
    num: 4,
    title: "مراجعة الجودة",
    desc: "يتحقق من الاتساق والدقة قبل التسليم النهائي",
    icons: ["📊", "✅"],
    color: "#AFA9EC",
    bg: "rgba(175,169,236,0.08)",
    border: "rgba(175,169,236,0.35)",
    iconBg1: "rgba(175,169,236,0.2)",
    iconBg2: "rgba(175,169,236,0.1)",
  },
] as const;

const OUTPUT_BADGES = ["PDF عربي", "PDF إنجليزي", "Word", "تقرير ATS"];

function Connector() {
  return (
    <div className="flex flex-col items-center">
      <div className="h-5 w-px bg-gradient-to-b from-white/30 to-white/10" />
      <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
      <div className="h-5 w-px bg-gradient-to-b from-white/10 to-transparent" />
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className={HOME_GLASS_SECTION_CLASS} dir="rtl">
      <div className={HOME_GLASS_CONTAINER_CLASS}>
        {/* Title */}
        <h2 className="mb-8 text-center text-[22px] font-extrabold leading-snug text-white md:text-[26px]">
          تكتب بياناتك{" "}
          <span className="text-[#FAC775]">ونحولها لسيرة ذاتية احترافية</span>
        </h2>

        {/* Input node */}
        <div className="flex justify-center mb-0">
          <div
            className="inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-sm font-bold text-white"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1.5px solid rgba(255,255,255,0.25)",
            }}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
              style={{ background: "#FAC775" }}
            >
              ✍️
            </div>
            <div>
              <div className="text-[11px] text-white/60">تدخل بياناتك</div>
              <div>بصياغتك العادية</div>
            </div>
          </div>
        </div>

        <Connector />

        {/* Phases 2×2 grid — RTL: 1 top-right, 2 top-left */}
        <div className="mx-auto mb-0 grid max-w-[580px] grid-cols-2 gap-3" dir="rtl">
          {PHASES.map((phase) => (
            <div
              key={phase.num}
              className="relative rounded-[16px] p-4"
              style={{ background: phase.bg, border: `1.5px solid ${phase.border}` }}
            >
              {/* Step badge */}
              <div
                className="absolute -top-2.5 right-3.5 rounded-full bg-white px-2 py-0.5 text-[10px] font-extrabold text-[#0C447C]"
              >
                مرحلة {phase.num}
              </div>

              <div className="mb-2.5 flex gap-2">
                <div
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-base"
                  style={{
                    background: phase.iconBg1,
                    border: "2px solid rgba(255,255,255,0.2)",
                  }}
                >
                  {phase.icons[0]}
                </div>
                <div
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-base"
                  style={{
                    background: phase.iconBg2,
                    border: "2px solid rgba(255,255,255,0.2)",
                  }}
                >
                  {phase.icons[1]}
                </div>
              </div>

              <p className="mb-1 text-xs font-extrabold" style={{ color: phase.color }}>
                {phase.title}
              </p>
              <p className="text-[10.5px] leading-relaxed text-white/60">
                {phase.desc}
              </p>
            </div>
          ))}
        </div>

        <Connector />

        {/* Output node */}
        <div className="flex justify-center mb-7">
          <div
            className="flex w-full max-w-[340px] items-center gap-4 rounded-[16px] px-6 py-4"
            style={{
              background: "linear-gradient(135deg, #378ADD, #185fa5)",
              boxShadow: "0 8px 24px rgba(55,138,221,0.4)",
            }}
          >
            <span className="text-3xl">📄</span>
            <div>
              <p className="mb-0.5 text-[11px] font-bold text-white/70">
                النتيجة النهائية
              </p>
              <p className="text-sm font-extrabold text-white">
                سيرتك الذاتية جاهزة للتحميل
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {OUTPUT_BADGES.map((b) => (
                  <span
                    key={b}
                    className="rounded-full px-2 py-0.5 text-[9px] font-bold text-white"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <StartNowLink className="inline-flex items-center rounded-full bg-white px-8 py-3.5 text-sm font-extrabold text-[#0C447C] shadow-[0_4px_20px_rgba(255,255,255,0.25)] transition-opacity hover:opacity-95">
            ابدأ الآن ←
          </StartNowLink>
        </div>
      </div>
    </section>
  );
}

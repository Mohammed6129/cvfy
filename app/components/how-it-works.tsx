import Image from "next/image";
import {
  HOME_GLASS_CONTAINER_CLASS,
  HOME_GLASS_SECTION_CLASS,
} from "./home-glass-shell";

const STEPS = [
  {
    num: 1,
    icon: "/icons/01_Form.png",
    title: "تعبئة الفورم",
    desc: "بياناتك بأسلوبك العادي",
    color: "#FAC775",
  },
  {
    num: 2,
    icon: "/icons/02_AI.png",
    title: "تحسين AI",
    desc: "صياغة احترافية تلقائية",
    color: "#85B7EB",
  },
  {
    num: 3,
    icon: "/icons/03_ATS.png",
    title: "فحص ATS",
    desc: "توافق مع أنظمة التوظيف",
    color: "#C0DD97",
  },
  {
    num: 4,
    icon: "/icons/04_Download.png",
    title: "التحميل",
    desc: "نسختان جاهزتان فوراً",
    color: "#AFA9EC",
  },
] as const;

function ArrowLeft() {
  return (
    <div
      className="hidden md:flex shrink-0 items-center justify-center"
      aria-hidden
      style={{ color: "rgba(255,255,255,0.35)", fontSize: "22px", userSelect: "none" }}
    >
      ←
    </div>
  );
}

function ArrowDown() {
  return (
    <div
      className="flex md:hidden items-center justify-center py-1"
      aria-hidden
      style={{ color: "rgba(255,255,255,0.35)", fontSize: "20px", userSelect: "none" }}
    >
      ↓
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className={HOME_GLASS_SECTION_CLASS} dir="rtl">
      <div className={HOME_GLASS_CONTAINER_CLASS}>
        <div
          style={{
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "28px",
            padding: "40px 32px",
          }}
        >
          {/* Header */}
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-[22px] font-extrabold text-white md:text-[26px]">
              رحلتك مع{" "}
              <span style={{ color: "#FAC775" }}>CVfy</span>
            </h2>
            <p className="text-sm text-white/60">
              من الفورم إلى السيرة الجاهزة في خطوات بسيطة
            </p>
          </div>

          {/* Steps — row on desktop, column on mobile */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-0">
            {STEPS.map((step, i) => (
              <div key={step.num} className="flex flex-col md:flex-row md:items-start md:flex-1">
                {/* Step card */}
                <div
                  className="relative flex flex-col items-center text-center px-4 py-6 rounded-[20px] md:flex-1"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  {/* Number badge */}
                  <div
                    className="absolute -top-3 right-4 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-extrabold shadow-md"
                    style={{ background: "#fff", color: "#0C447C" }}
                  >
                    {step.num}
                  </div>

                  {/* Icon */}
                  <div className="mb-3 mt-2">
                    <Image
                      src={step.icon}
                      alt={step.title}
                      width={38}
                      height={38}
                      className="object-contain"
                      style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.18))" }}
                    />
                  </div>

                  <p className="mb-1 text-sm font-extrabold text-white">{step.title}</p>
                  <p className="text-xs leading-relaxed text-white/60">{step.desc}</p>
                </div>

                {/* Arrow between steps (not after last) */}
                {i < STEPS.length - 1 && (
                  <>
                    <ArrowLeft />
                    <ArrowDown />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

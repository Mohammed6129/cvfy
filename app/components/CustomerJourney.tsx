import type { ReactNode } from "react";
import {
  HOME_GLASS_CONTAINER_CLASS,
  HOME_GLASS_SECTION_CLASS,
} from "./home-glass-shell";

const WRAPPER_STYLE = {
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: "24px",
  padding: "36px 28px",
} as const;

const BADGE_STYLE = {
  position: "absolute" as const,
  top: "-10px",
  right: "-10px",
  width: "26px",
  height: "26px",
  borderRadius: "50%",
  background: "#fff",
  color: "#0C447C",
  fontSize: "12px",
  fontWeight: 800,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
};

function JourneyArrow() {
  return (
    <div className="flex h-7 w-full shrink-0 items-center justify-center md:h-auto md:w-[26px]">
      <svg
        width="20"
        height="14"
        viewBox="0 0 20 14"
        fill="none"
        aria-hidden
        className="rotate-90 md:rotate-0"
      >
        <path
          d="M18 7H2M8 1L2 7l6 6"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function StepBadge({ number }: { number: number }) {
  return <div style={BADGE_STYLE}>{number}</div>;
}

function StepIcon({ bg, children }: { bg: string; children: ReactNode }) {
  return (
    <div
      style={{
        width: "38px",
        height: "38px",
        borderRadius: "11px",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 8px",
      }}
    >
      {children}
    </div>
  );
}

const STEPS = [
  {
    number: 1,
    title: "تعبئة الفورم",
    desc: "بياناتك العادية",
    iconBg: "rgba(192,221,151,0.2)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect x="3" y="2" width="14" height="16" rx="2" stroke="#C0DD97" strokeWidth="1.3" />
        <path
          d="M6.5 7h8M6.5 10.5h8M6.5 13.5h4.5"
          stroke="#C0DD97"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    number: 2,
    title: "تحسين AI",
    desc: "صياغة احترافية",
    iconBg: "rgba(250,199,117,0.2)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path
          d="M10 2l1.5 4.3H16l-3.5 2.5 1.5 4.3L10 10.5l-4 2.6 1.5-4.3L4 6.3h4.5z"
          fill="#FAC775"
        />
      </svg>
    ),
  },
  {
    number: 3,
    title: "فحص ATS",
    desc: "توافق مضمون",
    iconBg: "rgba(175,169,236,0.2)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle cx="10" cy="10" r="6.5" stroke="#AFA9EC" strokeWidth="1.3" />
        <path
          d="M7 10l1.8 1.8 3.7-4"
          stroke="#AFA9EC"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    number: 4,
    title: "التحميل",
    desc: "فوري ومباشر",
    iconBg: "rgba(133,183,235,0.2)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect x="4" y="2" width="12" height="13" rx="2" stroke="#85B7EB" strokeWidth="1.3" />
        <path
          d="M10 17v3M7.5 18.5l2.5 2.5 2.5-2.5"
          stroke="#85B7EB"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const;

export default function CustomerJourney() {
  return (
    <section id="journey" className={HOME_GLASS_SECTION_CLASS} dir="rtl">
      <div className={HOME_GLASS_CONTAINER_CLASS} style={WRAPPER_STYLE}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "20px",
            fontWeight: 800,
            color: "#fff",
            marginBottom: "6px",
          }}
        >
          رحلتك مع <span style={{ color: "#FAC775" }}>CVfy</span>
        </h2>
        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "rgba(255,255,255,0.65)",
            marginBottom: "32px",
          }}
        >
          من الفورم إلى السيرة الجاهزة في خطوات بسيطة
        </p>

        <div className="flex flex-col items-stretch md:flex-row md:items-center md:justify-between">
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              className="flex flex-col items-stretch md:contents"
            >
              <div
                className="relative w-full text-center md:flex-1"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "16px",
                  padding: "16px 12px",
                }}
              >
                <StepBadge number={step.number} />
                <StepIcon bg={step.iconBg}>{step.icon}</StepIcon>
                <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#fff" }}>
                  {step.title}
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    color: "rgba(255,255,255,0.6)",
                    marginTop: "3px",
                  }}
                >
                  {step.desc}
                </div>
              </div>
              {index < STEPS.length - 1 && <JourneyArrow />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

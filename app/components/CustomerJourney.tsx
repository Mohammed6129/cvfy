import Image from "next/image";
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

function StepIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{ width: "56px", height: "56px", margin: "0 auto 10px" }}>
      <Image src={src} alt={alt} width={56} height={56} style={{ objectFit: "contain" }} />
    </div>
  );
}

const STEPS = [
  {
    number: 1,
    title: "تعبئة الفورم",
    desc: "بياناتك العادية",
    icon: "/icons/01_Form.png",
  },
  {
    number: 2,
    title: "تحسين AI",
    desc: "صياغة احترافية",
    icon: "/icons/02_AI.png",
  },
  {
    number: 3,
    title: "فحص ATS",
    desc: "توافق مضمون",
    icon: "/icons/03_ATS.png",
  },
  {
    number: 4,
    title: "التحميل",
    desc: "فوري ومباشر",
    icon: "/icons/04_Download.png",
  },
] as const;

export default function CustomerJourney() {
  return (
    <section id="journey" className={HOME_GLASS_SECTION_CLASS} dir="rtl">
      <div className={HOME_GLASS_CONTAINER_CLASS} style={WRAPPER_STYLE}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "22px",
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
            fontSize: "13px",
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
                <StepIcon src={step.icon} alt={step.title} />
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>
                  {step.title}
                </div>
                <div
                  style={{
                    fontSize: "11px",
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

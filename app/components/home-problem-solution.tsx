import type { ReactNode } from "react";
import {
  HOME_GLASS_CONTAINER_CLASS,
  HOME_GLASS_SECTION_CLASS,
} from "./home-glass-shell";

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="4" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3"/>
      <path d="M9.5 9.5L12 12" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden className="shrink-0">
      <circle cx="11" cy="11" r="11" fill="#22C55E" />
      <path
        d="M7 11l2.5 2.5 5.5-6"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden className="shrink-0">
      <circle cx="11" cy="11" r="11" fill="#DC2626" />
      <path
        d="M8 8l6 6M14 8l-6 6"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const SOLUTION_POINTS = [
  {
    title: "كلمات الوظيفة تدخل سيرتك الذاتية تلقائياً",
    description:
      "نحلل الوصف الوظيفي ونضمّن مصطلحاته داخل خبراتك بصياغة طبيعية، بدون حشو.",
  },
  {
    title: "قالب واحد متوافق مع ATS بالكامل",
    description:
      "بنية نظيفة بدون جداول أو أعمدة معقدة، فيقرأ النظام سيرتك الذاتية سطراً بسطر دون أن يفوّت شيء.",
  },
  {
    title: "تقرير يوضّح فرصك الحقيقية",
    description:
      "تشوف نسبة توافق سيرتك الذاتية مع الوظيفة المستهدفة، ومن وين بالضبط ممكن تحسّن قبل ما ترسل.",
  },
];

const PROBLEM_POINTS = [
  {
    title: "سيرتك الذاتية تتكلم بلغة، والوظيفة تبحث بلغة أخرى",
    description:
      "إذا ما طابقت كلماتك مصطلحات الإعلان الوظيفي بالضبط، النظام يتجاهل سيرتك الذاتية تلقائياً.",
  },
  {
    title: "التصميم الجمالي يكسر القراءة الآلية",
    description:
      "الأعمدة والصور والجداول الجذابة بصرياً تتحول لفوضى غير مقروءة بالنسبة للنظام.",
  },
  {
    title: 'تكتب "مسؤول"، والنظام يبحث عن "محقق نتائج"',
    description:
      "بدون أرقام وإنجازات ملموسة، سيرتك الذاتية تبدو عامة وسط مئات المتقدمين المتشابهين.",
  },
];

function PointItem({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 text-right">
      {icon}
      <div>
        <p className="mb-1 text-sm font-bold text-white">{title}</p>
        <p className="text-xs leading-relaxed text-white/65">{description}</p>
      </div>
    </div>
  );
}

const GLASS_WRAPPER_STYLE = {
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "28px",
  padding: "40px 32px",
} as const;

export default function HomeProblemSolution() {
  return (
    <section className={HOME_GLASS_SECTION_CLASS} dir="rtl">
      <div className={`${HOME_GLASS_CONTAINER_CLASS} text-center`} style={GLASS_WRAPPER_STYLE}>
        <p className="mx-auto mb-5 flex items-center justify-center gap-2 text-[15px] font-bold text-white/60">
          <SearchIcon />
          <span>وين تروح سيرتك الذاتية بعد التقديم؟</span>
        </p>

        <h2
          className="mb-4"
          style={{
            color: "#fff",
            fontSize: "26px",
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          3 من كل 4 سير ذاتية لا تجتاز الفرز الآلي
        </h2>

        <p
          className="mx-auto mb-10"
          style={{
            color: "rgba(255,255,255,0.65)",
            fontSize: "13px",
            maxWidth: "520px",
            lineHeight: 1.7,
            textAlign: "center",
          }}
        >
          قبل أن يفتح أي مسؤول توظيف ملفك، يفحصه نظام آلي صارم. لا يهم خبرتك إذا
          كانت سيرتك الذاتية بصيغة لا يفهمها النظام.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2" style={{ gap: "24px" }}>
          <div
            className="text-right"
            style={{
              background: "rgba(34,197,94,0.06)",
              border: "1.5px solid rgba(34,197,94,0.35)",
              borderRadius: "20px",
              padding: "24px",
            }}
          >
            <h3 className="mb-5 text-base font-extrabold text-white">
              مع CVfy، الموضوع مختلف
            </h3>

            <div className="mb-5 flex flex-col gap-4">
              {SOLUTION_POINTS.map((point) => (
                <PointItem
                  key={point.title}
                  icon={<CheckCircleIcon />}
                  title={point.title}
                  description={point.description}
                />
              ))}
            </div>

            <div
              className="rounded-2xl px-4 py-4 text-center"
              style={{ background: "rgba(34,197,94,0.1)" }}
            >
              <p className="mb-1 text-[30px] font-extrabold leading-none text-[#4ADE80]">
                94%
              </p>
              <p className="text-xs leading-relaxed text-white/70">
                من سير CVfy الذاتية تعدّي فحص ATS بنجاح
              </p>
            </div>
          </div>

          <div
            className="text-right"
            style={{
              background: "rgba(220,38,38,0.06)",
              border: "1.5px solid rgba(220,38,38,0.35)",
              borderRadius: "20px",
              padding: "24px",
            }}
          >
            <h3 className="mb-5 text-base font-extrabold text-white">
              بدون CVfy، هذا ما يحدث
            </h3>

            <div className="mb-5 flex flex-col gap-4">
              {PROBLEM_POINTS.map((point) => (
                <PointItem
                  key={point.title}
                  icon={<XCircleIcon />}
                  title={point.title}
                  description={point.description}
                />
              ))}
            </div>

            <div
              className="rounded-2xl px-4 py-4 text-center"
              style={{ background: "rgba(220,38,38,0.1)" }}
            >
              <p className="mb-1 text-[30px] font-extrabold leading-none text-[#FF6B6B]">
                75%
              </p>
              <p className="text-xs leading-relaxed text-white/70">
                من السير الذاتية لا تصل أبداً لعين أي موظف توظيف
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

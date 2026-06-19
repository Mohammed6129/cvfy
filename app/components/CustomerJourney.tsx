const STEPS = [
  {
    title: "تعبئة الفورم",
    desc: "بياناتك بأسلوبك العادي",
    iconBg: "rgba(192,221,151,0.25)",
    iconColor: "#C0DD97",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <line x1="8" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="8" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="8" y1="16" x2="12" y2="16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "تحسين AI",
    desc: "صياغة احترافية تلقائية",
    iconBg: "rgba(250,199,117,0.25)",
    iconColor: "#FAC775",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 4L13.4 9.2L18.5 10.5L13.4 11.8L12 17L10.6 11.8L5.5 10.5L10.6 9.2L12 4Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "فحص ATS",
    desc: "توافق مع أنظمة التوظيف",
    iconBg: "rgba(127,119,221,0.25)",
    iconColor: "#7F77DD",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M8.5 12L10.8 14.3L15.5 9.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "التحميل",
    desc: "نسختان جاهزتان فوراً",
    iconBg: "rgba(133,183,235,0.25)",
    iconColor: "#85B7EB",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 4V14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path
          d="M8.5 10.5L12 14L15.5 10.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M6 18H18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function CustomerJourney() {
  return (
    <section id="journey" className="px-6 py-12 md:px-12" dir="rtl">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-[26px] font-extrabold text-white">
            رحلتك مع <span className="text-[#FAC770]">CVfy</span>
          </h2>
          <p className="text-sm text-white/70">
            من الفورم إلى السيرة الجاهزة في خطوات بسيطة
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="glass-surface-md rounded-2xl px-2 py-4 text-center"
            >
              <div
                className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ backgroundColor: step.iconBg, color: step.iconColor }}
              >
                {step.icon}
              </div>
              <h3 className="mb-1 text-[13px] font-bold text-white">{step.title}</h3>
              <p className="text-[11px] leading-relaxed text-white/75">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

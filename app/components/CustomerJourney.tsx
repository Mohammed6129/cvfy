const STEPS = [
  {
    title: "تعبئة الفورم",
    iconBg: "#EAF3DE",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <rect x="6" y="4" width="14" height="18" rx="2" fill="#4CAF50" fillOpacity="0.2" stroke="#4CAF50" strokeWidth="1.5" />
        <line x1="9" y1="9" x2="17" y2="9" stroke="#4CAF50" strokeWidth="1.2" />
        <line x1="9" y1="13" x2="15" y2="13" stroke="#4CAF50" strokeWidth="1.2" />
        <circle cx="19" cy="19" r="5" fill="#22C55E" />
        <path d="M17 19L18.5 20.5L21.5 17.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "تحسين AI",
    iconBg: "#E6F1FB",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <circle cx="14" cy="14" r="9" fill="#378ADD" fillOpacity="0.15" stroke="#378ADD" strokeWidth="1.5" />
        <path d="M14 9L14.8 12.2L18 13L14.8 13.8L14 17L13.2 13.8L10 13L13.2 12.2L14 9Z" fill="#378ADD" />
        <path d="M19 19H21V21" stroke="#378ADD" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "فحص ATS",
    iconBg: "#EEEDFE",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <rect x="5" y="6" width="18" height="14" rx="2" fill="#7C6FE0" fillOpacity="0.15" stroke="#7C6FE0" strokeWidth="1.5" />
        <path d="M11 14L13.5 16.5L18 12" stroke="#7C6FE0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "التحميل",
    iconBg: "#FAEEDA",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <rect x="7" y="5" width="12" height="16" rx="2" fill="#F59E0B" fillOpacity="0.2" stroke="#F59E0B" strokeWidth="1.5" />
        <path d="M13 11V17M13 17L10.5 14.5M13 17L15.5 14.5" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function CustomerJourney() {
  return (
    <section className="bg-[#F8FBFF] px-4 py-14 sm:px-8 sm:py-16" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-center text-2xl font-extrabold text-[#0C447C] sm:text-3xl">
          رحلتك مع <span className="text-[#378ADD]">CVfy</span>
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-white bg-white p-5 text-center shadow-sm"
            >
              <div
                className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl"
                style={{ backgroundColor: step.iconBg }}
              >
                {step.icon}
              </div>
              <h3 className="text-sm font-bold text-[#0C447C]">{step.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

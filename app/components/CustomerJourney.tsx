const STEPS = [
  {
    num: "01",
    title: "تعبئة الفورم",
    desc: "أدخل بياناتك بأسلوبك العادي — بدون تعقيد أو تنسيق مسبق",
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
    num: "02",
    title: "تحسين AI",
    desc: "الذكاء الاصطناعي يصيغ خبراتك بلغة احترافية تناسب سوق العمل",
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
    num: "03",
    title: "فحص ATS",
    desc: "نتحقق إن سيرتك تجتاز أنظمة الفرز الآلي وتوصل للمسؤولين",
    iconBg: "#EEEDFE",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <rect x="5" y="6" width="18" height="14" rx="2" fill="#7C6FE0" fillOpacity="0.15" stroke="#7C6FE0" strokeWidth="1.5" />
        <path d="M11 14L13.5 16.5L18 12" stroke="#7C6FE0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "التحميل",
    desc: "نسختان جاهزتان — عربي وإنجليزي بصيغة PDF و Word فوراً",
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
    <section id="journey" className="bg-white" dir="rtl">
      <div className="mx-auto max-w-[1100px] px-6 py-16 md:px-12">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block rounded-full bg-[#E6F1FB] px-3 py-1 text-xs font-semibold text-[#378ADD]">
            كيف يعمل CVfy؟
          </span>
          <h2 className="mb-2 text-[26px] font-extrabold text-[#0C447C]">
            رحلتك مع <span className="text-[#378ADD]">CVfy</span>
          </h2>
          <p className="text-sm text-[#555]">
            من الفورم إلى السيرة الجاهزة في خطوات بسيطة — بدون تعقيد
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="relative overflow-hidden rounded-2xl border border-[#EEF3FA] bg-[#F8FAFE] p-5"
            >
              <span
                className="pointer-events-none absolute -top-1 right-2 select-none text-[52px] font-extrabold leading-none text-[#EEF3FA]"
                aria-hidden
              >
                {step.num}
              </span>
              <div
                className="relative mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: step.iconBg }}
              >
                {step.icon}
              </div>
              <h3 className="relative mb-1.5 text-[13px] font-bold text-[#0C447C]">
                {step.title}
              </h3>
              <p className="relative text-xs leading-relaxed text-[#555]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.364 15.364 0 0 1-8.47 0 2.25 2.25 0 0 1-2.4-2.245 4.5 4.5 0 0 0 8.4 2.245c.22 0 .44-.02.66-.05m0 0a15.364 15.364 0 0 0 8.47 0 2.25 2.25 0 0 0 2.4-2.245 4.5 4.5 0 0 1-8.4 2.245c-.22 0-.44-.02-.66-.05"
        />
      </svg>
    ),
    title: "قالب رسمي احترافي",
    description:
      "قالب أبيض وأسود بخط Times New Roman — مصمم خصيصاً لسوق العمل السعودي ومتوافق مع معايير ATS.",
  },
  {
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
        />
      </svg>
    ),
    title: "تحسين بالذكاء الاصطناعي",
    description:
      "احصل على اقتراحات ذكية لتحسين صياغة خبراتك ومهاراتك بشكل احترافي.",
  },
  {
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
        />
      </svg>
    ),
    title: "متوافق مع أنظمة التوظيف",
    description:
      "سيرتك الذاتية جاهزة لتجاوز أنظمة الفرز الآلي ATS المستخدمة في الشركات الكبرى.",
  },
  {
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
        />
      </svg>
    ),
    title: "تصدير PDF فوري",
    description:
      "حمّل سيرتك الذاتية بصيغة PDF عالية الجودة وجاهزة للإرسال في أي وقت.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-slate-900 md:text-4xl">
            لماذا <span className="text-[#378ADD]">CVfy</span>؟
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            كل ما تحتاجه لبناء سيرة ذاتية تبرز مهاراتك وتفتح لك أبواب الفرص
            الوظيفية.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-[#378ADD]/20 hover:shadow-lg hover:shadow-[#378ADD]/10"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f2fc] text-[#378ADD] transition-colors group-hover:bg-[#378ADD] group-hover:text-white">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

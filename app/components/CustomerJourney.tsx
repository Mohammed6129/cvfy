const STEPS = [
  { icon: "📝", title: "تعبئة الفورم", desc: "أدخل بياناتك بأسلوبك العادي" },
  { icon: "✨", title: "تحسين AI", desc: "الذكاء الاصطناعي يصيغها احترافياً" },
  { icon: "🎯", title: "فحص ATS", desc: "نتحقق من توافقها مع أنظمة التوظيف" },
  { icon: "📥", title: "التحميل", desc: "نسختان عربي وإنجليزي — 99 ر.س" },
];

export default function CustomerJourney() {
  return (
    <section className="bg-[#378ADD]/5 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-4 text-center text-3xl font-extrabold text-slate-900 sm:text-4xl">
          رحلتك مع <span className="text-[#378ADD]">CVfy</span>
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-slate-600">
          من الفورم إلى السيرة الجاهزة في خطوات بسيطة
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-white bg-white p-6 text-center shadow-sm"
            >
              {i < STEPS.length - 1 && (
                <span
                  className="absolute -left-3 top-1/2 hidden h-0.5 w-6 bg-[#378ADD]/30 lg:block"
                  aria-hidden
                />
              )}
              <span className="mb-3 block text-3xl">{step.icon}</span>
              <h3 className="mb-2 font-extrabold text-slate-900">{step.title}</h3>
              <p className="text-sm text-slate-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

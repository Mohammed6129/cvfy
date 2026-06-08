const STATS = [
  { value: "+5,000", label: "سيرة ذاتية منشأة" },
  { value: "92%", label: "رضا المستخدمين" },
  { value: "4.9", label: "تقييم المنصة" },
];

const TESTIMONIALS = [
  {
    name: "سارة العتيبي",
    role: "أخصائية موارد بشرية",
    text: "أفضل أداة عربية لبناء سيرة ATS. وفرت عليّ ساعات من التنسيق.",
  },
  {
    name: "محمد الحربي",
    role: "مهندس برمجيات",
    text: "الذكاء الاصطناعي حسّن صياغة خبراتي بشكل احترافي. حصلت على مقابلات أكثر.",
  },
  {
    name: "نورة القحطاني",
    role: "خريجة جديدة",
    text: "سهلة الاستخدام ومناسبة للسوق السعودي. أنصح بها كل طالبة وخريجة.",
  },
];

export default function SocialProof() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-6 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#378ADD]/15 bg-[#e8f2fc]/40 p-6 text-center"
            >
              <p className="text-3xl font-extrabold text-[#378ADD]">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-600">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <h2 className="mb-8 text-center text-3xl font-extrabold text-slate-900">
          ماذا يقول مستخدمونا
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.name}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <p className="mb-4 text-sm leading-relaxed text-slate-700">
                &ldquo;{t.text}&rdquo;
              </p>
              <footer>
                <p className="font-bold text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

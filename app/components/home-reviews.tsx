const REVIEWS = [
  {
    name: "خالد المطيري",
    city: "الرياض",
    date: "مارس 2026",
    text: "في أقل من ساعة عندي سيرة ذاتية احترافية بالعربي والإنجليزي. الخدمة استثنائية وتستحق كل ريال.",
  },
  {
    name: "سارة القحطاني",
    city: "جدة",
    date: "فبراير 2026",
    text: "كنت خايف إن السيرة ما تعدّي الـ ATS، بس بعد ما استخدمت CVfy وصلتني مقابلات من شركتين كبار.",
  },
  {
    name: "فيصل العنزي",
    city: "الدمام",
    date: "يناير 2026",
    text: "الـ AI غيّر صياغة خبراتي بشكل ما توقعته. الـ 99 ريال أفضل استثمار في مسيرتي المهنية.",
  },
];

export default function HomeReviews() {
  return (
    <section className="border-t border-[#EEF3FA] bg-[#F8FAFE]" dir="rtl">
      <div className="mx-auto max-w-[1100px] px-6 py-14 md:px-12">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block rounded-full bg-[#E6F1FB] px-3 py-1 text-xs font-semibold text-[#378ADD]">
            آراء عملاؤنا
          </span>
          <h2 className="text-[26px] font-extrabold text-[#0C447C]">
            ماذا قالوا عن CVfy؟
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {REVIEWS.map((review) => (
            <div
              key={review.name}
              className="rounded-2xl border border-[#EEF3FA] bg-white p-5"
            >
              <p className="mb-3 text-sm text-[#D97706]" aria-label="5 نجوم">
                ★★★★★
              </p>
              <p className="mb-4 text-sm leading-relaxed text-[#555]">{review.text}</p>
              <div className="text-xs text-[#999]">
                <span className="font-bold text-[#0C447C]">{review.name}</span>
                <span> · {review.city}</span>
                <span> · {review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import {
  HOME_GLASS_CONTAINER_CLASS,
  HOME_GLASS_SECTION_CLASS,
} from "./home-glass-shell";

const REVIEWS = [
  {
    name: "خالد المطيري",
    city: "الرياض",
    date: "مارس 2026",
    text: "في أقل من ساعة عندي سيرة ذاتية احترافية بالعربي والإنجليزي. الخدمة استثنائية وتستحق كل ريال.",
    initials: "خ",
  },
  {
    name: "سارة القحطاني",
    city: "جدة",
    date: "فبراير 2026",
    text: "كنت خايف إن السيرة ما تعدّي الـ ATS، بس بعد ما استخدمت CVfy وصلتني مقابلات من شركتين كبار.",
    initials: "س",
  },
  {
    name: "فيصل العنزي",
    city: "الدمام",
    date: "يناير 2026",
    text: "الـ AI غيّر صياغة خبراتي بشكل ما توقعته. الـ 99 ريال أفضل استثمار في مسيرتي المهنية.",
    initials: "ف",
  },
];

export default function HomeReviews() {
  return (
    <section className={HOME_GLASS_SECTION_CLASS} dir="rtl">
      <div className={HOME_GLASS_CONTAINER_CLASS}>
        <div className="mb-10 text-center">
          <span
            className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white/80"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            آراء عملاؤنا
          </span>
          <h2 className="text-[22px] font-extrabold text-white md:text-[26px]">
            ماذا قالوا عن CVfy؟
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {REVIEWS.map((review) => (
            <div
              key={review.name}
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: "20px",
                padding: "20px",
              }}
            >
              <p className="mb-3 text-sm text-[#FAC775]" aria-label="5 نجوم">
                ★★★★★
              </p>
              <p className="mb-5 text-sm leading-relaxed text-white/80">
                {review.text}
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[#0C447C]"
                  style={{ background: "rgba(255,255,255,0.85)" }}
                >
                  {review.initials}
                </div>
                <div className="text-xs">
                  <span className="block font-bold text-white">{review.name}</span>
                  <span className="text-white/50">
                    {review.city} · {review.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

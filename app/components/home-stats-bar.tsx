const STATS = [
  { value: "4,200+", label: "سيرة ذاتية أنجزناها" },
  { value: "94%", label: "متوافقة مع ATS" },
  { value: "3 دقائق", label: "متوسط وقت الإنجاز" },
];

export default function HomeStatsBar() {
  return (
    <section dir="rtl" className="px-6 md:px-12">
      <div className="mx-auto flex max-w-[1100px] flex-wrap justify-around gap-6 rounded-3xl bg-[#0C447C] px-5 py-7 text-center text-white">
        {STATS.map((stat) => (
          <div key={stat.label} className="min-w-[120px] flex-1">
            <p className="text-2xl font-extrabold md:text-3xl">{stat.value}</p>
            <p className="mt-1 text-xs text-[#85B7EB] md:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

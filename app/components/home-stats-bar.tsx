const STATS = [
  {
    value: "4,200+",
    label: "سيرة ذاتية أنجزناها",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <rect x="5" y="3" width="12" height="16" rx="2" stroke="white" strokeWidth="1.4" />
        <path
          d="M8 8h6M8 11h6M8 14h4"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    value: "94%",
    label: "متوافقة مع ATS",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="1.4" />
        <path
          d="M7.5 11l2.3 2.3 4.2-4.6"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    value: "3 دقائق",
    label: "متوسط وقت الإنجاز",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="1.4" />
        <path d="M11 6v5l3.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function HomeStatsBar() {
  return (
    <section dir="rtl">
      <div className="glass-surface mx-auto flex max-w-[1100px] flex-wrap justify-around gap-6 rounded-3xl px-5 py-7 text-center text-white">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex min-w-[120px] flex-1 flex-col items-center gap-1.5"
          >
            <span className="text-white/90">{stat.icon}</span>
            <p className="text-2xl font-extrabold md:text-3xl">{stat.value}</p>
            <p className="text-xs text-white/75 md:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

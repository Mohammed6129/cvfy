const STATS = [
  {
    value: "4,200+",
    label: "سيرة ذاتية أنجزناها",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
        <circle cx="18" cy="18" r="18" fill="#85B7EB" />
        <rect x="11" y="8" width="14" height="20" rx="2" fill="white" />
        <path
          d="M14 14h8M14 17.5h8M14 21h5"
          stroke="#0C447C"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    value: "94%",
    label: "متوافقة مع ATS",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
        <circle cx="18" cy="18" r="18" fill="#C0DD97" />
        <path
          d="M11 18l4.5 4.5 9.5-10"
          stroke="#27500A"
          strokeWidth="2.8"
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
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
        <circle cx="18" cy="18" r="18" fill="#FAC775" />
        <circle cx="18" cy="18" r="10" stroke="#854F0B" strokeWidth="2" />
        <path
          d="M18 12.5v6l4 2.5"
          stroke="#854F0B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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
            className="flex min-w-[120px] flex-1 flex-col items-center gap-2"
          >
            <span className="mb-2.5">{stat.icon}</span>
            <p className="text-2xl font-extrabold md:text-3xl">{stat.value}</p>
            <p className="text-xs text-white/75 md:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

import { Fragment } from "react";

const STATS = [
  { value: "4,200+", valueColor: "#0C447C", label: "سيرة ذاتية أنجزناها" },
  { value: "94%", valueColor: "#378ADD", label: "متوافقة مع ATS" },
  { value: "3 دقائق", valueColor: "#D97706", label: "متوسط وقت الإنجاز" },
];

export default function StatsBar() {
  return (
    <section className="border-y border-[#EEF3FA] bg-[#F8FAFE]">
      <div className="mx-auto max-w-[1100px] px-6 py-5 md:px-12">
        <div className="flex flex-wrap items-center justify-center gap-12">
          {STATS.map((stat, index) => (
            <Fragment key={stat.label}>
              {index > 0 && (
                <div
                  className="hidden h-8 w-px shrink-0 bg-[#E6F1FB] sm:block"
                  aria-hidden
                />
              )}
              <div className="text-center">
                <p
                  className="text-[22px] font-extrabold leading-tight"
                  style={{ color: stat.valueColor }}
                >
                  {stat.value}
                </p>
                <p className="text-xs text-[#888]">{stat.label}</p>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

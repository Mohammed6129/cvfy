const COMPANIES = ["أرامكو", "STC", "stc pay", "الراجحي", "NEOM", "الجوازات", "PIF"];

export default function CompanyBar() {
  return (
    <section className="border-y border-[#EEF3FA] bg-[#F8FAFE]">
      <div className="mx-auto max-w-[1100px] px-6 py-5 md:px-12">
        <p className="mb-3 text-center text-xs text-[#999]">عملاؤنا وجدوا وظائف في:</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {COMPANIES.map((name) => (
            <span
              key={name}
              className="rounded-full border border-[#E8EDF5] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#555]"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

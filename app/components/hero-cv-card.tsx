const SKILLS = ["React", "Node.js", "Python", "AWS"];

function MailIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
      <rect x="0.5" y="1.5" width="7" height="5" rx="0.5" stroke="#85B7EB" strokeWidth="0.8" />
      <path d="M0.5 2L4 4.5L7.5 2" stroke="#85B7EB" strokeWidth="0.8" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
      <circle cx="4" cy="2.5" r="1.5" stroke="#85B7EB" strokeWidth="0.8" />
      <path d="M1 7c0-1.7 1.3-3 3-3s3 1.3 3 3" stroke="#85B7EB" strokeWidth="0.8" />
    </svg>
  );
}

function CvBar({ width }: { width: string }) {
  return <div className={`h-1 rounded-full bg-[#CBD5E1] ${width}`} />;
}

export default function HeroCvCard() {
  return (
    <div
      className="w-full overflow-hidden rounded-xl border border-[#C8DCF0] bg-white shadow-lg"
      dir="ltr"
      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      <div className="bg-[#1a2e4a] px-3 py-2.5">
        <p className="text-[11px] font-bold text-white">Faisal Ali</p>
        <p className="text-[9px] text-[#85B7EB]">Senior Software Engineer</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[7px] text-[#85B7EB]">
          <span className="inline-flex items-center gap-0.5">
            <MailIcon />
            faisal@email.com
          </span>
          <span>|</span>
          <span className="inline-flex items-center gap-0.5">
            <PersonIcon />
            Riyadh, KSA
          </span>
        </div>
      </div>

      <div className="space-y-2.5 px-3 py-2.5">
        <div>
          <p className="mb-1 text-[7px] font-bold tracking-wide text-[#0C447C]">
            PROFESSIONAL SUMMARY
          </p>
          <div className="space-y-0.5">
            <CvBar width="w-[90%]" />
            <CvBar width="w-[80%]" />
            <CvBar width="w-[60%]" />
          </div>
        </div>

        <div>
          <p className="mb-1 text-[7px] font-bold tracking-wide text-[#0C447C]">
            WORK EXPERIENCE
          </p>
          <div className="mb-1.5">
            <p className="text-[7px] font-bold text-[#0C447C]">Senior Software Engineer</p>
            <p className="text-[6px] text-[#64748b]">Saudi Aramco · 2021 — Present</p>
            <div className="mt-0.5 space-y-0.5">
              <CvBar width="w-full" />
              <CvBar width="w-4/5" />
            </div>
          </div>
          <div>
            <p className="text-[7px] font-bold text-[#0C447C]">Software Developer</p>
            <p className="text-[6px] text-[#64748b]">STC · 2018 — 2021</p>
            <div className="mt-0.5 space-y-0.5">
              <CvBar width="w-full" />
              <CvBar width="w-11/12" />
            </div>
          </div>
        </div>

        <div>
          <p className="mb-1 text-[7px] font-bold tracking-wide text-[#0C447C]">SKILLS</p>
          <div className="flex flex-wrap gap-1">
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="rounded bg-[#EEF5FC] px-1 py-0.5 text-[6px] font-semibold text-[#378ADD]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

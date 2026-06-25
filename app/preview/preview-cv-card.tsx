import type { GeneratedCv } from "@/lib/cv-types";

function MailIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
      <rect x="0.5" y="1.5" width="8" height="6" rx="0.5" stroke="#85B7EB" strokeWidth="0.8" />
      <path d="M0.5 2.5L4.5 5L8.5 2.5" stroke="#85B7EB" strokeWidth="0.8" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
      <path
        d="M2 1.5h2l0.8 2L3.5 4.5c0.6 1.2 1.8 2.4 3 3l1-1.3 2 0.8V8.5H7C3.7 8.5 1 5.8 1 2.5V1.5h1Z"
        stroke="#85B7EB"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
      <path
        d="M4.5 1C3 1 1.8 2.2 1.8 3.7C1.8 5.5 4.5 8 4.5 8C4.5 8 7.2 5.5 7.2 3.7C7.2 2.2 6 1 4.5 1Z"
        stroke="#85B7EB"
        strokeWidth="0.8"
      />
      <circle cx="4.5" cy="3.7" r="0.8" fill="#85B7EB" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <rect x="4" y="10" width="14" height="10" rx="2" fill="#378ADD" />
      <path d="M7 10V7a4 4 0 018 0v3" stroke="#378ADD" strokeWidth="2" strokeLinecap="round" />
      <circle cx="11" cy="15" r="1.5" fill="white" />
    </svg>
  );
}

function CvBar({ width }: { width: string }) {
  return <div className={`h-1 rounded-full bg-[#CBD5E1] ${width}`} />;
}

type PreviewCvCardProps = {
  cv: GeneratedCv;
  isPaid?: boolean;
};

export default function PreviewCvCard({ cv, isPaid = false }: PreviewCvCardProps) {
  const content = cv.contentEn ?? cv.content;
  const experiences = content.experiences.slice(0, 2);
  const skills = content.skills.slice(0, 6);

  return (
    <div className="relative overflow-hidden rounded-[20px] border border-[#E0EDF8] bg-white">
      {/* ── Always visible: header + summary ── */}
      <header className="bg-[#1a2e4a] px-4 py-3.5">
        <h2 className="text-sm font-bold text-white">{cv.name}</h2>
        {content.headline && (
          <p className="mt-0.5 text-xs text-[#85B7EB]">{content.headline}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-[#85B7EB]">
          {cv.email && (
            <span className="inline-flex items-center gap-1">
              <MailIcon />
              {cv.email}
            </span>
          )}
          {cv.phone && (
            <span className="inline-flex items-center gap-1">
              <PhoneIcon />
              {cv.phone}
            </span>
          )}
          {cv.city && (
            <span className="inline-flex items-center gap-1">
              <LocationIcon />
              {cv.city}
            </span>
          )}
        </div>
      </header>

      {/* Summary — always visible */}
      <div
        className="px-4 pt-3.5"
        dir="ltr"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        <div className="pb-3">
          <p className="mb-1.5 text-[8px] font-bold tracking-wide text-[#0C447C]">
            PROFESSIONAL SUMMARY
          </p>
          <div className="space-y-1">
            <CvBar width="w-full" />
            <CvBar width="w-[92%]" />
            <CvBar width="w-[85%]" />
            <CvBar width="w-[70%]" />
          </div>
        </div>
      </div>

      {/* ── Rest: blurred if not paid ── */}
      <div className="relative">
        <div
          className={`px-4 pb-3.5 transition-all duration-300 ${isPaid ? "" : "pointer-events-none select-none blur-[3px]"}`}
          dir="ltr"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          aria-hidden={!isPaid}
        >
          {experiences.length > 0 && (
            <div className="mb-3">
              <p className="mb-1.5 text-[8px] font-bold tracking-wide text-[#0C447C]">
                WORK EXPERIENCE
              </p>
              <div className="space-y-2">
                {experiences.map((exp, index) => (
                  <div key={`${exp.jobTitle}-${index}`}>
                    <p className="text-[8px] font-bold text-[#0C447C]">{exp.jobTitle}</p>
                    <p className="text-[7px] text-[#64748b]">
                      {exp.company}
                      {exp.period ? ` · ${exp.period}` : ""}
                    </p>
                    <div className="mt-1 space-y-0.5">
                      <CvBar width="w-full" />
                      <CvBar width="w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills.length > 0 && (
            <div className="mb-3">
              <p className="mb-1.5 text-[8px] font-bold tracking-wide text-[#0C447C]">SKILLS</p>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded bg-[#EEF5FC] px-1.5 py-0.5 text-[7px] font-semibold text-[#378ADD]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Filler sections to give depth */}
          <div className="mb-3">
            <p className="mb-1.5 text-[8px] font-bold tracking-wide text-[#0C447C]">EDUCATION</p>
            <CvBar width="w-3/4" />
            <div className="mt-1"><CvBar width="w-1/2" /></div>
          </div>
          <div>
            <p className="mb-1.5 text-[8px] font-bold tracking-wide text-[#0C447C]">CERTIFICATIONS</p>
            <CvBar width="w-2/3" />
            <div className="mt-1"><CvBar width="w-1/2" /></div>
          </div>
        </div>

        {/* Paywall overlay — shown when not paid */}
        {!isPaid && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-b-[20px] text-center"
            style={{
              background: "linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.95) 40%)",
              backdropFilter: "blur(2px)",
            }}
          >
            <LockIcon />
            <p className="text-[13px] font-extrabold text-[#0C447C]">
              سيرتك جاهزة — ادفع لتحميلها كاملة
            </p>
            <p className="max-w-[200px] text-[10px] leading-relaxed text-[#64748b]">
              الملخص المهني ظاهر. الخبرات والمهارات والتعليم تظهر بعد الدفع.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

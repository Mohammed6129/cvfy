import { SAMPLE_BEFORE } from "@/lib/cv/sample";

/**
 * The product in one glance: a line the way people actually talk about
 * their job, and the same facts the way a recruiter wants to read them.
 * The highlighter strokes sweep in once on load.
 */
export default function HeroDemo() {
  const hl = (text: string, order: number) => (
    <mark className="hl hl-animate" style={{ animationDelay: `${0.7 + order * 0.22}s` }}>
      {text}
    </mark>
  );

  return (
    <div className="rounded-[1.5rem] bg-desk p-4 sm:p-6">
      <p className="t-small mb-2 font-medium text-ink">أنت تكتب</p>
      <p className="t-hand rounded-[var(--radius-control)] rounded-ss-sm border border-rule bg-paper px-4 py-3 text-[1.0625rem] leading-[2] text-ink">
        {SAMPLE_BEFORE}
      </p>

      <div className="my-3 flex justify-center text-mute" aria-hidden>
        <svg width="24" height="28" viewBox="0 0 24 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v21M5 17l7 7 7-7" />
        </svg>
      </div>

      <p className="t-small mb-2 font-medium text-ink">CVfy يسلّمك</p>
      <div
        dir="ltr"
        lang="en"
        className="paper px-5 py-5 text-start text-[0.8125rem] leading-[1.6] text-[#1f2937] sm:px-7 sm:text-[0.875rem]"
        style={{ fontFamily: 'Helvetica, Arial, "Liberation Sans", sans-serif' }}
      >
        <p className="border-b border-[#c9d0dc] pb-1 text-[1.05em] font-bold text-[#0f1b3d]">Work Experience</p>
        <div className="mt-2 flex items-baseline justify-between gap-3">
          <p className="font-bold text-[#0f1b3d]">Customer Service Representative</p>
          <p className="shrink-0 text-[0.9em] text-[#4b5563]">Mar 2022 – Present</p>
        </div>
        <ul className="mt-1 space-y-1">
          <li className="flex gap-2">
            <span aria-hidden>•</span>
            <span>
              Resolve 40+ {hl("customer inquiries", 0)} daily across phone and chat, with a focus on {hl("billing", 1)} disputes.
            </span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden>•</span>
            <span>
              Built an {hl("Excel", 2)} {hl("complaint", 3)} tracker that gave the team one shared view of open cases.
            </span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden>•</span>
            <span>Trained 6 new agents on billing procedures and the {hl("CRM", 4)} workflow.</span>
          </li>
        </ul>
      </div>

      <p className="t-small mt-3 flex items-start gap-2">
        <span className="mt-[0.45em] inline-block h-2.5 w-6 shrink-0 rounded-sm bg-marker" aria-hidden />
        <span>المظلّل: كلمات يبحث عنها إعلان الوظيفة. والأرقام كلها من كلامك — ما نألّف شي من عندنا.</span>
      </p>
    </div>
  );
}

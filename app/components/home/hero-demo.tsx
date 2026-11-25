import { runAtsCheck } from "@/lib/ats/check";
import { SAMPLE_BEFORE, SAMPLE_EN } from "@/lib/cv/sample";

/**
 * The product in one glance: what the user types, the CV section it becomes,
 * and the ATS result of that sample (computed by the real checker, not typed in).
 * Matched keywords light up once on load.
 */
export default function HeroDemo() {
  const score = runAtsCheck(SAMPLE_EN, null, { fromJobAd: false }).score;
  const job = SAMPLE_EN.experience[0];

  const hl = (text: string, order: number) => (
    <mark
      className="hl hl-animate"
      style={{ animationDelay: `${0.6 + order * 0.2}s` }}
    >
      {text}
    </mark>
  );

  return (
    <div>
      <div className="rounded-[1.5rem] bg-desk p-4 sm:p-6">
        {/* What the user writes */}
        <div className="flex items-start gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[0.8125rem] font-semibold text-brand-deep"
            aria-hidden
          >
            أنت
          </span>
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-[0.8125rem] font-medium text-graphite">
              كتبت بأسلوبك:
            </p>
            <p className="rounded-[var(--radius-control)] rounded-ss-sm bg-paper px-4 py-3 text-[0.9375rem] leading-[1.95] text-ink shadow-[0_1px_2px_rgb(11_27_58/0.06)]">
              {SAMPLE_BEFORE}
            </p>
          </div>
        </div>

        <p className="my-3 flex items-center justify-center gap-2 text-[0.8125rem] font-medium text-brand-deep">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 4v16M6 14l6 6 6-6" />
          </svg>
          CVfy كتبها كذا
        </p>

        <div className="relative">
          {/* The CV section it becomes */}
          <div
            dir="ltr"
            lang="en"
            className="paper px-5 pb-20 pt-5 text-start text-[0.8125rem] leading-[1.6] text-[#1f2937] sm:px-7 sm:text-[0.875rem]"
            style={{
              fontFamily: 'Helvetica, Arial, "Liberation Sans", sans-serif',
            }}
          >
            <p className="text-[1.35em] font-bold leading-tight text-[#0f1b3d]">
              {SAMPLE_EN.name}
            </p>
            <p className="mt-0.5 text-[0.95em] text-[#374151]">
              {SAMPLE_EN.headline}
            </p>
            <p className="mt-4 border-b border-[#c9d0dc] pb-1 text-[1.02em] font-bold text-[#0f1b3d]">
              Work Experience
            </p>
            <div className="mt-2 flex items-baseline justify-between gap-3">
              <p className="font-bold text-[#0f1b3d]">{job.title}</p>
              <p className="shrink-0 text-[0.9em] text-[#4b5563]">
                {job.period}
              </p>
            </div>
            <ul className="mt-1 space-y-1">
              <li className="flex gap-2">
                <span aria-hidden>•</span>
                <span>
                  Resolve 40+ {hl("customer inquiries", 0)} daily across phone
                  and chat, with a focus on {hl("billing", 1)} disputes.
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden>•</span>
                <span>
                  Built an {hl("Excel", 2)} {hl("complaint", 3)} tracker that
                  gave the team one shared view of open cases.
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden>•</span>
                <span>
                  Trained 6 new agents on billing procedures and the{" "}
                  {hl("CRM", 4)} workflow.
                </span>
              </li>
            </ul>
          </div>

          {/* The check result of this sample */}
          <div className="absolute bottom-3 start-3 flex items-center gap-3 rounded-[var(--radius-control)] border border-rule bg-paper py-2 pe-4 ps-2 shadow-[var(--shadow-pop)] sm:bottom-4 sm:start-4">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full bg-ok-soft text-ok"
              aria-hidden
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
            <span className="leading-tight">
              <span className="block text-[0.75rem] text-graphite">
                فحص ATS لهذا المثال
              </span>
              <span className="block text-[1rem] font-bold text-ink">
                {score}{" "}
                <span className="text-[0.8125rem] font-medium text-graphite">
                  من 100
                </span>
              </span>
            </span>
          </div>
        </div>
      </div>
      <p className="t-small mt-4 flex items-start gap-2">
        <span
          className="mt-[0.5em] inline-block h-2.5 w-5 shrink-0 rounded-sm bg-marker"
          aria-hidden
        />
        <span>
          المظلّل: كلمات يبحث عنها إعلان الوظيفة. والأرقام كلها من كلامك، ما نألّف
          شي من عندنا.
        </span>
      </p>
    </div>
  );
}

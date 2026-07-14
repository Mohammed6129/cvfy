import { splitBullets } from "@/lib/cv-export";
import type { GeneratedCv } from "@/lib/cv-types";
import { SINGLE_PLAN } from "@/lib/payment";

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <rect x="4" y="10" width="14" height="10" rx="2" fill="#378ADD" />
      <path d="M7 10V7a4 4 0 018 0v3" stroke="#378ADD" strokeWidth="2" strokeLinecap="round" />
      <circle cx="11" cy="15" r="1.5" fill="white" />
    </svg>
  );
}

// Show only the opening of the summary before payment.
function truncateSummary(summary: string): string {
  const words = summary.split(/\s+/);
  if (words.length <= 28) return summary;
  return `${words.slice(0, 28).join(" ")}…`;
}

// Placeholder line standing in for locked text. The real content is never
// rendered in the DOM before payment, so it cannot be extracted via
// select-all/copy or the browser inspector.
function SkeletonLine({ width, bold = false }: { width: string; bold?: boolean }) {
  return (
    <div
      aria-hidden
      style={{
        height: bold ? "9px" : "7px",
        width,
        background: bold ? "#c3cbd5" : "#d8dde3",
        borderRadius: "4px",
        marginBottom: "7px",
      }}
    />
  );
}

function LockedSection({
  title,
  lines,
}: {
  title: string;
  lines: { width: string; bold?: boolean }[];
}) {
  return (
    <div aria-hidden>
      <h2 style={cvSectionTitle}>{title}</h2>
      {lines.map((line, i) => (
        <SkeletonLine key={i} width={line.width} bold={line.bold} />
      ))}
    </div>
  );
}

// Very light diagonal CVfy watermark, always BEHIND the text layer —
// screenshots keep the mark, reading is never obstructed.
function WatermarkLayer() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <div
        style={{
          position: "absolute",
          inset: "-30%",
          transform: "rotate(-30deg)",
          display: "flex",
          flexWrap: "wrap",
          gap: "110px",
          alignContent: "space-around",
          justifyContent: "space-around",
        }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            style={{
              fontSize: "30px",
              fontWeight: 800,
              color: "rgba(20,44,84,0.05)",
              whiteSpace: "nowrap",
              fontFamily: "Arial, sans-serif",
            }}
          >
            CVfy
          </span>
        ))}
      </div>
    </div>
  );
}

function TitleDateRow({ title, period }: { title: string; period?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
      <p style={{ margin: 0, fontWeight: "bold", color: "#000", fontSize: "10.5px" }}>{title}</p>
      {period && (
        <p style={{ margin: 0, color: "#000", fontSize: "9.5px", whiteSpace: "nowrap" }}>{period}</p>
      )}
    </div>
  );
}

type PreviewCvCardProps = {
  cv: GeneratedCv;
  isPaid?: boolean;
};

export default function PreviewCvCard({ cv, isPaid = false }: PreviewCvCardProps) {
  const content = cv.contentEn ?? cv.content;
  const experiences = content.experiences.slice(0, 3);

  return (
    <div
      className="relative ms-auto w-full max-w-[420px] overflow-hidden rounded-[10px]"
      style={{
        boxShadow: "0 20px 50px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.2)",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {/* ── Document card: clean black-on-white, matches the exported files ── */}
      <div
        dir="ltr"
        className="relative"
        style={{
          background: "#fff",
          color: "#000",
          fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
          padding: "24px",
        }}
      >
        <WatermarkLayer />

        {/* Text layer always above the watermark */}
        <div className="relative z-10">
          <header style={{ marginBottom: "14px" }}>
            <h1 style={{ margin: "0 0 3px", fontSize: "18px", fontWeight: "bold", color: "#000", textAlign: "left" }}>
              {cv.name}
            </h1>
            {content.headline && (
              <p style={{ fontSize: "11px", fontWeight: 600, margin: "0 0 3px", color: "#000" }}>
                {content.headline}
              </p>
            )}
            <p style={{ margin: 0, fontSize: "9.5px", color: "#000" }}>
              {[cv.city, cv.phone, cv.email, cv.linkedIn].filter(Boolean).join(" | ")}
            </p>
          </header>

          {content.summary && (
            <>
              <h2 style={cvSectionTitle}>Profile</h2>
              <p style={cvText}>
                {isPaid ? content.summary : truncateSummary(content.summary)}
              </p>
            </>
          )}

          {isPaid ? (
            <>
              {content.education.length > 0 && (
                <>
                  <h2 style={cvSectionTitle}>Education</h2>
                  {content.education.map((edu, index) => (
                    <div key={`${edu.degree}-${index}`} style={{ marginBottom: "8px" }}>
                      <TitleDateRow title={edu.degree} period={edu.period} />
                      {edu.institution && <p style={cvText}>{edu.institution}</p>}
                    </div>
                  ))}
                </>
              )}

              {content.skills.length > 0 && (
                <>
                  <h2 style={cvSectionTitle}>Skills</h2>
                  {content.skills.map((skill) => (
                    <p key={skill} style={cvText}>- {skill}</p>
                  ))}
                </>
              )}

              {experiences.length > 0 && (
                <>
                  <h2 style={cvSectionTitle}>Work Experience</h2>
                  {experiences.map((exp, index) => (
                    <div key={`${exp.jobTitle}-${index}`} style={{ marginBottom: "10px" }}>
                      <TitleDateRow title={exp.jobTitle} period={exp.period} />
                      {exp.company && (
                        <p style={{ ...cvText, fontStyle: "italic" }}>{exp.company}</p>
                      )}
                      {splitBullets(exp.description).map((bullet, i) => (
                        <p key={i} style={cvText}>- {bullet}</p>
                      ))}
                    </div>
                  ))}
                </>
              )}
            </>
          ) : (
            /* Locked preview (~70% of the card): layout shape only — the
               actual data never enters the DOM — with a real render-level
               blur on top of the skeleton shape. */
            <div aria-hidden style={{ filter: "blur(5px)", opacity: 0.85 }}>
              <LockedSection
                title="Education"
                lines={[
                  { width: "52%", bold: true },
                  { width: "64%" },
                ]}
              />
              <LockedSection
                title="Skills"
                lines={[
                  { width: "38%" },
                  { width: "46%" },
                  { width: "33%" },
                  { width: "42%" },
                  { width: "36%" },
                  { width: "48%" },
                ]}
              />
              <LockedSection
                title="Work Experience"
                lines={[
                  { width: "62%", bold: true },
                  { width: "40%" },
                  { width: "92%" },
                  { width: "85%" },
                  { width: "78%" },
                  { width: "55%", bold: true },
                  { width: "36%" },
                  { width: "90%" },
                  { width: "82%" },
                  { width: "74%" },
                ]}
              />
            </div>
          )}
        </div>
      </div>

      {!isPaid && (
        <div
          className="absolute left-1/2 z-20 flex w-[86%] -translate-x-1/2 flex-col items-center gap-2.5 rounded-2xl bg-white p-5 text-center"
          dir="rtl"
          style={{ bottom: "6%", boxShadow: "0 12px 30px rgba(0,0,0,0.25)" }}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6F1FB]">
            <LockIcon />
          </span>
          <h3 className="text-sm font-extrabold text-[#0C447C]">
            أكمل الدفع لعرض السيرة كاملة وتحميلها
          </h3>
          <span className="rounded-full bg-[#E6F1FB] px-4 py-1 text-xs font-extrabold text-[#185FA5]">
            {SINGLE_PLAN.price} ريال — دفعة واحدة
          </span>
        </div>
      )}
    </div>
  );
}

const cvSectionTitle: React.CSSProperties = {
  color: "#000",
  borderBottom: "1px solid #000",
  paddingBottom: "4px",
  margin: "14px 0 7px",
  fontSize: "11px",
  fontWeight: "bold",
};

const cvText: React.CSSProperties = {
  margin: "2px 0 0",
  color: "#000",
  lineHeight: 1.5,
  fontSize: "10px",
};

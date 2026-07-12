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

// Show only the opening of the summary before payment (2-3 lines).
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
        marginBottom: "6px",
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
    <div style={{ filter: "blur(2.5px)" }} aria-hidden>
      <h2 style={cvSectionTitle}>{title}</h2>
      {lines.map((line, i) => (
        <SkeletonLine key={i} width={line.width} bold={line.bold} />
      ))}
    </div>
  );
}

type PreviewCvCardProps = {
  cv: GeneratedCv;
  isPaid?: boolean;
};

export default function PreviewCvCard({ cv, isPaid = false }: PreviewCvCardProps) {
  const content = cv.contentEn ?? cv.content;
  const experiences = content.experiences.slice(0, 2);

  return (
    <div
      className="relative ms-auto w-full max-w-[420px] overflow-hidden rounded-[10px]"
      style={{
        boxShadow:
          "0 20px 50px rgba(0,0,0,0.35), 0 0 0 1px rgba(250,199,117,0.5), 0 0 26px rgba(250,199,117,0.22)",
        userSelect: isPaid ? "auto" : "none",
        WebkitUserSelect: isPaid ? "auto" : "none",
      }}
    >
      {/* ── Real CV document — matches buildCvHtml exactly ── */}
      <div
        dir="ltr"
        style={{
          background: "#fff",
          color: "#000",
          fontFamily: '"Times New Roman", Times, serif',
          padding: "22px",
        }}
      >
        <header style={{ textAlign: "center", borderBottom: "1px solid #000", paddingBottom: "14px", marginBottom: "14px" }}>
          <h1 style={{ margin: "0 0 6px", fontSize: "19px", color: "#000" }}>{cv.name}</h1>
          {content.headline && (
            <p style={{ fontSize: "11.5px", fontWeight: 600, margin: "0 0 8px", color: "#000" }}>{content.headline}</p>
          )}
          <p style={{ margin: 0, fontSize: "10px", color: "#000" }}>
            {[cv.email, cv.phone, cv.city].filter(Boolean).join(" · ")}
          </p>
        </header>

        {content.summary && (
          <>
            <h2 style={cvSectionTitle}>الملخص المهني / Professional Summary</h2>
            <p style={cvText}>
              {isPaid ? content.summary : truncateSummary(content.summary)}
            </p>
          </>
        )}

        {isPaid ? (
          <>
            {experiences.length > 0 && (
              <>
                <h2 style={cvSectionTitle}>الخبرات العملية / Work Experience</h2>
                {experiences.map((exp, index) => (
                  <div key={`${exp.jobTitle}-${index}`} style={{ marginBottom: "10px" }}>
                    <p style={{ margin: 0, fontWeight: "bold", color: "#000", fontSize: "10.5px" }}>
                      {exp.jobTitle}
                      {exp.company ? ` — ${exp.company}` : ""}
                    </p>
                    {exp.period && <p style={{ margin: "2px 0", fontSize: "9.5px", color: "#000" }}>{exp.period}</p>}
                    {exp.description && <p style={cvText}>{exp.description}</p>}
                  </div>
                ))}
              </>
            )}

            {content.education.length > 0 && (
              <>
                <h2 style={cvSectionTitle}>التعليم / Education</h2>
                <p style={cvText}>
                  <strong>{content.education[0].degree}</strong>
                </p>
                <p style={cvText}>
                  {[content.education[0].institution, content.education[0].period].filter(Boolean).join(" · ")}
                </p>
              </>
            )}

            {content.skills.length > 0 && (
              <>
                <h2 style={cvSectionTitle}>المهارات / Skills</h2>
                <p style={cvText}>{content.skills.join(" • ")}</p>
              </>
            )}
          </>
        ) : (
          /* Locked preview: layout shape only — actual data never enters the DOM */
          <div className="relative">
            <LockedSection
              title="الخبرات العملية / Work Experience"
              lines={[
                { width: "62%", bold: true },
                { width: "30%" },
                { width: "100%" },
                { width: "88%" },
                { width: "55%", bold: true },
                { width: "28%" },
                { width: "94%" },
                { width: "70%" },
              ]}
            />
            <LockedSection
              title="التعليم / Education"
              lines={[
                { width: "48%", bold: true },
                { width: "64%" },
              ]}
            />
            <LockedSection
              title="المهارات / Skills"
              lines={[
                { width: "96%" },
                { width: "58%" },
              ]}
            />
          </div>
        )}
      </div>

      {!isPaid && (
        <div
          className="absolute left-1/2 z-10 flex w-[86%] -translate-x-1/2 flex-col items-center gap-2.5 rounded-2xl bg-white p-5 text-center"
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
  paddingBottom: "5px",
  margin: "14px 0 8px",
  fontSize: "10.5px",
  fontWeight: "bold",
};

const cvText: React.CSSProperties = {
  margin: "0 0 5px",
  color: "#000",
  lineHeight: 1.5,
  fontSize: "10.5px",
};

import type { GeneratedCv } from "@/lib/cv-types";

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <rect x="4" y="10" width="14" height="10" rx="2" fill="#378ADD" />
      <path d="M7 10V7a4 4 0 018 0v3" stroke="#378ADD" strokeWidth="2" strokeLinecap="round" />
      <circle cx="11" cy="15" r="1.5" fill="white" />
    </svg>
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
      }}
    >
      <span className="absolute left-2.5 top-2.5 z-10 rounded-full px-2.5 py-1 text-[10px] font-extrabold text-[#142c54]" style={{ background: "linear-gradient(135deg, #FAC775, #F0A93E)" }}>
        ★ AI مدعوم
      </span>

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
            <p style={cvText}>{content.summary}</p>
          </>
        )}

        {/* ── Rest of the document: blurred if not paid ── */}
        <div className="relative">
          <div
            className={`transition-all duration-300 ${isPaid ? "" : "pointer-events-none select-none blur-[3px]"}`}
            aria-hidden={!isPaid}
          >
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
          </div>

          {!isPaid && (
            <div
              className="absolute inset-x-0 bottom-0"
              style={{
                height: "70%",
                backdropFilter: "blur(6px)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent, black 35%)",
                maskImage: "linear-gradient(to bottom, transparent, black 35%)",
                background: "rgba(255,255,255,0.35)",
              }}
              aria-hidden
            />
          )}
        </div>
      </div>

      {!isPaid && (
        <div
          className="absolute left-1/2 z-10 flex w-[86%] -translate-x-1/2 flex-col items-center gap-2.5 rounded-2xl bg-white p-5 text-center"
          style={{ bottom: "6%", boxShadow: "0 12px 30px rgba(0,0,0,0.25)" }}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6F1FB]">
            <LockIcon />
          </span>
          <h3 className="text-sm font-extrabold text-[#0C447C]">سيرتك الذاتية جاهزة، خطوة وحدة تفصلك عنها</h3>
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

import type { GeneratedCv, Language } from "@/lib/cv-types";

const SECTION_LABELS: Record<
  Exclude<Language, "" | "both">,
  {
    summary: string;
    experience: string;
    education: string;
    skills: string;
    courses: string;
  }
> = {
  arabic: {
    summary: "الملخص المهني",
    experience: "الخبرات العملية",
    education: "التعليم",
    skills: "المهارات",
    courses: "الدورات والشهادات",
  },
  english: {
    summary: "Professional Summary",
    experience: "Work Experience",
    education: "Education",
    skills: "Skills",
    courses: "Courses & Certifications",
  },
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 border-b-2 border-[#378ADD] pb-1.5 text-base font-bold uppercase tracking-wide text-[#378ADD] sm:text-lg">
      {children}
    </h2>
  );
}

type ClassicCvTemplateProps = {
  cv: GeneratedCv;
};

export default function ClassicCvTemplate({ cv }: ClassicCvTemplateProps) {
  const { content } = cv;
  const isEnglish = cv.language === "english";
  const labels = isEnglish ? SECTION_LABELS.english : SECTION_LABELS.arabic;

  return (
    <article
      className="cv-document mx-auto max-w-[210mm] bg-white text-[13px] leading-relaxed text-slate-800 sm:text-sm"
      dir={isEnglish ? "ltr" : "rtl"}
    >
      <header className="mb-6 border-b-2 border-slate-200 pb-5 text-center sm:mb-8 sm:pb-6">
        <h1 className="mb-1 text-2xl font-extrabold tracking-tight text-[#378ADD] sm:text-3xl md:text-4xl">
          {cv.name}
        </h1>
        {content.headline && (
          <p className="mb-3 text-base font-semibold text-slate-700 sm:text-lg">
            {content.headline}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600 sm:text-sm">
          {cv.city && <span>{cv.city}</span>}
          {cv.phone && (
            <span dir="ltr" className="inline-block">
              {cv.phone}
            </span>
          )}
          {cv.email && (
            <span dir="ltr" className="inline-block">
              {cv.email}
            </span>
          )}
        </div>
      </header>

      {content.summary && (
        <section className="mb-6 sm:mb-7">
          <SectionTitle>{labels.summary}</SectionTitle>
          <p className="text-justify leading-7 text-slate-700">
            {content.summary}
          </p>
        </section>
      )}

      {content.experiences.length > 0 && (
        <section className="mb-6 sm:mb-7">
          <SectionTitle>{labels.experience}</SectionTitle>
          <div className="space-y-5">
            {content.experiences.map((exp, index) => (
              <div key={`${exp.jobTitle}-${index}`}>
                <div className="mb-1 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                    {exp.jobTitle}
                    {exp.company && (
                      <span className="font-semibold text-slate-600">
                        {isEnglish ? " at " : " — "}
                        {exp.company}
                      </span>
                    )}
                  </h3>
                  {exp.period && (
                    <span
                      dir="ltr"
                      className="shrink-0 text-xs font-medium text-slate-500"
                    >
                      {exp.period}
                    </span>
                  )}
                </div>
                {exp.description && (
                  <p className="text-justify leading-6 text-slate-700">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {content.education.length > 0 && (
        <section className="mb-6 sm:mb-7">
          <SectionTitle>{labels.education}</SectionTitle>
          <div className="space-y-3">
            {content.education.map((edu, index) => (
              <div
                key={`${edu.degree}-${index}`}
                className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <div>
                  <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                  {edu.institution && (
                    <p className="text-slate-600">{edu.institution}</p>
                  )}
                </div>
                {edu.period && (
                  <span dir="ltr" className="text-xs text-slate-500">
                    {edu.period}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {content.skills.length > 0 && (
        <section className="mb-6 sm:mb-7">
          <SectionTitle>{labels.skills}</SectionTitle>
          <p className="leading-7 text-slate-700">
            {content.skills.join(isEnglish ? " • " : " • ")}
          </p>
        </section>
      )}

      {content.courses.length > 0 && (
        <section>
          <SectionTitle>{labels.courses}</SectionTitle>
          <div className="space-y-2">
            {content.courses.map((course, index) => (
              <div
                key={`${course.name}-${index}`}
                className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">{course.name}</h3>
                  {course.provider && (
                    <p className="text-xs text-slate-600">{course.provider}</p>
                  )}
                </div>
                {course.year && (
                  <span dir="ltr" className="text-xs text-slate-500">
                    {course.year}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

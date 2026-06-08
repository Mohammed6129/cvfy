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
    summary: "الوصف الذاتي",
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
    <h2 className="mb-4 border-b-2 border-[#378ADD] pb-2 text-lg font-bold text-[#378ADD]">
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
      className="cv-document mx-auto max-w-[210mm] bg-white text-slate-800"
      dir={isEnglish ? "ltr" : "rtl"}
    >
      <header className="mb-8 border-b border-slate-200 pb-6 text-center">
        <h1 className="mb-2 text-3xl font-extrabold text-[#378ADD] sm:text-4xl">
          {cv.name}
        </h1>
        {content.headline && (
          <p className="mb-4 text-lg font-semibold text-slate-700">
            {content.headline}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600">
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
        <section className="mb-8">
          <SectionTitle>{labels.summary}</SectionTitle>
          <p className="leading-relaxed text-slate-700">{content.summary}</p>
        </section>
      )}

      {content.experiences.length > 0 && (
        <section className="mb-8">
          <SectionTitle>{labels.experience}</SectionTitle>
          <div className="space-y-6">
            {content.experiences.map((exp, index) => (
              <div key={`${exp.jobTitle}-${index}`}>
                <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {exp.jobTitle}
                    {exp.company && (
                      <span className="font-semibold text-slate-600">
                        {" "}
                        — {exp.company}
                      </span>
                    )}
                  </h3>
                  {exp.period && (
                    <span
                      dir="ltr"
                      className="shrink-0 text-sm text-slate-500"
                    >
                      {exp.period}
                    </span>
                  )}
                </div>
                {exp.description && (
                  <p className="leading-relaxed text-slate-700">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {content.education.length > 0 && (
        <section className="mb-8">
          <SectionTitle>{labels.education}</SectionTitle>
          <div className="space-y-4">
            {content.education.map((edu, index) => (
              <div
                key={`${edu.degree}-${index}`}
                className="flex flex-wrap items-baseline justify-between gap-2"
              >
                <div>
                  <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                  {edu.institution && (
                    <p className="text-slate-600">{edu.institution}</p>
                  )}
                </div>
                {edu.period && (
                  <span dir="ltr" className="text-sm text-slate-500">
                    {edu.period}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {content.skills.length > 0 && (
        <section className="mb-8">
          <SectionTitle>{labels.skills}</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {content.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-[#e8f2fc] px-3 py-1.5 text-sm font-medium text-[#378ADD]"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {content.courses.length > 0 && (
        <section>
          <SectionTitle>{labels.courses}</SectionTitle>
          <div className="space-y-3">
            {content.courses.map((course, index) => (
              <div
                key={`${course.name}-${index}`}
                className="flex flex-wrap items-baseline justify-between gap-2"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">{course.name}</h3>
                  {course.provider && (
                    <p className="text-sm text-slate-600">{course.provider}</p>
                  )}
                </div>
                {course.year && (
                  <span dir="ltr" className="text-sm text-slate-500">
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

import type { ReactNode } from "react";
import type { GeneratedCv, GeneratedCvContent } from "@/lib/cv-types";

const SECTION_LABELS = {
  summary: "Professional Summary",
  experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  courses: "Courses & Certifications",
};

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="cv-section-title mb-3 border-b border-black pb-1 text-sm font-bold uppercase tracking-wide text-black">
      {children}
    </h2>
  );
}

function pickEnglishContent(cv: GeneratedCv): GeneratedCvContent {
  return cv.contentEn ?? cv.content;
}

type EnglishCvTemplateProps = {
  cv: GeneratedCv;
};

export default function EnglishCvTemplate({ cv }: EnglishCvTemplateProps) {
  const content = pickEnglishContent(cv);

  return (
    <article
      className="cv-document mx-auto max-w-[210mm] bg-white font-serif text-[13px] leading-relaxed text-black sm:text-sm"
      dir="ltr"
      style={{ fontFamily: '"Times New Roman", Times, serif' }}
    >
      <header className="mb-6 border-b border-black pb-5 text-center sm:mb-8 sm:pb-6">
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-black sm:text-3xl md:text-4xl">
          {cv.name}
        </h1>
        {content.headline && (
          <p className="mb-3 text-base font-semibold text-black sm:text-lg">
            {content.headline}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-black sm:text-sm">
          {cv.email && <span>{cv.email}</span>}
          {cv.phone && <span>{cv.phone}</span>}
          {cv.city && <span>{cv.city}</span>}
          {cv.linkedIn && <span>{cv.linkedIn}</span>}
        </div>
      </header>

      {content.summary && (
        <section className="mb-6 sm:mb-7">
          <SectionTitle>{SECTION_LABELS.summary}</SectionTitle>
          <p className="text-justify leading-7 text-black">{content.summary}</p>
        </section>
      )}

      {content.experiences.length > 0 && (
        <section className="mb-6 sm:mb-7">
          <SectionTitle>{SECTION_LABELS.experience}</SectionTitle>
          <div className="space-y-5">
            {content.experiences.map((exp, index) => (
              <div key={`${exp.jobTitle}-${index}`}>
                <div className="mb-1 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-sm font-bold text-black sm:text-base">
                    {exp.jobTitle}
                    {exp.company && (
                      <span className="font-semibold text-black">
                        {" — "}
                        {exp.company}
                      </span>
                    )}
                  </h3>
                  {exp.period && (
                    <span className="shrink-0 text-xs font-medium text-black">
                      {exp.period}
                    </span>
                  )}
                </div>
                {exp.description && (
                  <p className="whitespace-pre-line text-justify leading-6 text-black">
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
          <SectionTitle>{SECTION_LABELS.education}</SectionTitle>
          <div className="space-y-3">
            {content.education.map((edu, index) => (
              <div
                key={`${edu.degree}-${index}`}
                className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <div>
                  <h3 className="font-bold text-black">{edu.degree}</h3>
                  {edu.institution && (
                    <p className="text-black">{edu.institution}</p>
                  )}
                </div>
                {edu.period && (
                  <span className="text-xs text-black">{edu.period}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {content.skills.length > 0 && (
        <section className="mb-6 sm:mb-7">
          <SectionTitle>{SECTION_LABELS.skills}</SectionTitle>
          <p className="leading-7 text-black">{content.skills.join(" • ")}</p>
        </section>
      )}

      {content.courses.length > 0 && (
        <section>
          <SectionTitle>{SECTION_LABELS.courses}</SectionTitle>
          <div className="space-y-2">
            {content.courses.map((course, index) => (
              <div
                key={`${course.name}-${index}`}
                className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-black">{course.name}</h3>
                  {course.provider && (
                    <p className="text-xs text-black">{course.provider}</p>
                  )}
                </div>
                {course.year && (
                  <span className="text-xs text-black">{course.year}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

import type { ReactNode } from "react";
import { LOCK } from "@/lib/cv/lock";
import type { CvDoc } from "@/lib/cv/types";

const TITLES = {
  en: {
    summary: "Professional Summary",
    experience: "Work Experience",
    projects: "Projects",
    education: "Education",
    skills: "Skills",
    certificates: "Certifications",
    languages: "Languages",
  },
  ar: {
    summary: "الملخص المهني",
    experience: "الخبرات العملية",
    projects: "المشاريع",
    education: "التعليم",
    skills: "المهارات",
    certificates: "الشهادات والدورات",
    languages: "اللغات",
  },
};

type CvSheetProps = {
  doc: CvDoc;
  /** Terms to mark with the highlighter (matched job keywords). */
  highlight?: string[];
  /** Animate the highlighter strokes in (hero only). */
  animateHighlight?: boolean;
  className?: string;
};

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * The CV as it will print, drawn in HTML so it is crisp on every screen.
 * Mirrors the PDF layout one-to-one. All sizes are in `em`, so the sheet
 * scales with the font-size of its container.
 */
export default function CvSheet({ doc, highlight = [], animateHighlight = false, className = "" }: CvSheetProps) {
  const rtl = doc.lang === "ar";
  const t = TITLES[doc.lang];
  const sep = rtl ? "، " : ", ";
  const terms = highlight.filter((term) => term.trim().length > 1);
  const pattern = terms.length
    ? new RegExp(`(${terms.sort((a, b) => b.length - a.length).map(escapeRegExp).join("|")})`, "gi")
    : null;
  let markIndex = 0;

  const mark = (text: string): ReactNode => {
    if (!pattern) return text;
    const parts = text.split(pattern);
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <mark
          key={i}
          className={`hl ${animateHighlight ? "hl-animate" : ""}`}
          style={animateHighlight ? { animationDelay: `${0.9 + markIndex++ * 0.18}s` } : undefined}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  /** Real text is shown as-is; anything after the lock marker is blurred filler. */
  const txt = (value: string): ReactNode => {
    const at = value.indexOf(LOCK);
    if (at === -1) return mark(value);
    return (
      <>
        {at > 0 ? mark(value.slice(0, at)) : null}
        <span className="locked-text" aria-hidden>
          {value.slice(at + 1)}
        </span>
      </>
    );
  };

  const Heading = ({ children }: { children: ReactNode }) => (
    <h3 className="mb-[0.5em] mt-[1.15em] border-b border-[#c9d0dc] pb-[0.25em] text-[1.08em] font-bold leading-snug text-[#0f1b3d]">
      {children}
    </h3>
  );

  const Bullets = ({ items }: { items: string[] }) => (
    <ul className="mt-[0.2em] space-y-[0.15em]">
      {items.map((item, i) => (
        <li key={i} className="flex gap-[0.6em]">
          <span className="shrink-0 text-[#4b5563]" aria-hidden>•</span>
          <span className="min-w-0">{txt(item)}</span>
        </li>
      ))}
    </ul>
  );

  const experience = doc.experience.length > 0 && (
    <section>
      <Heading>{t.experience}</Heading>
      {doc.experience.map((x, i) => (
        <div key={i} className="mb-[0.7em]">
          <div className="flex items-baseline justify-between gap-[1em]">
            <p className="font-bold text-[#0f1b3d]">{x.title}</p>
            <p className="shrink-0 text-[0.92em] text-[#4b5563]">{x.period}</p>
          </div>
          <p className="text-[0.97em] text-[#4b5563]">{x.company}</p>
          <Bullets items={x.bullets} />
        </div>
      ))}
    </section>
  );

  const projects = doc.projects.length > 0 && (
    <section>
      <Heading>{t.projects}</Heading>
      {doc.projects.map((p, i) => (
        <div key={i} className="mb-[0.7em]">
          <p className="font-bold text-[#0f1b3d]">{p.name}</p>
          <Bullets items={p.bullets} />
        </div>
      ))}
    </section>
  );

  const education = doc.education.length > 0 && (
    <section>
      <Heading>{t.education}</Heading>
      {doc.education.map((e, i) => (
        <div key={i} className="mb-[0.5em]">
          <div className="flex items-baseline justify-between gap-[1em]">
            <p className="font-bold text-[#0f1b3d]">{e.degree}</p>
            <p className="shrink-0 text-[0.92em] text-[#4b5563]">{e.year}</p>
          </div>
          <p className="text-[0.97em] text-[#4b5563]">{[e.institution, e.detail].filter(Boolean).join(" — ")}</p>
        </div>
      ))}
    </section>
  );

  return (
    <article
      dir={rtl ? "rtl" : "ltr"}
      lang={doc.lang}
      className={`paper px-[3.4em] py-[3em] text-start leading-[1.55] text-[#1f2937] ${className}`}
      style={{
        fontFamily: rtl ? "var(--font-cv)" : 'Helvetica, Arial, "Liberation Sans", sans-serif',
        lineHeight: rtl ? 1.75 : 1.5,
      }}
    >
      <header>
        <h2 className="text-[2em] font-bold leading-tight text-[#0f1b3d]">{doc.name}</h2>
        {doc.headline && <p className="mt-[0.15em] text-[1.12em] text-[#0f1b3d]">{doc.headline}</p>}
        <p className="mt-[0.35em] text-[0.9em] text-[#4b5563]">
          {doc.contact.map((part, i) => (
            <span key={i} className="inline-block whitespace-nowrap">
              {i > 0 && <span className="mx-[0.6em] text-[#c9d0dc]">|</span>}
              <bdi>{part}</bdi>
            </span>
          ))}
        </p>
      </header>

      {doc.summary && (
        <section>
          <Heading>{t.summary}</Heading>
          <p>{txt(doc.summary)}</p>
        </section>
      )}

      {doc.educationFirst ? (
        <>
          {education}
          {projects}
          {experience}
        </>
      ) : (
        <>
          {experience}
          {projects}
          {education}
        </>
      )}

      {doc.skills.length > 0 && (
        <section>
          <Heading>{t.skills}</Heading>
          {doc.skills.map((g, i) => (
            <p key={i} className="mb-[0.2em]">
              {g.label && <span className="font-bold text-[#0f1b3d]">{g.label}: </span>}
              {g.items.map((item, ii) => (
                <span key={ii}>
                  {ii > 0 && sep}
                  {txt(item)}
                </span>
              ))}
            </p>
          ))}
        </section>
      )}

      {doc.certificates.length > 0 && (
        <section>
          <Heading>{t.certificates}</Heading>
          {doc.certificates.map((c, i) => (
            <p key={i} className="mb-[0.2em]">
              <span className="font-bold text-[#0f1b3d]">{c.name}</span>
              {[c.issuer, c.year].filter(Boolean).length > 0 && ` — ${[c.issuer, c.year].filter(Boolean).join(sep)}`}
            </p>
          ))}
        </section>
      )}

      {doc.languages.length > 0 && (
        <section>
          <Heading>{t.languages}</Heading>
          <p>{doc.languages.map((l) => (l.level ? `${l.name} (${l.level})` : l.name)).join(sep)}</p>
        </section>
      )}
    </article>
  );
}

import { callJson, isMockMode, MODELS, WRITER_EFFORT } from "./client";
import { mockWrite } from "./mock";
import {
  cityIn,
  DEGREES,
  formatPeriod,
  LANGUAGE_LEVELS,
  residencyLine,
  totalExperienceMonths,
} from "@/lib/cv/form";
import { cleanLine, cleanList } from "@/lib/cv/text";
import type { CvDoc, CvForm, CvLang, Interview } from "@/lib/cv/types";

/* ───────────── What the model returns ───────────── */

export type WriterOutput = {
  /** The candidate's name in the output language (transliterated when only the other script was given). */
  name: string;
  headline: string;
  summary: string;
  experience: { refId: string; title: string; company: string; bullets: string[] }[];
  projects: { name: string; bullets: string[] }[];
  education: { refId: string; degree: string; institution: string }[];
  skills: { label: string; items: string[] }[];
  certificates: { refId: string; name: string; issuer: string }[];
  missingKeywords: string[];
};

const str = { type: "string" };
const strList = { type: "array", items: str };

const WRITER_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "name",
    "headline",
    "summary",
    "experience",
    "projects",
    "education",
    "skills",
    "certificates",
    "missingKeywords",
  ],
  properties: {
    name: str,
    headline: str,
    summary: str,
    experience: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["refId", "title", "company", "bullets"],
        properties: { refId: str, title: str, company: str, bullets: strList },
      },
    },
    projects: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "bullets"],
        properties: { name: str, bullets: strList },
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["refId", "degree", "institution"],
        properties: { refId: str, degree: str, institution: str },
      },
    },
    skills: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "items"],
        properties: { label: str, items: strList },
      },
    },
    certificates: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["refId", "name", "issuer"],
        properties: { refId: str, name: str, issuer: str },
      },
    },
    missingKeywords: strList,
  },
};

/* ───────────── The brief ───────────── */

const SHARED_RULES = `You are a senior CV writer who has spent years placing candidates with Saudi employers — Aramco, SABIC, stc, the banks, PIF companies, ministries and fast-growing SMEs — and you know how their recruiters and applicant tracking systems (SAP SuccessFactors, Oracle Recruiting, Workday, Jadarat) screen applications. You are writing ONE CV for ONE candidate targeting ONE job.

The candidate's notes are raw: often Saudi dialect, unstructured, and modest about real achievements. Do what a paid professional does in a one-hour session: find the real accomplishment inside each casual sentence and state it the way a hiring manager wants to read it. A candidate who could have produced your output by pasting their notes into a chatbot has been short-changed.

# Truth — never break these
- Use only facts present in the input: employers, titles, dates, numbers, tools, degrees, certificates, answers to the interview questions.
- Never invent a number, a tool, an employer, a certificate, a team size or a result. If no number was given, write a strong bullet without one. Never output placeholders such as "X%" or "[number]".
- You may make an implied fact explicit ("I answered customers all day" → handled customer inquiries) and choose stronger accurate wording. You may not raise seniority or scope.
- Interview answers are the best material you have — every concrete number or tool in them must appear in the CV.
- A job keyword may appear only where the candidate's input supports it. Put every job keyword you could not honestly support into missingKeywords, spelled exactly as given.

# Name
- name: the candidate's full name in the output language. If candidate.name is given, copy it exactly. If only candidate.nameInOtherScript is given, write it in the output language the way Saudi names are officially spelled (محمد عبدالله القحطاني → Mohammed Abdullah Alqahtani; Sarah Alotaibi → سارة العتيبي).

# Tailoring
- Read the target job and keywords first. Order bullets and skills by relevance to THAT job, not by how the candidate listed them.
- Use the job's own terms (exact spelling) wherever the candidate truly has that experience — ATS matching is literal.
- headline: the target job title, optionally followed by one specialization after " | " (max 8 words in total).

# Summary
3 sentences, 45–65 words. Sentence 1: who they are — title, years of experience (use experienceYears; if it is 0, say graduate/student of the field instead and do not mention years), field or industry. Sentence 2: their two strongest proofs, with numbers when the input has them. Sentence 3: what they bring to the target role, using 2–3 job keywords. No objectives ("seeking a challenging position"), no unproven adjectives.

# Experience
- Return one entry per input experience, same refId. Keep the employer and title truthful; you may only normalize them (see Saudi-market rules).
- 3–5 bullets for each of the two most recent roles; 2–3 for older ones. Training and volunteering: 2–3 bullets.
- Each bullet: action + what + scale or result. One sentence, 12–26 words. Strongest and most job-relevant bullet first.
- Do not pad with duties anyone in that role performs. Merge small duties into one bullet. Never repeat the same opening word within a role.

# Projects
- Only when the input has projects (common for students and fresh graduates). 2–3 bullets each: what was built or done, with which tools, and the outcome.

# Skills
- 2–4 groups with short labels, 8–14 items in total. Hard skills and tools first. At most 3 soft skills, and only ones the notes demonstrate.
- Start from the candidate's own list (often empty — the form does not ask for one), add skills their notes and interview answers clearly demonstrate, and use the job-ad term when they have it.

# Education and certificates
- One entry per input item, same refId. degree = level + major written the official way. institution = official name.
- Certificates: official name and issuing body.

# Saudi-market rules
- Official names: "King Saud University", "Imam Abdulrahman Bin Faisal University", "Saudi Aramco", "Saudi Telecom Company (stc)", "Saudi Electricity Company". Programs and bodies by their known names: Tamheer, HRDF (Hadaf), Doroob, Qiwa, Mudad, GOSI, ZATCA, SOCPA, SCE, SCFHS, Jadarat.
- Tool and product names stay in Latin letters in both languages (Excel, SAP, Power BI).
- Never include photo, age, marital status, ID number, religion, or a references line.
- No emojis, no decorative symbols, no markdown. Plain text only.`;

const EN_RULES = `# Language — English
- The entire CV is in professional English, American spelling. No Arabic characters anywhere; transliterate Arabic names of small companies sensibly.
- Bullets: start with a strong verb, past tense for past roles, present tense for a current role. No first-person pronouns. End each bullet with a period.
- Banned phrases: "responsible for", "duties included", "worked on", "helped with", "hard-working", "team player", "detail-oriented", "passionate", "dynamic", "results-driven", "proven track record", "go-getter", "synergy", "utilize", "various", "etc."
- Skill group labels such as: "Technical Skills", "Tools & Systems", "Core Competencies".`;

const AR_RULES = `# Language — Arabic
- السيرة كاملة بالعربية الفصحى المهنية المبسطة. ممنوع اللهجة تماماً. أسماء الأدوات والأنظمة تبقى بحروفها اللاتينية (Excel، SAP).
- ابدأ كل نقطة خبرة بمصدر صريح قوي (إدارة، إعداد، تطوير، تنفيذ، تحليل، قيادة، تنسيق، تصميم، متابعة، معالجة). لا تستخدم ضمير المتكلم ("قمت"، "أدرتُ") ولا صيغة الغائب ("قاد"، "طوّر"). أنهِ كل نقطة بنقطة.
- الملخص المهني بصيغة اسمية بلا ضمائر: "محاسب بخبرة 4 سنوات في ..." أو "خريجة هندسة صناعية من جامعة ...".
- الأرقام تُكتب 0-9. النسبة تُكتب هكذا: 25%.
- حافظ على صيغة التذكير أو التأنيث كما كتبها المرشح في مسماه (محاسب / محاسبة).
- عبارات ممنوعة: "مسؤول عن"، "القيام بـ"، "العمل تحت الضغط"، "سريع التعلم"، "شغوف"، "طموح"، "روح الفريق"، "وغيرها".
- عناوين مجموعات المهارات مثل: "المهارات التقنية"، "الأنظمة والأدوات"، "المهارات المهنية".`;

function buildBrief(form: CvForm, interview: Interview | null, lang: CvLang) {
  const months = totalExperienceMonths(form.experience);
  const degree = (id: string) => DEGREES.find((d) => d.id === id);

  return {
    outputLanguage: lang === "ar" ? "Arabic" : "English",
    target: {
      jobTitleAsTyped: form.target.jobTitle,
      jobTitle: interview ? (lang === "ar" ? interview.job.titleAr : interview.job.titleEn) : form.target.jobTitle,
      careerLevel: form.target.level,
      experienceYears: Math.floor(months / 12),
    },
    jobAd: form.target.jobAd ? form.target.jobAd.slice(0, 3500) : null,
    jobKeywords: (interview?.job.keywords ?? []).map((k) => ({
      term: lang === "ar" ? k.ar : k.en,
      mustHave: k.must,
    })),
    candidate: {
      name: (lang === "ar" ? form.personal.nameAr : form.personal.nameEn) || null,
      nameInOtherScript: (lang === "ar" ? form.personal.nameAr : form.personal.nameEn)
        ? null
        : (lang === "ar" ? form.personal.nameEn : form.personal.nameAr) || null,
    },
    experience: form.experience.map((x) => ({
      refId: x.id,
      kind: x.kind,
      title: x.title,
      company: x.company,
      period: formatPeriod(x.start, x.end, x.current, "en"),
      isCurrent: x.current,
      notesInCandidateWords: x.description,
    })),
    projects: form.projects.map((p) => ({ name: p.name, notesInCandidateWords: p.description })),
    education: form.education.map((e) => ({
      refId: e.id,
      level: degree(e.level)?.en ?? e.level,
      major: e.major,
      institution: e.institution,
      graduationYear: e.year,
    })),
    skillsListedByCandidate: form.skills,
    certificates: form.certificates.map((c) => ({ refId: c.id, name: c.name, issuer: c.issuer, year: c.year })),
    extraNotes: form.notes || null,
    interviewAnswers: (interview?.questions ?? [])
      .map((q) => ({ question: q.question, answer: (interview?.answers[q.id] ?? "").trim() }))
      .filter((qa) => qa.answer),
  };
}

/* ───────────── Assemble the final document ───────────── */

/** Dates, contact line, languages and GPA come from the form — never from the model. */
export function assembleDoc(form: CvForm, out: WriterOutput, lang: CvLang): CvDoc {
  const p = form.personal;
  const isAr = lang === "ar";

  const contact = [
    cityIn(p.city, lang),
    p.phone,
    p.email,
    p.linkedIn,
    residencyLine(p.nationality, lang),
  ].filter(Boolean);

  const sortedForm = [...form.experience].sort((a, b) => {
    if (a.current !== b.current) return a.current ? -1 : 1;
    return (b.end || b.start).localeCompare(a.end || a.start);
  });

  const experience = sortedForm
    .map((x) => {
      const written = out.experience.find((w) => w.refId === x.id);
      if (!written) return null;
      const bullets = cleanList(written.bullets).slice(0, 5);
      if (bullets.length === 0) return null;
      return {
        refId: x.id,
        title: cleanLine(written.title) || x.title,
        company: cleanLine(written.company) || x.company,
        period: formatPeriod(x.start, x.end, x.current, lang),
        bullets,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const education = form.education.map((e) => {
    const written = out.education.find((w) => w.refId === e.id);
    const fallbackDegree = DEGREES.find((d) => d.id === e.level);
    return {
      degree:
        cleanLine(written?.degree ?? "") ||
        [isAr ? fallbackDegree?.ar : fallbackDegree?.en, e.major].filter(Boolean).join(isAr ? " " : " in "),
      institution: cleanLine(written?.institution ?? "") || e.institution,
      year: e.year,
      detail: e.gpa ? (isAr ? `المعدل: ${e.gpa}` : `GPA: ${e.gpa}`) : "",
    };
  });

  const certificates = form.certificates.map((c) => {
    const written = out.certificates.find((w) => w.refId === c.id);
    return {
      name: cleanLine(written?.name ?? "") || c.name,
      issuer: cleanLine(written?.issuer ?? "") || c.issuer,
      year: c.year,
    };
  });

  const level = (id: string) => {
    const hit = LANGUAGE_LEVELS.find((l) => l.id === id);
    return hit ? (isAr ? hit.ar : hit.en) : "";
  };

  // Cap skills so the section stays scannable.
  let budget = 16;
  const skills = out.skills
    .map((group) => {
      const items = cleanList(group.items).slice(0, Math.max(0, budget));
      budget -= items.length;
      return { label: cleanLine(group.label), items };
    })
    .filter((g) => g.items.length > 0)
    .slice(0, 4);

  return {
    lang,
    name: (isAr ? p.nameAr : p.nameEn) || cleanLine(out.name) || (isAr ? p.nameEn : p.nameAr),
    headline: cleanLine(out.headline) || form.target.jobTitle,
    contact,
    summary: cleanLine(out.summary),
    experience,
    projects: out.projects
      .map((pr) => ({ name: cleanLine(pr.name), bullets: cleanList(pr.bullets).slice(0, 3) }))
      .filter((pr) => pr.name && pr.bullets.length > 0)
      .slice(0, 4),
    education,
    skills,
    certificates,
    languages: [
      { name: isAr ? "العربية" : "Arabic", level: level(form.languages.arabic) },
      { name: isAr ? "الإنجليزية" : "English", level: level(form.languages.english) },
    ],
    educationFirst: form.target.level === "student" || form.target.level === "fresh" || experience.length === 0,
  };
}

/* ───────────── Public API ───────────── */

export async function writeCv(
  form: CvForm,
  interview: Interview | null,
  lang: CvLang,
  fixNotes?: string[]
): Promise<{ doc: CvDoc; missingKeywords: string[] }> {
  if (isMockMode()) {
    const out = mockWrite(form, lang);
    return { doc: assembleDoc(form, out, lang), missingKeywords: out.missingKeywords };
  }

  const brief = buildBrief(form, interview, lang);
  const fix = fixNotes?.length
    ? `\n\nA quality check on your previous draft found these problems. Fix every one of them in this version:\n${fixNotes.map((n) => `- ${n}`).join("\n")}`
    : "";

  const out = await callJson<WriterOutput>({
    model: MODELS.writer,
    effort: WRITER_EFFORT,
    // Generous ceiling: thinking tokens count toward it, and a truncated CV is useless.
    maxTokens: 16000,
    system: `${SHARED_RULES}\n\n${lang === "ar" ? AR_RULES : EN_RULES}`,
    user: `Write the CV in ${brief.outputLanguage} from this brief. Return JSON only.${fix}\n\n${JSON.stringify(brief, null, 2)}`,
    schema: WRITER_SCHEMA,
  });

  return { doc: assembleDoc(form, out, lang), missingKeywords: cleanList(out.missingKeywords) };
}

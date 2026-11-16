/**
 * CVfy data model (v2).
 *
 * Three layers, kept strictly apart:
 *   1. CvForm      — what the user typed (any dialect, any quality).
 *   2. CvDoc       — one finished language version written by the AI.
 *   3. CvRecord    — what we store; the browser only ever receives a
 *                    CvView (redacted until paid).
 */

export type CvLang = "ar" | "en";

/** Career stage drives section order, tone and what the form asks for. */
export type CareerLevel = "student" | "fresh" | "junior" | "mid" | "senior";

export type FormExperience = {
  id: string;
  kind: "job" | "training" | "volunteer";
  title: string;
  company: string;
  /** YYYY-MM */
  start: string;
  /** YYYY-MM, or "" when `current` */
  end: string;
  current: boolean;
  /** Free text, in the user's own words. */
  description: string;
};

export type FormEducation = {
  id: string;
  level: "highschool" | "diploma" | "bachelor" | "master" | "phd" | "other";
  major: string;
  institution: string;
  /** Graduation year (or expected). */
  year: string;
  gpa: string;
};

export type FormCertificate = {
  id: string;
  name: string;
  issuer: string;
  year: string;
};

export type FormProject = {
  id: string;
  name: string;
  description: string;
};

export type LanguageLevel = "native" | "fluent" | "good" | "basic";

export type CvForm = {
  v: 2;
  /** Language of the CV generated first (and shown in the free preview). */
  primaryLang: CvLang;
  target: {
    jobTitle: string;
    level: CareerLevel;
    /** Pasted job ad — optional, powers keyword tailoring. */
    jobAd: string;
  };
  personal: {
    nameAr: string;
    nameEn: string;
    email: string;
    phone: string;
    city: string;
    nationality: string;
    linkedIn: string;
  };
  experience: FormExperience[];
  education: FormEducation[];
  projects: FormProject[];
  skills: string[];
  certificates: FormCertificate[];
  languages: { arabic: LanguageLevel; english: LanguageLevel };
  /** Anything the user wants highlighted. Optional. */
  notes: string;
};

/* ───────────── Interview (AI follow-up questions) ───────────── */

export type JobKeyword = {
  /** Canonical English term as it would appear in a job ad. */
  en: string;
  /** Arabic equivalent used in Arabic CVs. */
  ar: string;
  must: boolean;
};

export type JobProfile = {
  titleEn: string;
  titleAr: string;
  keywords: JobKeyword[];
};

export type InterviewQuestion = {
  id: string;
  question: string;
  /** Short example answer shown as placeholder. */
  example: string;
};

export type Interview = {
  job: JobProfile;
  questions: InterviewQuestion[];
  answers: Record<string, string>;
};

/* ───────────── Finished document ───────────── */

export type DocExperience = {
  /** Links back to FormExperience.id so dates stay exactly as entered. */
  refId: string;
  title: string;
  company: string;
  /** Preformatted period, e.g. "Feb 2024 – Present". Filled by code, not AI. */
  period: string;
  bullets: string[];
};

export type DocEducation = {
  degree: string;
  institution: string;
  year: string;
  detail: string;
};

export type DocProject = {
  name: string;
  bullets: string[];
};

export type DocSkillGroup = {
  label: string;
  items: string[];
};

export type DocCertificate = {
  name: string;
  issuer: string;
  year: string;
};

export type DocLanguage = {
  name: string;
  level: string;
};

export type CvDoc = {
  lang: CvLang;
  name: string;
  /** Line under the name: target title. */
  headline: string;
  /** City, phone, email, LinkedIn, nationality — already localized. */
  contact: string[];
  summary: string;
  experience: DocExperience[];
  projects: DocProject[];
  education: DocEducation[];
  skills: DocSkillGroup[];
  certificates: DocCertificate[];
  languages: DocLanguage[];
  /** True when education should come before experience (students / fresh grads). */
  educationFirst: boolean;
};

/* ───────────── ATS report ───────────── */

export type AtsCheck = {
  id: string;
  label: string;
  pass: boolean;
  /** Shown either way: what we found / what to do. */
  detail: string;
  weight: number;
};

export type AtsGroup = {
  id: "parse" | "structure" | "content" | "match";
  label: string;
  checks: AtsCheck[];
};

export type KeywordHit = {
  term: string;
  must: boolean;
  found: boolean;
};

export type AtsReport = {
  score: number;
  groups: AtsGroup[];
  keywords: KeywordHit[];
  /** Share of job keywords present in the CV, 0–100. */
  matchPercent: number;
  /** True when the user pasted a real job ad (vs. keywords inferred from the title). */
  fromJobAd: boolean;
};

/* ───────────── Extras (paid, full plan) ───────────── */

export type Extras = {
  coverLetter: Record<CvLang, string>;
  linkedInHeadline: string;
  linkedInAbout: string;
};

/* ───────────── Stored record ───────────── */

export type PlanId = "basic" | "full" | "upgrade";

export type CvStored = {
  v: 2;
  primaryLang: CvLang;
  docs: Partial<Record<CvLang, CvDoc>>;
  ats: Partial<Record<CvLang, AtsReport>>;
  extras: Extras | null;
  /** One raw→polished pair, safe to show before payment. */
  showcase: { before: string; after: string } | null;
  meta: {
    generations: number;
    createdAt: string;
    updatedAt: string;
    paidAt: string | null;
    /** "basic" = primary language only, "full" = everything. */
    plan: "basic" | "full" | null;
  };
};

/* ───────────── What the browser receives ───────────── */

export type CvView = {
  id: string;
  paid: boolean;
  plan: "basic" | "full" | null;
  primaryLang: CvLang;
  /** Languages that exist. Before payment only the primary one. */
  docs: Partial<Record<CvLang, CvDoc>>;
  /** When not paid, `docs` holds placeholder text in the locked slots. */
  locked: boolean;
  ats: Partial<Record<CvLang, AtsReport>>;
  extras: Extras | null;
  showcase: { before: string; after: string } | null;
  stats: { bullets: number; skills: number; words: number };
  generationsLeft: number;
  updatedAt: string;
};

export type CvListItem = {
  id: string;
  title: string;
  jobTitle: string;
  paid: boolean;
  plan: "basic" | "full" | null;
  hasDoc: boolean;
  score: number | null;
  updatedAt: string;
};

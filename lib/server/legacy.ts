/**
 * CVs created before the Nov 2026 rebuild were stored in a different shape.
 * This converts them so anyone who already paid can still open and download
 * their files with the new renderer.
 */
import { cleanLine } from "@/lib/cv/text";
import type { CvDoc, CvLang, CvStored } from "@/lib/cv/types";

type LegacyContent = {
  headline?: string;
  summary?: string;
  experiences?: { jobTitle?: string; company?: string; period?: string; description?: string }[];
  education?: { degree?: string; institution?: string; period?: string }[];
  skills?: string[];
  courses?: { name?: string; provider?: string; year?: string }[];
};

type LegacyCv = {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  linkedIn?: string;
  content?: LegacyContent;
  contentEn?: LegacyContent;
};

function toDoc(cv: LegacyCv, content: LegacyContent, lang: CvLang): CvDoc {
  return {
    lang,
    name: cv.name ?? "",
    headline: cleanLine(content.headline),
    contact: [cv.city, cv.phone, cv.email, cv.linkedIn].filter((v): v is string => Boolean(v)),
    summary: cleanLine(content.summary),
    experience: (content.experiences ?? []).map((x, i) => ({
      refId: `legacy-${i}`,
      title: cleanLine(x.jobTitle),
      company: cleanLine(x.company),
      period: cleanLine(x.period),
      bullets: (x.description ?? "")
        .split(/[•\n]/)
        .map((b) => cleanLine(b))
        .filter(Boolean),
    })),
    projects: [],
    education: (content.education ?? []).map((e) => ({
      degree: cleanLine(e.degree),
      institution: cleanLine(e.institution),
      year: cleanLine(e.period),
      detail: "",
    })),
    skills: content.skills?.length
      ? [{ label: lang === "ar" ? "المهارات" : "Skills", items: content.skills.map((s) => cleanLine(s)).filter(Boolean) }]
      : [],
    certificates: (content.courses ?? [])
      .filter((c) => c.name)
      .map((c) => ({ name: cleanLine(c.name), issuer: cleanLine(c.provider), year: cleanLine(c.year) })),
    languages: [],
    educationFirst: false,
  };
}

export function legacyToStored(raw: unknown, updatedAt: string, isPaid: boolean): CvStored | null {
  const cv = raw as LegacyCv | null;
  if (!cv?.content || typeof cv.content !== "object") return null;

  const docs: CvStored["docs"] = { ar: toDoc(cv, cv.content, "ar") };
  if (cv.contentEn) docs.en = toDoc(cv, cv.contentEn, "en");

  return {
    v: 2,
    primaryLang: docs.en ? "en" : "ar",
    docs,
    ats: {},
    extras: null,
    showcase: null,
    meta: {
      generations: 99, // legacy CVs are read-only; edits start a new CV
      createdAt: updatedAt,
      updatedAt,
      paidAt: isPaid ? updatedAt : null,
      plan: isPaid ? "full" : null,
    },
  };
}

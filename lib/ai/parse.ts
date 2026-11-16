import { callJson, isMockMode, MODELS } from "./client";
import { cleanForm, emptyForm, newId } from "@/lib/cv/form";
import type { CvForm } from "@/lib/cv/types";

type ParsedCv = {
  jobTitle: string;
  nameAr: string;
  nameEn: string;
  email: string;
  phone: string;
  city: string;
  linkedIn: string;
  experience: {
    kind: string;
    title: string;
    company: string;
    start: string;
    end: string;
    current: boolean;
    description: string;
  }[];
  education: { level: string; major: string; institution: string; year: string; gpa: string }[];
  projects: { name: string; description: string }[];
  skills: string[];
  certificates: { name: string; issuer: string; year: string }[];
};

const str = { type: "string" };
const obj = (properties: Record<string, unknown>) => ({
  type: "object",
  additionalProperties: false,
  required: Object.keys(properties),
  properties,
});

const SCHEMA = obj({
  jobTitle: str,
  nameAr: str,
  nameEn: str,
  email: str,
  phone: str,
  city: str,
  linkedIn: str,
  experience: {
    type: "array",
    items: obj({
      kind: { type: "string", enum: ["job", "training", "volunteer"] },
      title: str,
      company: str,
      start: str,
      end: str,
      current: { type: "boolean" },
      description: str,
    }),
  },
  education: {
    type: "array",
    items: obj({
      level: { type: "string", enum: ["highschool", "diploma", "bachelor", "master", "phd", "other"] },
      major: str,
      institution: str,
      year: str,
      gpa: str,
    }),
  },
  projects: { type: "array", items: obj({ name: str, description: str }) },
  skills: { type: "array", items: str },
  certificates: { type: "array", items: obj({ name: str, issuer: str, year: str }) },
});

const SYSTEM = `You extract the contents of a CV into structured data. The CV text was pulled from a PDF or Word file, so lines may be out of order and Arabic text may have broken letter order — repair obvious extraction damage.

Rules:
- Copy facts faithfully. Do not improve, summarize or invent anything. Leave a field as an empty string when the CV does not state it.
- jobTitle: the person's current or most recent professional title.
- nameAr: the name in Arabic script if the CV has it, else empty. nameEn: the name in Latin script if the CV has it, else empty.
- city: city only, in Arabic if it is a Saudi city (e.g. "الرياض").
- phone: digits with country code if present.
- experience: newest first. start/end as YYYY-MM (use YYYY when the month is unknown). current = true when the role is ongoing, with end empty. description: all bullets and sentences of that role joined with newlines, in their original language.
- kind: "training" for internships, co-op and Tamheer; "volunteer" for volunteering; otherwise "job".
- education.year: graduation year as YYYY.
- skills: individual skills, one per item, max 25.`;

/** Turn raw text from an uploaded CV into a pre-filled form. */
export async function parseCvText(text: string): Promise<CvForm> {
  const base = emptyForm();

  if (isMockMode()) {
    return cleanForm({
      ...base,
      target: { ...base.target, jobTitle: "أخصائي موارد بشرية" },
      personal: { ...base.personal, nameAr: "سارة محمد العتيبي", nameEn: "Sarah Alotaibi", email: "sarah@example.com", phone: "0551234567", city: "الرياض" },
      experience: [
        { id: newId(), kind: "job", title: "منسقة موارد بشرية", company: "شركة المراعي", start: "2022-03", end: "", current: true, description: "متابعة ملفات الموظفين والتوظيف وإعداد التقارير الشهرية" },
      ],
      skills: ["Excel", "التوظيف", "قوى"],
    });
  }

  const parsed = await callJson<ParsedCv>({
    model: MODELS.fast,
    effort: "low",
    maxTokens: 10000,
    system: SYSTEM,
    user: `Extract this CV. Return JSON only.\n\n<cv>\n${text.slice(0, 14000)}\n</cv>`,
    schema: SCHEMA,
  });

  return cleanForm({
    ...base,
    target: { ...base.target, jobTitle: parsed.jobTitle },
    personal: {
      ...base.personal,
      nameAr: parsed.nameAr,
      nameEn: parsed.nameEn,
      email: parsed.email,
      phone: parsed.phone,
      city: parsed.city,
      linkedIn: parsed.linkedIn,
    },
    experience: parsed.experience.map((x) => ({
      id: newId(),
      kind: x.kind === "training" || x.kind === "volunteer" ? x.kind : "job",
      title: x.title,
      company: x.company,
      start: x.start,
      end: x.end,
      current: x.current,
      description: x.description,
    })),
    education: parsed.education.map((e) => ({
      id: newId(),
      level: e.level as CvForm["education"][number]["level"],
      major: e.major,
      institution: e.institution,
      year: e.year,
      gpa: e.gpa,
    })),
    projects: parsed.projects.map((p) => ({ id: newId(), name: p.name, description: p.description })),
    skills: parsed.skills,
    certificates: parsed.certificates.map((c) => ({ id: newId(), name: c.name, issuer: c.issuer, year: c.year })),
  });
}

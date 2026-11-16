import { callJson, isMockMode, MODELS } from "./client";
import { mockInterview } from "./mock";
import { formatPeriod } from "@/lib/cv/form";
import { cleanLine } from "@/lib/cv/text";
import type { CvForm, InterviewQuestion, JobProfile } from "@/lib/cv/types";

type InterviewOutput = {
  job: JobProfile;
  questions: { question: string; example: string }[];
};

const str = { type: "string" };

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["job", "questions"],
  properties: {
    job: {
      type: "object",
      additionalProperties: false,
      required: ["titleEn", "titleAr", "keywords"],
      properties: {
        titleEn: str,
        titleAr: str,
        keywords: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["en", "ar", "must"],
            properties: { en: str, ar: str, must: { type: "boolean" } },
          },
        },
      },
    },
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["question", "example"],
        properties: { question: str, example: str },
      },
    },
  },
};

const SYSTEM = `You are a career coach in Saudi Arabia about to write a client's CV. Before writing, you do two things every good CV writer does.

# 1. Profile the target job
- titleEn / titleAr: the standard professional title for the job the client is targeting (Arabic title in the same gender the client used).
- keywords: 10–16 terms a recruiter or ATS would search for when filling this role. If a job ad is provided, take them from the ad using its exact wording — hard skills, tools, systems, certifications, domain terms. If no ad is provided, use the standard terms for this title in the Saudi market. No soft-skill filler ("communication", "teamwork") unless the ad stresses it.
- Each keyword has the English term (en) and the natural Arabic equivalent (ar). Tool and system names stay in Latin letters in both.
- must = true for the 4–7 terms that are clearly required.

# 2. Ask the client 3–5 questions
Ask only what would most improve the CV. In priority order:
a) Numbers missing from their strongest work: how many, how much, how often, what size, what changed (customers per day, team size, budget, reports per month, time saved, sales achieved).
b) A must-have keyword their notes do not evidence — ask whether they have it and where they used it.
c) Tools or systems they used but did not name.
For students and fresh graduates, ask about the graduation project, training, and anything they led or organized.

Rules for the questions:
- Written in light Saudi dialect — warm, simple, the way a helpful friend who works in HR would ask. Example tone: "في شغلك مع شركة X، كم عميل تقريباً كنت تخدم باليوم؟"
- One thing per question. Answerable in one short line from memory.
- Refer to the specific employer or project by name.
- Never ask for something already in the notes. Never ask yes/no-only questions; ask كم / وش / كيف / وين.
- No more than 5 questions. Fewer is fine when the notes are already rich.
- example: a realistic one-line sample answer in the same dialect, with a number in it. It is shown as a placeholder, so it must not be about the client's actual data.`;

function buildBrief(form: CvForm) {
  return {
    targetJob: form.target.jobTitle,
    careerLevel: form.target.level,
    jobAd: form.target.jobAd ? form.target.jobAd.slice(0, 3500) : null,
    experience: form.experience.map((x) => ({
      kind: x.kind,
      title: x.title,
      company: x.company,
      period: formatPeriod(x.start, x.end, x.current, "en"),
      notes: x.description,
    })),
    projects: form.projects.map((p) => ({ name: p.name, notes: p.description })),
    education: form.education.map((e) => ({ level: e.level, major: e.major, institution: e.institution, year: e.year })),
    skills: form.skills,
    certificates: form.certificates.map((c) => c.name),
    extraNotes: form.notes || null,
  };
}

export async function runInterview(
  form: CvForm
): Promise<{ job: JobProfile; questions: InterviewQuestion[] }> {
  const out = isMockMode()
    ? mockInterview(form)
    : await callJson<InterviewOutput>({
        model: MODELS.writer,
        effort: "low",
        maxTokens: 8000,
        system: SYSTEM,
        user: `Profile the job and write the questions for this client. Return JSON only.\n\n${JSON.stringify(buildBrief(form), null, 2)}`,
        schema: SCHEMA,
      });

  const keywords = out.job.keywords
    .map((k) => ({ en: cleanLine(k.en), ar: cleanLine(k.ar) || cleanLine(k.en), must: Boolean(k.must) }))
    .filter((k) => k.en)
    .slice(0, 16);

  return {
    job: {
      titleEn: cleanLine(out.job.titleEn) || form.target.jobTitle,
      titleAr: cleanLine(out.job.titleAr) || form.target.jobTitle,
      keywords,
    },
    questions: out.questions
      .map((q, i) => ({ id: `q${i + 1}`, question: cleanLine(q.question), example: cleanLine(q.example) }))
      .filter((q) => q.question)
      .slice(0, 5),
  };
}

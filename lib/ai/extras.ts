import { callJson, isMockMode, MODELS } from "./client";
import type { CvDoc, CvForm, Extras } from "@/lib/cv/types";

type ExtrasOutput = {
  coverLetterEn: string;
  coverLetterAr: string;
  linkedInHeadline: string;
  linkedInAbout: string;
};

const str = { type: "string" };

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["coverLetterEn", "coverLetterAr", "linkedInHeadline", "linkedInAbout"],
  properties: {
    coverLetterEn: str,
    coverLetterAr: str,
    linkedInHeadline: str,
    linkedInAbout: str,
  },
};

const SYSTEM = `You write the short texts a job seeker in Saudi Arabia sends alongside their CV. You are given the finished CV; use only facts that are in it.

coverLetterEn — the message pasted into an email or an application form. 90–130 words, 3 short paragraphs: (1) the role they are applying for and who they are in one line; (2) the two most relevant proofs from the CV, with numbers when available; (3) availability for an interview and a thank-you. Starts with "Dear Hiring Manager," and ends with "Best regards," and the candidate's name. No clichés, no "I am writing to express my interest".

coverLetterAr — the same message in formal Arabic, written natively (not translated line by line). Starts with "السلام عليكم ورحمة الله وبركاته،" and ends with "وتقبلوا خالص التحية،" and the candidate's Arabic name. Suitable for email or WhatsApp to an HR contact.

linkedInHeadline — in English, max 110 characters: title | specialization | 2–3 core skills. No "seeking opportunities".

linkedInAbout — in English, first person, 70–110 words, plain paragraphs, no emojis. Who they are, what they have done (with numbers), what they are good at, what they are looking for.

Plain text only. Use line breaks between paragraphs.`;

export async function writeExtras(
  form: CvForm,
  docs: { en?: CvDoc; ar?: CvDoc }
): Promise<Extras> {
  if (isMockMode()) {
    return {
      coverLetter: {
        en: `Dear Hiring Manager,\n\nI am applying for the ${form.target.jobTitle} role. This is sample text shown in local development.\n\nBest regards,\n${form.personal.nameEn}`,
        ar: `السلام عليكم ورحمة الله وبركاته،\n\nأتقدم لوظيفة ${form.target.jobTitle}. هذا نص تجريبي يظهر في بيئة التطوير.\n\nوتقبلوا خالص التحية،\n${form.personal.nameAr}`,
      },
      linkedInHeadline: `${form.target.jobTitle} | Sample headline`,
      linkedInAbout: "Sample LinkedIn summary shown in local development.",
    };
  }

  const source = docs.en ?? docs.ar;
  const out = await callJson<ExtrasOutput>({
    model: MODELS.writer,
    effort: "low",
    maxTokens: 8000,
    system: SYSTEM,
    user: `Target job: ${form.target.jobTitle}\nCandidate name (English): ${form.personal.nameEn}\nCandidate name (Arabic): ${form.personal.nameAr}\n\nFinished CV:\n${JSON.stringify(source, null, 2)}\n\nReturn JSON only.`,
    schema: SCHEMA,
  });

  return {
    coverLetter: { en: out.coverLetterEn.trim(), ar: out.coverLetterAr.trim() },
    linkedInHeadline: out.linkedInHeadline.trim().slice(0, 220),
    linkedInAbout: out.linkedInAbout.trim(),
  };
}

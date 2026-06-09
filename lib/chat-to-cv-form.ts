import type { CvFormData, Language } from "@/lib/cv-types";

export type ChatAnswers = {
  name: string;
  jobTitle: string;
  experience: string;
  education: string;
  courses: string;
  skills: string;
  selfDescription: string;
  language: Language;
};

function newId() {
  return Math.random().toString(36).slice(2, 11);
}

function splitList(text: string): string[] {
  return text
    .split(/[,،、\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function isSkippedAnswer(text: string): boolean {
  const normalized = text.trim().toLowerCase();
  return (
    !normalized ||
    normalized === "لا" ||
    normalized === "no" ||
    normalized === "none" ||
    normalized === "مافي" ||
    normalized === "ما عندي"
  );
}

export function chatAnswersToFormData(
  answers: ChatAnswers,
  email: string
): CvFormData {
  const courses = isSkippedAnswer(answers.courses)
    ? []
    : splitList(answers.courses).map((name) => ({
        id: newId(),
        name,
        provider: "",
        date: "",
        year: "",
      }));

  const skills = splitList(answers.skills).map((name) => ({
    id: newId(),
    name,
  }));

  return {
    language: "both",
    name: answers.name.trim(),
    currentJobTitle: answers.jobTitle.trim(),
    city: "",
    phone: "",
    email: email.trim(),
    linkedIn: "",
    selfDescription: answers.selfDescription.trim(),
    workExperience: [
      {
        id: newId(),
        jobTitle: answers.jobTitle.trim(),
        company: "",
        department: "",
        startDate: "",
        endDate: "",
        description: answers.experience.trim(),
      },
    ],
    education: [
      {
        id: newId(),
        degree: answers.education.trim(),
        institution: "",
        startDate: "",
        endDate: "",
      },
    ],
    skills: skills.length > 0 ? skills : [{ id: newId(), name: "" }],
    courses:
      courses.length > 0
        ? courses
        : [{ id: newId(), name: "", provider: "", date: "", year: "" }],
  };
}

import type { CvFormData } from "@/lib/cv-types";
import { normalizeLinkedInUrl } from "@/lib/linkedin";

export function prepareCvPayload(data: CvFormData): CvFormData {
  return {
    language: data.language,
    name: data.name.trim(),
    currentJobTitle: data.currentJobTitle.trim(),
    city: data.city.trim(),
    phone: data.phone.trim(),
    email: data.email.trim(),
    linkedIn: normalizeLinkedInUrl(data.linkedIn),
    selfDescription: data.selfDescription.trim(),
    workExperience: data.workExperience
      .filter(
        (item) =>
          item.jobTitle.trim() ||
          item.company.trim() ||
          item.department?.trim() ||
          item.description.trim()
      )
      .map((item) => ({
        id: item.id,
        jobTitle: item.jobTitle.trim(),
        company: item.company.trim(),
        department: item.department?.trim() ?? "",
        startDate: item.startDate,
        endDate: item.endDate,
        description: item.description.trim(),
      })),
    education: data.education
      .filter((item) => item.degree.trim() || item.institution.trim())
      .map((item) => {
        const degreeParts = [item.degree.trim()];
        if (item.gpa?.trim()) {
          degreeParts.push(`المعدل: ${item.gpa.trim()}`);
        }
        return {
          id: item.id,
          degree: degreeParts.join(" — "),
          institution: item.institution.trim(),
          startDate: item.startDate,
          endDate: item.endDate,
        };
      }),
    skills: data.skills
      .filter((item) => item.name.trim())
      .map((item) => ({
        id: item.id,
        name: item.name.trim(),
      })),
    courses: data.courses
      .filter((item) => item.name.trim())
      .map((item) => ({
        id: item.id,
        name: item.name.trim(),
        provider: item.provider.trim(),
        date: item.date.trim(),
        year: item.date.trim() || item.year.trim(),
      })),
  };
}

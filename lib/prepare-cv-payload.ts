import type { CvFormData } from "@/lib/cv-types";

export function prepareCvPayload(data: CvFormData): CvFormData {
  return {
    language: data.language,
    name: data.name.trim(),
    city: data.city.trim(),
    phone: data.phone.trim(),
    email: data.email.trim(),
    selfDescription: data.selfDescription.trim(),
    workExperience: data.workExperience
      .filter(
        (item) =>
          item.jobTitle.trim() ||
          item.company.trim() ||
          item.description.trim()
      )
      .map((item) => ({
        id: item.id,
        jobTitle: item.jobTitle.trim(),
        company: item.company.trim(),
        startDate: item.startDate,
        endDate: item.endDate,
        description: item.description.trim(),
      })),
    education: data.education
      .filter((item) => item.degree.trim() || item.institution.trim())
      .map((item) => ({
        id: item.id,
        degree: item.degree.trim(),
        institution: item.institution.trim(),
        startDate: item.startDate,
        endDate: item.endDate,
      })),
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
        year: item.year.trim(),
      })),
  };
}

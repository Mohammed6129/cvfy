import type { GeneratedCv } from "@/lib/cv-types";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildCvHtml(cv: GeneratedCv): string {
  const isEnglish = cv.language === "english";
  const dir = isEnglish ? "ltr" : "rtl";
  const { content } = cv;

  const section = (title: string, body: string) =>
    body
      ? `<h2 style="color:#378ADD;border-bottom:2px solid #378ADD;padding-bottom:6px;margin:24px 0 12px;font-size:16px;">${escapeHtml(title)}</h2>${body}`
      : "";

  const experiences = content.experiences
    .map(
      (exp) => `
      <div style="margin-bottom:16px;">
        <p style="margin:0;font-weight:bold;color:#0f172a;">${escapeHtml(exp.jobTitle)}${exp.company ? ` — ${escapeHtml(exp.company)}` : ""}</p>
        ${exp.period ? `<p style="margin:4px 0;color:#64748b;font-size:13px;">${escapeHtml(exp.period)}</p>` : ""}
        ${exp.description ? `<p style="margin:6px 0 0;color:#334155;line-height:1.6;">${escapeHtml(exp.description)}</p>` : ""}
      </div>`
    )
    .join("");

  const education = content.education
    .map(
      (edu) => `
      <div style="margin-bottom:12px;">
        <p style="margin:0;font-weight:bold;">${escapeHtml(edu.degree)}</p>
        ${edu.institution ? `<p style="margin:4px 0;color:#64748b;">${escapeHtml(edu.institution)}</p>` : ""}
        ${edu.period ? `<p style="margin:0;color:#64748b;font-size:13px;">${escapeHtml(edu.period)}</p>` : ""}
      </div>`
    )
    .join("");

  const skills = content.skills
    .map(
      (skill) =>
        `<span style="display:inline-block;background:#e8f2fc;color:#378ADD;padding:4px 10px;margin:4px;border-radius:6px;font-size:13px;">${escapeHtml(skill)}</span>`
    )
    .join("");

  const courses = content.courses
    .map(
      (course) => `
      <div style="margin-bottom:10px;">
        <p style="margin:0;font-weight:600;">${escapeHtml(course.name)}</p>
        ${course.provider ? `<p style="margin:2px 0;color:#64748b;font-size:13px;">${escapeHtml(course.provider)}</p>` : ""}
      </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="${isEnglish ? "en" : "ar"}" dir="${dir}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(cv.name)} - CV</title>
</head>
<body style="font-family:Arial,sans-serif;color:#1e293b;max-width:800px;margin:0 auto;padding:32px;">
  <header style="text-align:center;border-bottom:1px solid #e2e8f0;padding-bottom:20px;margin-bottom:20px;">
    <h1 style="color:#378ADD;margin:0 0 8px;font-size:28px;">${escapeHtml(cv.name)}</h1>
    ${content.headline ? `<p style="font-size:16px;font-weight:600;margin:0 0 12px;">${escapeHtml(content.headline)}</p>` : ""}
    <p style="margin:0;color:#64748b;font-size:14px;">
      ${[cv.city, cv.phone, cv.email].filter(Boolean).map(escapeHtml).join(" · ")}
    </p>
  </header>
  ${section(isEnglish ? "Professional Summary" : "الوصف الذاتي", content.summary ? `<p style="line-height:1.7;">${escapeHtml(content.summary)}</p>` : "")}
  ${section(isEnglish ? "Work Experience" : "الخبرات العملية", experiences)}
  ${section(isEnglish ? "Education" : "التعليم", education)}
  ${section(isEnglish ? "Skills" : "المهارات", skills ? `<div>${skills}</div>` : "")}
  ${section(isEnglish ? "Courses" : "الدورات والشهادات", courses)}
</body>
</html>`;
}

export function downloadCvAsWord(cv: GeneratedCv): void {
  const html = buildCvHtml(cv);
  const blob = new Blob([`\ufeff${html}`], {
    type: "application/msword;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${cv.name.replace(/\s+/g, "_")}_CV.doc`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadCvAsPdf(cv: GeneratedCv): void {
  const printWindow = window.open("", "_blank", "noopener,noreferrer");
  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.write(buildCvHtml(cv));
  printWindow.document.close();
  printWindow.focus();
  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };
}

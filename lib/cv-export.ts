import type { GeneratedCv } from "@/lib/cv-types";

const CV_FONT = '"Times New Roman", Times, serif';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildCvHtml(cv: GeneratedCv): string {
  const { content } = cv;

  const section = (title: string, body: string) =>
    body
      ? `<h2 style="font-family:${CV_FONT};color:#000;border-bottom:1px solid #000;padding-bottom:6px;margin:24px 0 12px;font-size:14px;font-weight:bold;">${escapeHtml(title)}</h2>${body}`
      : "";

  const experiences = content.experiences
    .map(
      (exp) => `
      <div style="margin-bottom:16px;">
        <p style="margin:0;font-weight:bold;color:#000;font-family:${CV_FONT};">${escapeHtml(exp.jobTitle)}${exp.company ? ` — ${escapeHtml(exp.company)}` : ""}</p>
        ${exp.period ? `<p style="margin:4px 0;color:#000;font-size:13px;font-family:${CV_FONT};">${escapeHtml(exp.period)}</p>` : ""}
        ${exp.description ? `<p style="margin:6px 0 0;color:#000;line-height:1.6;font-family:${CV_FONT};">${escapeHtml(exp.description)}</p>` : ""}
      </div>`
    )
    .join("");

  const education = content.education
    .map(
      (edu) => `
      <div style="margin-bottom:12px;">
        <p style="margin:0;font-weight:bold;color:#000;font-family:${CV_FONT};">${escapeHtml(edu.degree)}</p>
        ${edu.institution ? `<p style="margin:4px 0;color:#000;font-family:${CV_FONT};">${escapeHtml(edu.institution)}</p>` : ""}
        ${edu.period ? `<p style="margin:0;color:#000;font-size:13px;font-family:${CV_FONT};">${escapeHtml(edu.period)}</p>` : ""}
      </div>`
    )
    .join("");

  const skills = content.skills.map(escapeHtml).join(" • ");

  const courses = content.courses
    .map(
      (course) => `
      <div style="margin-bottom:10px;">
        <p style="margin:0;font-weight:600;color:#000;font-family:${CV_FONT};">${escapeHtml(course.name)}</p>
        ${course.provider ? `<p style="margin:2px 0;color:#000;font-size:13px;font-family:${CV_FONT};">${escapeHtml(course.provider)}</p>` : ""}
      </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(cv.name)} - CV</title>
  <style>
    * { color: #000 !important; background: #fff !important; }
    body { font-family: ${CV_FONT}; color: #000; max-width: 800px; margin: 0 auto; padding: 32px; }
  </style>
</head>
<body>
  <header style="text-align:center;border-bottom:1px solid #000;padding-bottom:20px;margin-bottom:20px;">
    <h1 style="color:#000;margin:0 0 8px;font-size:28px;font-family:${CV_FONT};">${escapeHtml(cv.name)}</h1>
    ${content.headline ? `<p style="font-size:16px;font-weight:600;margin:0 0 12px;font-family:${CV_FONT};">${escapeHtml(content.headline)}</p>` : ""}
    <p style="margin:0;color:#000;font-size:14px;font-family:${CV_FONT};">
      ${[cv.city, cv.phone, cv.email].filter(Boolean).map(escapeHtml).join(" · ")}
    </p>
  </header>
  ${section("الملخص المهني / Professional Summary", content.summary ? `<p style="line-height:1.7;font-family:${CV_FONT};">${escapeHtml(content.summary)}</p>` : "")}
  ${section("الخبرات العملية / Work Experience", experiences)}
  ${section("التعليم / Education", education)}
  ${section("المهارات / Skills", skills ? `<p style="font-family:${CV_FONT};">${skills}</p>` : "")}
  ${section("الدورات والشهادات / Courses & Certifications", courses)}
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

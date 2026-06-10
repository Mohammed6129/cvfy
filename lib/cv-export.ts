import type { AtsScoreResult, GeneratedCv } from "@/lib/cv-types";

const CV_FONT = '"Times New Roman", Times, serif';
const PDF_UI_FONT = '"Segoe UI", Tahoma, Arial, sans-serif';

function sanitizeFilename(name: string): string {
  return name.replace(/\s+/g, "_").replace(/[^\w\u0600-\u06FF._-]/g, "") || "CVfy";
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function downloadHtmlAsPdf(html: string, filename: string): Promise<void> {
  const html2pdf = (await import("html2pdf.js")).default;

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-10000px";
  container.style.top = "0";
  container.style.width = "794px";
  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    const worker = html2pdf()
      .set({
        margin: [12, 12, 12, 12],
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(container);

    const pdfBlob: Blob = await worker.outputPdf("blob");
    triggerBlobDownload(pdfBlob, filename);
  } finally {
    document.body.removeChild(container);
  }
}

export function buildCvHtml(cv: GeneratedCv): string {
  const content = cv.contentEn ?? cv.content;

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
        ${course.year ? `<p style="margin:0;color:#000;font-size:13px;font-family:${CV_FONT};">${escapeHtml(course.year)}</p>` : ""}
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
      ${[cv.email, cv.phone, cv.city, cv.linkedIn].filter((v): v is string => Boolean(v)).map(escapeHtml).join(" · ")}
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

export function buildAtsReportHtml(cv: GeneratedCv, result: AtsScoreResult): string {
  const keywordsCategory = result.categories.find((c) => c.name.includes("الكلمات"));
  const keywordsFromCv = (cv.contentEn ?? cv.content).skills.slice(0, 12);
  const keywordsText =
    keywordsCategory?.note ||
    (keywordsFromCv.length > 0 ? keywordsFromCv.join("، ") : "—");

  const passedList = result.passed
    .map((item) => `<li style="margin-bottom:6px;">${escapeHtml(item)}</li>`)
    .join("");

  const improvementsList = result.improvements
    .map((item) => `<li style="margin-bottom:6px;">${escapeHtml(item)}</li>`)
    .join("");

  const categories = result.categories
    .map(
      (cat) => `
      <div style="margin-bottom:10px;padding:10px;border:1px solid #E6F1FB;border-radius:8px;">
        <p style="margin:0 0 4px;font-weight:700;color:#0C447C;">${escapeHtml(cat.name)} — ${cat.score}/${cat.maxScore}</p>
        <p style="margin:0;color:#555;font-size:13px;">${escapeHtml(cat.note)}</p>
      </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>تقرير ATS - ${escapeHtml(cv.name)}</title>
  <style>
    body { font-family: ${PDF_UI_FONT}; color: #111; background: #fff; padding: 28px; }
    h1 { color: #0C447C; margin: 0 0 8px; font-size: 24px; }
    h2 { color: #378ADD; margin: 20px 0 10px; font-size: 16px; border-bottom: 1px solid #E6F1FB; padding-bottom: 6px; }
    .score { font-size: 42px; font-weight: 800; color: #378ADD; margin: 12px 0; }
  </style>
</head>
<body>
  <h1>تقرير فحص ATS — CVfy</h1>
  <p style="margin:0;color:#555;">الاسم: <strong>${escapeHtml(cv.name)}</strong></p>
  <div class="score">${result.score}%</div>
  <p style="line-height:1.7;color:#333;">${escapeHtml(result.summary)}</p>

  <h2>الكلمات المفتاحية المكتشفة</h2>
  <p style="line-height:1.7;color:#333;">${escapeHtml(keywordsText)}</p>

  <h2>نقاط القوة</h2>
  <ul style="padding-right:20px;color:#333;">${passedList}</ul>

  <h2>التوصيات</h2>
  <ul style="padding-right:20px;color:#333;">${improvementsList}</ul>

  <h2>تفاصيل التقييم</h2>
  ${categories}
</body>
</html>`;
}

export async function downloadCvAsPdf(cv: GeneratedCv): Promise<void> {
  const html = buildCvHtml(cv);
  await downloadHtmlAsPdf(html, `${sanitizeFilename(cv.name)}_CV.pdf`);
}

export function downloadCvAsWord(cv: GeneratedCv): void {
  const html = buildCvHtml(cv);
  const blob = new Blob([`\ufeff${html}`], {
    type: "application/msword;charset=utf-8",
  });
  triggerBlobDownload(blob, `${sanitizeFilename(cv.name)}_CV.doc`);
}

export async function downloadAtsReportPdf(
  cv: GeneratedCv,
  result: AtsScoreResult
): Promise<void> {
  const html = buildAtsReportHtml(cv, result);
  await downloadHtmlAsPdf(html, `${sanitizeFilename(cv.name)}_ATS_Report.pdf`);
}

export async function fetchAtsResult(cv: GeneratedCv): Promise<AtsScoreResult> {
  const response = await fetch("/api/ats-check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json",
    },
    body: JSON.stringify(cv),
  });

  const text = await response.text();
  let data: AtsScoreResult & { error?: string };

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("استجابة غير صالحة من الخادم.");
  }

  if (!response.ok) {
    throw new Error(data.error || "تعذر إنشاء تقرير ATS.");
  }

  return data;
}

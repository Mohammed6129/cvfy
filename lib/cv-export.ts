import { jsPDF } from "jspdf";
import { applyGuaranteedTemplate } from "@/lib/cv-guaranteed-template";
import type {
  AtsScoreResult,
  CvLanguage,
  GeneratedCv,
  GeneratedCvContent,
} from "@/lib/cv-types";

function contentForLanguage(cv: GeneratedCv, language: CvLanguage): GeneratedCvContent {
  const content = language === "ar" ? cv.content : (cv.contentEn ?? cv.content);
  const gate = cv.atsGate?.[language];
  // Delivery is unconditional: a record whose gate is marked as failed
  // (saved before the guaranteed-template rollout) gets the pre-certified
  // rule-based template applied here, so no file below the ATS minimum
  // can ever leave the system.
  if (gate && !gate.passed) {
    return applyGuaranteedTemplate(content, language);
  }
  return content;
}

const CV_FONT = '"Times New Roman", Times, serif';
const PDF_UI_FONT = '"Segoe UI", Tahoma, Arial, sans-serif';
const PAGE_MARGIN = 15;
const LINE_HEIGHT = 5.5;

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

// Legacy helpers used by buildAtsPdfBlob (multi-page ATS report)
function addLines(
  doc: jsPDF,
  text: string,
  y: number,
  maxWidth: number,
  fontSize = 10,
  fontStyle: "normal" | "bold" | "italic" = "normal"
): number {
  doc.setFont("helvetica", fontStyle);
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  const pageHeight = doc.internal.pageSize.getHeight();
  for (const line of lines) {
    if (y + LINE_HEIGHT > pageHeight - PAGE_MARGIN) {
      doc.addPage();
      y = PAGE_MARGIN;
    }
    doc.text(line, PAGE_MARGIN, y);
    y += LINE_HEIGHT;
  }
  return y;
}

function addSectionTitle(doc: jsPDF, title: string, y: number, maxWidth: number): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + LINE_HEIGHT * 2 > pageHeight - PAGE_MARGIN) {
    doc.addPage();
    y = PAGE_MARGIN;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(title, PAGE_MARGIN, y);
  y += 4;
  doc.setLineWidth(0.3);
  doc.line(PAGE_MARGIN, y, PAGE_MARGIN + maxWidth, y);
  return y + LINE_HEIGHT;
}

// Measure total CV content height using a dry-run jsPDF (no actual drawing)
function measureCvHeight(cv: GeneratedCv, content: GeneratedCvContent): number {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const maxWidth = doc.internal.pageSize.getWidth() - PAGE_MARGIN * 2;

  function linesHeight(text: string, fontSize: number, fontStyle: "normal" | "bold" | "italic" = "normal"): number {
    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth) as string[];
    return lines.length * LINE_HEIGHT;
  }

  let y = PAGE_MARGIN;

  // Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  const nameLines = doc.splitTextToSize(cv.name, maxWidth) as string[];
  y += nameLines.length * 8;

  if (content.headline) y += linesHeight(content.headline, 12);

  const contact = [cv.email, cv.phone, cv.city, cv.linkedIn].filter(Boolean).join(" | ");
  if (contact) y += linesHeight(contact, 9);

  y += 3;

  if (content.summary) {
    y += LINE_HEIGHT * 2 + 4; // section title
    y += linesHeight(content.summary, 10) + 2;
  }

  if (content.experiences.length > 0) {
    y += LINE_HEIGHT * 2 + 4;
    for (const exp of content.experiences) {
      y += linesHeight(`${exp.jobTitle}${exp.company ? ` — ${exp.company}` : ""}`, 10, "bold");
      if (exp.period) y += linesHeight(exp.period, 9, "italic");
      if (exp.description) y += linesHeight(exp.description, 10);
      y += 2;
    }
  }

  if (content.education.length > 0) {
    y += LINE_HEIGHT * 2 + 4;
    for (const edu of content.education) {
      y += linesHeight(edu.degree, 10, "bold");
      if (edu.institution) y += linesHeight(edu.institution, 10);
      if (edu.period) y += linesHeight(edu.period, 9, "italic");
      y += 1;
    }
  }

  if (content.skills.length > 0) {
    y += LINE_HEIGHT * 2 + 4;
    y += linesHeight(content.skills.join(" • "), 10) + 2;
  }

  if (content.courses.length > 0) {
    y += LINE_HEIGHT * 2 + 4;
    for (const course of content.courses) {
      y += linesHeight(course.name, 10, "bold");
      if (course.provider) y += linesHeight(course.provider, 9);
      if (course.year) y += linesHeight(course.year, 9, "italic");
      y += 1;
    }
  }

  return y;
}

function renderCvPdfDoc(cv: GeneratedCv, content: GeneratedCvContent, scale: number): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - PAGE_MARGIN * 2;
  const lh = LINE_HEIGHT * scale;
  const bottom = pageHeight - PAGE_MARGIN;
  let y = PAGE_MARGIN;

  function addScaled(
    text: string,
    fontSize: number,
    fontStyle: "normal" | "bold" | "italic" = "normal"
  ): void {
    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize * scale);
    const lines = doc.splitTextToSize(text, maxWidth) as string[];
    for (const line of lines) {
      if (y + lh > bottom) return;
      doc.text(line, PAGE_MARGIN, y);
      y += lh;
    }
  }

  function addSection(title: string): void {
    if (y + lh * 2 > bottom) return;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11 * scale);
    doc.text(title, PAGE_MARGIN, y);
    y += 4 * scale;
    doc.setLineWidth(0.3);
    doc.line(PAGE_MARGIN, y, PAGE_MARGIN + maxWidth, y);
    y += lh;
  }

  // Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20 * scale);
  const nameLines = doc.splitTextToSize(cv.name, maxWidth) as string[];
  for (const line of nameLines) {
    if (y + 8 * scale > bottom) break;
    doc.text(line, PAGE_MARGIN, y);
    y += 8 * scale;
  }

  if (content.headline) addScaled(content.headline, 12);

  const contact = [cv.email, cv.phone, cv.city, cv.linkedIn].filter(Boolean).join(" | ");
  if (contact) addScaled(contact, 9);

  y += 3 * scale;

  if (content.summary) {
    addSection("PROFESSIONAL SUMMARY");
    addScaled(content.summary, 10);
    y += 2 * scale;
  }

  if (content.experiences.length > 0) {
    addSection("WORK EXPERIENCE");
    for (const exp of content.experiences) {
      addScaled(`${exp.jobTitle}${exp.company ? ` — ${exp.company}` : ""}`, 10, "bold");
      if (exp.period) addScaled(exp.period, 9, "italic");
      if (exp.description) addScaled(exp.description, 10);
      y += 2 * scale;
    }
  }

  if (content.education.length > 0) {
    addSection("EDUCATION");
    for (const edu of content.education) {
      addScaled(edu.degree, 10, "bold");
      if (edu.institution) addScaled(edu.institution, 10);
      if (edu.period) addScaled(edu.period, 9, "italic");
      y += 1 * scale;
    }
  }

  if (content.skills.length > 0) {
    addSection("SKILLS");
    addScaled(content.skills.join(" • "), 10);
    y += 2 * scale;
  }

  if (content.courses.length > 0) {
    addSection("COURSES & CERTIFICATIONS");
    for (const course of content.courses) {
      addScaled(course.name, 10, "bold");
      if (course.provider) addScaled(course.provider, 9);
      if (course.year) addScaled(course.year, 9, "italic");
      y += 1 * scale;
    }
  }

  return doc;
}

// jsPDF's built-in helvetica cannot render Arabic script, so this fast
// selectable-text path is only valid for the English document.
export function buildCvPdfBlob(cv: GeneratedCv): Blob {
  const content = contentForLanguage(cv, "en");
  const PAGE_USABLE = 297 - PAGE_MARGIN * 2 - 4; // A4 usable height (mm)
  const measured = measureCvHeight(cv, content);
  // Apply scale if content overflows; cap at 1.0 so we never upscale
  const scale = measured > PAGE_USABLE ? (PAGE_USABLE / measured) * 0.97 : 1.0;
  return renderCvPdfDoc(cv, content, Math.min(scale, 1.0)).output("blob");
}

export async function buildCvPdfBlobForLanguage(
  cv: GeneratedCv,
  language: CvLanguage
): Promise<Blob> {
  if (language === "en") {
    const blob = buildCvPdfBlob(cv);
    if (!blob || blob.size < 500) {
      throw new Error("ملف PDF فارغ.");
    }
    return blob;
  }

  // Arabic must go through the HTML renderer for correct script shaping.
  const blob = await renderHtmlToPdfBlob(buildCvHtml(cv, "ar"));
  if (!blob || blob.size < 500) {
    throw new Error("ملف PDF فارغ.");
  }
  return blob;
}

async function waitForIframeDocument(iframe: HTMLIFrameElement): Promise<Document> {
  await new Promise<void>((resolve) => {
    if (iframe.contentDocument?.readyState === "complete") {
      resolve();
      return;
    }
    iframe.onload = () => resolve();
  });

  await new Promise((resolve) => setTimeout(resolve, 350));

  const doc = iframe.contentDocument;
  if (!doc?.body) {
    throw new Error("تعذر تحميل محتوى PDF.");
  }

  return doc;
}

async function renderHtmlToPdfBlob(html: string): Promise<Blob> {
  const iframe = document.createElement("iframe");
  iframe.setAttribute(
    "style",
    "position:fixed;left:0;top:0;width:794px;height:1123px;opacity:0;pointer-events:none;border:0;z-index:-1"
  );
  document.body.appendChild(iframe);

  try {
    const frameDoc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!frameDoc) {
      throw new Error("تعذر تهيئة PDF.");
    }

    frameDoc.open();
    frameDoc.write(html);
    frameDoc.close();

    const doc = await waitForIframeDocument(iframe);
    const textContent = doc.body.innerText.trim();
    if (!textContent) {
      throw new Error("محتوى PDF فارغ.");
    }

    const html2pdf = (await import("html2pdf.js")).default;
    const blob = (await html2pdf()
      .set({
        margin: [10, 10, 10, 10],
        filename: "report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          width: 794,
          windowWidth: 794,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(doc.body)
      .outputPdf("blob")) as Blob;

    if (!blob || blob.size < 500) {
      throw new Error("ملف PDF فارغ.");
    }

    return blob;
  } finally {
    document.body.removeChild(iframe);
  }
}

async function downloadHtmlAsPdf(html: string, filename: string): Promise<void> {
  const blob = await renderHtmlToPdfBlob(html);
  triggerBlobDownload(blob, filename);
}

const CV_SECTION_TITLES: Record<CvLanguage, {
  summary: string;
  experience: string;
  education: string;
  skills: string;
  courses: string;
}> = {
  ar: {
    summary: "الملخص المهني",
    experience: "الخبرات العملية",
    education: "التعليم",
    skills: "المهارات",
    courses: "الدورات والشهادات",
  },
  en: {
    summary: "Professional Summary",
    experience: "Work Experience",
    education: "Education",
    skills: "Skills",
    courses: "Courses & Certifications",
  },
};

export function buildCvHtml(cv: GeneratedCv, language: CvLanguage): string {
  const content = contentForLanguage(cv, language);
  const titles = CV_SECTION_TITLES[language];
  const dir = language === "ar" ? "rtl" : "ltr";
  const langAttr = language === "ar" ? "ar" : "en";

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
<html lang="${langAttr}" dir="${dir}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(cv.name)} - CV</title>
  <style>
    * { color: #000 !important; background: #fff !important; }
    body { font-family: ${CV_FONT}; color: #000; max-width: 800px; margin: 0 auto; padding: 32px; direction: ${dir}; }
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
  ${section(titles.summary, content.summary ? `<p style="line-height:1.7;font-family:${CV_FONT};">${escapeHtml(content.summary)}</p>` : "")}
  ${section(titles.experience, experiences)}
  ${section(titles.education, education)}
  ${section(titles.skills, skills ? `<p style="font-family:${CV_FONT};">${skills}</p>` : "")}
  ${section(titles.courses, courses)}
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
    body { font-family: ${PDF_UI_FONT}; color: #111; background: #fff; padding: 28px; width: 794px; }
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

export async function downloadCvAsPdf(
  cv: GeneratedCv,
  language: CvLanguage
): Promise<void> {
  const blob = await buildCvPdfBlobForLanguage(cv, language);
  const suffix = language === "ar" ? "AR" : "EN";
  triggerBlobDownload(blob, `${sanitizeFilename(cv.name)}_CV_${suffix}.pdf`);
}

export function buildCvWordBlob(cv: GeneratedCv, language: CvLanguage): Blob {
  const html = buildCvHtml(cv, language);
  return new Blob([`\ufeff${html}`], {
    type: "application/msword;charset=utf-8",
  });
}

export function downloadCvAsWord(cv: GeneratedCv, language: CvLanguage): void {
  const suffix = language === "ar" ? "AR" : "EN";
  triggerBlobDownload(
    buildCvWordBlob(cv, language),
    `${sanitizeFilename(cv.name)}_CV_${suffix}.doc`
  );
}

export function buildAtsPdfBlob(cv: GeneratedCv, result: AtsScoreResult): Blob {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const maxWidth = doc.internal.pageSize.getWidth() - PAGE_MARGIN * 2;
  let y = PAGE_MARGIN;

  y = addLines(doc, "CVfy ATS Report", y, maxWidth, 16, "bold");
  y = addLines(doc, `Name: ${cv.name}`, y, maxWidth, 11, "bold");
  y = addLines(doc, `ATS Score: ${result.score}%`, y, maxWidth, 14, "bold");
  y = addLines(doc, result.summary, y, maxWidth);
  y += 2;

  const keywordsCategory = result.categories.find((c) => c.name.includes("الكلمات"));
  const keywords =
    keywordsCategory?.note ||
    (cv.contentEn ?? cv.content).skills.slice(0, 12).join(", ") ||
    "—";

  y = addSectionTitle(doc, "Keywords", y, maxWidth);
  y = addLines(doc, keywords, y, maxWidth);
  y += 2;

  y = addSectionTitle(doc, "Strengths", y, maxWidth);
  for (const item of result.passed) {
    y = addLines(doc, `• ${item}`, y, maxWidth);
  }
  y += 2;

  y = addSectionTitle(doc, "Recommendations", y, maxWidth);
  for (const item of result.improvements) {
    y = addLines(doc, `• ${item}`, y, maxWidth);
  }
  y += 2;

  y = addSectionTitle(doc, "Category Scores", y, maxWidth);
  for (const cat of result.categories) {
    y = addLines(doc, `${cat.name}: ${cat.score}/${cat.maxScore}`, y, maxWidth, 10, "bold");
    y = addLines(doc, cat.note, y, maxWidth);
  }

  return doc.output("blob");
}

export async function buildAtsPdfBlobAsync(
  cv: GeneratedCv,
  result: AtsScoreResult
): Promise<Blob> {
  try {
    const html = buildAtsReportHtml(cv, result);
    return await renderHtmlToPdfBlob(html);
  } catch {
    const blob = buildAtsPdfBlob(cv, result);
    if (!blob || blob.size < 500) {
      throw new Error("ملف PDF فارغ.");
    }
    return blob;
  }
}

export type CvFileBlobs = {
  cvPdfAr: Blob;
  cvPdfEn: Blob;
  cvWordAr: Blob;
  cvWordEn: Blob;
  atsPdf: Blob;
};

export async function buildAllCvFileBlobs(
  cv: GeneratedCv,
  atsResult: AtsScoreResult
): Promise<CvFileBlobs> {
  const cvPdfAr = await buildCvPdfBlobForLanguage(cv, "ar");
  const cvPdfEn = await buildCvPdfBlobForLanguage(cv, "en");
  const cvWordAr = buildCvWordBlob(cv, "ar");
  const cvWordEn = buildCvWordBlob(cv, "en");
  const atsPdf = await buildAtsPdfBlobAsync(cv, atsResult);

  if (cvWordAr.size < 100) throw new Error("ملف Word للسيرة فارغ.");
  if (cvWordEn.size < 100) throw new Error("ملف Word للسيرة فارغ.");
  if (atsPdf.size < 500) throw new Error("ملف تقرير ATS فارغ.");

  return { cvPdfAr, cvPdfEn, cvWordAr, cvWordEn, atsPdf };
}

export async function downloadAtsReportPdf(
  cv: GeneratedCv,
  result: AtsScoreResult
): Promise<void> {
  const filename = `${sanitizeFilename(cv.name)}_ATS_Report.pdf`;
  const blob = await buildAtsPdfBlobAsync(cv, result);
  triggerBlobDownload(blob, filename);
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

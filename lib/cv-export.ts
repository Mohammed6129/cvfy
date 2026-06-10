import { jsPDF } from "jspdf";
import type { AtsScoreResult, GeneratedCv } from "@/lib/cv-types";

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

function ensurePageSpace(doc: jsPDF, y: number, blockHeight: number): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + blockHeight > pageHeight - PAGE_MARGIN) {
    doc.addPage();
    return PAGE_MARGIN;
  }
  return y;
}

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

  for (const line of lines) {
    y = ensurePageSpace(doc, y, LINE_HEIGHT);
    doc.text(line, PAGE_MARGIN, y);
    y += LINE_HEIGHT;
  }

  return y;
}

function addSectionTitle(doc: jsPDF, title: string, y: number, maxWidth: number): number {
  y = ensurePageSpace(doc, y, LINE_HEIGHT * 2);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(title, PAGE_MARGIN, y);
  y += 4;
  doc.setLineWidth(0.3);
  doc.line(PAGE_MARGIN, y, PAGE_MARGIN + maxWidth, y);
  return y + LINE_HEIGHT;
}

export function buildCvPdfBlob(cv: GeneratedCv): Blob {
  const content = cv.contentEn ?? cv.content;
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - PAGE_MARGIN * 2;
  let y = PAGE_MARGIN;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  const nameLines = doc.splitTextToSize(cv.name, maxWidth) as string[];
  for (const line of nameLines) {
    y = ensurePageSpace(doc, y, 8);
    doc.text(line, PAGE_MARGIN, y);
    y += 8;
  }

  if (content.headline) {
    y = addLines(doc, content.headline, y, maxWidth, 12, "normal");
  }

  const contact = [cv.email, cv.phone, cv.city, cv.linkedIn].filter(Boolean).join(" | ");
  if (contact) {
    y = addLines(doc, contact, y, maxWidth, 9, "normal");
  }

  y += 3;

  if (content.summary) {
    y = addSectionTitle(doc, "PROFESSIONAL SUMMARY", y, maxWidth);
    y = addLines(doc, content.summary, y, maxWidth);
    y += 2;
  }

  if (content.experiences.length > 0) {
    y = addSectionTitle(doc, "WORK EXPERIENCE", y, maxWidth);
    for (const exp of content.experiences) {
      y = addLines(
        doc,
        `${exp.jobTitle}${exp.company ? ` — ${exp.company}` : ""}`,
        y,
        maxWidth,
        10,
        "bold"
      );
      if (exp.period) {
        y = addLines(doc, exp.period, y, maxWidth, 9, "italic");
      }
      if (exp.description) {
        y = addLines(doc, exp.description, y, maxWidth);
      }
      y += 2;
    }
  }

  if (content.education.length > 0) {
    y = addSectionTitle(doc, "EDUCATION", y, maxWidth);
    for (const edu of content.education) {
      y = addLines(doc, edu.degree, y, maxWidth, 10, "bold");
      if (edu.institution) {
        y = addLines(doc, edu.institution, y, maxWidth);
      }
      if (edu.period) {
        y = addLines(doc, edu.period, y, maxWidth, 9, "italic");
      }
      y += 1;
    }
  }

  if (content.skills.length > 0) {
    y = addSectionTitle(doc, "SKILLS", y, maxWidth);
    y = addLines(doc, content.skills.join(" • "), y, maxWidth);
    y += 2;
  }

  if (content.courses.length > 0) {
    y = addSectionTitle(doc, "COURSES & CERTIFICATIONS", y, maxWidth);
    for (const course of content.courses) {
      y = addLines(doc, course.name, y, maxWidth, 10, "bold");
      if (course.provider) {
        y = addLines(doc, course.provider, y, maxWidth, 9);
      }
      if (course.year) {
        y = addLines(doc, course.year, y, maxWidth, 9, "italic");
      }
      y += 1;
    }
  }

  return doc.output("blob");
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

export async function downloadCvAsPdf(cv: GeneratedCv): Promise<void> {
  const blob = buildCvPdfBlob(cv);
  if (!blob || blob.size < 500) {
    throw new Error("ملف PDF فارغ.");
  }
  triggerBlobDownload(blob, `${sanitizeFilename(cv.name)}_CV.pdf`);
}

export function buildCvWordBlob(cv: GeneratedCv): Blob {
  const html = buildCvHtml(cv);
  return new Blob([`\ufeff${html}`], {
    type: "application/msword;charset=utf-8",
  });
}

export function downloadCvAsWord(cv: GeneratedCv): void {
  triggerBlobDownload(buildCvWordBlob(cv), `${sanitizeFilename(cv.name)}_CV.doc`);
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

export async function buildAllCvFileBlobs(
  cv: GeneratedCv,
  atsResult: AtsScoreResult
): Promise<{ cvPdf: Blob; cvWord: Blob; atsPdf: Blob }> {
  const cvPdf = buildCvPdfBlob(cv);
  const cvWord = buildCvWordBlob(cv);
  const atsPdf = await buildAtsPdfBlobAsync(cv, atsResult);

  if (cvPdf.size < 500) throw new Error("ملف PDF للسيرة فارغ.");
  if (cvWord.size < 100) throw new Error("ملف Word للسيرة فارغ.");
  if (atsPdf.size < 500) throw new Error("ملف تقرير ATS فارغ.");

  return { cvPdf, cvWord, atsPdf };
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

/**
 * Word output — a real .docx (not HTML renamed to .doc).
 *
 * Word files carry text in logical order with no glyph tricks, which makes
 * this the most reliable format to upload to an ATS, especially in Arabic.
 * Built with native paragraphs and a native bullet list: no tables, no text
 * boxes, no headers/footers.
 */
import {
  AlignmentType,
  BorderStyle,
  Document,
  LevelFormat,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import type { CvDoc } from "@/lib/cv/types";
import { SECTION_TITLES } from "./pdf";

const INK = "0F1B3D";
const SOFT = "4B5563";
const FONT = "Arial";

export async function renderCvDocx(doc: CvDoc): Promise<Buffer> {
  const rtl = doc.lang === "ar";
  const t = SECTION_TITLES[doc.lang];
  const sep = rtl ? "، " : ", ";

  const run = (
    text: string,
    opts: { bold?: boolean; size?: number; color?: string; ltr?: boolean } = {}
  ) =>
    new TextRun({
      text,
      bold: opts.bold,
      boldComplexScript: opts.bold,
      size: opts.size ?? 21,
      sizeComplexScript: opts.size ?? 21,
      color: opts.color ?? "1F2937",
      font: { ascii: FONT, hAnsi: FONT, cs: FONT, eastAsia: FONT },
      // Phone numbers and emails keep left-to-right order inside an Arabic line.
      rightToLeft: rtl && !opts.ltr,
    });

  const para = (
    children: TextRun[],
    opts: { before?: number; after?: number; keepNext?: boolean } = {}
  ) =>
    new Paragraph({
      children,
      bidirectional: rtl,
      alignment: AlignmentType.START,
      keepNext: opts.keepNext,
      spacing: { before: opts.before ?? 0, after: opts.after ?? 40, line: rtl ? 320 : 276 },
    });

  const heading = (text: string) =>
    new Paragraph({
      children: [run(text, { bold: true, size: 23, color: INK })],
      bidirectional: rtl,
      alignment: AlignmentType.START,
      keepNext: true,
      spacing: { before: 220, after: 90 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "C9D0DC", space: 2 } },
    });

  const bullet = (text: string) =>
    new Paragraph({
      children: [run(text)],
      bidirectional: rtl,
      alignment: AlignmentType.START,
      numbering: { reference: "cv-bullets", level: 0 },
      spacing: { before: 0, after: 30, line: rtl ? 320 : 276 },
    });

  const body: Paragraph[] = [];

  body.push(para([run(doc.name, { bold: true, size: 40, color: INK })], { after: 20 }));
  if (doc.headline) body.push(para([run(doc.headline, { size: 24, color: INK })], { after: 40 }));
  body.push(
    para(
      doc.contact.flatMap((part, i) => [
        ...(i > 0 ? [run("  |  ", { size: 19, color: SOFT })] : []),
        run(part, { size: 19, color: SOFT, ltr: !/[\u0600-\u06FF]/.test(part) }),
      ]),
      { after: 60 }
    )
  );

  if (doc.summary) {
    body.push(heading(t.summary));
    body.push(para([run(doc.summary)]));
  }

  const experience: Paragraph[] = [];
  if (doc.experience.length > 0) {
    experience.push(heading(t.experience));
    for (const x of doc.experience) {
      experience.push(para([run(x.title, { bold: true, size: 22, color: INK })], { before: 80, after: 0, keepNext: true }));
      experience.push(
        para([run([x.company, x.period].filter(Boolean).join("  |  "), { color: SOFT, size: 20 })], { after: 40, keepNext: true })
      );
      for (const b of x.bullets) experience.push(bullet(b));
    }
  }

  const projects: Paragraph[] = [];
  if (doc.projects.length > 0) {
    projects.push(heading(t.projects));
    for (const p of doc.projects) {
      projects.push(para([run(p.name, { bold: true, size: 22, color: INK })], { before: 80, after: 40, keepNext: true }));
      for (const b of p.bullets) projects.push(bullet(b));
    }
  }

  const education: Paragraph[] = [];
  if (doc.education.length > 0) {
    education.push(heading(t.education));
    for (const e of doc.education) {
      education.push(para([run(e.degree, { bold: true, size: 22, color: INK })], { before: 60, after: 0, keepNext: true }));
      education.push(
        para([run([e.institution, e.year, e.detail].filter(Boolean).join("  |  "), { color: SOFT, size: 20 })])
      );
    }
  }

  if (doc.educationFirst) body.push(...education, ...projects, ...experience);
  else body.push(...experience, ...projects, ...education);

  if (doc.skills.length > 0) {
    body.push(heading(t.skills));
    for (const g of doc.skills) {
      body.push(
        para([...(g.label ? [run(`${g.label}: `, { bold: true, color: INK })] : []), run(g.items.join(sep))])
      );
    }
  }

  if (doc.certificates.length > 0) {
    body.push(heading(t.certificates));
    for (const c of doc.certificates) {
      const tail = [c.issuer, c.year].filter(Boolean).join(sep);
      body.push(para([run(c.name, { bold: true, color: INK }), ...(tail ? [run(` — ${tail}`)] : [])]));
    }
  }

  if (doc.languages.length > 0) {
    body.push(heading(t.languages));
    body.push(para([run(doc.languages.map((l) => (l.level ? `${l.name} (${l.level})` : l.name)).join(sep))]));
  }

  const file = new Document({
    creator: "CVfy",
    title: `${doc.name} — CV`,
    description: doc.headline,
    styles: {
      default: {
        document: {
          run: { font: FONT, size: 21, sizeComplexScript: 21 },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: "cv-bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.START,
              style: { paragraph: { indent: { left: 360, hanging: 220 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 }, // A4
            margin: { top: 850, bottom: 850, left: 1000, right: 1000 },
          },
        },
        children: body,
      },
    ],
  });

  return Packer.toBuffer(file);
}

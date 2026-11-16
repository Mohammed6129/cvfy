import { jsonError, unauthorized } from "@/lib/server/http";
import { getCv } from "@/lib/server/repo";
import { getSessionUser } from "@/lib/server/session";
import { accessFor } from "@/lib/server/view";
import type { CvLang } from "@/lib/cv/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

type Ctx = { params: Promise<{ id: string }> };

const MIME = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function safeName(name: string): string {
  return name.replace(/[^\p{L}\p{N}]+/gu, "_").replace(/^_+|_+$/g, "") || "CV";
}

/**
 * Files are produced here, on the server, at download time — and only for
 * a CV that is paid. There is no pre-built file a browser could reach.
 */
export async function GET(request: Request, { params }: Ctx) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const url = new URL(request.url);
  const lang: CvLang = url.searchParams.get("lang") === "ar" ? "ar" : "en";
  const kind = url.searchParams.get("format");
  if (kind !== "pdf" && kind !== "docx" && kind !== "report") return jsonError("صيغة غير مدعومة.", 400);

  const row = await getCv(user.id, id);
  if (!row?.stored) return jsonError("ما لقينا هذي السيرة.", 404);

  const access = accessFor(row, user);
  if (!access.paid) return jsonError("التحميل متاح بعد الدفع.", 402, { code: "payment_required" });
  if (access.plan === "basic" && lang !== row.stored.primaryLang) {
    return jsonError("اللغة الثانية ضمن الباقة الكاملة.", 402, { code: "upgrade_required" });
  }

  const doc = row.stored.docs[lang];
  if (!doc) return jsonError("هذي النسخة لسا ما تجهزت.", 404);

  // The English name keeps file names safe for every upload form.
  const baseName = safeName(row.stored.docs.en?.name ?? row.form?.personal.nameEn ?? doc.name);
  let buffer: Buffer;
  let filename: string;
  let mime: string;

  try {
    if (kind === "report") {
      const report = row.stored.ats[lang];
      if (!report) return jsonError("لا يوجد تقرير لهذي النسخة.", 404);
      const { renderReportPdf } = await import("@/lib/files/pdf");
      buffer = await renderReportPdf({
        name: row.stored.docs.ar?.name ?? doc.name,
        jobTitle: row.form?.target.jobTitle ?? doc.headline,
        report,
        langLabel: lang === "ar" ? "النسخة العربية" : "النسخة الإنجليزية",
      });
      filename = `${baseName}_ATS_Report_${lang.toUpperCase()}.pdf`;
      mime = MIME.pdf;
    } else if (kind === "pdf") {
      const { renderCvPdf } = await import("@/lib/files/pdf");
      buffer = await renderCvPdf(doc);
      filename = `${baseName}_CV_${lang.toUpperCase()}.pdf`;
      mime = MIME.pdf;
    } else {
      const { renderCvDocx } = await import("@/lib/files/docx");
      buffer = await renderCvDocx(doc);
      filename = `${baseName}_CV_${lang.toUpperCase()}.docx`;
      mime = MIME.docx;
    }
  } catch (error) {
    console.error("[file] render failed:", error);
    return jsonError("ما قدرنا نجهّز الملف. جرّب مرة ثانية.", 500);
  }

  const ascii = filename.replace(/[^\x20-\x7E]/g, "_");
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": mime,
      "Content-Length": String(buffer.length),
      "Content-Disposition": `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "private, no-store",
    },
  });
}

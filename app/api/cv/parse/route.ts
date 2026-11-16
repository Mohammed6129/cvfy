import { NextResponse } from "next/server";
import { parseCvText } from "@/lib/ai/parse";
import { aiFailure, jsonError, unauthorized } from "@/lib/server/http";
import { getSessionUser } from "@/lib/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BYTES = 5 * 1024 * 1024;

async function pdfText(buffer: Buffer): Promise<string> {
  const [{ PDFParse }, { CanvasFactory }] = await Promise.all([import("pdf-parse"), import("pdf-parse/worker")]);
  const parser = new PDFParse({ data: buffer, CanvasFactory });
  try {
    const result = await parser.getText();
    return result.text.trim();
  } finally {
    await parser.destroy();
  }
}

async function docxText(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value.trim();
}

/** Read an uploaded CV (PDF / Word / text) and return a pre-filled form. */
export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  let file: File | null = null;
  try {
    const data = await request.formData();
    const entry = data.get("file");
    if (entry instanceof File) file = entry;
  } catch {
    return jsonError("ما قدرنا نقرأ الملف.", 400);
  }
  if (!file) return jsonError("ارفع ملف سيرتك أولاً.", 400);
  if (file.size > MAX_BYTES) return jsonError("حجم الملف أكبر من 5 ميجا.", 413);

  const name = file.name.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());
  let text = "";

  try {
    if (name.endsWith(".pdf")) text = await pdfText(buffer);
    else if (name.endsWith(".docx")) text = await docxText(buffer);
    else if (name.endsWith(".txt")) text = buffer.toString("utf8").trim();
    else return jsonError("الصيغ المدعومة: PDF أو Word (docx).", 415);
  } catch (error) {
    console.error("[parse] text extraction failed:", error);
    return jsonError("ما قدرنا نقرأ الملف. جرّب نسخة PDF أو Word ثانية.", 422);
  }

  if (text.length < 80) {
    return jsonError(
      "الملف ما فيه نص نقدر نقرأه — غالباً سيرتك محفوظة كصورة. عبّي بياناتك يدوياً وبنكتبها لك من جديد.",
      422,
      { code: "no_text" }
    );
  }

  try {
    const form = await parseCvText(text);
    return NextResponse.json({ form });
  } catch (error) {
    return aiFailure("parse", error);
  }
}

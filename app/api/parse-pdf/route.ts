import { CanvasFactory } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function extractPdfText(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer, CanvasFactory });

  try {
    const result = await parser.getText();
    return result.text.trim();
  } finally {
    await parser.destroy();
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "لم يتم رفع ملف." }, { status: 400 });
    }

    const name = file.name.toLowerCase();

    if (!name.endsWith(".pdf")) {
      return NextResponse.json(
        { error: "يجب أن يكون الملف بصيغة PDF." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractPdfText(buffer);

    if (!text) {
      return NextResponse.json(
        { error: "لم نتمكن من استخراج نص من ملف PDF." },
        { status: 400 }
      );
    }

    console.log("[parse-pdf] Extracted text length:", text.length);

    return NextResponse.json({ text });
  } catch (error) {
    console.error("[parse-pdf]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "تعذر قراءة ملف PDF. جرّب ملفاً آخر.",
      },
      { status: 500 }
    );
  }
}

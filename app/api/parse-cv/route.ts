import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getAnthropicApiKey } from "@/lib/anthropic-env";
import { CLAUDE_MODEL } from "@/lib/cv-claude";
import type { CvFormData } from "@/lib/cv-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf")) {
    const { PDFParse } = await import("pdf-parse");
    const buffer = Buffer.from(await file.arrayBuffer());
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text;
  }

  if (name.endsWith(".docx")) {
    const mammoth = await import("mammoth");
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (name.endsWith(".doc") || name.endsWith(".txt")) {
    return await file.text();
  }

  throw new Error("نوع الملف غير مدعوم. استخدم PDF أو Word.");
}

function extractJson(content: string): Partial<CvFormData> {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1].trim() : content.trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid JSON");
  return JSON.parse(jsonMatch[0]) as Partial<CvFormData>;
}

export async function POST(request: Request) {
  const apiKey = getAnthropicApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: "خدمة استخراج البيانات غير متاحة حالياً." },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "لم يتم رفع ملف." }, { status: 400 });
    }

    const text = await extractTextFromFile(file);
    if (!text.trim()) {
      return NextResponse.json(
        { error: "لم نتمكن من استخراج نص من الملف." },
        { status: 400 }
      );
    }

    const anthropic = new Anthropic({ apiKey });
    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `استخرج بيانات السيرة الذاتية من النص التالي وأخرج JSON فقط بالهيكل:
{
  "name": "",
  "email": "",
  "phone": "",
  "city": "",
  "selfDescription": "",
  "workExperience": [{ "jobTitle": "", "company": "", "department": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM or حتى الآن", "description": "" }],
  "education": [{ "degree": "", "institution": "", "endDate": "YYYY", "gpa": "" }],
  "skills": [{ "name": "" }],
  "courses": [{ "name": "", "provider": "" }]
}

النص:
${text.slice(0, 12000)}`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No response");
    }

    const parsed = extractJson(textBlock.text);
    return NextResponse.json({ formData: parsed });
  } catch (error) {
    console.error("[parse-cv]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "تعذر قراءة الملف. جرّب ملفاً آخر.",
      },
      { status: 500 }
    );
  }
}

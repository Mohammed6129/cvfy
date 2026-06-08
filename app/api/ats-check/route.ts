import Anthropic, { APIError } from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getAnthropicApiKey } from "@/lib/anthropic-env";
import { CLAUDE_MODEL, extractAtsScoreJson } from "@/lib/cv-claude";
import type { AtsScoreResult, GeneratedCv } from "@/lib/cv-types";

function logError(context: string, error: unknown) {
  console.error(`[ats-check] ${context}`);

  if (error instanceof APIError) {
    console.error("[ats-check] APIError status:", error.status);
    console.error("[ats-check] APIError message:", error.message);
    console.error("[ats-check] APIError body:", JSON.stringify(error.error, null, 2));
    return;
  }

  if (error instanceof Error) {
    console.error("[ats-check] Error message:", error.message);
    console.error("[ats-check] Error stack:", error.stack);
  }
}

function buildAtsPrompt(cv: GeneratedCv): string {
  return `You are an ATS expert for the Saudi job market. Analyze this CV for ATS compatibility.

CV data:
${JSON.stringify(cv, null, 2)}

Return JSON only (no markdown) in Arabic:
{
  "score": 85,
  "summary": "ملخص قصير لحالة السيرة (جملة أو جملتين)",
  "categories": [
    { "name": "معلومات الاتصال", "score": 90, "maxScore": 100, "note": "ملاحظة مختصرة" },
    { "name": "الهيكل والأقسام", "score": 85, "maxScore": 100, "note": "ملاحظة مختصرة" },
    { "name": "الكلمات المفتاحية", "score": 80, "maxScore": 100, "note": "ملاحظة مختصرة" },
    { "name": "الخبرات والإنجازات", "score": 75, "maxScore": 100, "note": "ملاحظة مختصرة" },
    { "name": "المهارات", "score": 88, "maxScore": 100, "note": "ملاحظة مختصرة" },
    { "name": "التوافق العام مع ATS", "score": 82, "maxScore": 100, "note": "ملاحظة مختصرة" }
  ],
  "passed": ["نقطة إيجابية محددة 1", "نقطة إيجابية 2"],
  "improvements": ["تحسين محدد 1", "تحسين 2"]
}

Rules:
- score: integer 0-100 reflecting overall ATS readiness
- categories: exactly 6 items with realistic sub-scores
- passed: 3-6 specific strengths from this CV
- improvements: 2-5 actionable fixes
- Be specific to this CV, not generic`;
}

export async function POST(request: Request) {
  const apiKey = getAnthropicApiKey();

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "مفتاح Anthropic API غير مُعد. أضف ANTHROPIC_API_KEY إلى .env.local (بدون NEXT_PUBLIC_) وأعد تشغيل الخادم.",
      },
      { status: 500 }
    );
  }

  let cv: GeneratedCv;
  try {
    cv = (await request.json()) as GeneratedCv;
  } catch (error) {
    logError("Failed to parse request body", error);
    return NextResponse.json({ error: "بيانات السيرة غير صالحة." }, { status: 400 });
  }

  if (!cv.name || !cv.content) {
    return NextResponse.json({ error: "بيانات السيرة ناقصة." }, { status: 400 });
  }

  try {
    console.log("[ats-check] Analyzing CV for:", cv.name);
    const anthropic = new Anthropic({ apiKey });

    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: buildAtsPrompt(cv),
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text block in Claude response");
    }

    const result: AtsScoreResult = extractAtsScoreJson(textBlock.text);
    console.log("[ats-check] Score:", result.score);

    return NextResponse.json(result);
  } catch (error) {
    logError("ATS check failed", error);

    const message =
      error instanceof APIError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Unknown error";

    return NextResponse.json(
      {
        error: "تعذر تحليل السيرة الذاتية. يرجى المحاولة مرة أخرى.",
        debug: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 }
    );
  }
}

import Anthropic, { APIError } from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
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
  return `You are an ATS (Applicant Tracking System) expert. Analyze this CV for ATS compatibility.

Evaluate: contact info clarity, section structure, keyword usage, action verbs, quantified achievements, formatting simplicity, skills relevance, work experience detail, education completeness, and overall parseability.

CV data:
${JSON.stringify(cv, null, 2)}

Return JSON only (no markdown, no explanation) in Arabic for passed and improvements lists:
{
  "score": 85,
  "passed": ["نقطة إيجابية 1", "نقطة إيجابية 2"],
  "improvements": ["تحسين مقترح 1", "تحسين مقترح 2"]
}

Rules:
- score must be an integer from 0 to 100
- include 3-6 items in passed
- include 2-5 items in improvements
- be specific to this CV, not generic advice`;
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();

  if (!apiKey) {
    return NextResponse.json(
      { error: "مفتاح Anthropic API غير مُعد." },
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

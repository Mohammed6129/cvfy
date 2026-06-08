import Anthropic, { APIError } from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getAnthropicApiKey } from "@/lib/anthropic-env";
import { CLAUDE_MODEL, extractCvContentJson } from "@/lib/cv-claude";
import type { GeneratedCv } from "@/lib/cv-types";

function logError(context: string, error: unknown) {
  console.error(`[enhance-cv] ${context}`);

  if (error instanceof APIError) {
    console.error("[enhance-cv] APIError status:", error.status);
    console.error("[enhance-cv] APIError message:", error.message);
    console.error("[enhance-cv] APIError body:", JSON.stringify(error.error, null, 2));
    return;
  }

  if (error instanceof Error) {
    console.error("[enhance-cv] Error message:", error.message);
    console.error("[enhance-cv] Error stack:", error.stack);
  }
}

function buildEnhancePrompt(cv: GeneratedCv): string {
  const translateNote =
    cv.language === "english"
      ? "\n\nThe user selected English as their CV language. Translate everything to English automatically."
      : cv.language === "both"
        ? "\n\nThe user selected bilingual CV. Keep Arabic as primary but ensure headline is also in English."
        : "";

  return `You are a professional CV writer. Enhance this CV by:
1) Improving the wording and making it more professional
2) Highlighting achievements with numbers and metrics
3) Better organizing the content
4) Using strong action verbs
Also, if the user selected English as their CV language, translate everything to English automatically. Return the enhanced CV in the same format.${translateNote}

Current CV data:
${JSON.stringify(cv, null, 2)}

Return JSON only (no markdown, no explanation) with this exact structure:
{
  "headline": "string",
  "summary": "string",
  "experiences": [
    { "jobTitle": "string", "company": "string", "period": "string", "description": "string" }
  ],
  "education": [
    { "degree": "string", "institution": "string", "period": "string" }
  ],
  "skills": ["string"],
  "courses": [
    { "name": "string", "provider": "string", "year": "string" }
  ]
}

Keep all factual information accurate. Do not invent employers, degrees, or credentials.`;
}

export async function POST(request: Request) {
  const apiKey = getAnthropicApiKey();

  if (!apiKey) {
    console.error("[enhance-cv] Missing or invalid ANTHROPIC_API_KEY");
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
    console.log("[enhance-cv] Enhancing CV for:", cv.name);
    const anthropic = new Anthropic({ apiKey });

    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: buildEnhancePrompt(cv),
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text block in Claude response");
    }

    const enhancedContent = extractCvContentJson(textBlock.text);

    const enhancedCv: GeneratedCv = {
      ...cv,
      content: enhancedContent,
      aiEnhanced: true,
      warning: undefined,
      generatedWithFallback: false,
    };

    console.log("[enhance-cv] CV enhanced successfully");
    return NextResponse.json(enhancedCv);
  } catch (error) {
    logError("Enhancement failed", error);

    const message =
      error instanceof APIError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Unknown error";

    return NextResponse.json(
      {
        error: "تعذر تحسين السيرة الذاتية. يرجى المحاولة مرة أخرى.",
        debug: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 }
    );
  }
}

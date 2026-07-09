import Anthropic, { APIError } from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getAnthropicApiKey } from "@/lib/anthropic-env";
import { applyGuaranteedFallback, runAtsGate } from "@/lib/ats-gate";
import { CLAUDE_MODEL, extractCvContentJson } from "@/lib/cv-claude";
import type {
  AtsGateInfo,
  CvLanguage,
  GeneratedCv,
  GeneratedCvContent,
} from "@/lib/cv-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

const OUTPUT_SCHEMA = `{
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
}`;

function buildEnhancePrompt(
  content: GeneratedCvContent,
  language: CvLanguage,
  feedback?: string[]
): string {
  const feedbackBlock = feedback?.length
    ? `\nATS audit feedback from the previous attempt — you MUST fix every point:\n${feedback.map((f) => `- ${f}`).join("\n")}\n`
    : "";

  const languageRules =
    language === "ar"
      ? `- Everything must be in formal professional Arabic (فصحى) ONLY — no English content anywhere (standard tool names like Excel may stay).
- Write the summary in FIRST PERSON: "أعمل..."، "أمتلك..."، "لدي خبرة..." — NEVER third person.
- Use strong Arabic action verbs: قاد، طوّر، حقّق، نفّذ، حسّن، أشرف، رفع، خفّض.`
      : `- Everything must be in formal professional English ONLY — no Arabic anywhere.
- Lead every achievement with a strong past-tense verb: Led, Developed, Achieved, Implemented, Optimized, Managed, Delivered, Increased, Reduced.`;

  return `You are a professional CV writer. This is an independent single-language (${language === "ar" ? "Arabic" : "English"}) enhancement pipeline.

Enhance this CV content by:
1) Improving the wording and making it more professional
2) Highlighting achievements with numbers and metrics already present in the data
3) Better organizing the content
4) Maximizing ATS compatibility: standard section semantics, fully linear text, uniform machine-parseable dates, role-relevant keywords in summary/experiences/skills
${feedbackBlock}
Language rules:
${languageRules}

IMPORTANT: The headline "${content.headline}" MUST remain exactly unchanged in the output headline field.

Current content:
${JSON.stringify(content, null, 2)}

Return JSON only (no markdown, no explanation) with this exact structure:
${OUTPUT_SCHEMA}

Keep all factual information accurate. Do not invent employers, degrees, or credentials.`;
}

async function enhanceLanguageContent(
  anthropic: Anthropic,
  content: GeneratedCvContent,
  language: CvLanguage,
  feedback?: string[]
): Promise<GeneratedCvContent> {
  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: buildEnhancePrompt(content, language, feedback),
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error(`No text block in Claude response (${language})`);
  }

  const enhanced = extractCvContentJson(textBlock.text);
  return { ...enhanced, headline: content.headline };
}

async function runLanguagePipeline(
  anthropic: Anthropic,
  cv: GeneratedCv,
  original: GeneratedCvContent,
  language: CvLanguage
): Promise<{ content: GeneratedCvContent; gate: AtsGateInfo }> {
  const contact = {
    name: cv.name,
    email: cv.email,
    phone: cv.phone,
    city: cv.city,
    linkedIn: cv.linkedIn,
  };

  const enhanced = await enhanceLanguageContent(anthropic, original, language);

  return runAtsGate(anthropic, enhanced, contact, language, (improvements) =>
    enhanceLanguageContent(anthropic, original, language, improvements)
  );
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

  const anthropic = new Anthropic({ apiKey });

  console.log("[enhance-cv] Running independent AR/EN enhancement + ATS gates for:", cv.name);

  // Two fully independent single-language pipelines. Each is enhanced,
  // ATS-scored, and retried on its own — one language never waits for or
  // affects the other.
  const [arResult, enResult] = await Promise.allSettled([
    runLanguagePipeline(anthropic, cv, cv.content, "ar"),
    cv.contentEn
      ? runLanguagePipeline(anthropic, cv, cv.contentEn, "en")
      : Promise.reject(new Error("No English content to enhance")),
  ]);

  // A hard pipeline failure (AI unavailable, parse error, ...) still may
  // never break the commercial 80%+ promise: the guaranteed rule-based
  // template is applied to the last available content for that language.
  let content: GeneratedCvContent;
  let gateAr: AtsGateInfo;
  if (arResult.status === "fulfilled") {
    content = arResult.value.content;
    gateAr = arResult.value.gate;
  } else {
    logError("Arabic pipeline failed — applying guaranteed template", arResult.reason);
    const fallback = applyGuaranteedFallback(cv.content, "ar", 1);
    content = fallback.content;
    gateAr = fallback.gate;
  }

  let contentEn: GeneratedCvContent;
  let gateEn: AtsGateInfo;
  if (enResult.status === "fulfilled") {
    contentEn = enResult.value.content;
    gateEn = enResult.value.gate;
  } else {
    logError("English pipeline failed — applying guaranteed template", enResult.reason);
    const fallback = applyGuaranteedFallback(
      cv.contentEn ?? cv.content,
      "en",
      1
    );
    contentEn = fallback.content;
    gateEn = fallback.gate;
  }

  const enhancedCv: GeneratedCv = {
    ...cv,
    content: {
      ...content,
      headline: cv.content.headline,
    },
    contentEn: {
      ...contentEn,
      headline: cv.contentEn?.headline ?? cv.content.headline,
    },
    atsGate: {
      ar: gateAr,
      en: gateEn,
    },
    linkedIn: cv.linkedIn,
    aiEnhanced: true,
    warning: undefined,
    generatedWithFallback: false,
  };

  console.log("[enhance-cv] Pipelines complete", {
    ar: gateAr,
    en: gateEn,
  });
  return NextResponse.json(enhancedCv);
}

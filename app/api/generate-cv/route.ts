import Anthropic, { APIError } from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import {
  getAnthropicApiKey,
  getAnthropicKeyDebugInfo,
} from "@/lib/anthropic-env";
import { CLAUDE_MODEL } from "@/lib/cv-claude";
import {
  fallbackContent,
  generateLanguageContent,
} from "@/lib/cv-generation";
import { normalizeLinkedInUrl } from "@/lib/linkedin";
import { prepareCvPayload } from "@/lib/prepare-cv-payload";
import type {
  CvFormData,
  GeneratedCv,
  GeneratedCvContent,
} from "@/lib/cv-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function logError(context: string, error: unknown) {
  console.error(`[generate-cv] ${context}`);

  if (error instanceof APIError) {
    console.error("[generate-cv] APIError status:", error.status);
    console.error("[generate-cv] APIError message:", error.message);
    console.error("[generate-cv] APIError type:", error.type);
    console.error(
      "[generate-cv] APIError body:",
      JSON.stringify(error.error, null, 2)
    );
    console.error("[generate-cv] APIError requestID:", error.requestID);
    return;
  }

  if (error instanceof Error) {
    console.error("[generate-cv] Error name:", error.name);
    console.error("[generate-cv] Error message:", error.message);
    console.error("[generate-cv] Error stack:", error.stack);
    return;
  }

  console.error("[generate-cv] Unknown error:", error);
}

function buildCvResponse(
  formData: CvFormData,
  content: GeneratedCvContent,
  contentEn: GeneratedCvContent,
  options?: { fallback?: boolean; warning?: string }
): GeneratedCv {
  const linkedIn = normalizeLinkedInUrl(formData.linkedIn ?? "");

  return {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    city: formData.city,
    linkedIn: linkedIn || undefined,
    language: formData.language,
    content: {
      ...content,
      headline: formData.currentJobTitle.trim() || content.headline,
    },
    contentEn,
    aiEnhanced: false,
    generatedWithFallback: options?.fallback ?? false,
    warning: options?.warning,
  };
}

export async function POST(request: Request) {
  const apiKey = getAnthropicApiKey();
  const keyInfo = getAnthropicKeyDebugInfo();
  console.log("[generate-cv] ANTHROPIC_API_KEY present:", keyInfo.present);
  console.log("[generate-cv] ANTHROPIC_API_KEY valid:", keyInfo.valid);
  if (keyInfo.prefix) {
    console.log("[generate-cv] Key prefix:", keyInfo.prefix);
  }

  let formData: CvFormData | null = null;

  try {
    const rawBody = await request.json();
    formData = prepareCvPayload(rawBody as CvFormData);
    console.log("[generate-cv] Received payload for:", formData.name);
  } catch (parseError) {
    logError("Failed to parse request body", parseError);
    return NextResponse.json(
      { error: "بيانات النموذج غير صالحة." },
      { status: 400 }
    );
  }

  formData.language = "both";

  if (!formData.name || !formData.email || !formData.currentJobTitle) {
    return NextResponse.json(
      { error: "البيانات الأساسية ناقصة (الاسم، المسمى المهني، البريد)." },
      { status: 400 }
    );
  }

  if (!formData.selfDescription) {
    return NextResponse.json(
      { error: "يرجى كتابة الوصف الذاتي." },
      { status: 400 }
    );
  }

  if (!apiKey) {
    console.error("[generate-cv] Missing ANTHROPIC_API_KEY — using fallback");
    const cv = buildCvResponse(
      formData,
      fallbackContent(formData, "ar"),
      fallbackContent(formData, "en"),
      {
        fallback: true,
        warning:
          "تم إنشاء السيرة من بياناتك مباشرة. أضف مفتاح Anthropic API لتحسين المحتوى بالذكاء الاصطناعي.",
      }
    );
    return NextResponse.json(cv);
  }

  const anthropic = new Anthropic({ apiKey });
  const data = formData;

  // Two fully independent language pipelines — separate AI calls,
  // no shared output and no cross-language merging at any stage.
  console.log("[generate-cv] Running independent AR/EN pipelines:", CLAUDE_MODEL);
  const [arResult, enResult] = await Promise.allSettled([
    generateLanguageContent(anthropic, data, "ar"),
    generateLanguageContent(anthropic, data, "en"),
  ]);

  let arFallback = false;
  let enFallback = false;

  let content: GeneratedCvContent;
  if (arResult.status === "fulfilled") {
    content = arResult.value;
    console.log("[generate-cv] Arabic pipeline succeeded");
  } else {
    logError("Arabic pipeline failed, using fallback", arResult.reason);
    content = fallbackContent(data, "ar");
    arFallback = true;
  }

  let contentEn: GeneratedCvContent;
  if (enResult.status === "fulfilled") {
    contentEn = {
      ...enResult.value,
      headline: enResult.value.headline || data.currentJobTitle.trim(),
    };
    console.log("[generate-cv] English pipeline succeeded");
  } else {
    logError("English pipeline failed, using fallback", enResult.reason);
    contentEn = fallbackContent(data, "en");
    enFallback = true;
  }

  const bothFailed = arFallback && enFallback;

  const cv = buildCvResponse(data, content, contentEn, {
    fallback: bothFailed,
    warning: bothFailed
      ? "تعذر الاتصال بخدمة الذكاء الاصطناعي. تم إنشاء السيرة من بياناتك المدخلة."
      : undefined,
  });

  console.log("[generate-cv] CV generated", {
    name: cv.name,
    arFallback,
    enFallback,
    experiences: cv.content.experiences.length,
  });
  return NextResponse.json(cv);
}

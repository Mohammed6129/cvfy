import Anthropic, { APIError } from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { prepareCvPayload } from "@/lib/prepare-cv-payload";
import type { CvFormData, GeneratedCv, GeneratedCvContent } from "@/lib/cv-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "claude-sonnet-4-20250514";

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

function formatPeriod(start: string, end: string): string {
  if (!start && !end) return "";
  if (start && end) return `${start} — ${end}`;
  return start || end;
}

function buildPrompt(data: CvFormData): string {
  const languageInstruction =
    data.language === "english"
      ? "اكتب جميع النصوص باللغة الإنجليزية."
      : data.language === "both"
        ? "اكتب النصوص بالعربية مع headline إنجليزي مختصر."
        : "اكتب جميع النصوص باللغة العربية الفصحى الاحترافية.";

  return `أنت خبير في كتابة السير الذاتية الاحترافية المتوافقة مع أنظمة ATS (Applicant Tracking Systems).

${languageInstruction}

حوّل البيانات التالية إلى محتوى سيرة ذاتية احترافي مصقول. حسّن الصياغة بأسلوب كلاسيكي واضح دون اختراع معلومات غير موجودة.

بيانات النموذج:
${JSON.stringify(data, null, 2)}

أخرج JSON فقط بدون markdown أو شرح، بالهيكل التالي:
{
  "headline": "المسمى المهني أو التخصص",
  "summary": "فقرة الوصف الذاتي المحسّنة",
  "experiences": [
    {
      "jobTitle": "المسمى الوظيفي",
      "company": "اسم الشركة",
      "period": "فترة العمل",
      "description": "وصف احترافي للمهام والإنجازات"
    }
  ],
  "education": [
    {
      "degree": "الدرجة",
      "institution": "المؤسسة",
      "period": "فترة الدراسة"
    }
  ],
  "skills": ["مهارة 1", "مهارة 2"],
  "courses": [
    {
      "name": "اسم الدورة",
      "provider": "الجهة",
      "year": "السنة"
    }
  ]
}

قواعد:
- احذف العناصر الفارغة من المصفوفات
- اجعل الأوصاف مختصرة ومناسبة لـ ATS
- استخدم أفعالاً قوية ونتائج ملموسة حيثما أمكن
- لا تضف حقولاً إضافية خارج الهيكل المحدد`;
}

function extractJson(content: string): GeneratedCvContent {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1].trim() : content.trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("Invalid JSON response from Claude");
  }

  return normalizeContent(
    JSON.parse(jsonMatch[0]) as Partial<GeneratedCvContent>
  );
}

function normalizeContent(
  content: Partial<GeneratedCvContent>
): GeneratedCvContent {
  return {
    headline: content.headline ?? "",
    summary: content.summary ?? "",
    experiences: Array.isArray(content.experiences) ? content.experiences : [],
    education: Array.isArray(content.education) ? content.education : [],
    skills: Array.isArray(content.skills) ? content.skills : [],
    courses: Array.isArray(content.courses) ? content.courses : [],
  };
}

function fallbackContent(data: CvFormData): GeneratedCvContent {
  return {
    headline: data.workExperience[0]?.jobTitle || "محترف",
    summary: data.selfDescription,
    experiences: data.workExperience.map((item) => ({
      jobTitle: item.jobTitle,
      company: item.company,
      period: formatPeriod(item.startDate, item.endDate),
      description: item.description,
    })),
    education: data.education.map((item) => ({
      degree: item.degree,
      institution: item.institution,
      period: formatPeriod(item.startDate, item.endDate),
    })),
    skills: data.skills.map((s) => s.name),
    courses: data.courses.map((c) => ({
      name: c.name,
      provider: c.provider,
      year: c.year,
    })),
  };
}

function buildCvResponse(
  formData: CvFormData,
  content: GeneratedCvContent,
  options?: { fallback?: boolean; warning?: string }
) {
  return {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    city: formData.city,
    language: formData.language,
    content,
    aiEnhanced: false,
    generatedWithFallback: options?.fallback ?? false,
    warning: options?.warning,
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();

  console.log("[generate-cv] ANTHROPIC_API_KEY loaded:", Boolean(apiKey));
  if (apiKey) {
    console.log("[generate-cv] Key prefix:", `${apiKey.slice(0, 12)}...`);
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

  if (!formData.language) {
    return NextResponse.json(
      { error: "يرجى اختيار لغة السيرة الذاتية." },
      { status: 400 }
    );
  }

  if (!formData.name || !formData.email) {
    return NextResponse.json(
      { error: "البيانات الأساسية ناقصة." },
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
    const cv = buildCvResponse(formData, fallbackContent(formData), {
      fallback: true,
      warning:
        "تم إنشاء السيرة من بياناتك مباشرة. أضف مفتاح Anthropic API لتحسين المحتوى بالذكاء الاصطناعي.",
    });
    return NextResponse.json(cv);
  }

  try {
    console.log("[generate-cv] Calling Anthropic model:", MODEL);
    const anthropic = new Anthropic({ apiKey });

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: buildPrompt(formData),
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text block in Claude response");
    }

    let content: GeneratedCvContent;
    try {
      content = extractJson(textBlock.text);
      console.log("[generate-cv] Successfully parsed Claude JSON response");
    } catch (parseError) {
      logError("JSON parse failed, using fallback content", parseError);
      content = fallbackContent(formData);
    }

    const cv = buildCvResponse(formData, content);
    console.log("[generate-cv] CV generated successfully via Anthropic");
    return NextResponse.json(cv);
  } catch (error) {
    logError("Anthropic API failed, using fallback content", error);

    const cv = buildCvResponse(formData, fallbackContent(formData), {
      fallback: true,
      warning:
        "تعذر الاتصال بخدمة الذكاء الاصطناعي. تم إنشاء السيرة من بياناتك المدخلة.",
    });

    return NextResponse.json(cv);
  }
}

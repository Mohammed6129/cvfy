import Anthropic, { APIError } from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import {
  getAnthropicApiKey,
  getAnthropicKeyDebugInfo,
} from "@/lib/anthropic-env";
import {
  CLAUDE_MODEL,
  CV_GENERATION_SYSTEM_PROMPT,
} from "@/lib/cv-claude";
import { prepareCvPayload } from "@/lib/prepare-cv-payload";
import type { CvFormData, GeneratedCv, GeneratedCvContent } from "@/lib/cv-types";

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

function formatPeriod(start: string, end: string): string {
  if (!start && !end) return "";
  if (start && end) return `${start} — ${end}`;
  return start || end;
}

function getLanguageRules(language: CvFormData["language"]): string {
  if (language === "english") {
    return `## اللغة
- اكتب جميع الحقول (headline, summary, experiences, education, skills, courses) بالإنجليزية الاحترافية الرسمية.
- استخدم أفعالاً قوية بصيغة الماضي: Led, Developed, Achieved, Implemented, Optimized, Managed, Delivered, Increased, Reduced, Streamlined.
- لا تستخدم لغة عامية أو اختصارات غير رسمية.`;
  }

  if (language === "both") {
    return `## اللغة
- اكتب headline بالإنجليزية الاحترافية (مسمى وظيفي دقيق).
- اكتب summary وexperiences وeducation وskills وcourses بالعربية الفصحى الرسمية فقط.
- لا تخلط اللهجات ولا تترجم حرفياً؛ صِغ المحتوى بأسلوب مهني سعودي/خليجي.`;
  }

  return `## اللغة
- اكتب جميع الحقول بالعربية الفصحى الرسمية الاحترافية فقط.
- حوّل أي إدخال باللهجة أو العامية (مثل: شغلت، سويت، عندي، نبي) إلى فصحى مهنية راقية.
- ممنوع تماماً: اللهجة السعودية/الخليجية، العامية، التعبيرات الدارجة، والإيموجي.
- استخدم أسلوب سيرة ذاتية كلاسيكية: موجز، رسمي، ومناسب لأنظمة ATS والتوظيف في السعودية.`;
}

function buildPrompt(data: CvFormData): string {
  const languageRules = getLanguageRules(data.language);

  return `أنت خبير كتابة سير ذاتية (CV Writer) متخصص في السوق السعودي والخليجي وأنظمة تتبع المتقدمين ATS.

مهمتك: تحويل بيانات المستخدم الخام — حتى لو كانت بالعامية أو غير منظمة — إلى سيرة ذاتية كلاسيكية احترافية، نظيفة، minimal، وجاهزة للتقديم الفوري.

${languageRules}

## معايير الجودة (إلزامية)
0. **ممنوع النسخ الحرفي**: NEVER copy the user's text directly — not a single phrase, sentence, or bullet. Every field must be fully rewritten.
1. **إعادة الصياغة الكاملة**: حوّل كل مدخل — حتى لو باللهجة أو العامية — إلى فصحى رسمية احترافية. لا تبقِ أي تعبير دارج أو عامي في المخرجات.
2. **أفعال قوية**: ابدأ كل إنجاز بفعل قوي. أمثلة عربية: قاد، طوّر، حقّق، نفّذ، حسّن، أشرف، أسهم، رفع، خفّض، أنجز، صمّم، أدار، طبّق.
3. **مقاييس وإنجازات**: استخرج الأرقام والنسب من البيانات إن وُجدت. إن لم تُذكر أرقام صريحة لكن السياق يشير لنتيجة، صِغها بصيغة احترافية دون اختلاق (مثال: "ساهم في تحسين الأداء" بدل اختلاق "35%").
4. **ممنوع اختلاق معلومات**: لا تضف شركات، وظائف، شهادات، أو أرقام غير موجودة في المدخلات.
5. **تنسيق كلاسيكي**: السيرة يجب أن تُعرض بهذا الترتيب فقط:
   - headline (المسمى المهني)
   - summary (الملخص المهني: 3–4 جمل)
   - experiences (الخبرات العملية)
   - education (التعليم)
   - skills (المهارات)
   - courses (الدورات والشهادات)

## قواعد كل حقل

### headline
- مسمى وظيفي دقيق يعكس أحدث دور أو التخصص (مثال: "مدير مشاريع | إدارة عمليات").
- جملة واحدة قصيرة، بدون ضمائر شخصية.

### summary
- فقرة من 3–4 جمل بفصحى رسمية.
- تلخّص الخبرة، المجال، وأبرز نقاط القوة.
- تجنّب "أنا شخص..."؛ استخدم صياغة مهنية: "محترف في..."، "يمتلك خبرة..."، "يتمتع بكفاءة في...".

### experiences
- رتّب من الأحدث إلى الأقدم.
- jobTitle: مسمى رسمي (مثال: "مدير مشاريع" لا "مدير مشاريع شغال").
- company: اسم الشركة كما في البيانات أو مستخرجاً بوضوح من النص.
- period: بصيغة موحدة مثل "2020 — 2023" أو "2019 — حتى الآن".
- description: 3–5 نقاط إنجاز بصيغة موجزة. افصل بينها بـ " • " (مسافة + نقطة + مسافة). كل نقطة تبدأ بفعل قوي وتتضمن نتيجة أو أثراً عند الإمكان.
  مثال: "قاد فريقاً من 8 موظفين • رفع كفاءة العمليات بنسبة 20% • نفّذ سياسات الجودة وفق معايير ISO"

### education
- degree: الدرجة والتخصص بصيغة رسمية (مثال: "بكالوريوس إدارة أعمال").
- institution: اسم الجامعة/المعهد.
- period: سنة البداية — سنة النهاية.

### skills
- قائمة مهارات نظيفة بدون تكرار.
- صِغها بأسماء معيارية (Excel، إدارة المشاريع، تحليل البيانات).
- 8–15 مهارة كحد أقصى، الأكثر صلة بالمجال أولاً.

### courses
- name: اسم الشهادة/الدورة رسمياً.
- provider: الجهة المانحة إن وُجدت.
- year: السنة إن وُجدت.
- احذف الدورات الفارغة أو التي كتب المستخدم "لا" لها.

## تحسين ATS
- كلمات مفتاحية من المجال والمسمى الوظيفي.
- جمل قصيرة وواضحة، بدون رموز زخرفية أو جداول.
- عناوين الأقسام ضمنية في الهيكل (لا تضف حقولاً إضافية).
- تجنّب الضمائر المفرطة والحشو والعبارات المبتذلة ("متعلم سريع"، "شغوف بالعمل").

## بيانات المستخدم (قد تكون عامية أو غير منظمة — حوّلها كلها):
${JSON.stringify(data, null, 2)}

## المخرجات
أخرج JSON صالحاً فقط — بدون markdown أو شرح أو نص قبل/بعد JSON — بالهيكل التالي حرفياً:
{
  "headline": "المسمى المهني",
  "summary": "الملخص المهني المحسّن",
  "experiences": [
    {
      "jobTitle": "المسمى الوظيفي",
      "company": "اسم الشركة",
      "period": "فترة العمل",
      "description": "نقطة إنجاز • نقطة إنجاز • نقطة إنجاز"
    }
  ],
  "education": [
    {
      "degree": "الدرجة والتخصص",
      "institution": "المؤسسة التعليمية",
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

قواعد نهائية:
- احذف العناصر الفارغة من المصفوفات.
- إن كانت الخبرة في نص حر واحد، قسّمه إلى experience entries منطقية إن أمكن.
- لا تضف حقولاً خارج الهيكل المحدد.
- تأكد أن الناتج النهائي يبدو كسيرة ذاتية كلاسيكية نظيفة minimal جاهزة للطباعة والتقديم.`;
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
    console.log("[generate-cv] Calling Anthropic model:", CLAUDE_MODEL);
    const anthropic = new Anthropic({ apiKey });

    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      system: CV_GENERATION_SYSTEM_PROMPT,
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

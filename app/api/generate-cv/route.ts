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
import { normalizeLinkedInUrl } from "@/lib/linkedin";
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
- أضف كائن contentEn منفصل بنسخة إنجليزية كاملة احترافية لجميع الحقول (headline, summary, experiences, education, skills, courses).
- لا تخلط اللهجات ولا تترجم حرفياً؛ صِغ المحتوى بأسلوب مهني سعودي/خليجي.`;
  }

  return `## اللغة
- اكتب جميع الحقول بالعربية الفصحى الرسمية الاحترافية فقط.
- حوّل أي إدخال باللهجة أو العامية (مثل: شغلت، سويت، عندي، نبي) إلى فصحى مهنية راقية.
- ممنوع تماماً: اللهجة السعودية/الخليجية، العامية، التعبيرات الدارجة، والإيموجي.
- استخدم أسلوب سيرة ذاتية رسمية احترافية: موجز، أبيض وأسود، ومناسب لأنظمة ATS ولسوق العمل السعودي.`;
}

function buildPrompt(data: CvFormData): string {
  const languageRules = getLanguageRules(data.language);

  return `أنت خبير كتابة سير ذاتية (CV Writer) متخصص في سوق العمل السعودي والخليجي وأنظمة تتبع المتقدمين ATS.

مهمتك: تحويل بيانات المستخدم الخام — حتى لو كانت بالعامية أو غير منظمة — إلى سيرة ذاتية رسمية احترافية بالعربي والإنجليزي، أبيض وأسود، Times New Roman، بدون ألوان أو صور، وجاهزة للتقديم الفوري.

${languageRules}

## صفحة واحدة — قيد صارم
السيرة يجب أن تتسع في صفحة A4 واحدة (210×297mm, هوامش 15mm, خط Times New Roman 10pt).
- **summary**: جملتان إلى ثلاث جمل فقط. لا تزيد عن 60 كلمة.
- **experiences**: احتفظ بأحدث 3 خبرات كحد أقصى (احذف الأقدم إذا تجاوز العدد 3). كل خبرة: 3 نقاط إنجاز كحد أقصى، كل نقطة لا تتجاوز 20 كلمة.
- **education**: مدخل واحد فقط (الأعلى درجة).
- **skills**: 8 إلى 12 مهارة. لا تزيد.
- **courses**: 3 دورات كحد أقصى (الأحدث والأهم فقط).
إذا كانت بيانات المستخدم تحتوي أكثر من الحد المسموح، اختر الأهم والأحدث وتجاهل الباقي بصمت.

## معايير الجودة (إلزامية)
0. **ممنوع النسخ الحرفي**: NEVER copy the user's text directly — not a single phrase, sentence, or bullet. Every field must be fully rewritten.
1. **إعادة الصياغة الكاملة**: حوّل كل مدخل — حتى لو باللهجة أو العامية — إلى فصحى رسمية احترافية. لا تبقِ أي تعبير دارج أو عامي في المخرجات.
2. **أفعال قوية**: ابدأ كل إنجاز بفعل قوي. أمثلة عربية: قاد، طوّر، حقّق، نفّذ، حسّن، أشرف، أسهم، رفع، خفّض، أنجز، صمّم، أدار، طبّق.
3. **مقاييس وإنجازات**: استخرج الأرقام والنسب من البيانات إن وُجدت. إن لم تُذكر أرقام صريحة لكن السياق يشير لنتيجة، صِغها بصيغة احترافية دون اختلاق (مثال: "ساهم في تحسين الأداء" بدل اختلاق "35%").
4. **ممنوع اختلاق معلومات**: لا تضف شركات، وظائف، شهادات، أو أرقام غير موجودة في المدخلات.
5. **تنسيق رسمي**: السيرة يجب أن تُعرض بهذا الترتيب فقط:
   - headline (المسمى المهني)
   - summary (الملخص المهني: 3–4 جمل)
   - experiences (الخبرات العملية)
   - education (التعليم)
   - skills (المهارات)
   - courses (الدورات والشهادات)

## قواعد كل حقل

### headline
- استخدم **حرفياً** قيمة currentJobTitle من بيانات المستخدم (المسمى المهني الحالي) — لا تغيّرها ولا تستبدلها بمسمى من الخبرات.
- هذا هو المسمى الوحيد الذي يظهر في رأس السيرة بجانب الاسم ومعلومات التواصل.

### summary
- فقرة من 3–4 جمل بفصحى رسمية.
- **اكتب بضمير المتكلم** كأن صاحب السيرة يتحدث عن نفسه: "أعمل..."، "أمتلك..."، "أسعى..."، "لدي خبرة...".
- مثال صحيح: "أعمل في مجال التسويق منذ 5 سنوات..."
- ممنوع صيغة الغائب: "يعمل..."، "يمتلك..."، "محترف في..."، "يتمتع بكفاءة..."
- تلخّص الخبرة، المجال، وأبرز نقاط القوة.

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
- year: تاريخ الإنجاز بصيغة شهر-سنة من حقل date (مثال: "2024-03" أو "مارس 2024").
- احذف الدورات الفارغة أو التي كتب المستخدم "لا" لها.

### linkedIn (إن وُجد في البيانات)
- استخدم الرابط القصير فقط بصيغة linkedin.com/in/username بدون https://
- تأكد أن username يبدو صحيحاً (أحرف إنجليزية وأرقام وشرطة سفلية فقط).

## تحسين ATS — هدف: نسبة 80% أو أعلى
- **الكلمات المفتاحية أولاً**: استخرج المصطلحات الجوهرية من المسمى الوظيفي والمجال (مثال: "إدارة المشاريع"، "تحليل البيانات"، "خدمة العملاء") وضمّنها بشكل طبيعي في summary وexperiences وskills.
- **بنية نظيفة**: نص خطي فقط، بدون جداول أو أعمدة أو رموز خاصة غير قياسية.
- **أفعال قوية بصيغة الماضي** في الخبرات: Managed، Led، Developed، Implemented، Achieved، Improved، Delivered، Designed، Coordinated.
- **أرقام ونسب**: أضف أرقاماً واقعية حيثما ذُكرت في المدخلات (مثال: "أشرف على فريق من 8 أعضاء"، "رفع المبيعات بنسبة 20%"). لا تختلق أرقاماً غير موجودة.
- **المهارات**: اجعل skills مطابقة للكلمات المفتاحية الشائعة في المجال، بصيغتها الإنجليزية المعيارية.
- **ممنوع**: الضمائر المفرطة، الحشو، العبارات المبتذلة ("متعلم سريع"، "شغوف بالعمل"، "قادر على العمل تحت ضغط").

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
  ],
  "contentEn": {
    "headline": "English job title",
    "summary": "English professional summary",
    "experiences": [
      {
        "jobTitle": "Job title",
        "company": "Company",
        "period": "Period",
        "description": "Achievement • Achievement"
      }
    ],
    "education": [
      {
        "degree": "Degree",
        "institution": "Institution",
        "period": "Period"
      }
    ],
    "skills": ["Skill 1", "Skill 2"],
    "courses": [
      {
        "name": "Course",
        "provider": "Provider",
        "year": "Year"
      }
    ]
  }
}

قواعد نهائية:
- احذف العناصر الفارغة من المصفوفات.
- إن كانت الخبرة في نص حر واحد، قسّمه إلى experience entries منطقية إن أمكن.
- لا تضف حقولاً خارج الهيكل المحدد.
- تأكد أن الناتج النهائي يبدو كسيرة ذاتية رسمية احترافية أبيض وأسود جاهزة للطباعة والتقديم.`;
}

function extractJson(content: string): {
  content: GeneratedCvContent;
  contentEn?: GeneratedCvContent;
} {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1].trim() : content.trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("Invalid JSON response from Claude");
  }

  const parsed = JSON.parse(jsonMatch[0]) as Partial<GeneratedCvContent> & {
    contentEn?: Partial<GeneratedCvContent>;
  };

  const { contentEn, ...rest } = parsed;

  return {
    content: normalizeContent(rest),
    contentEn: contentEn ? normalizeContent(contentEn) : undefined,
  };
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

function formatCourseDate(date: string): string {
  if (!date) return "";
  const [year, month] = date.split("-");
  if (!year) return date;
  if (!month) return year;
  return `${year}-${month}`;
}

function fallbackContent(data: CvFormData): GeneratedCvContent {
  return {
    headline: data.currentJobTitle.trim() || "محترف",
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
      year: formatCourseDate(c.date) || c.year,
    })),
  };
}

function buildEnglishFallback(data: CvFormData): GeneratedCvContent {
  return {
    headline: data.currentJobTitle.trim() || "Professional",
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
      year: formatCourseDate(c.date) || c.year,
    })),
  };
}

function buildCvResponse(
  formData: CvFormData,
  content: GeneratedCvContent,
  options?: { fallback?: boolean; warning?: string; contentEn?: GeneratedCvContent }
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
    contentEn: options?.contentEn ?? buildEnglishFallback(formData),
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
    let contentEn: GeneratedCvContent | undefined;
    try {
      const parsed = extractJson(textBlock.text);
      content = parsed.content;
      contentEn = parsed.contentEn;
      console.log("[generate-cv] Successfully parsed Claude JSON response");
    } catch (parseError) {
      logError("JSON parse failed, using fallback content", parseError);
      content = fallbackContent(formData);
    }

    const cv = buildCvResponse(formData, content, {
      contentEn: contentEn
        ? {
            ...contentEn,
            headline: formData.currentJobTitle.trim() || contentEn.headline,
          }
        : undefined,
    });
    console.log("[generate-cv] CV generated successfully via Anthropic", {
      name: cv.name,
      hasContent: Boolean(cv.content),
      experiences: cv.content.experiences.length,
    });
    return NextResponse.json(cv);
  } catch (error) {
    logError("Anthropic API failed, using fallback content", error);

    const cv = buildCvResponse(formData, fallbackContent(formData), {
      fallback: true,
      warning:
        "تعذر الاتصال بخدمة الذكاء الاصطناعي. تم إنشاء السيرة من بياناتك المدخلة.",
    });

    console.log("[generate-cv] Returning fallback CV", {
      name: cv.name,
      hasContent: Boolean(cv.content),
    });
    return NextResponse.json(cv);
  }
}

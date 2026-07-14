import type Anthropic from "@anthropic-ai/sdk";
import {
  CLAUDE_MODEL,
  CV_GENERATION_SYSTEM_PROMPT,
  CV_GENERATION_SYSTEM_PROMPT_EN,
  extractCvContentJson,
} from "@/lib/cv-claude";
import type {
  CvFormData,
  CvLanguage,
  GeneratedCvContent,
} from "@/lib/cv-types";

function formatPeriod(start: string, end: string): string {
  if (!start && !end) return "";
  if (start && end) return `${start} — ${end}`;
  return start || end;
}

const OUTPUT_SCHEMA = `{
  "headline": "...",
  "summary": "...",
  "experiences": [
    { "jobTitle": "...", "company": "...", "period": "...", "description": "..." }
  ],
  "education": [
    { "degree": "...", "institution": "...", "period": "..." }
  ],
  "skills": ["...", "..."],
  "courses": [
    { "name": "...", "provider": "...", "year": "..." }
  ]
}`;

const ONE_PAGE_RULES = `## صفحة واحدة — قيد صارم
السيرة يجب أن تتسع في صفحة A4 واحدة (210×297mm, هوامش 15mm, خط Times New Roman 10pt).
- **summary**: جملتان إلى ثلاث جمل فقط. لا تزيد عن 60 كلمة.
- **experiences**: احتفظ بأحدث 3 خبرات كحد أقصى (احذف الأقدم إذا تجاوز العدد 3). كل خبرة: 3 نقاط إنجاز كحد أقصى، كل نقطة لا تتجاوز 20 كلمة.
- **education**: مدخل واحد فقط (الأعلى درجة).
- **skills**: 8 إلى 12 مهارة. لا تزيد.
- **courses**: 3 دورات كحد أقصى (الأحدث والأهم فقط).
إذا كانت بيانات المستخدم تحتوي أكثر من الحد المسموح، اختر الأهم والأحدث وتجاهل الباقي بصمت.`;

function buildArabicPrompt(data: CvFormData, feedback?: string[]): string {
  const feedbackBlock = feedback?.length
    ? `\n## ملاحظات فحص ATS من المحاولة السابقة — عالجها كلها إلزامياً:\n${feedback.map((f) => `- ${f}`).join("\n")}\n`
    : "";

  return `أنت خبير كتابة سير ذاتية (CV Writer) متخصص في سوق العمل السعودي والخليجي وأنظمة تتبع المتقدمين ATS.

مهمتك: إنتاج سيرة ذاتية **بالعربية الفصحى فقط** من بيانات المستخدم الخام — حتى لو كانت بالعامية أو غير منظمة. هذا مسار عربي مستقل بالكامل: أعد صياغة كل المحتوى من الصفر بأعراف الكتابة المهنية العربية (Native Rewriting)، وليس ترجمة.
${feedbackBlock}
## اللغة
- اكتب جميع الحقول بالعربية الفصحى الرسمية الاحترافية فقط.
- حوّل أي إدخال باللهجة أو العامية (مثل: شغلت، سويت، عندي، نبي) إلى فصحى مهنية راقية.
- ممنوع تماماً: اللهجة السعودية/الخليجية، العامية، التعبيرات الدارجة، الإيموجي، وأي كلمة إنجليزية يمكن استبدالها بمقابل عربي معياري (أسماء الأدوات التقنية مثل Excel تبقى كما هي).

${ONE_PAGE_RULES}

## معايير الجودة (إلزامية)
0. **ممنوع النسخ الحرفي**: لا تنسخ نص المستخدم مباشرة — ولا عبارة واحدة. كل حقل يعاد كتابته بالكامل.
1. **إعادة الصياغة الكاملة**: بنية وصفية مهنية عربية، وليست ترجمة حرفية لأي قالب أجنبي.
2. **أفعال قوية**: ابدأ كل إنجاز بفعل قوي: قاد، طوّر، حقّق، نفّذ، حسّن، أشرف، أسهم، رفع، خفّض، أنجز، صمّم، أدار، طبّق.
3. **مقاييس وإنجازات**: استخرج الأرقام والنسب من البيانات إن وُجدت. لا تختلق أرقاماً.
4. **ممنوع اختلاق معلومات**: لا تضف شركات أو وظائف أو شهادات غير موجودة في المدخلات.

## قواعد كل حقل
### headline
- استخدم **حرفياً** قيمة currentJobTitle من بيانات المستخدم — لا تغيّرها.
### summary
- فقرة قصيرة من 2–3 جمل (3–4 أسطر كحد أقصى) بفصحى رسمية.
- **يجب أن تبدأ الفقرة بالمسمى الوظيفي وسنوات الخبرة** بنمط الريفرنس، مثال: "مدير مشاريع بخبرة تتجاوز 5 سنوات في الإعلان والتسويق الرقمي..." — لأن المسمى لا يظهر في رأس السيرة، هذا مكانه.
### experiences
- رتّب من الأحدث إلى الأقدم.
- period بصيغة شهر وسنة مثل الريفرنس: "فبراير 2024 – حتى الآن" أو "أكتوبر 2022 – فبراير 2024". صيغة موحدة في كل السيرة.
- description: 3 إلى 4 نقاط إنجاز كحد أقصى مفصولة بـ " • ".
- **قاعدة كل نقطة (نمط الريفرنس)**: جملة واحدة موجزة ومباشرة — 18 كلمة كحد أقصى — تبدأ بفعل ماضٍ قوي وتنتهي بنقطة، وتتضمن كلمات مفتاحية من المجال. ممنوع الجمل المركبة الطويلة؛ قسّمها أو اختصرها.
### education
- degree بصيغة رسمية (مثال: "بكالوريوس إدارة أعمال")، institution اسم الجهة، period سنوات الدراسة.
### skills
- 6 إلى 10 مهارات بصيغة عبارات مفتاحية معيارية يبحث عنها ATS (مثال: "تخطيط وتنفيذ المشاريع"، "إدارة علاقات العملاء"، "إعداد تقارير الأداء") — الأكثر صلة بالمجال أولاً، بدون تكرار.
### courses
- احذف الدورات الفارغة أو التي كتب المستخدم "لا" لها.
### linkedIn (إن وُجد)
- الرابط القصير فقط بصيغة linkedin.com/in/username بدون https://

## تحسين ATS — الهدف الإلزامي: 80% أو أعلى
- كلمات مفتاحية من المسمى الوظيفي والمجال مضمّنة طبيعياً في summary وexperiences وskills.
- بنية نصية خطية بالكامل: بدون جداول أو أعمدة أو رموز خاصة أو زخارف.
- تواريخ بصيغة موحدة قابلة للتحليل الآلي في كل السيرة.
- عناوين أقسام قياسية فقط (الترتيب: headline ثم summary ثم experiences ثم education ثم skills ثم courses).
- ممنوع الحشو والعبارات المبتذلة ("متعلم سريع"، "شغوف بالعمل"، "أعمل تحت ضغط").

## بيانات المستخدم (قد تكون عامية أو غير منظمة — حوّلها كلها):
${JSON.stringify(data, null, 2)}

## المخرجات
أخرج JSON صالحاً فقط — بدون markdown أو شرح — بالهيكل التالي حرفياً (كل القيم بالعربية):
${OUTPUT_SCHEMA}

قواعد نهائية:
- احذف العناصر الفارغة من المصفوفات.
- لا تضف حقولاً خارج الهيكل المحدد.
- لا تضف أي محتوى بلغة أخرى غير العربية.`;
}

function buildEnglishPrompt(data: CvFormData, feedback?: string[]): string {
  const feedbackBlock = feedback?.length
    ? `\n## ATS audit feedback from the previous attempt — you MUST address every point:\n${feedback.map((f) => `- ${f}`).join("\n")}\n`
    : "";

  return `You are an expert CV writer specializing in the Saudi/Gulf job market and Applicant Tracking Systems (ATS).

Your task: produce a CV written **entirely in professional English** from the user's raw data (which may be in Arabic dialect or unstructured). This is a fully independent English pipeline: rewrite ALL content from scratch following native English professional-writing conventions — do NOT translate literally.
${feedbackBlock}
## Language
- Every field must be in formal professional English only.
- Lead every achievement with a strong past-tense achievement verb: Led, Developed, Achieved, Implemented, Optimized, Managed, Delivered, Increased, Reduced, Streamlined, Spearheaded, Coordinated.
- No slang, no informal abbreviations, no Arabic text anywhere in the output.

## One page — hard constraint
The CV must fit a single A4 page (210×297mm, 15mm margins, Times New Roman 10pt).
- **summary**: 2-3 sentences max, under 60 words.
- **experiences**: newest 3 roles max (silently drop older ones). Each role: max 3 achievement bullets, each under 20 words.
- **education**: single highest-degree entry only.
- **skills**: 8-12 skills.
- **courses**: max 3 (most recent/relevant).

## Quality rules (mandatory)
0. **Never copy the user's text verbatim** — not a single phrase. Rewrite everything.
1. **Full native rewriting**: achievement-driven English CV conventions, not a translation of Arabic phrasing.
2. **Metrics**: surface numbers and percentages from the input where present. Never invent figures.
3. **No fabrication**: no companies, roles, degrees, or credentials that are not in the input.

## Field rules
### headline
- Use a precise professional English rendering of the user's currentJobTitle.
### summary
- 2-3 sentences (3-4 lines max), focused on expertise, scope, and impact.
- **MUST open with the job title + years of experience**, reference style: "Project Manager with 5+ years in advertising and digital marketing. Proven success in..." — the title does not appear in the header, so it lives here.
### experiences
- Newest first.
- period in month-year format exactly like the reference: "Feb 2024 – Present" or "Oct 2022 – Feb 2024". Consistent across the whole CV.
- description: 3-4 bullets max, separated by " • ".
- **Rule per bullet (reference style)**: one concise direct sentence — 18 words max — starting with a strong past-tense verb (Managed, Led, Oversaw, Delivered, Coordinated), ending with a period, and carrying role-relevant ATS keywords. NO long compound sentences — split or compress them. Quantify where the input allows (e.g. "Led and delivered 35+ creative campaigns.").
### education
- degree: formal degree + major (e.g. "B.Sc. Business Administration"), institution, period.
### skills
- 6-10 skills as standard ATS keyword phrases exactly like the reference (e.g. "Project Planning & Execution", "Client Relationship Management", "Cross-functional Team Collaboration", "Performance Reporting"), no duplicates, most relevant first.
### courses
- Drop empty entries or ones the user marked as none.
### linkedIn (if present)
- Short form only: linkedin.com/in/username without https://

## ATS optimization — mandatory target: 80%+
- Role/industry keywords embedded naturally in summary, experiences, and skills.
- Fully linear text structure: no tables, columns, symbols, or decorative characters.
- Uniform machine-parseable date formats everywhere.
- Standard section semantics only (headline, summary, experiences, education, skills, courses).
- No filler or clichés ("fast learner", "team player", "works under pressure").

## User data (may be Arabic/dialect/unstructured — transform all of it):
${JSON.stringify(data, null, 2)}

## Output
Return valid JSON only — no markdown, no explanations — exactly this structure (all values in English):
${OUTPUT_SCHEMA}

Final rules:
- Remove empty array items.
- No fields outside the schema.
- No Arabic content anywhere.`;
}

function formatCourseDate(date: string): string {
  if (!date) return "";
  const [year, month] = date.split("-");
  if (!year) return date;
  if (!month) return year;
  return `${year}-${month}`;
}

export function fallbackContent(
  data: CvFormData,
  language: CvLanguage
): GeneratedCvContent {
  return {
    headline:
      data.currentJobTitle.trim() ||
      (language === "ar" ? "محترف" : "Professional"),
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

export async function generateLanguageContent(
  anthropic: Anthropic,
  data: CvFormData,
  language: CvLanguage,
  feedback?: string[]
): Promise<GeneratedCvContent> {
  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    system:
      language === "ar"
        ? CV_GENERATION_SYSTEM_PROMPT
        : CV_GENERATION_SYSTEM_PROMPT_EN,
    messages: [
      {
        role: "user",
        content:
          language === "ar"
            ? buildArabicPrompt(data, feedback)
            : buildEnglishPrompt(data, feedback),
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error(`No text block in Claude response (${language})`);
  }

  return extractCvContentJson(textBlock.text);
}


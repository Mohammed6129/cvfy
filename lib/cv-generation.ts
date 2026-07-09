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
- فقرة من 3–4 جمل بفصحى رسمية **بضمير المتكلم**: "أعمل..."، "أمتلك..."، "لدي خبرة...". ممنوع صيغة الغائب.
### experiences
- رتّب من الأحدث إلى الأقدم. period بصيغة موحدة "2020 — 2023" أو "2019 — حتى الآن".
- description: 3 نقاط إنجاز كحد أقصى مفصولة بـ " • "، كل نقطة تبدأ بفعل قوي.
### education
- degree بصيغة رسمية (مثال: "بكالوريوس إدارة أعمال")، institution اسم الجهة، period سنوات الدراسة.
### skills
- أسماء معيارية بدون تكرار، الأكثر صلة بالمجال أولاً.
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
- 2-3 sentences, first person implied (no "I" repetition), focused on expertise, scope, and impact.
### experiences
- Newest first. period in a consistent machine-parseable format like "2020 — 2023" or "2019 — Present".
- description: up to 3 bullets separated by " • ", each starting with an achievement verb, quantified where the input allows.
### education
- degree: formal degree + major (e.g. "B.Sc. Business Administration"), institution, period.
### skills
- Standard industry keyword names (e.g. "Project Management", "Data Analysis", "Excel"), no duplicates, most relevant first.
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


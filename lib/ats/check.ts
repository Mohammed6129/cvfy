/**
 * ATS check — rule-based and repeatable.
 *
 * Every line in the report is something we actually measured on the
 * finished CV. No model is asked to "guess a score": the same CV always
 * gets the same result, and each failed check says exactly what to change.
 */
import { normalizeForMatch, wordCount } from "@/lib/cv/text";
import type {
  AtsCheck,
  AtsGroup,
  AtsReport,
  CvDoc,
  JobProfile,
  KeywordHit,
} from "@/lib/cv/types";

const EN_WEAK_STARTS = /^(responsible|duties|worked|helped|assisted with|tasked|in charge|participated|involved)\b/i;
const AR_WEAK_STARTS = /^(مسؤول|مسؤولة|قمت|كنت|أقوم|اقوم|القيام|العمل على|المشاركة في|المساعدة في)/;

const EN_CLICHES = [
  "hard-working", "hard working", "team player", "detail-oriented", "detail oriented",
  "results-driven", "results driven", "go-getter", "think outside the box", "proven track record",
  "self-motivated", "fast learner", "quick learner", "passionate", "dynamic", "synergy",
  "references available",
];
const AR_CLICHES = [
  "سريع التعلم", "سريعة التعلم", "العمل تحت الضغط", "روح الفريق", "شغوف", "شغوفة",
  "طموح", "طموحة", "مجتهد", "مجتهدة", "متحمس", "متحمسة",
];

const SYMBOLS = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}★☆✓✔►▶■□●◆]/u;

function allBullets(doc: CvDoc): string[] {
  return [...doc.experience.flatMap((x) => x.bullets), ...doc.projects.flatMap((p) => p.bullets)];
}

export function docText(doc: CvDoc): string {
  return [
    doc.headline,
    doc.summary,
    ...doc.experience.flatMap((x) => [x.title, x.company, ...x.bullets]),
    ...doc.projects.flatMap((p) => [p.name, ...p.bullets]),
    ...doc.education.flatMap((e) => [e.degree, e.institution]),
    ...doc.skills.flatMap((g) => g.items),
    ...doc.certificates.flatMap((c) => [c.name, c.issuer]),
  ].join(" \n ");
}

/** Arabic prefixes (ال، وال، بال، لل…) are dropped on both sides so «التوظيف» matches «للتوظيف». */
function foldArabicPrefixes(text: string): string {
  return ` ${text} `.replace(/\s(?:و|ف)?(?:ب|ك|ل)?(?:ال|ل(?=ل))/g, " ").trim();
}

function findKeyword(haystack: string, haystackFolded: string, term: string): boolean {
  const needle = normalizeForMatch(term);
  if (!needle) return false;
  if (` ${haystack} `.includes(` ${needle} `) || haystack.includes(needle)) return true;

  const foldedNeedle = foldArabicPrefixes(needle);
  if (foldedNeedle && haystackFolded.includes(foldedNeedle)) return true;

  // Multi-word terms: accept when every significant word is present.
  const words = foldedNeedle.split(" ").filter((w) => w.length > 2);
  return words.length > 1 && words.every((w) => haystackFolded.includes(w));
}

export function matchKeywords(doc: CvDoc, job: JobProfile | null): KeywordHit[] {
  if (!job) return [];
  const haystack = normalizeForMatch(docText(doc));
  const folded = foldArabicPrefixes(haystack);
  return job.keywords.map((k) => {
    const term = doc.lang === "ar" ? k.ar : k.en;
    // Tools keep their Latin name in Arabic CVs, so check both spellings.
    const found = findKeyword(haystack, folded, term) || (doc.lang === "ar" && findKeyword(haystack, folded, k.en));
    return { term, must: k.must, found };
  });
}

export function runAtsCheck(
  doc: CvDoc,
  job: JobProfile | null,
  options: { fromJobAd: boolean }
): AtsReport {
  const ar = doc.lang === "ar";
  const bullets = allBullets(doc);
  const text = docText(doc);
  const contactText = doc.contact.join(" ");

  /* ── 1. Machine readability ── */
  const hasEmail = /[^\s@]+@[^\s@]+\.[^\s@]{2,}/.test(contactText);
  const hasPhone = /\+?\d[\d\s-]{8,}/.test(contactText);
  const datesOk = doc.experience.every((x) => x.period.trim().length > 0);
  const symbolFree = !SYMBOLS.test(text);

  const parse: AtsCheck[] = [
    {
      id: "layout",
      label: "تنسيق يقرأه النظام",
      pass: true,
      detail: "عمود واحد، بدون جداول أو صور أو مربعات نص — النص يُقرأ بالترتيب الصحيح.",
      weight: 10,
    },
    {
      id: "headings",
      label: "عناوين أقسام قياسية",
      pass: true,
      detail: ar
        ? "الملخص المهني، الخبرات العملية، التعليم، المهارات — نفس المسميات اللي تبحث عنها الأنظمة."
        : "Professional Summary, Work Experience, Education, Skills — المسميات اللي تتعرف عليها الأنظمة.",
      weight: 6,
    },
    {
      id: "contact",
      label: "بيانات التواصل كاملة",
      pass: hasEmail && hasPhone,
      detail:
        hasEmail && hasPhone
          ? "البريد والجوال في أعلى الصفحة بصيغة نصية."
          : "ناقص البريد أو رقم الجوال — أضفه من «تعديل البيانات».",
      weight: 8,
    },
    {
      id: "dates",
      label: "تواريخ بصيغة موحدة",
      pass: datesOk,
      detail: datesOk
        ? ar ? "كل الخبرات بصيغة «شهر سنة – شهر سنة»." : "كل الخبرات بصيغة Mon YYYY – Mon YYYY."
        : "فيه خبرة بدون تاريخ — الأنظمة تحسب سنوات خبرتك من التواريخ.",
      weight: 6,
    },
    {
      id: "symbols",
      label: "نص نظيف بدون رموز",
      pass: symbolFree,
      detail: symbolFree ? "لا إيموجي ولا رموز زخرفية تلخبط القراءة الآلية." : "فيه رموز أو إيموجي في النص — احذفها.",
      weight: 4,
    },
  ];

  /* ── 2. Structure ── */
  const summaryWords = wordCount(doc.summary);
  const summaryOk = summaryWords >= 30 && summaryWords <= 80;
  const hasCore =
    Boolean(doc.summary) &&
    (doc.experience.length > 0 || doc.projects.length > 0) &&
    doc.education.length > 0 &&
    doc.skills.length > 0;
  const totalWords = wordCount(text);
  const lengthOk = totalWords >= 150 && totalWords <= 700;
  const skillCount = doc.skills.reduce((n, g) => n + g.items.length, 0);
  const skillsOk = skillCount >= 6 && skillCount <= 18;

  const structure: AtsCheck[] = [
    {
      id: "sections",
      label: "الأقسام الأساسية موجودة",
      pass: hasCore,
      detail: hasCore ? "ملخص، خبرات أو مشاريع، تعليم، مهارات." : "فيه قسم أساسي ناقص — كمّل بياناتك.",
      weight: 8,
    },
    {
      id: "summary",
      label: "ملخص مهني بطول مناسب",
      pass: summaryOk,
      detail: `${summaryWords} كلمة — المناسب بين 30 و80 كلمة.`,
      weight: 6,
    },
    {
      id: "length",
      label: "طول السيرة مناسب",
      pass: lengthOk,
      detail: lengthOk
        ? `${totalWords} كلمة — تقرأ في أقل من دقيقة.`
        : totalWords < 150
          ? `${totalWords} كلمة فقط — أضف تفاصيل أكثر عن خبراتك أو مشاريعك.`
          : `${totalWords} كلمة — طويلة، الأفضل تختصر الخبرات القديمة.`,
      weight: 5,
    },
    {
      id: "skills",
      label: "عدد المهارات مناسب",
      pass: skillsOk,
      detail: `${skillCount} مهارة — المناسب بين 6 و18.`,
      weight: 5,
    },
  ];

  /* ── 3. Content strength ── */
  const weakStarts = bullets.filter((b) => (ar ? AR_WEAK_STARTS : EN_WEAK_STARTS).test(b.trim()));
  const sized = bullets.filter((b) => {
    const n = wordCount(b);
    return n >= 7 && n <= 32;
  });
  const sizedRatio = bullets.length ? sized.length / bullets.length : 0;
  const numbered = bullets.filter((b) => /\d/.test(b));
  const numberRatio = bullets.length ? numbered.length / bullets.length : 0;
  const lower = text.toLowerCase();
  const cliches = (ar ? AR_CLICHES : EN_CLICHES).filter((c) => lower.includes(c));
  const pronouns = ar ? /(^|\s)(أنا|قمتُ?|لديّ?)(\s|$)/.test(text) : /\b(I|my|me|myself)\b/.test(text);

  const content: AtsCheck[] = [
    {
      id: "verbs",
      label: "كل نقطة تبدأ بفعل إنجاز",
      pass: bullets.length > 0 && weakStarts.length === 0,
      detail:
        bullets.length === 0
          ? "ما فيه نقاط خبرة بعد."
          : weakStarts.length === 0
            ? "ما فيه نقطة تبدأ بـ«مسؤول عن» أو ما شابهها."
            : `${weakStarts.length} نقطة تبدأ بصيغة ضعيفة.`,
      weight: 8,
    },
    {
      id: "numbers",
      label: "إنجازات بالأرقام",
      pass: numberRatio >= 0.3,
      detail: bullets.length
        ? numberRatio >= 0.3
          ? `${numbered.length} من ${bullets.length} نقطة فيها رقم يثبت الأثر.`
          : `${numbered.length} من ${bullets.length} نقطة فقط فيها رقم. أضف أرقاماً (كم عميل، كم ريال، كم بالمئة) من «تعديل البيانات» وأعد الإنشاء.`
        : "—",
      weight: 10,
    },
    {
      id: "bulletLength",
      label: "نقاط مركّزة",
      pass: sizedRatio >= 0.85,
      detail: sizedRatio >= 0.85 ? "كل نقطة جملة وحدة واضحة." : "بعض النقاط طويلة أو قصيرة أكثر من اللازم.",
      weight: 6,
    },
    {
      id: "cliches",
      label: "بدون عبارات مستهلكة",
      pass: cliches.length === 0,
      detail: cliches.length === 0 ? "لا «سريع التعلم» ولا «team player»." : `عبارات يتجاهلها المسؤول: ${cliches.join("، ")}`,
      weight: 4,
    },
    {
      id: "pronouns",
      label: "صياغة مهنية بدون ضمائر",
      pass: !pronouns,
      detail: !pronouns ? "مكتوبة بصيغة السير الذاتية المعتمدة." : "فيه ضمير متكلم في النص.",
      weight: 4,
    },
  ];

  /* ── 4. Job match ── */
  const keywords = matchKeywords(doc, job);
  const found = keywords.filter((k) => k.found).length;
  const must = keywords.filter((k) => k.must);
  const mustFound = must.filter((k) => k.found).length;
  const matchPercent = keywords.length ? Math.round((found / keywords.length) * 100) : 0;
  const mustRatio = must.length ? mustFound / must.length : found ? 1 : 0;

  const match: AtsCheck[] = keywords.length
    ? [
        {
          id: "mustKeywords",
          label: "الكلمات المفتاحية الأساسية",
          pass: mustRatio >= 0.7,
          detail: must.length
            ? `${mustFound} من ${must.length} كلمة أساسية موجودة في سيرتك.`
            : "لا توجد كلمات مصنفة كأساسية.",
          weight: 12,
        },
        {
          id: "allKeywords",
          label: options.fromJobAd ? "التغطية الكاملة لإعلان الوظيفة" : "التغطية لكلمات المجال",
          pass: matchPercent >= 60,
          detail: `${found} من ${keywords.length} كلمة (${matchPercent}%).`,
          weight: 8,
        },
      ]
    : [];

  const groups: AtsGroup[] = [
    { id: "parse", label: "القراءة الآلية", checks: parse },
    { id: "structure", label: "بناء السيرة", checks: structure },
    { id: "content", label: "قوة المحتوى", checks: content },
    ...(match.length ? [{ id: "match" as const, label: "المطابقة مع الوظيفة", checks: match }] : []),
  ];

  // Proportional credit where the measure is a ratio; pass/fail elsewhere.
  let earned = 0;
  let total = 0;
  for (const group of groups) {
    for (const check of group.checks) {
      total += check.weight;
      if (check.id === "numbers") earned += check.weight * Math.min(1, numberRatio / 0.3);
      else if (check.id === "mustKeywords") earned += check.weight * mustRatio;
      else if (check.id === "allKeywords") earned += check.weight * (matchPercent / 100);
      else if (check.id === "bulletLength") earned += check.weight * sizedRatio;
      else if (check.pass) earned += check.weight;
    }
  }

  return {
    score: total ? Math.round((earned / total) * 100) : 0,
    groups,
    keywords,
    matchPercent,
    fromJobAd: options.fromJobAd,
  };
}

/** Problems worth one automatic rewrite before the user ever sees the draft. */
export function criticalFixes(doc: CvDoc, report: AtsReport): string[] {
  const fixes: string[] = [];
  const ar = doc.lang === "ar";
  const failed = (id: string) => report.groups.flatMap((g) => g.checks).some((c) => c.id === id && !c.pass);

  if (failed("verbs")) {
    fixes.push(
      ar
        ? "Some bullets open with a weak form (مسؤول عن، قمت، القيام بـ). Start every bullet with a strong مصدر."
        : 'Some bullets open with a weak phrase ("Responsible for", "Worked on", "Helped"). Start every bullet with a strong verb.'
    );
  }
  if (failed("pronouns")) fixes.push("Remove all first-person pronouns.");
  if (failed("cliches")) fixes.push("Remove the clichés and unproven adjectives.");
  if (failed("bulletLength")) fixes.push("Keep every bullet to one sentence of 12–26 words.");
  if (failed("summary")) fixes.push("The summary must be 45–65 words in 3 sentences.");
  if (failed("symbols")) fixes.push("Remove emojis and decorative symbols.");
  return fixes;
}

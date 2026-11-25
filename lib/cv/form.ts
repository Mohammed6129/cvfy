import type {
  CareerLevel,
  CvForm,
  CvLang,
  FormCertificate,
  FormEducation,
  FormExperience,
  FormProject,
  LanguageLevel,
} from "./types";

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/* ───────────── Reference lists ───────────── */

export const CITIES: { ar: string; en: string }[] = [
  { ar: "الرياض", en: "Riyadh" },
  { ar: "جدة", en: "Jeddah" },
  { ar: "مكة المكرمة", en: "Makkah" },
  { ar: "المدينة المنورة", en: "Madinah" },
  { ar: "الدمام", en: "Dammam" },
  { ar: "الخبر", en: "Khobar" },
  { ar: "الظهران", en: "Dhahran" },
  { ar: "الجبيل", en: "Jubail" },
  { ar: "الأحساء", en: "Al-Ahsa" },
  { ar: "القطيف", en: "Qatif" },
  { ar: "الطائف", en: "Taif" },
  { ar: "بريدة", en: "Buraydah" },
  { ar: "عنيزة", en: "Unaizah" },
  { ar: "تبوك", en: "Tabuk" },
  { ar: "حائل", en: "Hail" },
  { ar: "أبها", en: "Abha" },
  { ar: "خميس مشيط", en: "Khamis Mushait" },
  { ar: "جازان", en: "Jazan" },
  { ar: "نجران", en: "Najran" },
  { ar: "ينبع", en: "Yanbu" },
  { ar: "الخرج", en: "Al-Kharj" },
  { ar: "حفر الباطن", en: "Hafar Al-Batin" },
  { ar: "عرعر", en: "Arar" },
  { ar: "سكاكا", en: "Sakaka" },
  { ar: "الباحة", en: "Al-Baha" },
  { ar: "القريات", en: "Qurayyat" },
];

export function cityIn(city: string, lang: CvLang): string {
  const trimmed = city.trim();
  const hit = CITIES.find((c) => c.ar === trimmed || c.en.toLowerCase() === trimmed.toLowerCase());
  if (!hit) return trimmed;
  return lang === "ar" ? `${hit.ar}، السعودية` : `${hit.en}, Saudi Arabia`;
}

export const LEVELS: { id: CareerLevel; label: string; hint: string }[] = [
  { id: "student", label: "طالب", hint: "تدريب تعاوني أو وظيفة جزئية" },
  { id: "fresh", label: "حديث تخرج", hint: "أول وظيفة بعد الدراسة" },
  { id: "junior", label: "خبرة 1–3 سنوات", hint: "" },
  { id: "mid", label: "خبرة 4–8 سنوات", hint: "" },
  { id: "senior", label: "خبرة أكثر من 8 سنوات", hint: "أو منصب قيادي" },
];

export const DEGREES: { id: FormEducation["level"]; ar: string; en: string }[] = [
  { id: "bachelor", ar: "بكالوريوس", en: "Bachelor's" },
  { id: "diploma", ar: "دبلوم", en: "Diploma" },
  { id: "master", ar: "ماجستير", en: "Master's" },
  { id: "phd", ar: "دكتوراه", en: "PhD" },
  { id: "highschool", ar: "ثانوية عامة", en: "High School" },
  { id: "other", ar: "أخرى", en: "Other" },
];

export const LANGUAGE_LEVELS: { id: LanguageLevel; ar: string; en: string }[] = [
  { id: "native", ar: "اللغة الأم", en: "Native" },
  { id: "fluent", ar: "طلاقة", en: "Fluent" },
  { id: "good", ar: "جيد", en: "Professional working proficiency" },
  { id: "basic", ar: "مبتدئ", en: "Basic" },
];

/** Why it is asked: Saudization quotas make this the first filter for many roles. */
export const RESIDENCY_OPTIONS: { id: string; label: string; ar: string; en: string }[] = [
  { id: "saudi", label: "سعودي / سعودية", ar: "الجنسية: السعودية", en: "Saudi National" },
  { id: "resident", label: "مقيم بإقامة قابلة للتحويل", ar: "مقيم – إقامة قابلة للتحويل", en: "Resident – Transferable Iqama" },
  { id: "", label: "لا تذكرها في السيرة", ar: "", en: "" },
];

export function residencyLine(id: string, lang: CvLang): string {
  const hit = RESIDENCY_OPTIONS.find((o) => o.id === id);
  return hit ? (lang === "ar" ? hit.ar : hit.en) : "";
}

export const EXPERIENCE_KINDS: { id: FormExperience["kind"]; label: string }[] = [
  { id: "job", label: "وظيفة" },
  { id: "training", label: "تدريب" },
  { id: "volunteer", label: "تطوع" },
];

const MONTHS_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const MONTH_OPTIONS = MONTHS_AR.map((label, i) => ({
  value: String(i + 1).padStart(2, "0"),
  label,
}));

export function yearOptions(from = 1985): string[] {
  const now = new Date().getFullYear();
  const out: string[] = [];
  for (let y = now + 1; y >= from; y--) out.push(String(y));
  return out;
}

/* ───────────── Date formatting — done by code so every CV is consistent ───────────── */

export function formatYm(ym: string, lang: CvLang): string {
  const [y, m] = ym.split("-");
  if (!y) return "";
  const idx = Number(m) - 1;
  if (!m || idx < 0 || idx > 11) return y;
  return lang === "ar" ? `${MONTHS_AR[idx]} ${y}` : `${MONTHS_EN[idx]} ${y}`;
}

export function formatPeriod(
  start: string,
  end: string,
  current: boolean,
  lang: CvLang
): string {
  const from = formatYm(start, lang);
  const to = current ? (lang === "ar" ? "حتى الآن" : "Present") : formatYm(end, lang);
  if (from && to) return `${from} – ${to}`;
  return from || to;
}

/** Total months across all jobs — used to state years of experience truthfully. */
export function totalExperienceMonths(items: FormExperience[]): number {
  const now = new Date();
  let months = 0;
  for (const item of items) {
    if (item.kind !== "job" || !item.start) continue;
    const [sy, sm] = item.start.split("-").map(Number);
    let ey = now.getFullYear();
    let em = now.getMonth() + 1;
    if (!item.current && item.end) {
      [ey, em] = item.end.split("-").map(Number);
    }
    const span = (ey - sy) * 12 + ((em || 1) - (sm || 1));
    if (span > 0) months += span;
  }
  return months;
}

/* ───────────── Factories ───────────── */

export function emptyExperience(kind: FormExperience["kind"] = "job"): FormExperience {
  return { id: newId(), kind, title: "", company: "", start: "", end: "", current: false, description: "" };
}

export function emptyEducation(): FormEducation {
  return { id: newId(), level: "bachelor", major: "", institution: "", year: "", gpa: "" };
}

export function emptyCertificate(): FormCertificate {
  return { id: newId(), name: "", issuer: "", year: "" };
}

export function emptyProject(): FormProject {
  return { id: newId(), name: "", description: "" };
}

export function emptyForm(): CvForm {
  return {
    v: 2,
    primaryLang: "en",
    target: { jobTitle: "", level: "junior", jobAd: "" },
    personal: { nameAr: "", nameEn: "", email: "", phone: "", city: "", nationality: "saudi", linkedIn: "" },
    experience: [emptyExperience()],
    education: [emptyEducation()],
    projects: [],
    skills: [],
    certificates: [],
    languages: { arabic: "native", english: "good" },
    notes: "",
  };
}

/* ───────────── Normalizing & validation ───────────── */

export function normalizePhone(input: string): string {
  let digits = input.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("966")) return `+${digits}`;
  if (digits.startsWith("05") && digits.length === 10) return `+966${digits.slice(1)}`;
  if (digits.startsWith("5") && digits.length === 9) return `+966${digits}`;
  return digits ? `+${digits}` : "";
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  const n = normalizePhone(phone);
  return /^\+\d{9,15}$/.test(n);
}

const LINKEDIN_RE = /^(?:https?:\/\/)?(?:[a-z]{2,3}\.)?linkedin\.com\/in\/([\w%-]+)\/?(?:\?.*)?$/i;

export function normalizeLinkedIn(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  const match = trimmed.match(LINKEDIN_RE);
  return match?.[1] ? `linkedin.com/in/${match[1]}` : trimmed;
}

export function isValidLinkedIn(url: string): boolean {
  const trimmed = url.trim();
  return !trimmed || LINKEDIN_RE.test(trimmed);
}

export function needsWorkHistory(level: CareerLevel): boolean {
  return level !== "student" && level !== "fresh";
}

export type FormErrors = Record<string, string>;

/**
 * Three short screens: the job (and CV language), you (contact + education),
 * your experience. Skills are not asked for — the writer derives them from the
 * experience and the job ad, and they can be added under "extras".
 */
export const FORM_STEPS = ["target", "about", "experience"] as const;
export type FormStep = (typeof FORM_STEPS)[number];

/** Which screen a validation key belongs to, so errors can send the user to the right place. */
export function stepForField(key: string): number {
  if (key.startsWith("target")) return 0;
  if (key.startsWith("personal") || key.startsWith("education")) return 1;
  return 2;
}

const ARABIC_LETTERS = /[\u0600-\u06FF]/;

export function hasArabic(text: string): boolean {
  return ARABIC_LETTERS.test(text);
}

/** The name field that belongs to a CV language. */
export function nameKey(lang: CvLang): "nameAr" | "nameEn" {
  return lang === "ar" ? "nameAr" : "nameEn";
}

export function validateStep(step: FormStep, form: CvForm): FormErrors {
  const e: FormErrors = {};

  if (step === "target") {
    if (form.target.jobTitle.trim().length < 2) e["target.jobTitle"] = "اكتب الوظيفة اللي تبغى تقدّم عليها";
  }

  if (step === "about") {
    const p = form.personal;
    const lang = form.primaryLang;
    const name = p[nameKey(lang)].trim();
    if (name.length < 3) e["personal.name"] = lang === "ar" ? "اكتب اسمك" : "اكتب اسمك بالإنجليزي";
    else if (lang === "en" && hasArabic(name)) e["personal.name"] = "اكتب الاسم بحروف إنجليزية";
    else if (lang === "ar" && !hasArabic(name)) e["personal.name"] = "اكتب الاسم بالعربي";
    const other = p[nameKey(lang === "ar" ? "en" : "ar")].trim();
    if (other && lang === "ar" && hasArabic(other)) e["personal.otherName"] = "اكتب الاسم بحروف إنجليزية";
    if (!p.phone.trim()) e["personal.phone"] = "اكتب رقم جوالك";
    else if (!isValidPhone(p.phone)) e["personal.phone"] = "الرقم غير صحيح، مثال: 0501234567";
    if (!p.email.trim()) e["personal.email"] = "اكتب إيميلك";
    else if (!isValidEmail(p.email)) e["personal.email"] = "الإيميل غير صحيح، مثال: name@gmail.com";
    if (!p.city.trim()) e["personal.city"] = "اختر مدينتك";
    if (!isValidLinkedIn(p.linkedIn)) e["personal.linkedIn"] = "الرابط يكون بهذا الشكل: linkedin.com/in/username";

    const filled = form.education.filter((x) => x.major.trim() || x.institution.trim());
    if (filled.length === 0) e["education"] = "أضف مؤهلك الدراسي";
    for (const x of filled) {
      if (!x.institution.trim()) e[`education.${x.id}.institution`] = "اسم الجامعة أو المدرسة مطلوب";
      if (x.level !== "highschool" && !x.major.trim()) e[`education.${x.id}.major`] = "التخصص مطلوب";
      if (!x.year) e[`education.${x.id}.year`] = "اختر سنة التخرج";
    }
  }

  if (step === "experience") {
    const filled = form.experience.filter((x) => x.title.trim() || x.company.trim() || x.description.trim());
    if (needsWorkHistory(form.target.level) && filled.length === 0) {
      e["experience"] = "أضف خبرة وحدة على الأقل";
    }
    for (const x of filled) {
      if (!x.title.trim()) e[`experience.${x.id}.title`] = "المسمى مطلوب";
      if (!x.company.trim()) e[`experience.${x.id}.company`] = "اسم الجهة مطلوب";
      if (!x.start) e[`experience.${x.id}.start`] = "اختر سنة البداية";
      if (!x.current && !x.end) e[`experience.${x.id}.end`] = "اختر سنة النهاية أو «لسا فيها»";
      if (x.start && x.end && !x.current && x.end.slice(0, 4) < x.start.slice(0, 4)) {
        e[`experience.${x.id}.end`] = "سنة النهاية قبل البداية";
      }
      if (x.description.trim().length < 15) {
        e[`experience.${x.id}.description`] = "اكتب جملتين على الأقل عن اللي كنت تسويه";
      }
    }
  }

  return e;
}

/**
 * Validation runs on the cleaned form, where an untouched card is dropped and
 * the error becomes "add at least one". The user is looking at that empty
 * card, so mark its fields instead.
 */
export function pinToEmptyCards(found: FormErrors, raw: CvForm): FormErrors {
  const out: FormErrors = { ...found };

  const edu = raw.education[0];
  if (out["education"] && edu) {
    delete out["education"];
    if (edu.level !== "highschool") out[`education.${edu.id}.major`] = "اكتب تخصصك";
    out[`education.${edu.id}.institution`] = edu.level === "highschool" ? "اكتب اسم المدرسة" : "اكتب اسم الجامعة أو الكلية";
    if (!edu.year) out[`education.${edu.id}.year`] = "اختر سنة التخرج";
  }

  const job = raw.experience[0];
  if (out["experience"] && job) {
    out[`experience.${job.id}.title`] = "اكتب المسمى";
    out[`experience.${job.id}.company`] = "اكتب اسم الجهة";
    if (!job.start) out[`experience.${job.id}.start`] = "اختر سنة البداية";
    out[`experience.${job.id}.description`] = "اكتب جملتين عن اللي كنت تسويه";
  }

  return out;
}

/* ───────────── Inferred, not asked ───────────── */

const TRAINING_TITLE = /متدرب|تدريب|تعاوني|تمهير|intern|trainee|co-?op|apprentic/i;
const VOLUNTEER_TITLE = /تطوع|متطوع|volunteer/i;

/** Job, training or volunteering — read from the title instead of asking. */
export function inferKind(title: string, given: FormExperience["kind"] | undefined): FormExperience["kind"] {
  if (TRAINING_TITLE.test(title)) return "training";
  if (VOLUNTEER_TITLE.test(title)) return "volunteer";
  return given === "training" || given === "volunteer" ? given : "job";
}

/**
 * The form only asks "do you have work experience?". The exact stage comes
 * from the dates: years of real jobs, or — without experience — whether the
 * graduation year is still ahead.
 */
export function inferLevel(level: CareerLevel, experience: FormExperience[], education: FormEducation[]): CareerLevel {
  if (level === "student" || level === "fresh") {
    const latest = Math.max(0, ...education.map((e) => Number(e.year) || 0));
    return latest > new Date().getFullYear() ? "student" : "fresh";
  }
  const months = totalExperienceMonths(experience);
  if (months < 48) return "junior";
  if (months < 96) return "mid";
  return "senior";
}

/** Trim, drop empty rows, normalize contact fields. Safe to run on untrusted input. */
export function cleanForm(input: CvForm): CvForm {
  const s = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
  const levelIds = LEVELS.map((l) => l.id);
  const degreeIds = DEGREES.map((d) => d.id);
  const langIds = LANGUAGE_LEVELS.map((l) => l.id);

  const experience: FormExperience[] = arr<FormExperience>(input.experience)
    .filter((x) => s(x?.title) || s(x?.company) || s(x?.description))
    .slice(0, 8)
    .map((x) => ({
      id: s(x.id, 20) || newId(),
      kind: inferKind(s(x.title, 120), x.kind),
      title: s(x.title, 120),
      company: s(x.company, 120),
      start: /^\d{4}(-\d{2})?$/.test(s(x.start)) ? s(x.start) : "",
      end: x.current ? "" : /^\d{4}(-\d{2})?$/.test(s(x.end)) ? s(x.end) : "",
      current: Boolean(x.current),
      description: s(x.description, 2500),
    }));

  const education: FormEducation[] = arr<FormEducation>(input.education)
    .filter((x) => s(x?.major) || s(x?.institution))
    .slice(0, 4)
    .map((x) => ({
      id: s(x.id, 20) || newId(),
      level: degreeIds.includes(x.level) ? x.level : "bachelor",
      major: s(x.major, 120),
      institution: s(x.institution, 120),
      year: /^\d{4}$/.test(s(x.year)) ? s(x.year) : "",
      gpa: s(x.gpa, 20),
    }));

  const givenLevel: CareerLevel = levelIds.includes(input.target?.level) ? input.target.level : "junior";

  return {
    v: 2,
    primaryLang: input.primaryLang === "ar" ? "ar" : "en",
    target: {
      jobTitle: s(input.target?.jobTitle, 120),
      level: inferLevel(givenLevel, experience, education),
      jobAd: s(input.target?.jobAd, 6000),
    },
    personal: {
      nameAr: s(input.personal?.nameAr, 80),
      nameEn: s(input.personal?.nameEn, 80),
      email: s(input.personal?.email, 120).toLowerCase(),
      phone: normalizePhone(s(input.personal?.phone, 30)),
      city: s(input.personal?.city, 60),
      nationality: input.personal?.nationality === "resident" ? "resident" : input.personal?.nationality === "" ? "" : "saudi",
      linkedIn: normalizeLinkedIn(s(input.personal?.linkedIn, 160)),
    },
    experience,
    education,
    projects: arr<FormProject>(input.projects)
      .filter((x) => s(x?.name) || s(x?.description))
      .slice(0, 4)
      .map((x) => ({ id: s(x.id, 20) || newId(), name: s(x.name, 120), description: s(x.description, 1200) })),
    skills: Array.from(new Set(arr<string>(input.skills).map((x) => s(x, 60)).filter(Boolean))).slice(0, 30),
    certificates: arr<FormCertificate>(input.certificates)
      .filter((x) => s(x?.name))
      .slice(0, 8)
      .map((x) => ({
        id: s(x.id, 20) || newId(),
        name: s(x.name, 140),
        issuer: s(x.issuer, 120),
        year: /^\d{4}$/.test(s(x.year)) ? s(x.year) : "",
      })),
    languages: {
      arabic: langIds.includes(input.languages?.arabic) ? input.languages.arabic : "native",
      english: langIds.includes(input.languages?.english) ? input.languages.english : "good",
    },
    notes: s(input.notes, 1500),
  };
}

/** Whole-form check used server-side before spending an AI call. */
export function validateForm(form: CvForm): FormErrors {
  return FORM_STEPS.reduce<FormErrors>((all, step) => ({ ...all, ...validateStep(step, form) }), {});
}

/* ───────────── Skill suggestions by field ─────────────
   Small, hand-picked lists so the user is one tap away from the terms
   recruiters actually search for. Matched loosely on the target title. */
const SKILL_SETS: { match: RegExp; skills: string[] }[] = [
  { match: /محاسب|مالي|مالية|account|financ|audit|مراجع/i, skills: ["إعداد القوائم المالية", "التسويات البنكية", "IFRS", "ضريبة القيمة المضافة", "SAP", "Excel المتقدم", "إعداد الموازنات", "التحليل المالي"] },
  { match: /موارد بشرية|hr|توظيف|recruit|شؤون الموظفين/i, skills: ["التوظيف والاستقطاب", "نظام العمل السعودي", "قوى ومدد", "GOSI", "إدارة الأداء", "الرواتب", "SuccessFactors", "السعودة"] },
  { match: /تسويق|market|سوشل|محتوى|content|brand/i, skills: ["التسويق الرقمي", "إدارة الحملات", "Google Analytics", "Meta Ads", "كتابة المحتوى", "SEO", "تحليل الأداء", "إدارة الميزانيات"] },
  { match: /مبيعات|sales|أعمال|business dev|حسابات عملاء|account manager/i, skills: ["إدارة علاقات العملاء", "CRM", "التفاوض", "تحقيق المستهدفات", "تطوير الأعمال", "العروض التقديمية", "Salesforce", "تحليل السوق"] },
  { match: /مشاريع|project|pmo|برنامج/i, skills: ["إدارة المشاريع", "PMP", "Agile", "إدارة المخاطر", "إدارة أصحاب المصلحة", "MS Project", "إعداد التقارير", "إدارة الميزانيات"] },
  { match: /مهندس برمج|مطور|developer|software|برمجة|frontend|backend|full.?stack/i, skills: ["JavaScript", "Python", "SQL", "React", "Git", "REST APIs", "AWS", "Agile"] },
  { match: /بيانات|data|تحليل|analyst|ذكاء أعمال|bi/i, skills: ["SQL", "Power BI", "Excel المتقدم", "Python", "تحليل البيانات", "Tableau", "إعداد لوحات المعلومات", "التقارير"] },
  { match: /خدمة عملاء|customer|call center|دعم/i, skills: ["خدمة العملاء", "حل المشكلات", "CRM", "التواصل الفعّال", "إدارة الشكاوى", "العمل تحت الضغط", "Excel", "إدخال البيانات"] },
  { match: /إداري|سكرتير|admin|مساعد|office|تنفيذي/i, skills: ["إدارة المكاتب", "تنظيم الاجتماعات", "المراسلات الرسمية", "Microsoft Office", "إدخال البيانات", "الأرشفة", "إدارة الوقت", "خدمة العملاء"] },
  { match: /مهندس|engineer|هندس/i, skills: ["AutoCAD", "إدارة المشاريع", "إعداد التقارير الفنية", "ضبط الجودة", "السلامة المهنية", "قراءة المخططات", "MS Project", "حل المشكلات"] },
  { match: /ممرض|تمريض|nurs|صحي|طبي|medical|صيدل|pharm/i, skills: ["رعاية المرضى", "BLS", "التوثيق الطبي", "مكافحة العدوى", "سلامة المرضى", "العمل ضمن فريق", "التثقيف الصحي", "إدارة الأدوية"] },
  { match: /معلم|تدريس|teach|تعليم|مدرب|train/i, skills: ["تخطيط الدروس", "إدارة الصف", "التقويم", "التعليم الإلكتروني", "تطوير المناهج", "التواصل مع أولياء الأمور", "Microsoft Teams", "العروض التقديمية"] },
  { match: /مصمم|design|جرافيك|ux|ui/i, skills: ["Adobe Photoshop", "Illustrator", "Figma", "الهوية البصرية", "تصميم واجهات المستخدم", "Motion Graphics", "إدارة المشاريع الإبداعية", "InDesign"] },
  { match: /مشتريات|إمداد|supply|logistic|مستودع|مخزون|procure/i, skills: ["إدارة سلاسل الإمداد", "المشتريات", "إدارة المخزون", "التفاوض مع الموردين", "SAP", "Oracle", "تخطيط الطلب", "الخدمات اللوجستية"] },
  { match: /قانون|محام|legal|امتثال|complian/i, skills: ["صياغة العقود", "البحث القانوني", "الامتثال", "الأنظمة السعودية", "نظام الشركات", "التقاضي", "حوكمة الشركات", "إعداد المذكرات"] },
];

const GENERAL_SKILLS = ["Microsoft Office", "Excel", "إعداد التقارير", "التواصل الفعّال", "العمل ضمن فريق", "إدارة الوقت", "حل المشكلات", "اللغة الإنجليزية"];

export function suggestSkills(jobTitle: string): string[] {
  const hit = SKILL_SETS.find((set) => set.match.test(jobTitle));
  return hit ? hit.skills : GENERAL_SKILLS;
}

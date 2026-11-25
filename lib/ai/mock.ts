/**
 * Canned AI answers for local development (CVFY_MOCK=1, never in production).
 * Realistic lengths so layouts, PDFs and the ATS checker can be exercised
 * without an API key.
 */
import type { CvForm, CvLang, JobProfile } from "@/lib/cv/types";
import type { WriterOutput } from "./write";

export function mockInterview(form: CvForm): {
  job: JobProfile;
  questions: { question: string; example: string }[];
} {
  const first = form.experience[0];
  return {
    job: {
      titleEn: "HR Specialist",
      titleAr: form.target.jobTitle || "أخصائي موارد بشرية",
      keywords: [
        { en: "Recruitment", ar: "التوظيف", must: true },
        { en: "Onboarding", ar: "تهيئة الموظفين", must: true },
        { en: "Saudi Labor Law", ar: "نظام العمل السعودي", must: true },
        { en: "Qiwa", ar: "قوى", must: true },
        { en: "GOSI", ar: "التأمينات الاجتماعية", must: false },
        { en: "Payroll", ar: "الرواتب", must: false },
        { en: "SAP SuccessFactors", ar: "SAP SuccessFactors", must: false },
        { en: "Performance Management", ar: "إدارة الأداء", must: false },
        { en: "HR Reporting", ar: "تقارير الموارد البشرية", must: false },
        { en: "Excel", ar: "Excel", must: false },
      ],
    },
    questions: [
      {
        question: `في شغلك مع ${first?.company || "آخر جهة اشتغلت فيها"}، كم وظيفة تقريباً سكّرتها بالسنة؟`,
        example: "تقريباً 40 وظيفة بالسنة، أغلبها مبيعات وخدمة عملاء",
      },
      {
        question: "الإعلان يطلب خبرة في منصة قوى — وش كنت تسوي عليها بالضبط؟",
        example: "أوثّق العقود وأحدّث بيانات 120 موظف",
      },
      {
        question: "التقارير الشهرية اللي ذكرتها، كانت تروح لمين وكم تقرير بالشهر؟",
        example: "3 تقارير شهرياً لمدير الموارد البشرية",
      },
    ],
  };
}

export function mockWrite(form: CvForm, lang: CvLang): WriterOutput {
  const en = lang === "en";

  const bulletsEn = [
    "Managed full-cycle recruitment for 40+ positions annually across sales and customer service, cutting average time-to-hire by 25%.",
    "Documented employment contracts and maintained records for 120 employees on Qiwa in line with Saudi Labor Law.",
    "Prepared 3 monthly HR reports for senior management covering headcount, turnover, and Saudization rates.",
    "Coordinated onboarding for new hires, reducing first-week setup issues through a standardized checklist.",
  ];
  const bulletsAr = [
    "إدارة دورة التوظيف الكاملة لأكثر من 40 وظيفة سنوياً في المبيعات وخدمة العملاء، مع خفض متوسط مدة التعيين بنسبة 25%.",
    "توثيق عقود العمل وتحديث بيانات 120 موظفاً عبر منصة قوى بما يتوافق مع نظام العمل السعودي.",
    "إعداد 3 تقارير شهرية للإدارة العليا تغطي أعداد الموظفين ومعدل الدوران ونسب السعودة.",
    "تنسيق تهيئة الموظفين الجدد وفق قائمة موحدة قلّصت مشكلات الأسبوع الأول.",
  ];

  return {
    name: en ? form.personal.nameEn || "Sarah Alotaibi" : form.personal.nameAr || "سارة العتيبي",
    headline: en ? "HR Specialist | Recruitment & Employee Relations" : form.target.jobTitle || "أخصائي موارد بشرية",
    summary: en
      ? "HR Specialist with 3 years of experience in recruitment and employee relations in the FMCG sector. Filled 40+ positions a year while cutting time-to-hire by 25%, and maintained Qiwa records for 120 employees. Brings hands-on knowledge of Saudi Labor Law, onboarding, and HR reporting to a growing team."
      : "أخصائية موارد بشرية بخبرة 3 سنوات في التوظيف وعلاقات الموظفين في قطاع السلع الاستهلاكية. شغل أكثر من 40 وظيفة سنوياً مع خفض مدة التعيين بنسبة 25%، وإدارة سجلات 120 موظفاً عبر منصة قوى. خبرة عملية في نظام العمل السعودي وتهيئة الموظفين وتقارير الموارد البشرية.",
    experience: form.experience.map((x, i) => ({
      refId: x.id,
      title: en ? (i === 0 ? "HR Coordinator" : "HR Assistant") : x.title,
      company: en ? (i === 0 ? "Almarai Company" : "Company") : x.company,
      bullets: (en ? bulletsEn : bulletsAr).slice(0, i === 0 ? 4 : 2),
    })),
    projects: form.projects.map((p) => ({
      name: p.name,
      bullets: en
        ? ["Built a tracking sheet in Excel that consolidated attendance data for 4 departments."]
        : ["بناء ملف متابعة على Excel يجمع بيانات الحضور لأربع إدارات."],
    })),
    education: form.education.map((e) => ({
      refId: e.id,
      degree: en ? "Bachelor of Business Administration, Human Resources" : `بكالوريوس ${e.major}`,
      institution: en ? "King Saud University" : e.institution,
    })),
    skills: en
      ? [
          { label: "Core Competencies", items: ["Recruitment", "Onboarding", "Saudi Labor Law", "HR Reporting", "Employee Relations"] },
          { label: "Tools & Systems", items: ["Qiwa", "GOSI", "Excel", "Mudad"] },
        ]
      : [
          { label: "المهارات المهنية", items: ["التوظيف", "تهيئة الموظفين", "نظام العمل السعودي", "تقارير الموارد البشرية", "علاقات الموظفين"] },
          { label: "الأنظمة والأدوات", items: ["قوى", "التأمينات الاجتماعية", "Excel", "مدد"] },
        ],
    certificates: form.certificates.map((c) => ({ refId: c.id, name: c.name, issuer: c.issuer })),
    missingKeywords: en ? ["Payroll", "SAP SuccessFactors", "Performance Management"] : ["الرواتب", "SAP SuccessFactors", "إدارة الأداء"],
  };
}

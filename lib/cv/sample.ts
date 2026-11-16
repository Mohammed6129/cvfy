import type { CvDoc } from "./types";

/**
 * Illustrative CV used on the landing page. The person is fictional, and
 * every number in it comes from the "before" note shown beside it — the
 * same rule the real writer follows.
 */
export const SAMPLE_BEFORE =
  "كنت أرد على العملاء بالجوال والشات، تقريباً 40 عميل باليوم، وأحل مشاكل الفواتير. سويت ملف إكسل نتابع فيه الشكاوى، ودربت 6 موظفين جدد.";

export const SAMPLE_KEYWORDS_EN = ["customer inquiries", "billing", "Excel", "complaint", "CRM", "Trained"];
export const SAMPLE_KEYWORDS_AR = ["استفسارات العملاء", "الفواتير", "Excel", "الشكاوى", "CRM", "تدريب"];

export const SAMPLE_EN: CvDoc = {
  lang: "en",
  name: "Sarah Alahmad",
  headline: "Customer Service Specialist | Telecom Support",
  contact: ["Riyadh, Saudi Arabia", "+966500000000", "sarah.alahmad@email.com", "linkedin.com/in/sarah-alahmad", "Saudi National"],
  summary:
    "Customer Service Specialist with 4 years of experience in telecom support. Resolved 40+ customer inquiries daily across phone and chat, and trained 6 new agents on billing procedures. Brings complaint handling, CRM, and reporting skills to a customer experience team.",
  experience: [
    {
      refId: "s1",
      title: "Customer Service Representative",
      company: "Riyadh Telecom Solutions",
      period: "Mar 2022 – Present",
      bullets: [
        "Resolve 40+ customer inquiries daily across phone and chat, with a focus on billing disputes.",
        "Built an Excel complaint tracker that gave the team one shared view of open cases.",
        "Trained 6 new agents on billing procedures and the CRM workflow.",
      ],
    },
    {
      refId: "s2",
      title: "Sales Associate",
      company: "Al Waha Retail",
      period: "Jun 2021 – Feb 2022",
      bullets: [
        "Served walk-in customers and processed returns in line with store policy.",
        "Kept daily sales records and reconciled the cash register at closing.",
      ],
    },
  ],
  projects: [],
  education: [
    { degree: "Bachelor of Business Administration", institution: "King Saud University", year: "2021", detail: "GPA: 4.4/5" },
  ],
  skills: [
    { label: "Core Skills", items: ["Customer Service", "Complaint Handling", "Billing Support", "Agent Training"] },
    { label: "Tools", items: ["CRM", "Excel", "Microsoft Office"] },
  ],
  certificates: [],
  languages: [
    { name: "Arabic", level: "Native" },
    { name: "English", level: "Professional working proficiency" },
  ],
  educationFirst: false,
};

export const SAMPLE_AR: CvDoc = {
  lang: "ar",
  name: "سارة الأحمد",
  headline: "أخصائية خدمة عملاء | دعم قطاع الاتصالات",
  contact: ["الرياض، السعودية", "+966500000000", "sarah.alahmad@email.com", "linkedin.com/in/sarah-alahmad", "الجنسية: السعودية"],
  summary:
    "أخصائية خدمة عملاء بخبرة 4 سنوات في دعم قطاع الاتصالات. معالجة أكثر من 40 من استفسارات العملاء يومياً عبر الهاتف والمحادثة، وتدريب 6 موظفين جدد على إجراءات الفواتير. خبرة في معالجة الشكاوى وأنظمة CRM وإعداد التقارير.",
  experience: [
    {
      refId: "s1",
      title: "ممثلة خدمة عملاء",
      company: "حلول الرياض للاتصالات",
      period: "مارس 2022 – حتى الآن",
      bullets: [
        "معالجة أكثر من 40 من استفسارات العملاء يومياً عبر الهاتف والمحادثة، مع التركيز على اعتراضات الفواتير.",
        "بناء ملف Excel لمتابعة الشكاوى وفّر للفريق عرضاً موحداً للحالات المفتوحة.",
        "تدريب 6 موظفين جدد على إجراءات الفواتير وآلية العمل على نظام CRM.",
      ],
    },
    {
      refId: "s2",
      title: "موظفة مبيعات",
      company: "الواحة للتجزئة",
      period: "يونيو 2021 – فبراير 2022",
      bullets: [
        "خدمة عملاء المعرض ومعالجة طلبات الاسترجاع وفق سياسة المتجر.",
        "توثيق المبيعات اليومية ومطابقة الصندوق عند الإغلاق.",
      ],
    },
  ],
  projects: [],
  education: [
    { degree: "بكالوريوس إدارة الأعمال", institution: "جامعة الملك سعود", year: "2021", detail: "المعدل: 4.4 من 5" },
  ],
  skills: [
    { label: "المهارات المهنية", items: ["خدمة العملاء", "معالجة الشكاوى", "دعم الفواتير", "تدريب الموظفين"] },
    { label: "الأنظمة والأدوات", items: ["CRM", "Excel", "Microsoft Office"] },
  ],
  certificates: [],
  languages: [
    { name: "العربية", level: "اللغة الأم" },
    { name: "الإنجليزية", level: "جيد" },
  ],
  educationFirst: false,
};

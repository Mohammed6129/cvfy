export const SAUDI_CITIES = [
  "الرياض",
  "جدة",
  "مكة المكرمة",
  "المدينة المنورة",
  "الدمام",
  "الخبر",
  "الظهران",
  "الطائف",
  "بريدة",
  "تبوك",
  "خميس مشيط",
  "الهفوف",
  "حائل",
  "نجران",
  "جازان",
  "ينبع",
  "الجبيل",
  "أبها",
  "القطيف",
  "الخرج",
  "الأحساء",
  "عرعر",
  "سكاكا",
  "الباحة",
  "القريات",
];

export const SUGGESTED_SKILLS = [
  "Excel",
  "PowerPoint",
  "Word",
  "إدارة المشاريع",
  "التسويق الرقمي",
  "تحليل البيانات",
  "التواصل",
  "القيادة",
  "SAP",
  "Photoshop",
  "Python",
  "JavaScript",
  "إدارة الوقت",
  "خدمة العملاء",
  "التفاوض",
];

export const MONTHS = [
  { value: "01", label: "يناير" },
  { value: "02", label: "فبراير" },
  { value: "03", label: "مارس" },
  { value: "04", label: "أبريل" },
  { value: "05", label: "مايو" },
  { value: "06", label: "يونيو" },
  { value: "07", label: "يوليو" },
  { value: "08", label: "أغسطس" },
  { value: "09", label: "سبتمبر" },
  { value: "10", label: "أكتوبر" },
  { value: "11", label: "نوفمبر" },
  { value: "12", label: "ديسمبر" },
];

export const GRADUATION_YEARS = Array.from(
  { length: new Date().getFullYear() - 1989 },
  (_, i) => String(new Date().getFullYear() - i)
);

export const WORK_YEARS = Array.from(
  { length: new Date().getFullYear() - 1979 },
  (_, i) => String(new Date().getFullYear() - i)
);

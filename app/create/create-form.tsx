"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "@/app/components/loading-spinner";
import {
  GRADUATION_YEARS,
  MONTHS,
  SAUDI_CITIES,
  SUGGESTED_SKILLS,
  WORK_YEARS,
} from "@/lib/create-form-constants";
import {
  CURRENT_CV_ID_KEY,
  STORAGE_KEY,
  loadCvFromAccount,
  saveCvToAccount,
} from "@/lib/cv-storage";
import { prepareCvPayload } from "@/lib/prepare-cv-payload";
import type { CvFormData, GeneratedCv } from "@/lib/cv-types";

const BRAND = "#378ADD";
const TOTAL_STEPS = 6;
const MAX_EXPERIENCES = 5;
const MANDATORY_MSG =
  "يجب تعبئة جميع الحقول لضمان سيرة ذاتية مثالية تطابق نظام ATS";

const STEP_TITLES = [
  "المعلومات الشخصية",
  "الخبرات العملية",
  "التعليم",
  "المهارات",
  "الدورات والشهادات",
  "نبذة عنك",
];

const START_NOTICE =
  "بعد تعبئة الفورم ستحصل على نسختين: عربي وإنجليزي. ملاحظة: السيرة الإنجليزية دائماً أفضل وتُفضّلها الشركات والجهات أكثر من العربية";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#378ADD] focus:ring-2 focus:ring-[#378ADD]/20";

const selectClass =
  "w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-colors focus:border-[#378ADD] focus:ring-2 focus:ring-[#378ADD]/20";

const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

type FormData = CvFormData;

function newId() {
  return Math.random().toString(36).slice(2, 11);
}

function emptyWork(): FormData["workExperience"][number] {
  return {
    id: newId(),
    jobTitle: "",
    company: "",
    department: "",
    startDate: "",
    endDate: "",
    description: "",
    isCurrent: false,
  };
}

function emptyEducation(): FormData["education"][number] {
  return { id: newId(), degree: "", institution: "", startDate: "", endDate: "", gpa: "" };
}

function emptyCourse(): FormData["courses"][number] {
  return { id: newId(), name: "", provider: "", year: "" };
}

const initialData: FormData = {
  language: "both",
  name: "",
  city: "",
  phone: "",
  email: "",
  workExperience: [emptyWork()],
  education: [emptyEducation()],
  skills: [],
  courses: [emptyCourse()],
  selfDescription: "",
};

function parseYearMonth(value: string) {
  const [year = "", month = ""] = value.split("-");
  return { year, month };
}

function formatYearMonth(year: string, month: string) {
  if (!year && !month) return "";
  if (!month) return year;
  return `${year}-${month}`;
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("966")) return `+${digits}`;
  if (digits.startsWith("0")) return `+966${digits.slice(1)}`;
  if (digits.length === 9) return `+966${digits}`;
  return phone.trim();
}

function FieldTip({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{children}</p>
  );
}

function MonthYearSelect({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const { month, year } = parseYearMonth(value);
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="grid grid-cols-2 gap-2">
        <select
          value={month}
          disabled={disabled}
          onChange={(e) => onChange(formatYearMonth(year, e.target.value))}
          className={selectClass}
        >
          <option value="">الشهر</option>
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <select
          value={year}
          disabled={disabled}
          onChange={(e) => onChange(formatYearMonth(e.target.value, month))}
          className={selectClass}
        >
          <option value="">السنة</option>
          {WORK_YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function CreateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [editCvId, setEditCvId] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadParsed, setUploadParsed] = useState(false);
  const [addFlags, setAddFlags] = useState({
    experience: true,
    courses: true,
    certs: true,
    extra: true,
  });

  const progress = (step / TOTAL_STEPS) * 100;

  useEffect(() => {
    const editId = searchParams.get("edit");
    if (!editId) return;
    setLoadingForm(true);
    void loadCvFromAccount(editId).then((record) => {
      if (record?.formData) {
        setData({
          ...initialData,
          ...record.formData,
          language: "both",
          workExperience:
            record.formData.workExperience.length > 0
              ? record.formData.workExperience.map((w) => ({
                  ...w,
                  department: w.department ?? "",
                  isCurrent: w.endDate === "حتى الآن" || w.isCurrent,
                }))
              : [emptyWork()],
          education:
            record.formData.education.length > 0
              ? record.formData.education
              : [emptyEducation()],
          skills: record.formData.skills.filter((s) => s.name.trim()),
          courses:
            record.formData.courses.length > 0
              ? record.formData.courses
              : [emptyCourse()],
        });
        setEditCvId(editId);
      }
      setLoadingForm(false);
    });
  }, [searchParams]);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const updateWork = (id: string, patch: Partial<FormData["workExperience"][number]>) => {
    update(
      "workExperience",
      data.workExperience.map((w) => (w.id === id ? { ...w, ...patch } : w))
    );
  };

  const addSkill = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || data.skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) return;
    update("skills", [...data.skills, { id: newId(), name: trimmed }]);
    setSkillInput("");
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/parse-cv", { method: "POST", body: form });
      const json = (await res.json()) as { formData?: Partial<FormData>; error?: string };
      if (!res.ok) throw new Error(json.error || "فشل رفع الملف");
      const p = json.formData;
      if (p) {
        setData((prev) => ({
          ...prev,
          name: p.name || prev.name,
          email: p.email || prev.email,
          phone: p.phone || prev.phone,
          city: p.city || prev.city,
          selfDescription: p.selfDescription || prev.selfDescription,
          workExperience: p.workExperience?.length
            ? p.workExperience.map((w) => ({ ...emptyWork(), ...w, department: w.department ?? "" }))
            : prev.workExperience,
          education: p.education?.length
            ? p.education.map((e) => ({ ...emptyEducation(), ...e }))
            : prev.education,
          skills: p.skills?.filter((s) => s.name?.trim()).map((s) => ({ id: newId(), name: s.name })) ?? prev.skills,
          courses: p.courses?.length
            ? p.courses.map((c) => ({ ...emptyCourse(), ...c }))
            : prev.courses,
        }));
        setUploadParsed(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذر قراءة الملف");
    }
    setUploading(false);
  };

  const applyUploadFlags = () => {
    if (addFlags.experience) setStep(2);
    else if (addFlags.courses || addFlags.certs) setStep(5);
    else if (addFlags.extra) setStep(6);
    setUploadParsed(false);
  };

  const validateStep = (): boolean => {
    setError(null);

    if (step === 1) {
      if (!data.name.trim() || !data.email.trim() || !data.email.includes("@") || !data.phone.trim() || !data.city) {
        setError(MANDATORY_MSG);
        return false;
      }
    }

    if (step === 2) {
      for (const w of data.workExperience) {
        if (!w.jobTitle.trim() || !w.company.trim() || !w.department.trim() || !w.description.trim() || !w.startDate) {
          setError(MANDATORY_MSG);
          return false;
        }
        if (!w.isCurrent && !w.endDate) {
          setError(MANDATORY_MSG);
          return false;
        }
      }
    }

    if (step === 3) {
      const edu = data.education[0];
      if (!edu?.institution.trim() || !edu.degree.trim() || !edu.endDate.trim()) {
        setError(MANDATORY_MSG);
        return false;
      }
    }

    if (step === 4 && data.skills.length === 0) {
      setError(MANDATORY_MSG);
      return false;
    }

    if (step === 5) {
      for (const c of data.courses) {
        if (!c.name.trim() || !c.provider.trim()) {
          setError(MANDATORY_MSG);
          return false;
        }
      }
    }

    if (step === 6 && !data.selfDescription.trim()) {
      setError(MANDATORY_MSG);
      return false;
    }

    return true;
  };

  const goNext = () => {
    if (!validateStep()) return;
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };

  const goBack = () => {
    setError(null);
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    const payload = prepareCvPayload({
      ...data,
      language: "both",
      phone: normalizePhone(data.phone),
      workExperience: data.workExperience.map((w) => ({
        ...w,
        endDate: w.isCurrent ? "حتى الآن" : w.endDate,
      })),
    });

    setGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await response.text();
      const result = JSON.parse(text) as GeneratedCv & { error?: string };
      if (!response.ok) {
        setError(result.error || "حدث خطأ أثناء إنشاء السيرة.");
        setGenerating(false);
        return;
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...result, language: "both" }));
      const saved = await saveCvToAccount({ ...result, language: "both" }, payload, editCvId);
      const cvId = saved?.id ?? editCvId;
      if (cvId) sessionStorage.setItem(CURRENT_CV_ID_KEY, cvId);
      router.push(cvId ? `/enhance?cv=${cvId}` : "/enhance");
    } catch {
      setError("حدث خطأ في الاتصال.");
      setGenerating(false);
    }
  };

  if (loadingForm) return <LoadingSpinner label="جاري تحميل بيانات السيرة..." />;

  if (generating) {
    return (
      <div className="animate-fade-in rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-lg">
        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-[#e8f2fc] border-t-[#378ADD]" />
        <h2 className="text-xl font-extrabold">جاري إنشاء سيرتك الذاتية...</h2>
      </div>
    );
  }

  const edu = data.education[0] ?? emptyEducation();

  return (
    <div className="animate-fade-in">
      <div className="mb-6 rounded-2xl border border-[#378ADD]/20 bg-[#378ADD]/5 px-4 py-4 text-sm leading-relaxed text-slate-700 sm:px-5">
        {START_NOTICE}
      </div>

      <div className="mb-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4 sm:p-5">
        <p className="mb-3 text-sm font-bold text-slate-800">عندك سيرة قديمة؟ ارفعها هنا</p>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleUpload(f);
          }}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="rounded-xl border-2 border-[#378ADD]/30 bg-white px-5 py-2.5 text-sm font-semibold text-[#378ADD] hover:bg-[#e8f2fc] disabled:opacity-60"
        >
          {uploading ? "جاري الاستخراج..." : "رفع سيرة (PDF أو Word)"}
        </button>

        {uploadParsed && (
          <div className="mt-4 space-y-3 rounded-xl border border-[#378ADD]/20 bg-white p-4">
            <p className="text-sm font-semibold text-slate-800">تبي تضيف معلومات إضافية؟</p>
            {[
              { key: "experience" as const, label: "خبرات" },
              { key: "courses" as const, label: "دورات" },
              { key: "certs" as const, label: "شهادات" },
              { key: "extra" as const, label: "معلومات إضافية" },
            ].map((item) => (
              <label key={item.key} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={addFlags[item.key]}
                  onChange={(e) => setAddFlags((f) => ({ ...f, [item.key]: e.target.checked }))}
                  className="h-4 w-4 rounded text-[#378ADD]"
                />
                {item.label}
              </label>
            ))}
            <button
              type="button"
              onClick={applyUploadFlags}
              className="mt-2 rounded-lg bg-[#378ADD] px-4 py-2 text-sm font-semibold text-white"
            >
              متابعة
            </button>
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="mb-3 flex justify-between text-sm">
          <span className="font-semibold text-[#378ADD]">الخطوة {step} من {TOTAL_STEPS}</span>
          <span className="text-slate-500">{STEP_TITLES[step - 1]}</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: BRAND }} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg sm:p-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-extrabold sm:text-2xl">المعلومات الشخصية</h2>
            <div>
              <label className={labelClass}>اسمك الكامل</label>
              <input value={data.name} onChange={(e) => update("name", e.target.value)} placeholder="مثال: محمد عبدالله العمري" className={inputClass} />
              <FieldTip>💡 مثال: محمد عبدالله العمري</FieldTip>
            </div>
            <div>
              <label className={labelClass}>البريد الإلكتروني</label>
              <input type="email" dir="ltr" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="mohammed.ali@gmail.com" className={`${inputClass} text-left`} />
              <FieldTip>💡 استخدم إيميل احترافي — الأفضل: اسمك.كنيتك@gmail.com</FieldTip>
            </div>
            <div>
              <label className={labelClass}>رقم الجوال</label>
              <div className="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-[#378ADD] focus-within:ring-2 focus-within:ring-[#378ADD]/20">
                <span dir="ltr" className="flex shrink-0 items-center bg-slate-50 px-4 text-sm font-semibold text-slate-600">+966</span>
                <input type="tel" dir="ltr" value={data.phone.replace(/^\+966/, "")} onChange={(e) => update("phone", e.target.value)} placeholder="5xxxxxxxx" className="w-full border-0 px-4 py-3 text-left outline-none" />
              </div>
              <FieldTip>💡 مثال: 501234567</FieldTip>
            </div>
            <div>
              <label className={labelClass}>المدينة</label>
              <select value={data.city} onChange={(e) => update("city", e.target.value)} className={selectClass}>
                <option value="">اختر المدينة</option>
                {SAUDI_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <FieldTip>💡 مثال: الرياض</FieldTip>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="mb-2 text-xl font-extrabold sm:text-2xl">سولف لنا عن خبراتك المهنية</h2>
            <p className="mb-2 text-sm font-semibold text-amber-700">التواريخ إلزامية لمطابقة نظام ATS</p>
            <div className="space-y-8">
              {data.workExperience.map((job, i) => (
                <div key={job.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 sm:p-6">
                  <div className="mb-4 flex justify-between">
                    <span className="text-sm font-bold text-[#378ADD]">الخبرة {i + 1}</span>
                    {data.workExperience.length > 1 && (
                      <button type="button" onClick={() => update("workExperience", data.workExperience.filter((w) => w.id !== job.id))} className="text-sm text-red-500">حذف</button>
                    )}
                  </div>
                  <div className="mb-3 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>المسمى الوظيفي</label>
                      <input value={job.jobTitle} onChange={(e) => updateWork(job.id, { jobTitle: e.target.value })} placeholder="مثال: مدير مشاريع" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>اسم الشركة</label>
                      <input value={job.company} onChange={(e) => updateWork(job.id, { company: e.target.value })} placeholder="مثال: stc" className={inputClass} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className={labelClass}>القسم / الإدارة</label>
                    <input value={job.department} onChange={(e) => updateWork(job.id, { department: e.target.value })} placeholder="مثال: إدارة التسويق" className={inputClass} />
                  </div>
                  <p className="mb-4 text-xs text-amber-700 sm:text-sm">⚠️ سنحافظ على اسم الشركة والمسمى كما هو</p>
                  <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
                    <div>
                      <label className={labelClass}>وصف الخبرة</label>
                      <textarea value={job.description} onChange={(e) => updateWork(job.id, { description: e.target.value })} rows={5} placeholder="اكتب بأسلوبك العادي وش سويت في هذي الوظيفة..." className={inputClass} />
                    </div>
                    <div className="rounded-xl border border-[#378ADD]/15 bg-[#378ADD]/5 p-4 text-sm text-slate-600">
                      ✅ مثال: كنت مسؤول عن إدارة 5 حسابات كبيرة، نظمت اجتماعات أسبوعية مع العملاء، وطورت استراتيجية تسويقية زادت المبيعات 30%
                    </div>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <MonthYearSelect label="من" value={job.startDate} onChange={(v) => updateWork(job.id, { startDate: v })} />
                    <div>
                      <MonthYearSelect label="إلى" value={job.isCurrent ? "" : job.endDate} onChange={(v) => updateWork(job.id, { endDate: v, isCurrent: false })} disabled={job.isCurrent} />
                      <label className="mt-3 flex items-center gap-2 text-sm font-medium">
                        <input type="checkbox" checked={job.isCurrent} onChange={(e) => updateWork(job.id, { isCurrent: e.target.checked, endDate: e.target.checked ? "حتى الآن" : "" })} className="h-4 w-4 rounded text-[#378ADD]" />
                        حتى الآن
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {data.workExperience.length < MAX_EXPERIENCES && (
              <button type="button" onClick={() => update("workExperience", [...data.workExperience, emptyWork()])} className="mt-6 w-full rounded-xl border-2 border-dashed border-[#378ADD]/40 py-3 text-sm font-semibold text-[#378ADD]">
                + إضافة خبرة أخرى
              </button>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-extrabold sm:text-2xl">التعليم</h2>
            <div>
              <label className={labelClass}>اسم الجامعة</label>
              <input value={edu.institution} onChange={(e) => update("education", [{ ...edu, institution: e.target.value }])} placeholder="مثال: جامعة الملك سعود" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>التخصص</label>
              <input value={edu.degree} onChange={(e) => update("education", [{ ...edu, degree: e.target.value }])} placeholder="مثال: إدارة أعمال" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>سنة التخرج</label>
              <select value={edu.endDate} onChange={(e) => update("education", [{ ...edu, endDate: e.target.value }])} className={selectClass}>
                <option value="">اختر السنة</option>
                {GRADUATION_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>المعدل (اختياري)</label>
              <input value={edu.gpa ?? ""} onChange={(e) => update("education", [{ ...edu, gpa: e.target.value }])} placeholder="4.5 / 5" dir="ltr" className={`${inputClass} text-left`} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-xl font-extrabold sm:text-2xl">المهارات</h2>
            <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); } }} placeholder="اكتب مهارة واضغط Enter" className={inputClass} />
            <FieldTip>💡 مثال: Excel، إدارة المشاريع</FieldTip>
            {data.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.skills.map((s) => (
                  <span key={s.id} className="inline-flex items-center gap-2 rounded-full bg-[#e8f2fc] px-3 py-1.5 text-sm font-semibold text-[#378ADD]">
                    {s.name}
                    <button type="button" onClick={() => update("skills", data.skills.filter((x) => x.id !== s.id))}>×</button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_SKILLS.map((skill) => (
                <button key={skill} type="button" onClick={() => addSkill(skill)} className="rounded-full border border-slate-200 px-3 py-1.5 text-sm hover:border-[#378ADD]">+ {skill}</button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="mb-6 text-xl font-extrabold sm:text-2xl">الدورات والشهادات</h2>
            <div className="space-y-6">
              {data.courses.map((course, i) => (
                <div key={course.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="mb-3 flex justify-between">
                    <span className="text-sm font-bold text-[#378ADD]">الدورة {i + 1}</span>
                    {data.courses.length > 1 && (
                      <button type="button" onClick={() => update("courses", data.courses.filter((c) => c.id !== course.id))} className="text-sm text-red-500">حذف</button>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>اسم الدورة / الشهادة</label>
                      <input value={course.name} onChange={(e) => update("courses", data.courses.map((c) => c.id === course.id ? { ...c, name: e.target.value } : c))} placeholder="مثال: PMP" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>الجهة المانحة</label>
                      <input value={course.provider} onChange={(e) => update("courses", data.courses.map((c) => c.id === course.id ? { ...c, provider: e.target.value } : c))} placeholder="مثال: PMI" className={inputClass} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => update("courses", [...data.courses, emptyCourse()])} className="mt-6 w-full rounded-xl border-2 border-dashed border-[#378ADD]/40 py-3 text-sm font-semibold text-[#378ADD]">
              + إضافة دورة أخرى
            </button>
          </div>
        )}

        {step === 6 && (
          <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
            <div>
              <h2 className="mb-4 text-xl font-extrabold sm:text-2xl">نبذة عنك</h2>
              <textarea value={data.selfDescription} onChange={(e) => update("selfDescription", e.target.value)} rows={8} placeholder="أنا شخص طموح..." className={inputClass} />
              <FieldTip>اكتب بأسلوبك العادي حتى لو بالعامية، الذكاء الاصطناعي سيحولها لنبذة احترافية</FieldTip>
            </div>
            <div className="rounded-xl border border-[#378ADD]/15 bg-[#378ADD]/5 p-4 text-sm text-slate-600">
              ✅ مثال: أنا شخص طموح عندي 5 سنوات خبرة في التسويق الرقمي، أحب أشتغل بفريق وأحقق أهداف واضحة
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button type="button" onClick={goBack} disabled={step === 1} className="rounded-full border-2 border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 disabled:opacity-40">السابق</button>
          {step < TOTAL_STEPS ? (
            <button type="button" onClick={goNext} className="rounded-full bg-[#378ADD] px-8 py-3 text-sm font-semibold text-white shadow-md">التالي</button>
          ) : (
            <button type="button" onClick={handleSubmit} className="rounded-full bg-[#378ADD] px-8 py-3 text-sm font-semibold text-white shadow-md">إنشاء السيرة الذاتية ✨</button>
          )}
        </div>
      </div>
    </div>
  );
}

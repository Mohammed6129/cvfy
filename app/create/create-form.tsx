"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CvLaptopLoader from "@/app/components/cv-laptop-loader";
import LoadingSpinner from "@/app/components/loading-spinner";
import CvUpload from "./cv-upload";
import {
  collectStepErrors,
  FormField,
  GRADUATION_YEARS,
  invalidFieldClass,
  MonthYearSelect,
  RequiredMarker,
  WorkExperienceDateRange,
} from "./create-form-fields";
import {
  SAUDI_CITIES,
  SUGGESTED_SKILLS,
} from "@/lib/create-form-constants";
import {
  CURRENT_CV_ID_KEY,
  STORAGE_KEY,
  loadCvFromAccount,
  saveCvToAccount,
  saveFormDraft,
} from "@/lib/cv-storage";
import { isValidLinkedInUrl } from "@/lib/linkedin";
import { prepareCvPayload } from "@/lib/prepare-cv-payload";
import type { CvFormData, GeneratedCv } from "@/lib/cv-types";
import {
  FORM_BTN_BACK_CLASS,
  FORM_BTN_NEXT_CLASS,
  FORM_INPUT_CLASS,
  FORM_LABEL_CLASS,
  FORM_NESTED_SECTION_CLASS,
  FORM_PHONE_INPUT_CLASS,
  FORM_PHONE_PREFIX_CLASS,
  FORM_PHONE_WRAPPER_CLASS,
  FORM_SELECT_CLASS,
  FORM_TIP_CLASS,
} from "@/app/components/home-glass-shell";

const BRAND = "#378ADD";
const TOTAL_STEPS = 5;
const MAX_EXPERIENCES = 5;
const MANDATORY_MSG =
  "يجب تعبئة جميع الحقول لضمان سيرة ذاتية مثالية تطابق نظام ATS";

const STEP_TITLES = [
  "المعلومات الشخصية",
  "الخبرات العملية",
  "التعليم",
  "المهارات والشهادات",
  "نبذة عنك",
];

const START_NOTICE =
  "بعد تعبئة الفورم ستحصل على نسختين: عربي وإنجليزي. ملاحظة: السيرة الإنجليزية دائماً أفضل وتُفضّلها الشركات والجهات أكثر من العربية";

const inputClass = FORM_INPUT_CLASS;

const selectClass = FORM_SELECT_CLASS;

const labelClass = FORM_LABEL_CLASS;

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
  return { id: newId(), name: "", provider: "", date: "", year: "" };
}

const initialData: FormData = {
  language: "both",
  name: "",
  currentJobTitle: "",
  city: "",
  phone: "",
  email: "",
  linkedIn: "",
  workExperience: [emptyWork()],
  education: [emptyEducation()],
  skills: [],
  courses: [emptyCourse()],
  selfDescription: "",
};

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("966")) return `+${digits}`;
  if (digits.startsWith("0")) return `+966${digits.slice(1)}`;
  if (digits.length === 9) return `+966${digits}`;
  return phone.trim();
}

function FieldTip({ children }: { children: React.ReactNode }) {
  return (
    <p className={`${FORM_TIP_CLASS} flex items-start gap-1`}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mt-px shrink-0 opacity-50" aria-hidden>
        <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1" fill="none"/>
        <path d="M6 5v3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="6" cy="3.5" r="0.6" fill="currentColor"/>
      </svg>
      <span>{children}</span>
    </p>
  );
}

export default function CreateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [editCvId, setEditCvId] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());

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
          currentJobTitle: record.formData.currentJobTitle ?? "",
          linkedIn: record.formData.linkedIn ?? "",
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
              ? record.formData.courses.map((c) => ({
                  ...c,
                  date: c.date || c.year || "",
                }))
              : [emptyCourse()],
        });
        setEditCvId(editId);
      }
      setLoadingForm(false);
    });
  }, [searchParams]);

  const clearInvalid = (fieldId: string) => {
    setInvalidFields((prev) => {
      if (!prev.has(fieldId)) return prev;
      const next = new Set(prev);
      next.delete(fieldId);
      return next;
    });
  };

  const isInvalid = (fieldId: string) => invalidFields.has(fieldId);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    clearInvalid(String(key));
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const updateWork = (
    id: string,
    patch: Partial<FormData["workExperience"][number]>,
    fieldIds?: string[]
  ) => {
    fieldIds?.forEach(clearInvalid);
    setData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((w) =>
        w.id === id ? { ...w, ...patch } : w
      ),
    }));
  };

  const addSkill = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || data.skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) return;
    clearInvalid("skills");
    update("skills", [...data.skills, { id: newId(), name: trimmed }]);
    setSkillInput("");
  };

  const handleParsedUpload = (p: Partial<FormData>) => {
    setData((prev) => ({
      ...prev,
      name: p.name || prev.name,
      currentJobTitle: p.currentJobTitle || prev.currentJobTitle,
      email: p.email || prev.email,
      phone: p.phone || prev.phone,
      city: p.city || prev.city,
      linkedIn: p.linkedIn || prev.linkedIn,
      selfDescription: p.selfDescription || prev.selfDescription,
      workExperience: p.workExperience?.length
        ? p.workExperience.map((w) => ({
            ...emptyWork(),
            ...w,
            department: w.department ?? "",
          }))
        : prev.workExperience,
      education: p.education?.length
        ? p.education.map((e) => ({ ...emptyEducation(), ...e }))
        : prev.education,
      skills:
        p.skills
          ?.filter((s) => s.name?.trim())
          .map((s) => ({ id: newId(), name: s.name })) ?? prev.skills,
      courses: p.courses?.length
        ? p.courses.map((c) => ({ ...emptyCourse(), ...c }))
        : prev.courses,
    }));
    setInvalidFields(new Set());
  };

  const validateStep = (): boolean => {
    const fields = collectStepErrors(step, data);

    if (step === 1 && data.linkedIn.trim() && !isValidLinkedInUrl(data.linkedIn)) {
      fields.push("linkedIn");
    }

    if (fields.length > 0) {
      setInvalidFields(new Set(fields));
      const linkedInOnlyInvalid =
        fields.length === 1 && fields[0] === "linkedIn";
      setError(
        linkedInOnlyInvalid
          ? "رابط LinkedIn غير صالح. استخدم صيغة: linkedin.com/in/username"
          : MANDATORY_MSG
      );
      return false;
    }

    setError(null);
    setInvalidFields(new Set());
    return true;
  };

  const buildPayload = () =>
    prepareCvPayload({
      ...data,
      language: "both",
      phone: normalizePhone(data.phone),
      workExperience: data.workExperience.map((w) => ({
        ...w,
        endDate: w.isCurrent ? "حتى الآن" : w.endDate,
      })),
    });

  const goNext = () => {
    if (!validateStep()) return;

    const payload = buildPayload();
    void saveFormDraft(payload, editCvId).then((saved) => {
      if (saved?.id) {
        setEditCvId(saved.id);
        sessionStorage.setItem(CURRENT_CV_ID_KEY, saved.id);
      }
    });

    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };

  const goBack = () => {
    setError(null);
    setInvalidFields(new Set());
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    const payload = buildPayload();

    setGenerating(true);
    setError(null);

    try {
      console.log("[create-form] Submitting CV generation for:", payload.name);

      const response = await fetch("/api/generate-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      console.log("[create-form] generate-cv status:", response.status);
      console.log("[create-form] generate-cv preview:", text.slice(0, 300));

      let result: GeneratedCv & { error?: string };

      try {
        result = JSON.parse(text) as GeneratedCv & { error?: string };
      } catch (parseError) {
        console.error("[create-form] JSON parse failed:", parseError);
        setError("استجابة غير صالحة من الخادم. حاول مرة أخرى.");
        setGenerating(false);
        return;
      }

      if (!response.ok) {
        console.error("[create-form] API error:", result);
        setError(result.error || "حدث خطأ أثناء إنشاء السيرة.");
        setGenerating(false);
        return;
      }

      if (!result.content || typeof result.content !== "object") {
        console.error("[create-form] Missing content in CV response:", result);
        setError("بيانات السيرة غير مكتملة من الخادم.");
        setGenerating(false);
        return;
      }

      const generatedCv: GeneratedCv = {
        ...result,
        language: "both",
        name: result.name || payload.name,
        email: result.email || payload.email,
        phone: result.phone || payload.phone,
        city: result.city || payload.city,
        linkedIn: result.linkedIn || payload.linkedIn || undefined,
        content: {
          ...result.content,
          headline: payload.currentJobTitle,
        },
      };

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(generatedCv));
      console.log("[create-form] CV stored in sessionStorage");

      const saved = await saveCvToAccount(generatedCv, payload, editCvId);
      console.log("[create-form] saveCvToAccount:", saved);

      const cvId =
        saved?.id ??
        editCvId ??
        sessionStorage.getItem(CURRENT_CV_ID_KEY);

      if (cvId) {
        sessionStorage.setItem(CURRENT_CV_ID_KEY, cvId);
      }

      const destination = cvId ? `/enhance?cv=${cvId}` : "/enhance";
      console.log("[create-form] Redirecting to:", destination);
      router.push(destination);
    } catch (submitError) {
      console.error("[create-form] Submit error:", submitError);
      setError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
      setGenerating(false);
    }
  };

  if (loadingForm) return <LoadingSpinner label="جاري تحميل بيانات السيرة..." />;

  if (generating) {
    return <CvLaptopLoader mode="generate" />;
  }

  const availableSuggestions = SUGGESTED_SKILLS.filter(
    (skill) =>
      !data.skills.some(
        (s) => s.name.toLowerCase() === skill.toLowerCase()
      )
  );

  const edu = data.education[0] ?? emptyEducation();

  return (
    <div className="animate-fade-in">
      <div className="glass-page-card-sm mb-6 px-4 py-4 text-sm leading-relaxed text-white/80 sm:px-5">
        {START_NOTICE}
      </div>

      <div className="mb-8">
        <div className="mb-3 flex justify-between text-sm">
          <span className="font-semibold text-[#FAC775]">الخطوة {step} من {TOTAL_STEPS}</span>
          <span className="text-white/60">{STEP_TITLES[step - 1]}</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: BRAND }} />
        </div>
      </div>

      <div className="glass-page-card p-5 sm:p-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <CvUpload onParsed={handleParsedUpload} onError={setError} />

            <h2 className="text-xl font-extrabold text-white sm:text-2xl">المعلومات الشخصية</h2>
            <FormField
              label="اسمك الكامل"
              required
              invalid={isInvalid("name")}
              tip={<FieldTip>مثال: محمد عبدالله العمري</FieldTip>}
            >
              <input
                value={data.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="مثال: محمد عبدالله العمري"
                className={invalidFieldClass(inputClass, isInvalid("name"))}
              />
            </FormField>
            <FormField
              label="المسمى المهني الحالي"
              required
              invalid={isInvalid("currentJobTitle")}
              tip={<FieldTip>هذا المسمى فقط هو الذي يظهر في رأس السيرة الذاتية</FieldTip>}
            >
              <input
                value={data.currentJobTitle}
                onChange={(e) => update("currentJobTitle", e.target.value)}
                placeholder="مثال: مدير مشاريع"
                className={invalidFieldClass(inputClass, isInvalid("currentJobTitle"))}
              />
            </FormField>
            <FormField
              label="البريد الإلكتروني"
              required
              invalid={isInvalid("email")}
              tip={<FieldTip>استخدم إيميل احترافي — الأفضل: اسمك.كنيتك@gmail.com</FieldTip>}
            >
              <input
                type="email"
                dir="ltr"
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="mohammed.ali@gmail.com"
                className={invalidFieldClass(`${inputClass} text-left`, isInvalid("email"))}
              />
            </FormField>
            <FormField
              label="رقم الجوال"
              required
              invalid={isInvalid("phone")}
              tip={<FieldTip>مثال: 501234567</FieldTip>}
            >
              <div
                className={invalidFieldClass(
                  FORM_PHONE_WRAPPER_CLASS,
                  isInvalid("phone")
                )}
              >
                <span dir="ltr" className={FORM_PHONE_PREFIX_CLASS}>+966</span>
                <input
                  type="tel"
                  dir="ltr"
                  value={data.phone.replace(/^\+966/, "")}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="5xxxxxxxx"
                  className={FORM_PHONE_INPUT_CLASS}
                />
              </div>
            </FormField>
            <FormField
              label="المدينة"
              required
              invalid={isInvalid("city")}
              tip={<FieldTip>مثال: الرياض</FieldTip>}
            >
              <select
                value={data.city}
                onChange={(e) => update("city", e.target.value)}
                className={invalidFieldClass(selectClass, isInvalid("city"))}
              >
                <option value="">اختر المدينة</option>
                {SAUDI_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField
              label={
                <>
                  رابط LinkedIn <span className="font-normal text-white/55">(اختياري)</span>
                </>
              }
              invalid={isInvalid("linkedIn")}
              tip={<FieldTip>الصيغة المفضلة: linkedin.com/in/username</FieldTip>}
            >
              <input
                type="url"
                dir="ltr"
                value={data.linkedIn}
                onChange={(e) => update("linkedIn", e.target.value)}
                placeholder="linkedin.com/in/username"
                className={invalidFieldClass(`${inputClass} text-left`, isInvalid("linkedIn"))}
              />
            </FormField>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="mb-2 text-xl font-extrabold text-white sm:text-2xl">سولف لنا عن خبراتك المهنية</h2>
            <p className="mb-2 text-sm font-semibold text-[#FAC775]/90">التواريخ إلزامية لمطابقة نظام ATS</p>
            <div className="space-y-8">
              {data.workExperience.map((job, i) => (
                <div key={job.id} className={FORM_NESTED_SECTION_CLASS}>
                  <div className="mb-4 flex justify-between">
                    <span className="text-sm font-bold text-[#FAC775]">الخبرة {i + 1}</span>
                    {data.workExperience.length > 1 && (
                      <button type="button" onClick={() => update("workExperience", data.workExperience.filter((w) => w.id !== job.id))} className="text-sm text-red-300">حذف</button>
                    )}
                  </div>
                  <div className="mb-3 grid gap-4 sm:grid-cols-2">
                    <FormField label="المسمى الوظيفي" required invalid={isInvalid(`work-${job.id}-jobTitle`)}>
                      <input
                        value={job.jobTitle}
                        onChange={(e) =>
                          updateWork(job.id, { jobTitle: e.target.value }, [`work-${job.id}-jobTitle`])
                        }
                        placeholder="مثال: مدير مشاريع"
                        className={invalidFieldClass(inputClass, isInvalid(`work-${job.id}-jobTitle`))}
                      />
                    </FormField>
                    <FormField label="اسم الشركة" required invalid={isInvalid(`work-${job.id}-company`)}>
                      <input
                        value={job.company}
                        onChange={(e) =>
                          updateWork(job.id, { company: e.target.value }, [`work-${job.id}-company`])
                        }
                        placeholder="مثال: stc"
                        className={invalidFieldClass(inputClass, isInvalid(`work-${job.id}-company`))}
                      />
                    </FormField>
                  </div>
                  <FormField label="القسم / الإدارة" required invalid={isInvalid(`work-${job.id}-department`)}>
                    <input
                      value={job.department}
                      onChange={(e) =>
                        updateWork(job.id, { department: e.target.value }, [`work-${job.id}-department`])
                      }
                      placeholder="مثال: إدارة التسويق"
                      className={invalidFieldClass(inputClass, isInvalid(`work-${job.id}-department`))}
                    />
                  </FormField>
                  <p className="mb-4 flex items-center gap-1 text-xs text-white/45">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0" aria-hidden>
                      <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1" fill="none"/>
                      <path d="M6 5v3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      <circle cx="6" cy="3.5" r="0.6" fill="currentColor"/>
                    </svg>
                    سنحافظ على اسم الشركة والمسمى كما هو
                  </p>
                  <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
                    <FormField label="وصف الخبرة" required invalid={isInvalid(`work-${job.id}-description`)}>
                      <textarea
                        value={job.description}
                        onChange={(e) =>
                          updateWork(job.id, { description: e.target.value }, [`work-${job.id}-description`])
                        }
                        rows={5}
                        placeholder="اكتب بأسلوبك العادي وش سويت في هذي الوظيفة..."
                        className={invalidFieldClass(inputClass, isInvalid(`work-${job.id}-description`))}
                      />
                    </FormField>
                    <div className="rounded-[11px] border border-[#E0EDF8] bg-white p-4 text-sm text-[#333]">
                      ✅ مثال: كنت مسؤول عن إدارة 5 حسابات كبيرة، نظمت اجتماعات أسبوعية مع العملاء، وطورت استراتيجية تسويقية زادت المبيعات 30%
                    </div>
                  </div>
                  <WorkExperienceDateRange
                    startDate={job.startDate}
                    endDate={job.endDate}
                    isCurrent={Boolean(job.isCurrent)}
                    invalidStart={isInvalid(`work-${job.id}-startDate`)}
                    invalidEnd={isInvalid(`work-${job.id}-endDate`)}
                    onStartChange={(v) =>
                      updateWork(job.id, { startDate: v }, [`work-${job.id}-startDate`])
                    }
                    onEndChange={(v) =>
                      updateWork(job.id, { endDate: v, isCurrent: false }, [`work-${job.id}-endDate`])
                    }
                    onCurrentChange={(checked) =>
                      updateWork(
                        job.id,
                        { isCurrent: checked, endDate: checked ? "حتى الآن" : "" },
                        [`work-${job.id}-endDate`]
                      )
                    }
                  />
                </div>
              ))}
            </div>
            {data.workExperience.length < MAX_EXPERIENCES && (
              <button type="button" onClick={() => update("workExperience", [...data.workExperience, emptyWork()])} className="mt-6 w-full rounded-[11px] border-2 border-dashed border-white/30 py-3 text-sm font-semibold text-white/85 hover:border-white/50 hover:bg-white/5">
                + إضافة خبرة أخرى
              </button>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-extrabold text-white sm:text-2xl">التعليم</h2>
            <FormField label="اسم الجامعة" required invalid={isInvalid("institution")}>
              <input
                value={edu.institution}
                onChange={(e) => {
                  clearInvalid("institution");
                  update("education", [{ ...edu, institution: e.target.value }]);
                }}
                placeholder="مثال: جامعة الملك سعود"
                className={invalidFieldClass(inputClass, isInvalid("institution"))}
              />
            </FormField>
            <FormField label="التخصص" required invalid={isInvalid("degree")}>
              <input
                value={edu.degree}
                onChange={(e) => {
                  clearInvalid("degree");
                  update("education", [{ ...edu, degree: e.target.value }]);
                }}
                placeholder="مثال: إدارة أعمال"
                className={invalidFieldClass(inputClass, isInvalid("degree"))}
              />
            </FormField>
            <FormField label="سنة التخرج" required invalid={isInvalid("graduationYear")}>
              <select
                value={edu.endDate}
                onChange={(e) => {
                  clearInvalid("graduationYear");
                  update("education", [{ ...edu, endDate: e.target.value }]);
                }}
                className={invalidFieldClass(selectClass, isInvalid("graduationYear"))}
              >
                <option value="">اختر السنة</option>
                {GRADUATION_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="المعدل (اختياري)">
              <input
                value={edu.gpa ?? ""}
                onChange={(e) => update("education", [{ ...edu, gpa: e.target.value }])}
                placeholder="4.5 / 5"
                dir="ltr"
                className={`${inputClass} text-left`}
              />
            </FormField>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8">
            {/* المهارات */}
            <div className="space-y-5">
              <h2 className="text-xl font-extrabold text-white sm:text-2xl">المهارات</h2>
              {isInvalid("skills") && <RequiredMarker />}
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill(skillInput);
                  }
                }}
                placeholder="اكتب مهارة واضغط Enter"
                className={invalidFieldClass(inputClass, isInvalid("skills"))}
              />
              <FieldTip>مثال: Excel، إدارة المشاريع</FieldTip>
              {data.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((s) => (
                    <span key={s.id} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-[#378ADD]">
                      {s.name}
                      <button type="button" onClick={() => update("skills", data.skills.filter((x) => x.id !== s.id))}>×</button>
                    </span>
                  ))}
                </div>
              )}
              {availableSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {availableSuggestions.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className="rounded-full border border-[#E0EDF8] bg-white px-3 py-1.5 text-sm text-[#333] hover:border-[#378ADD] hover:text-[#378ADD]"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* الدورات والشهادات — مدمجة في نفس الخطوة */}
            <div>
              <div className="mb-1 flex items-center gap-3">
                <h3 className="text-lg font-extrabold text-white">الدورات والشهادات</h3>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/60">اختياري</span>
              </div>
              <p className="mb-4 text-sm text-white/65">يمكنك تخطي هذا القسم إذا لم يكن لديك دورات</p>
              <div className="space-y-6">
                {data.courses.map((course, i) => (
                  <div key={course.id} className={FORM_NESTED_SECTION_CLASS}>
                    <div className="mb-3 flex justify-between">
                      <span className="text-sm font-bold text-[#FAC775]">الدورة {i + 1}</span>
                      {data.courses.length > 1 && (
                        <button type="button" onClick={() => update("courses", data.courses.filter((c) => c.id !== course.id))} className="text-sm text-red-300">حذف</button>
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
                    <div className="mt-4">
                      <MonthYearSelect
                        label="تاريخ الحصول على الشهادة / الدورة"
                        value={course.date}
                        onChange={(v) =>
                          update(
                            "courses",
                            data.courses.map((c) =>
                              c.id === course.id ? { ...c, date: v, year: v } : c
                            )
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => update("courses", [...data.courses, emptyCourse()])} className="mt-6 w-full rounded-[11px] border-2 border-dashed border-white/30 py-3 text-sm font-semibold text-white/85 hover:border-white/50 hover:bg-white/5">
                + إضافة دورة أخرى
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
            <div>
              <h2 className="mb-4 text-xl font-extrabold text-white sm:text-2xl">نبذة عنك</h2>
              <FormField
                label="اكتب نبذة عنك بأسلوبك"
                required
                invalid={isInvalid("selfDescription")}
                tip={
                  <FieldTip>
                    اكتب بأسلوبك العادي حتى لو بالعامية، الذكاء الاصطناعي سيحولها لنبذة احترافية بضمير المتكلم
                  </FieldTip>
                }
              >
                <textarea
                  value={data.selfDescription}
                  onChange={(e) => update("selfDescription", e.target.value)}
                  rows={8}
                  placeholder="أنا شخص طموح..."
                  className={invalidFieldClass(inputClass, isInvalid("selfDescription"))}
                />
              </FormField>
            </div>
            <div className="rounded-[11px] border border-[#E0EDF8] bg-white p-4 text-sm text-[#333]">
              ✅ مثال: أنا شخص طموح عندي 5 سنوات خبرة في التسويق الرقمي، أحب أشتغل بفريق وأحقق أهداف واضحة
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button type="button" onClick={goBack} disabled={step === 1} className={`${FORM_BTN_BACK_CLASS} disabled:opacity-40`}>السابق</button>
          {step < TOTAL_STEPS ? (
            <button type="button" onClick={goNext} className={FORM_BTN_NEXT_CLASS}>التالي</button>
          ) : (
            <button type="button" onClick={handleSubmit} className={FORM_BTN_NEXT_CLASS}>إنشاء السيرة الذاتية ✨</button>
          )}
        </div>
      </div>
    </div>
  );
}

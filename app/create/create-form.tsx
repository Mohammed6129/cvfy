"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { prepareCvPayload } from "@/lib/prepare-cv-payload";
import type { CvFormData } from "@/lib/cv-types";

const BRAND = "#378ADD";
const TOTAL_STEPS = 7;

const STEP_TITLES = [
  "اختر اللغة",
  "المعلومات الشخصية",
  "الخبرات العملية",
  "التعليم",
  "المهارات",
  "الدورات",
  "الوصف الذاتي",
];

type Language = "arabic" | "english" | "both" | "";

type WorkExperience = {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
};

type Education = {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
};

type Skill = {
  id: string;
  name: string;
};

type Course = {
  id: string;
  name: string;
  provider: string;
  year: string;
};

type FormData = {
  language: Language;
  name: string;
  city: string;
  phone: string;
  email: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  courses: Course[];
  selfDescription: string;
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#378ADD] focus:ring-2 focus:ring-[#378ADD]/20";

const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

function newId() {
  return Math.random().toString(36).slice(2, 11);
}

function emptyWork(): WorkExperience {
  return {
    id: newId(),
    jobTitle: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
  };
}

function emptyEducation(): Education {
  return {
    id: newId(),
    degree: "",
    institution: "",
    startDate: "",
    endDate: "",
  };
}

function emptySkill(): Skill {
  return { id: newId(), name: "" };
}

function emptyCourse(): Course {
  return { id: newId(), name: "", provider: "", year: "" };
}

const initialData: FormData = {
  language: "",
  name: "",
  city: "",
  phone: "",
  email: "",
  workExperience: [emptyWork()],
  education: [emptyEducation()],
  skills: [emptySkill()],
  courses: [emptyCourse()],
  selfDescription: "",
};

export default function CreateForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const progress = (step / TOTAL_STEPS) * 100;

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const validateStep = (): boolean => {
    setError(null);

    if (step === 1 && !data.language) {
      setError("يرجى اختيار لغة السيرة الذاتية.");
      return false;
    }

    if (step === 2) {
      if (!data.name.trim()) {
        setError("يرجى إدخال الاسم الكامل.");
        return false;
      }
      if (!data.email.trim()) {
        setError("يرجى إدخال البريد الإلكتروني.");
        return false;
      }
    }

    if (step === 7 && !data.selfDescription.trim()) {
      setError("يرجى كتابة الوصف الذاتي.");
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

    const payload: CvFormData = prepareCvPayload(data);

    if (!payload.language) {
      setError("يرجى اختيار لغة السيرة الذاتية.");
      return;
    }

    if (!payload.name || !payload.email) {
      setError("يرجى إدخال الاسم والبريد الإلكتروني.");
      return;
    }

    if (!payload.selfDescription) {
      setError("يرجى كتابة الوصف الذاتي.");
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let result: Record<string, unknown>;

      try {
        result = JSON.parse(responseText) as Record<string, unknown>;
      } catch (parseError) {
        console.error("[create-form] Invalid JSON response:", responseText);
        console.error("[create-form] Parse error:", parseError);
        setError("استجابة غير صالحة من الخادم.");
        setGenerating(false);
        return;
      }

      if (!response.ok) {
        console.error("[create-form] API error:", result);
        setError(
          typeof result.error === "string"
            ? result.error
            : "حدث خطأ أثناء إنشاء السيرة الذاتية."
        );
        setGenerating(false);
        return;
      }

      console.log("[create-form] CV generated successfully");
      sessionStorage.setItem("cvfy-generated-cv", JSON.stringify(result));
      router.push("/preview");
    } catch (submitError) {
      console.error("[create-form] Submit error:", submitError);
      setError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
      setGenerating(false);
    }
  };

  if (generating) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-lg shadow-slate-200/60">
        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-[#e8f2fc] border-t-[#378ADD]" />
        <h2 className="mb-2 text-2xl font-extrabold text-slate-900">
          جاري إنشاء سيرتك الذاتية...
        </h2>
        <p className="text-slate-600">
          الذكاء الاصطناعي يعمل على صياغة سيرة ذاتية احترافية ومتوافقة مع ATS
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-semibold text-[#378ADD]">
            الخطوة {step} من {TOTAL_STEPS}
          </span>
          <span className="text-slate-500">{STEP_TITLES[step - 1]}</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: BRAND }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="mb-2 text-2xl font-extrabold text-slate-900">
              اختر لغة السيرة الذاتية
            </h2>
            <p className="mb-6 text-slate-600">
              حدد اللغة التي تريد إنشاء سيرتك الذاتية بها.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {(
                [
                  { value: "arabic", label: "العربية", desc: "سيرة ذاتية باللغة العربية" },
                  { value: "english", label: "الإنجليزية", desc: "سيرة ذاتية باللغة الإنجليزية" },
                  { value: "both", label: "كلاهما", desc: "نسخة عربية وإنجليزية" },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => update("language", option.value)}
                  className={`rounded-xl border-2 p-5 text-right transition-all ${
                    data.language === option.value
                      ? "border-[#378ADD] bg-[#e8f2fc] shadow-md shadow-[#378ADD]/10"
                      : "border-slate-200 bg-white hover:border-[#378ADD]/40"
                  }`}
                >
                  <p className="mb-1 text-lg font-bold text-slate-900">
                    {option.label}
                  </p>
                  <p className="text-sm text-slate-500">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="mb-2 text-2xl font-extrabold text-slate-900">
                المعلومات الشخصية
              </h2>
              <p className="mb-6 text-slate-600">
                أدخل بياناتك الأساسية للتواصل.
              </p>
            </div>
            <div>
              <label htmlFor="name" className={labelClass}>
                الاسم الكامل
              </label>
              <input
                id="name"
                value={data.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="محمد أحمد العلي"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="city" className={labelClass}>
                المدينة
              </label>
              <input
                id="city"
                value={data.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="الرياض"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>
                رقم الجوال
              </label>
              <input
                id="phone"
                type="tel"
                value={data.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="05xxxxxxxx"
                dir="ltr"
                className={`${inputClass} text-left`}
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="example@email.com"
                dir="ltr"
                className={`${inputClass} text-left`}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="mb-2 text-2xl font-extrabold text-slate-900">
              الخبرات العملية
            </h2>
            <p className="mb-6 text-slate-600">
              أضف خبراتك العملية مع وصف باللغة العربية.
            </p>
            <div className="space-y-6">
              {data.workExperience.map((job, index) => (
                <div
                  key={job.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#378ADD]">
                      الخبرة {index + 1}
                    </span>
                    {data.workExperience.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          update(
                            "workExperience",
                            data.workExperience.filter((w) => w.id !== job.id)
                          )
                        }
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        حذف
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>المسمى الوظيفي</label>
                      <input
                        value={job.jobTitle}
                        onChange={(e) =>
                          update(
                            "workExperience",
                            data.workExperience.map((w) =>
                              w.id === job.id
                                ? { ...w, jobTitle: e.target.value }
                                : w
                            )
                          )
                        }
                        placeholder="مهندس برمجيات"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>اسم الشركة</label>
                      <input
                        value={job.company}
                        onChange={(e) =>
                          update(
                            "workExperience",
                            data.workExperience.map((w) =>
                              w.id === job.id
                                ? { ...w, company: e.target.value }
                                : w
                            )
                          )
                        }
                        placeholder="شركة التقنية المتقدمة"
                        className={inputClass}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>تاريخ البداية</label>
                        <input
                          type="month"
                          value={job.startDate}
                          onChange={(e) =>
                            update(
                              "workExperience",
                              data.workExperience.map((w) =>
                                w.id === job.id
                                  ? { ...w, startDate: e.target.value }
                                  : w
                              )
                            )
                          }
                          dir="ltr"
                          className={`${inputClass} text-left`}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>تاريخ النهاية</label>
                        <input
                          type="month"
                          value={job.endDate}
                          onChange={(e) =>
                            update(
                              "workExperience",
                              data.workExperience.map((w) =>
                                w.id === job.id
                                  ? { ...w, endDate: e.target.value }
                                  : w
                              )
                            )
                          }
                          dir="ltr"
                          className={`${inputClass} text-left`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>الوصف (بالعربية)</label>
                      <textarea
                        value={job.description}
                        onChange={(e) =>
                          update(
                            "workExperience",
                            data.workExperience.map((w) =>
                              w.id === job.id
                                ? { ...w, description: e.target.value }
                                : w
                            )
                          )
                        }
                        rows={4}
                        placeholder="اكتب وصفاً لمهامك وإنجازاتك في هذا المنصب..."
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                update("workExperience", [...data.workExperience, emptyWork()])
              }
              className="mt-4 text-sm font-semibold text-[#378ADD] hover:text-[#2a6bb8]"
            >
              + إضافة خبرة أخرى
            </button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="mb-2 text-2xl font-extrabold text-slate-900">
              التعليم
            </h2>
            <p className="mb-6 text-slate-600">
              أضف مؤهلاتك التعليمية وشهاداتك الأكاديمية.
            </p>
            <div className="space-y-6">
              {data.education.map((edu, index) => (
                <div
                  key={edu.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#378ADD]">
                      المؤهل {index + 1}
                    </span>
                    {data.education.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          update(
                            "education",
                            data.education.filter((e) => e.id !== edu.id)
                          )
                        }
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        حذف
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>الدرجة / المؤهل</label>
                      <input
                        value={edu.degree}
                        onChange={(e) =>
                          update(
                            "education",
                            data.education.map((item) =>
                              item.id === edu.id
                                ? { ...item, degree: e.target.value }
                                : item
                            )
                          )
                        }
                        placeholder="بكالوريوس علوم الحاسب"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>المؤسسة التعليمية</label>
                      <input
                        value={edu.institution}
                        onChange={(e) =>
                          update(
                            "education",
                            data.education.map((item) =>
                              item.id === edu.id
                                ? { ...item, institution: e.target.value }
                                : item
                            )
                          )
                        }
                        placeholder="جامعة الملك سعود"
                        className={inputClass}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>تاريخ البداية</label>
                        <input
                          type="month"
                          value={edu.startDate}
                          onChange={(e) =>
                            update(
                              "education",
                              data.education.map((item) =>
                                item.id === edu.id
                                  ? { ...item, startDate: e.target.value }
                                  : item
                              )
                            )
                          }
                          dir="ltr"
                          className={`${inputClass} text-left`}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>تاريخ التخرج</label>
                        <input
                          type="month"
                          value={edu.endDate}
                          onChange={(e) =>
                            update(
                              "education",
                              data.education.map((item) =>
                                item.id === edu.id
                                  ? { ...item, endDate: e.target.value }
                                  : item
                              )
                            )
                          }
                          dir="ltr"
                          className={`${inputClass} text-left`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                update("education", [...data.education, emptyEducation()])
              }
              className="mt-4 text-sm font-semibold text-[#378ADD] hover:text-[#2a6bb8]"
            >
              + إضافة مؤهل آخر
            </button>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="mb-2 text-2xl font-extrabold text-slate-900">
              المهارات
            </h2>
            <p className="mb-6 text-slate-600">
              أضف مهاراتك التقنية والشخصية.
            </p>
            <div className="space-y-4">
              {data.skills.map((skill, index) => (
                <div key={skill.id} className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className={labelClass}>المهارة {index + 1}</label>
                    <input
                      value={skill.name}
                      onChange={(e) =>
                        update(
                          "skills",
                          data.skills.map((s) =>
                            s.id === skill.id
                              ? { ...s, name: e.target.value }
                              : s
                          )
                        )
                      }
                      placeholder="مثال: React، إدارة المشاريع"
                      className={inputClass}
                    />
                  </div>
                  {data.skills.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          "skills",
                          data.skills.filter((s) => s.id !== skill.id)
                        )
                      }
                      className="mb-3 text-sm text-red-500 hover:text-red-700"
                    >
                      حذف
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => update("skills", [...data.skills, emptySkill()])}
              className="mt-4 text-sm font-semibold text-[#378ADD] hover:text-[#2a6bb8]"
            >
              + إضافة مهارة أخرى
            </button>
          </div>
        )}

        {step === 6 && (
          <div>
            <h2 className="mb-2 text-2xl font-extrabold text-slate-900">
              الدورات
            </h2>
            <p className="mb-6 text-slate-600">
              أضف الدورات التدريبية والشهادات المهنية التي حصلت عليها.
            </p>
            <div className="space-y-6">
              {data.courses.map((course, index) => (
                <div
                  key={course.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#378ADD]">
                      الدورة {index + 1}
                    </span>
                    {data.courses.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          update(
                            "courses",
                            data.courses.filter((c) => c.id !== course.id)
                          )
                        }
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        حذف
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>اسم الدورة</label>
                      <input
                        value={course.name}
                        onChange={(e) =>
                          update(
                            "courses",
                            data.courses.map((c) =>
                              c.id === course.id
                                ? { ...c, name: e.target.value }
                                : c
                            )
                          )
                        }
                        placeholder="دورة تطوير تطبيقات الويب"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>الجهة المقدمة</label>
                      <input
                        value={course.provider}
                        onChange={(e) =>
                          update(
                            "courses",
                            data.courses.map((c) =>
                              c.id === course.id
                                ? { ...c, provider: e.target.value }
                                : c
                            )
                          )
                        }
                        placeholder="أكاديمية سدايا"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>سنة الإنجاز</label>
                      <input
                        type="number"
                        min="1990"
                        max="2030"
                        value={course.year}
                        onChange={(e) =>
                          update(
                            "courses",
                            data.courses.map((c) =>
                              c.id === course.id
                                ? { ...c, year: e.target.value }
                                : c
                            )
                          )
                        }
                        placeholder="2024"
                        dir="ltr"
                        className={`${inputClass} text-left`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                update("courses", [...data.courses, emptyCourse()])
              }
              className="mt-4 text-sm font-semibold text-[#378ADD] hover:text-[#2a6bb8]"
            >
              + إضافة دورة أخرى
            </button>
          </div>
        )}

        {step === 7 && (
          <div>
            <h2 className="mb-2 text-2xl font-extrabold text-slate-900">
              الوصف الذاتي
            </h2>
            <p className="mb-6 text-slate-600">
              اكتب نبذة مختصرة عن نفسك وخبراتك وطموحاتك المهنية.
            </p>
            <div>
              <label htmlFor="selfDescription" className={labelClass}>
                الوصف الذاتي (بالعربية)
              </label>
              <textarea
                id="selfDescription"
                value={data.selfDescription}
                onChange={(e) => update("selfDescription", e.target.value)}
                rows={8}
                placeholder="أنا محترف في مجال... أتميز بـ... أسعى إلى..."
                className={inputClass}
              />
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className="rounded-full border-2 border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition-colors hover:border-[#378ADD] hover:text-[#378ADD] disabled:cursor-not-allowed disabled:opacity-40"
          >
            السابق
          </button>

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={goNext}
              className="rounded-full bg-[#378ADD] px-8 py-3 text-sm font-semibold text-white shadow-md shadow-[#378ADD]/25 transition-colors hover:bg-[#2a6bb8]"
            >
              التالي
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={generating}
              className="rounded-full bg-[#378ADD] px-8 py-3 text-sm font-semibold text-white shadow-md shadow-[#378ADD]/25 transition-colors hover:bg-[#2a6bb8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              إنهاء وإنشاء السيرة الذاتية
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

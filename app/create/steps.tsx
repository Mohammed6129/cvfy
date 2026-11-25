"use client";

import { useState, type ReactNode } from "react";
import { PlusIcon, TrashIcon } from "@/app/components/icons";
import { SpotBriefcase, SpotPerson, SpotTarget } from "@/app/components/illustrations";
import {
  CITIES,
  DEGREES,
  emptyCertificate,
  emptyEducation,
  emptyExperience,
  emptyProject,
  nameKey,
  needsWorkHistory,
  suggestSkills,
  yearOptions,
  type FormErrors,
} from "@/lib/cv/form";
import type { CvForm, FormEducation, FormExperience, LanguageLevel } from "@/lib/cv/types";
import { ChoiceChips, Reveal, Segmented, SelectField, TagInput, TextArea, TextField, YearPicker } from "./fields";

export type StepProps = {
  form: CvForm;
  update: (fn: (form: CvForm) => CvForm) => void;
  errors: FormErrors;
};

function StepIntro({ title, lead, art }: { title: string; lead: string; art: ReactNode }) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-card)] bg-desk sm:flex">{art}</span>
      <div>
        <h1 className="t-h2">{title}</h1>
        <p className="t-body mt-1">{lead}</p>
      </div>
    </div>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button type="button" onClick={onClick} className="btn btn-ghost btn-block border-dashed">
      <PlusIcon size={16} />
      {children}
    </button>
  );
}

function RemoveButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="btn btn-quiet btn-sm text-bad hover:bg-bad-soft hover:text-bad">
      <TrashIcon size={16} />
      حذف
    </button>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <h2 className="t-h3 border-t border-rule pt-6">{children}</h2>;
}

/* ───────────── 1. The job ───────────── */

export function TargetStep({ form, update, errors, intro = true }: StepProps & { intro?: boolean }) {
  const set = (patch: Partial<CvForm["target"]>) => update((f) => ({ ...f, target: { ...f.target, ...patch } }));
  const hasExperience = needsWorkHistory(form.target.level);

  return (
    <div>
      {intro && (
        <StepIntro
          art={<SpotTarget className="h-10 w-10" />}
          title="نبدأ بالوظيفة"
          lead="ثلاث خطوات قصيرة، وبعدها تشوف سيرتك مكتوبة."
        />
      )}
      <div className="space-y-6">
        <Segmented
          label="لغة السيرة"
          value={form.primaryLang}
          onChange={(primaryLang) => update((f) => ({ ...f, primaryLang }))}
          options={[
            { id: "en", label: "إنجليزي", note: "للشركات والبنوك" },
            { id: "ar", label: "عربي", note: "للجهات الحكومية" },
          ]}
        />

        <TextField
          name="target.jobTitle"
          label="الوظيفة اللي بتقدّم عليها"
          value={form.target.jobTitle}
          onChange={(v) => set({ jobTitle: v })}
          placeholder="مثال: محاسب، أخصائية موارد بشرية"
          error={errors["target.jobTitle"]}
        />

        <Segmented
          label="عندك خبرة وظيفية؟"
          value={hasExperience ? "yes" : "no"}
          onChange={(v) => set({ level: v === "yes" ? "junior" : "fresh" })}
          options={[
            { id: "yes", label: "إيه، عندي خبرة" },
            { id: "no", label: "لا، طالب أو خريج" },
          ]}
        />

        <Reveal label="عندك إعلان وظيفة؟ الصقه هنا" open={Boolean(form.target.jobAd)}>
          <TextArea
            label="نص إعلان الوظيفة"
            optional
            rows={5}
            value={form.target.jobAd}
            onChange={(v) => set({ jobAd: v })}
            placeholder="انسخ نص الإعلان من LinkedIn أو جدارات أو موقع الشركة…"
            hint="نطلّع كلماته المفتاحية ونكتب سيرتك عليها."
          />
        </Reveal>
      </div>
    </div>
  );
}

/* ───────────── 2. About you: contact + education ───────────── */

const NATIONALITY_OPTIONS: { id: string; label: string }[] = [
  { id: "saudi", label: "سعودي" },
  { id: "resident", label: "مقيم" },
  { id: "", label: "لا تذكرها" },
];

export function AboutStep({ form, update, errors }: StepProps) {
  const p = form.personal;
  const lang = form.primaryLang;
  const key = nameKey(lang);
  const otherKey = nameKey(lang === "ar" ? "en" : "ar");
  const set = (patch: Partial<CvForm["personal"]>) => update((f) => ({ ...f, personal: { ...f.personal, ...patch } }));
  const knownCity = CITIES.some((c) => c.ar === p.city);
  const years = yearOptions(1980).map((y) => ({ value: y, label: y }));

  const patchEdu = (id: string, patch: Partial<FormEducation>) =>
    update((f) => ({ ...f, education: f.education.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));

  return (
    <div>
      <StepIntro art={<SpotPerson className="h-10 w-10" />} title="بياناتك" lead="تطلع في رأس السيرة عشان يتواصلون معك." />

      <div className="space-y-5">
        <TextField
          name="personal.name"
          label={lang === "en" ? "اسمك بالإنجليزي" : "اسمك"}
          value={p[key]}
          onChange={(v) => set(key === "nameAr" ? { nameAr: v } : { nameEn: v })}
          placeholder={lang === "en" ? "Mohammed Abdullah Alqahtani" : "محمد عبدالله القحطاني"}
          ltr={lang === "en"}
          autoComplete="name"
          autoCapitalize={lang === "en" ? "words" : undefined}
          error={errors["personal.name"]}
        />
        {p[otherKey] && (
          <TextField
            name="personal.otherName"
            label={lang === "en" ? "اسمك بالعربي (للنسخة العربية)" : "اسمك بالإنجليزي (للنسخة الإنجليزية)"}
            optional
            value={p[otherKey]}
            onChange={(v) => set(otherKey === "nameAr" ? { nameAr: v } : { nameEn: v })}
            ltr={lang === "ar"}
            error={errors["personal.otherName"]}
          />
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            name="personal.phone"
            label="رقم الجوال"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            ltr
            value={p.phone}
            onChange={(v) => set({ phone: v })}
            placeholder="05xxxxxxxx"
            error={errors["personal.phone"]}
          />
          <TextField
            name="personal.email"
            label="الإيميل"
            type="email"
            inputMode="email"
            autoComplete="email"
            ltr
            value={p.email}
            onChange={(v) => set({ email: v })}
            placeholder="name@email.com"
            error={errors["personal.email"]}
          />
        </div>

        <div data-field="personal.city">
          <SelectField
            label="المدينة"
            value={knownCity ? p.city : p.city ? "__other" : ""}
            onChange={(v) => set({ city: v === "__other" ? " " : v })}
            placeholder="اختر مدينتك"
            options={[...CITIES.map((c) => ({ value: c.ar, label: c.ar })), { value: "__other", label: "مدينة ثانية" }]}
            error={!knownCity && !p.city.trim() ? errors["personal.city"] : undefined}
          />
          {!knownCity && p.city !== "" && (
            <input
              aria-label="اسم المدينة"
              className="field mt-2"
              value={p.city.trim()}
              onChange={(e) => set({ city: e.target.value || " " })}
              placeholder="اكتب اسم المدينة"
              aria-invalid={errors["personal.city"] ? true : undefined}
            />
          )}
        </div>

        <Segmented
          label="الجنسية"
          value={p.nationality}
          onChange={(nationality) => set({ nationality })}
          options={NATIONALITY_OPTIONS}
        />

        <SectionTitle>تعليمك</SectionTitle>
        {errors["education"] && <p data-field="education" className="note note-bad" role="alert">{errors["education"]}</p>}

        {form.education.map((x, i) => (
          <div key={x.id} className={`space-y-5 ${i > 0 ? "border-t border-dashed border-rule pt-5" : ""}`}>
            {i > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-mute">مؤهل {i + 1}</span>
                <RemoveButton
                  label={`حذف المؤهل ${i + 1}`}
                  onClick={() => update((f) => ({ ...f, education: f.education.filter((e) => e.id !== x.id) }))}
                />
              </div>
            )}
            <ChoiceChips
              label="المؤهل"
              value={x.level}
              onChange={(level) => patchEdu(x.id, { level })}
              options={DEGREES.filter((d) => d.id !== "other" || x.level === "other").map((d) => ({ id: d.id, label: d.ar }))}
            />
            {x.level !== "highschool" && (
              <TextField
                name={`education.${x.id}.major`}
                label="التخصص"
                value={x.major}
                onChange={(v) => patchEdu(x.id, { major: v })}
                placeholder="مثال: إدارة أعمال"
                error={errors[`education.${x.id}.major`]}
              />
            )}
            <TextField
              name={`education.${x.id}.institution`}
              label={x.level === "highschool" ? "المدرسة" : "الجامعة أو الكلية"}
              value={x.institution}
              onChange={(v) => patchEdu(x.id, { institution: v })}
              placeholder={x.level === "highschool" ? "مثال: ثانوية الملك فهد" : "مثال: جامعة الملك سعود"}
              error={errors[`education.${x.id}.institution`]}
            />
            <div data-field={`education.${x.id}.year`}>
              <SelectField
                label="سنة التخرج"
                value={x.year}
                onChange={(v) => patchEdu(x.id, { year: v })}
                placeholder="اختر السنة (أو المتوقعة)"
                options={years}
                error={errors[`education.${x.id}.year`]}
              />
            </div>
            <Reveal label="أضف المعدل (اختياري)" open={Boolean(x.gpa)}>
              <TextField
                label="المعدل"
                optional
                ltr
                value={x.gpa}
                onChange={(v) => patchEdu(x.id, { gpa: v })}
                placeholder="4.5/5"
              />
            </Reveal>
          </div>
        ))}

        {form.education.length < 3 && (
          <button
            type="button"
            onClick={() => update((f) => ({ ...f, education: [...f.education, emptyEducation()] }))}
            className="flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-medium text-pen"
          >
            <span aria-hidden className="text-lg leading-none">+</span>
            أضف مؤهل ثاني
          </button>
        )}
      </div>
    </div>
  );
}

/* ───────────── 3. Experience (+ extras) ───────────── */

const DESCRIPTION_PLACEHOLDER = {
  job: "مثال: أمسك حسابات 5 عملاء وأجهّز لهم تقارير شهرية، وسويت ملف إكسل اختصر علينا شغل يومين.",
  other: "مثال: تدربت 6 شهور في المبيعات، أجهّز عروض الأسعار وأتابع الطلبات مع المستودع.",
};

function ExperienceCard({
  item,
  index,
  required,
  removable,
  errors,
  patch,
  remove,
}: {
  item: FormExperience;
  index: number;
  required: boolean;
  removable: boolean;
  errors: FormErrors;
  patch: (patch: Partial<FormExperience>) => void;
  remove: () => void;
}) {
  const [showMonths, setShowMonths] = useState(item.start.includes("-") || item.end.includes("-"));

  return (
    <section className="card space-y-5 p-4 sm:p-5" aria-label={`الخبرة ${index + 1}`}>
      <div className="flex min-h-9 items-center justify-between">
        <span className="text-sm font-medium text-mute">{required ? `الخبرة ${index + 1}` : `التدريب أو التطوع ${index + 1}`}</span>
        {removable && <RemoveButton label={`حذف الخبرة ${index + 1}`} onClick={remove} />}
      </div>

      <TextField
        name={`experience.${item.id}.title`}
        label="المسمى"
        value={item.title}
        onChange={(v) => patch({ title: v })}
        placeholder={required ? "مثال: محاسب" : "مثال: متدرب تعاوني"}
        error={errors[`experience.${item.id}.title`]}
      />
      <TextField
        name={`experience.${item.id}.company`}
        label="الجهة"
        value={item.company}
        onChange={(v) => patch({ company: v })}
        placeholder="مثال: شركة المراعي"
        error={errors[`experience.${item.id}.company`]}
      />

      <div>
        <div className={`grid gap-3 ${showMonths ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2"}`}>
          <YearPicker
            name={`experience.${item.id}.start`}
            label="من"
            value={item.start}
            showMonth={showMonths}
            onChange={(v) => patch({ start: v })}
            error={errors[`experience.${item.id}.start`]}
          />
          <YearPicker
            name={`experience.${item.id}.end`}
            label="إلى"
            value={item.current ? "" : item.end}
            disabled={item.current}
            showMonth={showMonths}
            onChange={(v) => patch({ end: v })}
            error={errors[`experience.${item.id}.end`]}
          />
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4">
          <label className="flex min-h-11 cursor-pointer items-center gap-2 text-[0.9375rem]">
            <input
              type="checkbox"
              checked={item.current}
              onChange={(e) => patch({ current: e.target.checked, end: e.target.checked ? "" : item.end })}
              className="h-5 w-5 accent-[var(--color-ink)]"
            />
            لسا فيها
          </label>
          {!showMonths && (
            <button type="button" onClick={() => setShowMonths(true)} className="min-h-11 text-[0.875rem] text-pen">
              + حدّد الشهر (اختياري)
            </button>
          )}
        </div>
      </div>

      <TextArea
        name={`experience.${item.id}.description`}
        label="وش كنت تسوي؟"
        casual
        rows={4}
        value={item.description}
        onChange={(v) => patch({ description: v })}
        placeholder={required ? DESCRIPTION_PLACEHOLDER.job : DESCRIPTION_PLACEHOLDER.other}
        hint="اذكر أرقام لو تقدر: كم عميل، كم ريال، كم موظف."
        error={errors[`experience.${item.id}.description`]}
      />
    </section>
  );
}

const ENGLISH_LEVELS: { id: LanguageLevel; label: string }[] = [
  { id: "fluent", label: "ممتاز" },
  { id: "good", label: "جيد" },
  { id: "basic", label: "مبتدئ" },
  { id: "native", label: "لغتي الأم" },
];

function Projects({ form, update }: Pick<StepProps, "form" | "update">) {
  const patchProject = (id: string, patch: { name?: string; description?: string }) =>
    update((f) => ({ ...f, projects: f.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));

  return (
    <div className="space-y-4">
      {form.projects.map((p, i) => (
        <section key={p.id} className="card space-y-4 p-4 sm:p-5" aria-label={`المشروع ${i + 1}`}>
          <div className="flex min-h-9 items-center justify-between">
            <span className="text-sm font-medium text-mute">مشروع {i + 1}</span>
            <RemoveButton
              label={`حذف المشروع ${i + 1}`}
              onClick={() => update((f) => ({ ...f, projects: f.projects.filter((x) => x.id !== p.id) }))}
            />
          </div>
          <TextField
            label="اسم المشروع"
            value={p.name}
            onChange={(v) => patchProject(p.id, { name: v })}
            placeholder="مثال: مشروع التخرج — نظام حجز مواعيد"
          />
          <TextArea
            label="وش سويت فيه؟"
            casual
            rows={3}
            value={p.description}
            onChange={(v) => patchProject(p.id, { description: v })}
            placeholder="وش المشكلة اللي حلّيتها؟ وش الأدوات؟ وش النتيجة؟"
          />
        </section>
      ))}
      {form.projects.length < 4 && (
        <AddButton onClick={() => update((f) => ({ ...f, projects: [...f.projects, emptyProject()] }))}>أضف مشروع</AddButton>
      )}
    </div>
  );
}

function Extras({ form, update, required }: Pick<StepProps, "form" | "update"> & { required: boolean }) {
  const years = yearOptions(1980).map((y) => ({ value: y, label: y }));
  const patchCert = (id: string, patch: { name?: string; issuer?: string; year?: string }) =>
    update((f) => ({ ...f, certificates: f.certificates.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  const hasAny =
    form.skills.length > 0 ||
    form.certificates.length > 0 ||
    Boolean(form.personal.linkedIn) ||
    Boolean(form.notes) ||
    form.languages.english !== "good" ||
    (required && form.projects.length > 0);

  return (
    <Reveal label="إضافات اختيارية: مهارات، شهادات، LinkedIn" open={hasAny}>
      <div className="space-y-6">
        <SectionTitle>إضافات (اختياري)</SectionTitle>

        <TagInput
          name="skills"
          label="مهارات تبغانا نذكرها"
          values={form.skills}
          onChange={(skills) => update((f) => ({ ...f, skills }))}
          suggestions={suggestSkills(form.target.jobTitle)}
          placeholder="اكتب مهارة واضغط إدخال"
        />

        <ChoiceChips
          label="مستوى إنجليزيتك"
          value={form.languages.english}
          onChange={(english) => update((f) => ({ ...f, languages: { ...f.languages, english } }))}
          options={ENGLISH_LEVELS}
        />

        <div className="space-y-3">
          <p className="label mb-0">شهادات مهنية أو دورات</p>
          {form.certificates.map((c, i) => (
            <section key={c.id} className="card space-y-4 p-4" aria-label={`الشهادة ${i + 1}`}>
              <div className="flex min-h-9 items-center justify-between">
                <span className="text-sm font-medium text-mute">شهادة {i + 1}</span>
                <RemoveButton
                  label={`حذف الشهادة ${i + 1}`}
                  onClick={() => update((f) => ({ ...f, certificates: f.certificates.filter((x) => x.id !== c.id) }))}
                />
              </div>
              <TextField label="اسم الشهادة" value={c.name} onChange={(v) => patchCert(c.id, { name: v })} placeholder="مثال: PMP" />
              <div className="grid grid-cols-2 gap-3">
                <TextField label="الجهة" optional value={c.issuer} onChange={(v) => patchCert(c.id, { issuer: v })} placeholder="PMI" />
                <SelectField label="السنة" value={c.year} onChange={(v) => patchCert(c.id, { year: v })} placeholder="—" options={years} />
              </div>
            </section>
          ))}
          {form.certificates.length < 8 && (
            <AddButton onClick={() => update((f) => ({ ...f, certificates: [...f.certificates, emptyCertificate()] }))}>
              أضف شهادة
            </AddButton>
          )}
        </div>

        {required && (
          <div className="space-y-3">
            <p className="label mb-0">مشاريع</p>
            <Projects form={form} update={update} />
          </div>
        )}

        <TextField
          name="personal.linkedIn"
          label="رابط LinkedIn"
          optional
          ltr
          type="url"
          inputMode="url"
          value={form.personal.linkedIn}
          onChange={(v) => update((f) => ({ ...f, personal: { ...f.personal, linkedIn: v } }))}
          placeholder="linkedin.com/in/username"
        />

        <TextArea
          label="شي ثاني تبغانا نبرزه؟"
          optional
          casual
          rows={3}
          value={form.notes}
          onChange={(v) => update((f) => ({ ...f, notes: v }))}
          placeholder="مثال: موظف الشهر مرتين، مستعد أنتقل لمدينة ثانية…"
        />
      </div>
    </Reveal>
  );
}

export function ExperienceStep({ form, update, errors }: StepProps) {
  const required = needsWorkHistory(form.target.level);
  const patchItem = (id: string, patch: Partial<FormExperience>) =>
    update((f) => ({ ...f, experience: f.experience.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));

  return (
    <div>
      <StepIntro
        art={<SpotBriefcase className="h-10 w-10" />}
        title={required ? "خبراتك" : "تدريبك ومشاريعك"}
        lead={
          required
            ? "اكتب مثل ما تسولف، حتى لو بالعامي. الصياغة علينا."
            : "ما عندك وظيفة؟ عادي. أضف تدريب أو تطوع أو مشروع تخرج، أو كمّل على طول."
        }
      />

      {errors["experience"] && (
        <div data-field="experience" className="note note-bad mb-5" role="alert">
          {errors["experience"]}.{" "}
          <button
            type="button"
            className="link font-medium"
            onClick={() => update((f) => ({ ...f, target: { ...f.target, level: "fresh" } }))}
          >
            ما عندي خبرة وظيفية
          </button>
        </div>
      )}

      <div className="space-y-5">
        {form.experience.map((x, i) => (
          <ExperienceCard
            key={x.id}
            item={x}
            index={i}
            required={required}
            removable={form.experience.length > 1 || !required}
            errors={errors}
            patch={(patch) => patchItem(x.id, patch)}
            remove={() => update((f) => ({ ...f, experience: f.experience.filter((e) => e.id !== x.id) }))}
          />
        ))}

        {form.experience.length < 6 && (
          <AddButton onClick={() => update((f) => ({ ...f, experience: [...f.experience, emptyExperience()] }))}>
            {form.experience.length === 0 ? (required ? "أضف خبرة" : "أضف تدريب أو تطوع") : required ? "أضف خبرة ثانية" : "أضف تدريب أو تطوع"}
          </AddButton>
        )}

        {!required && (
          <div className="space-y-3 pt-2">
            <h2 className="t-h3">مشروع تخرج أو مشروع شخصي</h2>
            <Projects form={form} update={update} />
          </div>
        )}

        <div className="pt-2">
          <Extras form={form} update={update} required={required} />
        </div>
      </div>
    </div>
  );
}

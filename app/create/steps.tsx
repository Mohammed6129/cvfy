"use client";

import { PlusIcon, TrashIcon } from "@/app/components/icons";
import {
  CITIES,
  DEGREES,
  emptyCertificate,
  emptyEducation,
  emptyExperience,
  emptyProject,
  EXPERIENCE_KINDS,
  LANGUAGE_LEVELS,
  LEVELS,
  needsWorkHistory,
  RESIDENCY_OPTIONS,
  suggestSkills,
  yearOptions,
  type FormErrors,
} from "@/lib/cv/form";
import type { CvForm, FormEducation, FormExperience } from "@/lib/cv/types";
import { ChoiceChips, MonthYear, SelectField, TagInput, TextArea, TextField } from "./fields";

export type StepProps = {
  form: CvForm;
  update: (fn: (form: CvForm) => CvForm) => void;
  errors: FormErrors;
};

function StepIntro({ title, lead }: { title: string; lead: string }) {
  return (
    <div className="mb-7">
      <h1 className="t-h2">{title}</h1>
      <p className="t-body mt-1">{lead}</p>
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

/* ───────────── 1. Target job ───────────── */

export function TargetStep({ form, update, errors }: StepProps) {
  const set = (patch: Partial<CvForm["target"]>) => update((f) => ({ ...f, target: { ...f.target, ...patch } }));

  return (
    <div>
      <StepIntro
        title="وش الوظيفة اللي تبغاها؟"
        lead="نبدأ من الهدف، عشان كل سطر في سيرتك ينكتب على مقاسه."
      />
      <div className="space-y-6">
        <TextField
          name="target.jobTitle"
          label="المسمى الوظيفي اللي بتقدّم عليه"
          value={form.target.jobTitle}
          onChange={(v) => set({ jobTitle: v })}
          placeholder="مثال: محاسب، أخصائية موارد بشرية، مهندس مدني"
          error={errors["target.jobTitle"]}
        />

        <ChoiceChips
          label="وين وصلت في مسيرتك؟"
          value={form.target.level}
          onChange={(level) => set({ level })}
          options={LEVELS.map((l) => ({ id: l.id, label: l.label }))}
        />

        <TextArea
          label="عندك إعلان وظيفة معيّن؟ الصق نصه هنا"
          optional
          rows={5}
          value={form.target.jobAd}
          onChange={(v) => set({ jobAd: v })}
          placeholder="انسخ نص الإعلان كامل من LinkedIn أو جدارات أو موقع الشركة والصقه هنا…"
          hint="هذي أقوى خطوة: نطلّع الكلمات المفتاحية من الإعلان ونكتب سيرتك بها، ونوريك أيها ناقص عندك."
        />

        <fieldset>
          <legend className="label">لغة السيرة</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                { id: "en", title: "الإنجليزية", note: "تطلبها أغلب الشركات والبنوك وبوابات التوظيف" },
                { id: "ar", title: "العربية", note: "للجهات الحكومية وبعض الشركات المحلية" },
              ] as const
            ).map((o) => (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={form.primaryLang === o.id}
                onClick={() => update((f) => ({ ...f, primaryLang: o.id }))}
                className={`rounded-[var(--radius-control)] border p-4 text-start transition-colors ${
                  form.primaryLang === o.id ? "border-ink bg-marker-soft" : "border-rule hover:border-ink"
                }`}
              >
                <span className="block font-medium">{o.title}</span>
                <span className="t-small block">{o.note}</span>
              </button>
            ))}
          </div>
          <p className="hint">واجهة الموقع عربية دائماً — هذا اختيار لغة ملف السيرة. وفي الباقة الكاملة تاخذ اللغتين.</p>
        </fieldset>
      </div>
    </div>
  );
}

/* ───────────── 2. Personal ───────────── */

export function PersonalStep({ form, update, errors }: StepProps) {
  const p = form.personal;
  const set = (patch: Partial<CvForm["personal"]>) => update((f) => ({ ...f, personal: { ...f.personal, ...patch } }));
  const knownCity = CITIES.some((c) => c.ar === p.city);

  return (
    <div>
      <StepIntro title="بياناتك" lead="اللي يطلع في رأس السيرة عشان يتواصلون معك." />
      <div className="space-y-5">
        <TextField
          name="personal.nameAr"
          label="اسمك بالعربي"
          value={p.nameAr}
          onChange={(v) => set({ nameAr: v })}
          placeholder="الاسم الأول واسم الأب والعائلة"
          autoComplete="name"
          error={errors["personal.nameAr"]}
        />
        <TextField
          name="personal.nameEn"
          label="اسمك بالإنجليزي"
          value={p.nameEn}
          onChange={(v) => set({ nameEn: v })}
          placeholder="Mohammed Abdullah Alqahtani"
          ltr
          hint="اكتبه مثل ما هو في جوازك أو شهاداتك — نفس الإملاء في كل مكان."
          error={errors["personal.nameEn"]}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            name="personal.email"
            label="البريد الإلكتروني"
            type="email"
            inputMode="email"
            autoComplete="email"
            ltr
            value={p.email}
            onChange={(v) => set({ email: v })}
            placeholder="name@email.com"
            hint="استخدم بريد باسمك، مو بريد قديم بلقب."
            error={errors["personal.email"]}
          />
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
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div data-field="personal.city">
            <SelectField
              label="المدينة"
              value={knownCity ? p.city : p.city ? "__other" : ""}
              onChange={(v) => set({ city: v === "__other" ? " " : v })}
              placeholder="اختر مدينتك"
              options={[...CITIES.map((c) => ({ value: c.ar, label: c.ar })), { value: "__other", label: "مدينة ثانية" }]}
              error={!p.city.trim() && !knownCity && p.city === "" ? errors["personal.city"] : undefined}
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
          <SelectField
            label="الجنسية أو الإقامة"
            value={p.nationality}
            onChange={(v) => set({ nationality: v })}
            options={RESIDENCY_OPTIONS.map((o) => ({ value: o.id, label: o.label }))}
            hint="كثير من الوظائف مخصصة للتوطين، فذكرها يقدّمك في الفرز."
          />
        </div>
        <TextField
          name="personal.linkedIn"
          label="رابط حسابك في LinkedIn"
          optional
          ltr
          type="url"
          inputMode="url"
          value={p.linkedIn}
          onChange={(v) => set({ linkedIn: v })}
          placeholder="linkedin.com/in/username"
          error={errors["personal.linkedIn"]}
        />
      </div>
    </div>
  );
}

/* ───────────── 3. Experience ───────────── */

const DESCRIPTION_HINTS: Record<FormExperience["kind"], string> = {
  job: "مثال: كنت أمسك حسابات 5 عملاء وأجهّز لهم تقارير شهرية، وسويت ملف إكسل اختصر علينا شغل يومين.",
  training: "مثال: تدربت 6 شهور في قسم المبيعات، كنت أجهّز عروض الأسعار وأتابع الطلبات مع المستودع.",
  volunteer: "مثال: نظّمت مع فريق من 8 أشخاص فعالية حضرها 300 زائر، وكنت مسؤول التسجيل.",
};

export function ExperienceStep({ form, update, errors }: StepProps) {
  const required = needsWorkHistory(form.target.level);

  const patchItem = (id: string, patch: Partial<FormExperience>) =>
    update((f) => ({ ...f, experience: f.experience.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));

  const patchProject = (id: string, patch: { name?: string; description?: string }) =>
    update((f) => ({ ...f, projects: f.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));

  return (
    <div>
      <StepIntro
        title="سولف لنا عن خبراتك"
        lead={
          required
            ? "اكتب مثل ما تسولف لصاحبك عن شغلك — بالعامي عادي. الصياغة علينا."
            : "ما عندك وظيفة سابقة؟ عادي. أضف تدريبك التعاوني أو تمهير أو تطوعك، ومشروع تخرجك تحت."
        }
      />

      {errors["experience"] && <p className="note note-bad mb-5" role="alert">{errors["experience"]}</p>}

      <div className="space-y-5">
        {form.experience.map((x, i) => (
          <section key={x.id} className="card p-4 sm:p-6" aria-label={`الخبرة ${i + 1}`}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="نوع الخبرة">
                {EXPERIENCE_KINDS.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    role="radio"
                    aria-checked={x.kind === k.id}
                    onClick={() => patchItem(x.id, { kind: k.id })}
                    className={`chip ${x.kind === k.id ? "chip-on" : ""}`}
                  >
                    {k.label}
                  </button>
                ))}
              </div>
              {(form.experience.length > 1 || !required) && (
                <RemoveButton
                  label={`حذف الخبرة ${i + 1}`}
                  onClick={() => update((f) => ({ ...f, experience: f.experience.filter((e) => e.id !== x.id) }))}
                />
              )}
            </div>

            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  name={`experience.${x.id}.title`}
                  label={x.kind === "job" ? "المسمى الوظيفي" : x.kind === "training" ? "مسمى التدريب" : "دورك"}
                  value={x.title}
                  onChange={(v) => patchItem(x.id, { title: v })}
                  placeholder={x.kind === "job" ? "مثال: محاسب" : x.kind === "training" ? "مثال: متدرب تعاوني" : "مثال: منسق متطوعين"}
                  error={errors[`experience.${x.id}.title`]}
                />
                <TextField
                  name={`experience.${x.id}.company`}
                  label="اسم الجهة"
                  value={x.company}
                  onChange={(v) => patchItem(x.id, { company: v })}
                  placeholder="مثال: شركة الاتصالات السعودية"
                  error={errors[`experience.${x.id}.company`]}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <MonthYear
                  name={`experience.${x.id}.start`}
                  label="من"
                  value={x.start}
                  onChange={(v) => patchItem(x.id, { start: v })}
                  error={errors[`experience.${x.id}.start`]}
                />
                <div>
                  <MonthYear
                    name={`experience.${x.id}.end`}
                    label="إلى"
                    value={x.current ? "" : x.end}
                    disabled={x.current}
                    onChange={(v) => patchItem(x.id, { end: v })}
                    error={errors[`experience.${x.id}.end`]}
                  />
                  <label className="mt-2 flex min-h-11 cursor-pointer items-center gap-2 text-[0.9375rem]">
                    <input
                      type="checkbox"
                      checked={x.current}
                      onChange={(e) => patchItem(x.id, { current: e.target.checked, end: e.target.checked ? "" : x.end })}
                      className="h-5 w-5 accent-[var(--color-ink)]"
                    />
                    لسا فيها
                  </label>
                </div>
              </div>

              <TextArea
                name={`experience.${x.id}.description`}
                label="وش كنت تسوي؟"
                casual
                rows={5}
                value={x.description}
                onChange={(v) => patchItem(x.id, { description: v })}
                placeholder={DESCRIPTION_HINTS[x.kind]}
                hint="كل ما ذكرت أرقام أكثر (كم عميل، كم ريال، كم موظف، كم بالمئة) طلعت سيرتك أقوى."
                error={errors[`experience.${x.id}.description`]}
              />
            </div>
          </section>
        ))}

        {form.experience.length < 6 && (
          <AddButton onClick={() => update((f) => ({ ...f, experience: [...f.experience, emptyExperience(required ? "job" : "training")] }))}>
            {form.experience.length === 0 ? "أضف خبرة أو تدريب" : "أضف خبرة ثانية"}
          </AddButton>
        )}
      </div>

      <div className="mt-10">
        <h2 className="t-h3">مشاريع</h2>
        <p className="t-small mb-4">
          مشروع تخرج، مشروع جانبي، أو شي بنيته بنفسك. {required ? "اختياري." : "مهم لحديثي التخرج."}
        </p>
        <div className="space-y-5">
          {form.projects.map((p, i) => (
            <section key={p.id} className="card p-4 sm:p-6" aria-label={`المشروع ${i + 1}`}>
              <div className="mb-2 flex justify-end">
                <RemoveButton
                  label={`حذف المشروع ${i + 1}`}
                  onClick={() => update((f) => ({ ...f, projects: f.projects.filter((x) => x.id !== p.id) }))}
                />
              </div>
              <div className="space-y-5">
                <TextField
                  label="اسم المشروع"
                  value={p.name}
                  onChange={(v) => patchProject(p.id, { name: v })}
                  placeholder="مثال: مشروع التخرج — نظام حجز مواعيد"
                />
                <TextArea
                  label="وش سويت فيه؟"
                  casual
                  rows={4}
                  value={p.description}
                  onChange={(v) => patchProject(p.id, { description: v })}
                  placeholder="وش المشكلة اللي حلّيتها؟ وش الأدوات اللي استخدمتها؟ وش كانت النتيجة؟"
                />
              </div>
            </section>
          ))}
          {form.projects.length < 4 && (
            <AddButton onClick={() => update((f) => ({ ...f, projects: [...f.projects, emptyProject()] }))}>أضف مشروع</AddButton>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────── 4. Education ───────────── */

export function EducationStep({ form, update, errors }: StepProps) {
  const patchItem = (id: string, patch: Partial<FormEducation>) =>
    update((f) => ({ ...f, education: f.education.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));
  const patchCert = (id: string, patch: { name?: string; issuer?: string; year?: string }) =>
    update((f) => ({ ...f, certificates: f.certificates.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  const years = yearOptions(1980).map((y) => ({ value: y, label: y }));

  return (
    <div>
      <StepIntro title="تعليمك وشهاداتك" lead="المؤهل الدراسي، وأي شهادة مهنية أو دورة لها علاقة بالوظيفة." />

      {errors["education"] && <p className="note note-bad mb-5" role="alert">{errors["education"]}</p>}

      <div className="space-y-5">
        {form.education.map((x, i) => (
          <section key={x.id} className="card p-4 sm:p-6" aria-label={`المؤهل ${i + 1}`}>
            {form.education.length > 1 && (
              <div className="mb-2 flex justify-end">
                <RemoveButton
                  label={`حذف المؤهل ${i + 1}`}
                  onClick={() => update((f) => ({ ...f, education: f.education.filter((e) => e.id !== x.id) }))}
                />
              </div>
            )}
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField
                  label="الدرجة"
                  value={x.level}
                  onChange={(v) => patchItem(x.id, { level: v as FormEducation["level"] })}
                  options={DEGREES.map((d) => ({ value: d.id, label: d.ar }))}
                />
                <TextField
                  name={`education.${x.id}.major`}
                  label="التخصص"
                  value={x.major}
                  onChange={(v) => patchItem(x.id, { major: v })}
                  placeholder="مثال: إدارة أعمال"
                  error={errors[`education.${x.id}.major`]}
                />
              </div>
              <TextField
                name={`education.${x.id}.institution`}
                label="الجامعة أو الجهة التعليمية"
                value={x.institution}
                onChange={(v) => patchItem(x.id, { institution: v })}
                placeholder="مثال: جامعة الملك سعود"
                error={errors[`education.${x.id}.institution`]}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <div data-field={`education.${x.id}.year`}>
                  <SelectField
                    label="سنة التخرج"
                    value={x.year}
                    onChange={(v) => patchItem(x.id, { year: v })}
                    placeholder="اختر السنة"
                    options={years}
                    hint="لسا تدرس؟ اختر السنة المتوقعة."
                    error={errors[`education.${x.id}.year`]}
                  />
                </div>
                <TextField
                  label="المعدل"
                  optional
                  ltr
                  value={x.gpa}
                  onChange={(v) => patchItem(x.id, { gpa: v })}
                  placeholder="4.5/5"
                  hint="اكتبه إذا كان 3.75 من 5 أو أعلى. غير كذا الأفضل تتركه فاضي."
                />
              </div>
            </div>
          </section>
        ))}
        {form.education.length < 3 && (
          <AddButton onClick={() => update((f) => ({ ...f, education: [...f.education, emptyEducation()] }))}>أضف مؤهل ثاني</AddButton>
        )}
      </div>

      <div className="mt-10">
        <h2 className="t-h3">شهادات مهنية ودورات</h2>
        <p className="t-small mb-4">اختياري. اكتب اللي له علاقة بالوظيفة فقط، مثل PMP أو SOCPA أو دورة Excel متقدم.</p>
        <div className="space-y-4">
          {form.certificates.map((c, i) => (
            <section key={c.id} className="card p-4 sm:p-5" aria-label={`الشهادة ${i + 1}`}>
              <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr_0.7fr_auto] sm:items-end">
                <TextField label="اسم الشهادة" value={c.name} onChange={(v) => patchCert(c.id, { name: v })} placeholder="مثال: PMP" />
                <TextField label="الجهة" optional value={c.issuer} onChange={(v) => patchCert(c.id, { issuer: v })} placeholder="مثال: PMI" />
                <SelectField label="السنة" value={c.year} onChange={(v) => patchCert(c.id, { year: v })} placeholder="—" options={years} />
                <RemoveButton
                  label={`حذف الشهادة ${i + 1}`}
                  onClick={() => update((f) => ({ ...f, certificates: f.certificates.filter((x) => x.id !== c.id) }))}
                />
              </div>
            </section>
          ))}
          {form.certificates.length < 8 && (
            <AddButton onClick={() => update((f) => ({ ...f, certificates: [...f.certificates, emptyCertificate()] }))}>
              أضف شهادة أو دورة
            </AddButton>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────── 5. Skills ───────────── */

export function SkillsStep({ form, update, errors }: StepProps) {
  const levels = LANGUAGE_LEVELS.map((l) => ({ value: l.id, label: l.ar }));

  return (
    <div>
      <StepIntro title="مهاراتك" lead="الأدوات والأنظمة أهم من الصفات. «Excel» و«SAP» تنبحث، «مجتهد» ما أحد يبحث عنها." />
      <div className="space-y-8">
        <TagInput
          name="skills"
          label="مهاراتك"
          values={form.skills}
          onChange={(skills) => update((f) => ({ ...f, skills }))}
          suggestions={suggestSkills(form.target.jobTitle)}
          placeholder="اكتب مهارة واضغط Enter"
          hint="اكتب اللي تعرفه فعلاً — بتنسأل عنه في المقابلة."
          error={errors["skills"]}
        />

        <fieldset>
          <legend className="label">اللغات</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              label="العربية"
              value={form.languages.arabic}
              onChange={(v) => update((f) => ({ ...f, languages: { ...f.languages, arabic: v as CvForm["languages"]["arabic"] } }))}
              options={levels}
            />
            <SelectField
              label="الإنجليزية"
              value={form.languages.english}
              onChange={(v) => update((f) => ({ ...f, languages: { ...f.languages, english: v as CvForm["languages"]["english"] } }))}
              options={levels}
            />
          </div>
        </fieldset>

        <TextArea
          label="شي ثاني تبغانا نبرزه؟"
          optional
          casual
          rows={3}
          value={form.notes}
          onChange={(v) => update((f) => ({ ...f, notes: v }))}
          placeholder="مثال: حصلت على موظف الشهر مرتين، عندي رخصة قيادة، مستعد أنتقل لمدينة ثانية…"
        />
      </div>
    </div>
  );
}

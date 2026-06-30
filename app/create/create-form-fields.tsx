"use client";

import type { ReactNode } from "react";
import {
  FORM_DATE_SELECT_CLASS,
  FORM_LABEL_CLASS,
  FORM_SELECT_CLASS,
} from "@/app/components/home-glass-shell";
import {
  GRADUATION_YEARS,
  MONTHS,
  WORK_YEARS,
} from "@/lib/create-form-constants";
import type { CvFormData } from "@/lib/cv-types";

export const REQUIRED_ORANGE = "#EF4444";

const labelClass = FORM_LABEL_CLASS;

export function parseYearMonth(value: string) {
  const [year = "", month = ""] = value.split("-");
  return { year, month };
}

export function formatYearMonth(year: string, month: string) {
  if (!year && !month) return "";
  if (!month) return year;
  return `${year}-${month}`;
}

export function collectStepErrors(step: number, data: CvFormData): string[] {
  const errors: string[] = [];

  if (step === 1) {
    if (!data.name.trim()) errors.push("name");
    if (!data.currentJobTitle.trim()) errors.push("currentJobTitle");
    if (!data.email.trim() || !data.email.includes("@")) errors.push("email");
    if (!data.phone.trim()) errors.push("phone");
    if (!data.city) errors.push("city");
  }

  if (step === 2) {
    for (const w of data.workExperience) {
      const prefix = `work-${w.id}`;
      if (!w.jobTitle.trim()) errors.push(`${prefix}-jobTitle`);
      if (!w.company.trim()) errors.push(`${prefix}-company`);
      if (!w.department.trim()) errors.push(`${prefix}-department`);
      if (!w.description.trim()) errors.push(`${prefix}-description`);
      if (!w.startDate) errors.push(`${prefix}-startDate`);
      if (!w.isCurrent && !w.endDate) errors.push(`${prefix}-endDate`);
    }
  }

  if (step === 3) {
    const edu = data.education[0];
    if (!edu?.institution.trim()) errors.push("institution");
    if (!edu?.degree.trim()) errors.push("degree");
    if (!edu?.endDate.trim()) errors.push("graduationYear");
  }

  if (step === 4 && data.skills.length === 0) {
    errors.push("skills");
  }

  if (step === 5 && !data.selfDescription.trim()) {
    errors.push("selfDescription");
  }

  return errors;
}

export function RequiredMarker() {
  return (
    <span
      className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold leading-none text-red-500"
      aria-hidden
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
        <circle cx="6" cy="6" r="5.5" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1"/>
        <path d="M6 3.5v3" stroke="#EF4444" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="6" cy="8.5" r="0.65" fill="#EF4444"/>
      </svg>
      هذا الحقل مطلوب
    </span>
  );
}

export function invalidFieldClass(base: string, invalid: boolean) {
  return invalid
    ? `${base} !border-red-500 !bg-red-50 focus:!border-red-500 focus:!ring-2 focus:!ring-red-500/30`
    : base;
}

type FormFieldProps = {
  label: ReactNode;
  required?: boolean;
  invalid?: boolean;
  tip?: ReactNode;
  children: ReactNode;
};

export function FormField({
  label,
  required,
  invalid,
  tip,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {required && invalid && <RequiredMarker />}
      {children}
      {tip}
    </div>
  );
}

const dateSelectBase = FORM_DATE_SELECT_CLASS;

type WorkExperienceDateRangeProps = {
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  invalidStart?: boolean;
  invalidEnd?: boolean;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onCurrentChange: (checked: boolean) => void;
};

export function WorkExperienceDateRange({
  startDate,
  endDate,
  isCurrent,
  invalidStart = false,
  invalidEnd = false,
  onStartChange,
  onEndChange,
  onCurrentChange,
}: WorkExperienceDateRangeProps) {
  const start = parseYearMonth(startDate);
  const end = parseYearMonth(endDate);

  return (
    <div className="mt-4">
      <label className={labelClass}>فترة العمل</label>
      {(invalidStart || invalidEnd) && <RequiredMarker />}

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={start.month}
          onChange={(e) =>
            onStartChange(formatYearMonth(start.year, e.target.value))
          }
          className={invalidFieldClass(dateSelectBase, invalidStart)}
          aria-label="شهر البداية"
        >
          <option value="">شهر البداية</option>
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <select
          value={start.year}
          onChange={(e) =>
            onStartChange(formatYearMonth(e.target.value, start.month))
          }
          className={invalidFieldClass(dateSelectBase, invalidStart)}
          aria-label="سنة البداية"
        >
          <option value="">سنة البداية</option>
          {WORK_YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <span
          className="flex shrink-0 items-center px-1 text-lg font-bold text-[#378ADD]"
          aria-hidden
        >
          ←
        </span>

        {isCurrent ? (
          <span className="inline-flex min-h-[46px] flex-1 items-center justify-center rounded-xl bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
            حتى الآن
          </span>
        ) : (
          <>
            <select
              value={end.month}
              onChange={(e) =>
                onEndChange(formatYearMonth(end.year, e.target.value))
              }
              className={invalidFieldClass(dateSelectBase, invalidEnd)}
              aria-label="شهر النهاية"
            >
              <option value="">شهر النهاية</option>
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            <select
              value={end.year}
              onChange={(e) =>
                onEndChange(formatYearMonth(e.target.value, end.month))
              }
              className={invalidFieldClass(dateSelectBase, invalidEnd)}
              aria-label="سنة النهاية"
            >
              <option value="">سنة النهاية</option>
              {WORK_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm font-medium text-white/85">
        <input
          type="checkbox"
          checked={isCurrent}
          onChange={(e) => onCurrentChange(e.target.checked)}
          className="h-4 w-4 rounded text-[#378ADD]"
        />
        حتى الآن
      </label>
    </div>
  );
}

export function MonthYearSelect({
  label,
  value,
  onChange,
  invalid,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
}) {
  const { month, year } = parseYearMonth(value);
  const selectBase = FORM_SELECT_CLASS;

  return (
    <FormField label={label} required invalid={invalid}>
      <div className="grid grid-cols-2 gap-2">
        <select
          value={month}
          onChange={(e) => onChange(formatYearMonth(year, e.target.value))}
          className={invalidFieldClass(selectBase, Boolean(invalid))}
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
          onChange={(e) => onChange(formatYearMonth(e.target.value, month))}
          className={invalidFieldClass(selectBase, Boolean(invalid))}
        >
          <option value="">السنة</option>
          {WORK_YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </FormField>
  );
}

export { GRADUATION_YEARS };

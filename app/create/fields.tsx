"use client";

import { useId, useState, type ReactNode } from "react";
import { XIcon } from "@/app/components/icons";
import { MONTH_OPTIONS, yearOptions } from "@/lib/cv/form";

type BaseProps = {
  label: string;
  optional?: boolean;
  hint?: ReactNode;
  error?: string;
  /** Used to scroll to the first invalid field. */
  name?: string;
};

export function Field({
  label,
  optional,
  hint,
  error,
  name,
  children,
  htmlFor,
}: BaseProps & { children: ReactNode; htmlFor?: string }) {
  return (
    <div data-field={name}>
      <label className="label" htmlFor={htmlFor}>
        {label}
        {optional && <span className="label-opt">اختياري</span>}
      </label>
      {children}
      {error ? <p className="field-error" role="alert">{error}</p> : hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}

type TextFieldProps = BaseProps & {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "url";
  ltr?: boolean;
  autoComplete?: string;
  autoCapitalize?: "off" | "words" | "sentences";
  inputMode?: "text" | "email" | "tel" | "numeric" | "url";
};

export function TextField({
  value,
  onChange,
  placeholder,
  type = "text",
  ltr,
  autoComplete,
  autoCapitalize,
  inputMode,
  ...base
}: TextFieldProps) {
  const id = useId();
  return (
    <Field {...base} htmlFor={id}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={ltr ? "ltr" : undefined}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize ?? (ltr ? "off" : undefined)}
        autoCorrect={ltr ? "off" : undefined}
        spellCheck={ltr ? false : undefined}
        inputMode={inputMode}
        enterKeyHint="next"
        aria-invalid={base.error ? true : undefined}
        className={`field ${ltr ? "text-left placeholder:text-left" : ""}`}
      />
    </Field>
  );
}

type TextAreaProps = BaseProps & {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  /** Show the text in the handwriting face: "write it the way you'd say it". */
  casual?: boolean;
};

export function TextArea({ value, onChange, placeholder, rows = 4, casual, ...base }: TextAreaProps) {
  const id = useId();
  return (
    <Field {...base} htmlFor={id}>
      <textarea
        id={id}
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir="auto"
        aria-invalid={base.error ? true : undefined}
        className={`field ${casual ? "t-hand leading-[2]" : ""}`}
      />
    </Field>
  );
}

type SelectFieldProps = BaseProps & {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
};

export function SelectField({ value, onChange, options, placeholder, ...base }: SelectFieldProps) {
  const id = useId();
  return (
    <Field {...base} htmlFor={id}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={base.error ? true : undefined}
        className={`field ${value ? "" : "text-[#a3abbd]"}`}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-ink">
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

/**
 * Year first (the part people remember); the month is optional and only
 * shown when asked for. Reads/writes "YYYY" or "YYYY-MM".
 */
export function YearPicker({
  value,
  onChange,
  disabled,
  showMonth,
  ...base
}: BaseProps & { value: string; onChange: (value: string) => void; disabled?: boolean; showMonth?: boolean }) {
  const [year = "", month = ""] = value.split("-");
  const set = (y: string, m: string) => onChange(y ? (m ? `${y}-${m}` : y) : "");

  return (
    <Field {...base}>
      <div className={showMonth ? "grid grid-cols-2 gap-2" : ""}>
        <select
          aria-label={`${base.label} — السنة`}
          value={year}
          disabled={disabled}
          onChange={(e) => set(e.target.value, month)}
          aria-invalid={base.error ? true : undefined}
          className={`field disabled:bg-desk disabled:text-mute ${year ? "" : "text-[#a3abbd]"}`}
        >
          <option value="">السنة</option>
          {yearOptions().map((y) => (
            <option key={y} value={y} className="text-ink">{y}</option>
          ))}
        </select>
        {showMonth && (
          <select
            aria-label={`${base.label} — الشهر`}
            value={month}
            disabled={disabled || !year}
            onChange={(e) => set(year, e.target.value)}
            className={`field disabled:bg-desk disabled:text-mute ${month ? "" : "text-[#a3abbd]"}`}
          >
            <option value="">الشهر</option>
            {MONTH_OPTIONS.map((m) => (
              <option key={m.value} value={m.value} className="text-ink">{m.label}</option>
            ))}
          </select>
        )}
      </div>
    </Field>
  );
}

/** Two or three big, equal buttons acting as a radio group — easy to hit with a thumb. */
export function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
  name,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { id: T; label: string; note?: string }[];
  name?: string;
}) {
  return (
    <fieldset data-field={name}>
      <legend className="label">{label}</legend>
      <div className={`grid gap-2 ${options.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {options.map((o) => {
          const on = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(o.id)}
              className={`flex min-h-12 flex-col items-center justify-center rounded-[var(--radius-control)] border px-2 py-2 text-center transition-colors ${
                on ? "border-ink bg-ink text-white" : "border-rule bg-paper text-ink hover:border-ink"
              }`}
            >
              <span className="text-[0.9375rem] font-medium leading-snug">{o.label}</span>
              {o.note && <span className={`mt-0.5 text-[0.75rem] leading-snug ${on ? "text-white/75" : "text-mute"}`}>{o.note}</span>}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Pill buttons for short lists (degree, English level). */
export function ChoiceChips<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <fieldset>
      <legend className="label">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={value === o.id}
            onClick={() => onChange(o.id)}
            className={`chip min-h-11 px-4 text-[0.9375rem] ${value === o.id ? "border-ink bg-ink font-medium text-white hover:border-ink" : ""}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** "+ something optional" — keeps optional fields out of sight until wanted. */
export function Reveal({
  label,
  open: initiallyOpen = false,
  children,
}: {
  label: string;
  open?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(initiallyOpen);
  if (open) return <div>{children}</div>;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-medium text-pen"
    >
      <span aria-hidden className="text-lg leading-none">+</span>
      {label}
    </button>
  );
}

/** Free-entry tags with one-tap suggestions. */
export function TagInput({
  label,
  hint,
  error,
  values,
  onChange,
  suggestions,
  placeholder,
  name,
}: BaseProps & {
  values: string[];
  onChange: (values: string[]) => void;
  suggestions: string[];
  placeholder?: string;
}) {
  const id = useId();
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const parts = raw.split(/[،,\n]/).map((p) => p.trim()).filter(Boolean);
    if (parts.length === 0) return;
    const next = [...values];
    for (const part of parts) {
      if (!next.some((v) => v.toLowerCase() === part.toLowerCase())) next.push(part);
    }
    onChange(next.slice(0, 30));
    setDraft("");
  };

  const open = suggestions.filter((s) => !values.some((v) => v.toLowerCase() === s.toLowerCase()));

  return (
    <div data-field={name}>
      <label className="label" htmlFor={id}>{label}</label>
      <div
        className={`field flex h-auto flex-wrap items-center gap-2 py-2 focus-within:border-pen focus-within:shadow-[0_0_0_3px_var(--color-pen-soft)]`}
        aria-invalid={error ? true : undefined}
      >
        {values.map((v) => (
          <span key={v} className="chip chip-on min-h-9 pe-1.5">
            {v}
            <button
              type="button"
              aria-label={`حذف ${v}`}
              onClick={() => onChange(values.filter((x) => x !== v))}
              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-ink/10"
            >
              <XIcon size={12} />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "," || e.key === "،") {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && values.length) {
              onChange(values.slice(0, -1));
            }
          }}
          onBlur={() => add(draft)}
          placeholder={values.length ? "" : placeholder}
          enterKeyHint="done"
          className="min-h-9 min-w-32 flex-1 bg-transparent text-base outline-none placeholder:font-light placeholder:text-[#a3abbd]"
        />
      </div>
      {error ? <p className="field-error" role="alert">{error}</p> : hint ? <p className="hint">{hint}</p> : null}

      {open.length > 0 && (
        <div className="mt-3">
          <p className="hint mb-2 mt-0">اضغط لإضافة اللي عندك:</p>
          <div className="flex flex-wrap gap-2">
            {open.map((s) => (
              <button key={s} type="button" onClick={() => add(s)} className="chip">
                <span aria-hidden className="text-mute">+</span>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

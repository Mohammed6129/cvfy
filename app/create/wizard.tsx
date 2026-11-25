"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import UploadCv from "@/app/components/upload-cv";
import { BackIcon, NextIcon, PenIcon } from "@/app/components/icons";
import { IlluWriting } from "@/app/components/illustrations";
import {
  cleanForm,
  DEGREES,
  emptyForm,
  FORM_STEPS,
  formatPeriod,
  nameKey,
  stepForField,
  pinToEmptyCards,
  validateForm,
  validateStep,
  type FormErrors,
} from "@/lib/cv/form";
import type { CvForm } from "@/lib/cv/types";
import { fetchAsGuest } from "@/lib/guest";
import { readDraft, writeDraft } from "./draft";
import { AboutStep, ExperienceStep, TargetStep } from "./steps";

const STEP_LABELS = ["الوظيفة", "بياناتك", "خبراتك"];

type Stage = "loading" | "form" | "review" | "writing";

type WizardProps = {
  editId: string | null;
  resume: boolean;
  fresh: boolean;
  review: boolean;
  email: string | null;
  mock: boolean;
};

function hasContent(form: CvForm): boolean {
  return Boolean(
    form.target.jobTitle.trim() ||
      form.personal.nameAr.trim() ||
      form.personal.nameEn.trim() ||
      form.experience.some((x) => x.title.trim() || x.description.trim())
  );
}

const WRITING_LINES = [
  "نقرأ الوظيفة ونطلّع كلماتها المفتاحية…",
  "نرتّب خبراتك حسب أهميتها للوظيفة…",
  "نصيغ إنجازاتك بالأرقام اللي ذكرتها…",
  "نفحص السيرة على معايير ATS…",
];

/** Bottom action bar: pinned to the thumb on phones, inline on larger screens. */
function ActionBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-rule bg-paper/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md sm:static sm:mt-8 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
      <div className="mx-auto flex max-w-xl items-center gap-3">{children}</div>
    </div>
  );
}

export default function Wizard({ editId, resume, fresh, review, email, mock }: WizardProps) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("loading");
  const [form, setForm] = useState<CvForm>(emptyForm);
  const [step, setStep] = useState(0);
  const [cvId, setCvId] = useState<string | null>(editId);
  const [errors, setErrors] = useState<FormErrors>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [lineIndex, setLineIndex] = useState(0);
  /** Editing one screen from the review summary: "done" goes back to the summary. */
  const [fromReview, setFromReview] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  /** Set once we hand off to sign-in, so a late autosave cannot clear the "pending" flag. */
  const leaving = useRef(false);

  const goLogin = useCallback(
    (next: string) => router.push(`/login?next=${encodeURIComponent(next)}`),
    [router]
  );

  /* ── Writing: save + profile the job, then write. One screen, no questions in between. ── */

  const write = useCallback(
    async (current: CvForm, id: string | null) => {
      setStage("writing");
      setFailure(null);
      setLineIndex(0);
      try {
        const prepared = await fetchAsGuest(mock, "/api/cv/prepare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ form: current, id }),
        });
        if (prepared.status === 401) {
          // Guest sessions are switched off on this deployment: fall back to signing in first.
          leaving.current = true;
          writeDraft({ form: current, step: FORM_STEPS.length - 1, cvId: id, pending: true });
          return goLogin("/create?resume=1");
        }
        const prep = (await prepared.json().catch(() => ({}))) as { id?: string; error?: string; fields?: FormErrors };
        if (prepared.status === 422 && prep.fields) {
          setErrors(prep.fields);
          setStep(stepForField(Object.keys(prep.fields)[0] ?? ""));
          setStage("form");
          return;
        }
        if (!prepared.ok || !prep.id) {
          setFailure(prep.error || "ما قدرنا نكمل هالمرة.");
          return;
        }
        setCvId(prep.id);
        writeDraft({ form: current, step: FORM_STEPS.length - 1, cvId: prep.id, pending: false });

        const res = await fetchAsGuest(mock, "/api/cv/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: prep.id }),
        });
        const data = (await res.json().catch(() => ({}))) as { id?: string; error?: string };
        if (!res.ok || !data.id) {
          setFailure(data.error || "ما قدرنا نكتب السيرة هالمرة.");
          return;
        }
        writeDraft(null);
        router.push(`/preview?cv=${data.id}`);
      } catch {
        setFailure("انقطع الاتصال. تأكد من الإنترنت وجرّب مرة ثانية.");
      }
    },
    [goLogin, mock, router]
  );

  /* ── Boot: edit an existing CV, resume after sign-in, review an upload, or restore the draft ── */

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const boot = async () => {
      if (editId) {
        try {
          const res = await fetch(`/api/cv/${editId}?form=1`, { cache: "no-store" });
          if (res.status === 401) return goLogin(`/create?edit=${editId}`);
          const data = (await res.json()) as { form?: CvForm | null };
          if (data.form) {
            setForm(data.form);
            setCvId(editId);
            setStage("form");
            return;
          }
        } catch {
          // fall through to a fresh form
        }
        setNotice("ما قدرنا نفتح هذي السيرة للتعديل، فبدأنا لك سيرة جديدة.");
        setCvId(null);
      }

      if (fresh) writeDraft(null);
      const draft = fresh ? null : readDraft();

      if (draft && resume && draft.pending) {
        setForm(draft.form);
        setStep(draft.step);
        setCvId(draft.cvId);
        void write(cleanForm(draft.form), draft.cvId);
        return;
      }

      if (draft && (review || draft.review)) {
        setForm(withEmail(draft.form, email));
        setCvId(null);
        setStage("review");
        return;
      }

      if (draft && hasContent(draft.form)) {
        setForm(draft.form);
        setStep(Math.min(draft.step, FORM_STEPS.length - 1));
        setCvId(draft.cvId);
        setRestored(true);
      } else {
        setForm(withEmail(emptyForm(), email));
      }
      setStage("form");
    };

    void boot();
  }, [editId, fresh, resume, review, email, goLogin, write]);

  // Save as the user types, so a closed tab never costs them their work.
  useEffect(() => {
    if (stage !== "form" && stage !== "review") return;
    const timer = setTimeout(() => {
      if (!leaving.current) writeDraft({ form, step, cvId, pending: false, review: stage === "review" });
    }, 400);
    return () => clearTimeout(timer);
  }, [form, step, cvId, stage]);

  useEffect(() => {
    if (stage !== "writing") return;
    const timer = setInterval(() => setLineIndex((i) => Math.min(i + 1, WRITING_LINES.length - 1)), 5000);
    return () => clearInterval(timer);
  }, [stage]);

  // Each new step or screen starts at the top.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step, stage]);

  const update = useCallback((fn: (f: CvForm) => CvForm) => {
    setForm(fn);
    setErrors((prev) => (Object.keys(prev).length ? {} : prev));
  }, []);

  const showErrors = (found: FormErrors) => {
    setErrors(found);
    requestAnimationFrame(() => {
      const first = Object.keys(found)[0];
      const node = first ? document.querySelector(`[data-field="${first}"]`) : null;
      if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
      else topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const submit = () => {
    const cleaned = cleanForm(form);
    const all = pinToEmptyCards(validateForm(cleaned), form);
    if (Object.keys(all).length > 0) {
      const at = stepForField(Object.keys(all)[0]);
      if (stage === "review") setFromReview(true);
      setStep(at);
      setStage("form");
      return showErrors(Object.fromEntries(Object.entries(all).filter(([k]) => stepForField(k) === at)));
    }
    void write(cleaned, cvId);
  };

  const next = () => {
    const found = pinToEmptyCards(validateStep(FORM_STEPS[step], cleanForm(form)), form);
    if (Object.keys(found).length > 0) return showErrors(found);
    setErrors({});
    setRestored(false);

    if (fromReview) {
      setFromReview(false);
      setStage("review");
      return;
    }
    if (step < FORM_STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    submit();
  };

  const startOver = () => {
    writeDraft(null);
    setForm(withEmail(emptyForm(), email));
    setStep(0);
    setCvId(null);
    setRestored(false);
    setErrors({});
  };

  /* ── Screens ── */

  if (stage === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-mute" role="status">
        <span className="spinner" />
        <span className="sr-only">جاري التحميل</span>
      </div>
    );
  }

  if (stage === "writing") {
    return (
      <div ref={topRef} className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center">
        {failure ? (
          <>
            <p className="note note-bad w-full" role="alert">{failure}</p>
            <div className="mt-5 flex w-full flex-col gap-3">
              <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => void write(cleanForm(form), cvId)}>
                جرّب مرة ثانية
              </button>
              <button type="button" className="btn btn-ghost btn-block" onClick={() => { setFailure(null); setStage("form"); }}>
                ارجع لبياناتي
              </button>
            </div>
            <p className="t-small mt-4">بياناتك محفوظة، ما راح عليك شي.</p>
          </>
        ) : (
          <div role="status" aria-live="polite">
            <IlluWriting tile="none" className="mx-auto h-40 w-40" />
            <h1 className="t-h2 mt-4">نكتب سيرتك</h1>
            <p className="t-body mt-2 min-h-8">{WRITING_LINES[lineIndex]}</p>
            <p className="t-small mt-4">تاخذ أقل من دقيقة. خلّ الصفحة مفتوحة.</p>
          </div>
        )}
      </div>
    );
  }

  if (stage === "review") {
    return (
      <ReviewScreen
        form={form}
        update={update}
        errors={errors}
        topRef={topRef}
        onEdit={(at) => {
          setFromReview(true);
          setStep(at);
          setStage("form");
          const all = validateForm(cleanForm(form));
          setErrors(Object.fromEntries(Object.entries(all).filter(([k]) => stepForField(k) === at)));
        }}
        onWrite={submit}
      />
    );
  }

  /* ── The form ── */

  const stepProps = { form, update, errors };
  const last = step === FORM_STEPS.length - 1;
  const isNew = !cvId;

  return (
    <div ref={topRef} className="mx-auto max-w-xl scroll-mt-24 pb-28 sm:pb-0">
      <nav aria-label="خطوات إنشاء السيرة" className="mb-6">
        <p className="mb-2 text-[0.8125rem] text-mute">
          {fromReview ? "تعديل من الملخص" : `الخطوة ${step + 1} من ${FORM_STEPS.length}: ${STEP_LABELS[step]}`}
        </p>
        <ol className="flex gap-1.5">
          {STEP_LABELS.map((label, i) => (
            <li key={label} className="flex-1">
              <button
                type="button"
                disabled={i > step || fromReview}
                onClick={() => i < step && setStep(i)}
                aria-label={label}
                aria-current={i === step ? "step" : undefined}
                className="block w-full py-1 disabled:cursor-default"
              >
                <span className={`block h-1.5 rounded-full ${i <= step ? "bg-brand" : "bg-rule"}`} />
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {notice && <p className="note note-info mb-5" role="status">{notice}</p>}

      {(step === 0 || restored) && isNew && !fromReview && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-[var(--radius-card)] bg-desk py-3 ps-4 pe-3">
          <div className="min-w-0">
            <p className="text-[0.9375rem] font-medium">{restored ? "كمّلنا لك من وين وقفت" : "عندك سيرة قديمة؟"}</p>
            <p className="t-small">{restored ? "بياناتك محفوظة على جهازك." : "ارفعها ونعبّي عنك."}</p>
          </div>
          {restored ? (
            <button type="button" className="btn btn-ghost btn-sm shrink-0 bg-paper" onClick={startOver}>
              ابدأ من جديد
            </button>
          ) : (
            <UploadCv
              mock={mock}
              className="btn btn-ghost btn-sm shrink-0 bg-paper"
              onParsed={(parsed) => {
                setForm(withEmail(parsed, email));
                setCvId(null);
                setStage("review");
              }}
            >
              ارفع ملفك
            </UploadCv>
          )}
        </div>
      )}

      {step === 0 && <TargetStep {...stepProps} />}
      {step === 1 && <AboutStep {...stepProps} />}
      {step === 2 && <ExperienceStep {...stepProps} />}

      {Object.keys(errors).length > 0 && (
        <p className="note note-bad mt-6" role="alert">فيه حقول تحتاج تعديل فوق.</p>
      )}

      {last && !fromReview && (
        <p className="t-small mt-6">
          المعاينة مجانية، وما تحتاج تسجّل دخول عشان تشوفها. باستمرارك توافق على{" "}
          <Link href="/terms" className="link">الشروط</Link> و<Link href="/privacy" className="link">الخصوصية</Link>.
        </p>
      )}

      <ActionBar>
        {step > 0 && !fromReview && (
          <button
            type="button"
            className="btn btn-ghost shrink-0"
            onClick={() => { setErrors({}); setRestored(false); setStep(step - 1); }}
            aria-label="الخطوة السابقة"
          >
            <BackIcon size={18} />
            <span className="hidden sm:inline">السابق</span>
          </button>
        )}
        <button type="button" className="btn btn-primary btn-lg flex-1" onClick={next}>
          {fromReview ? "تم" : last ? "اكتب سيرتي" : "التالي"}
          {!fromReview && <NextIcon size={18} />}
        </button>
      </ActionBar>
    </div>
  );
}

function withEmail(form: CvForm, email: string | null): CvForm {
  return email && !form.personal.email ? { ...form, personal: { ...form.personal, email } } : form;
}

/* ───────────── After an upload: one summary screen, then write ───────────── */

function ReviewSection({
  title,
  at,
  issue,
  onEdit,
  children,
}: {
  title: string;
  at: number;
  issue: boolean;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="t-h3">{title}</h2>
        <button type="button" className="btn btn-quiet btn-sm text-pen" onClick={() => onEdit(at)}>
          <PenIcon size={15} />
          عدّل
        </button>
      </div>
      <div className="mt-2 space-y-1 text-[0.9375rem] text-graphite">{children}</div>
      {issue && (
        <button type="button" onClick={() => onEdit(at)} className="note note-warn mt-3 block w-full text-start">
          فيه شي ناقص هنا — اضغط وكمّله
        </button>
      )}
    </section>
  );
}

function ReviewScreen({
  form,
  update,
  errors,
  topRef,
  onEdit,
  onWrite,
}: {
  form: CvForm;
  update: (fn: (f: CvForm) => CvForm) => void;
  errors: FormErrors;
  topRef: React.RefObject<HTMLDivElement | null>;
  onEdit: (step: number) => void;
  onWrite: () => void;
}) {
  const cleaned = cleanForm(form);
  const issues = validateForm(cleaned);
  const keys = Object.keys(issues);
  const issue = {
    personal: keys.some((k) => k.startsWith("personal")),
    education: keys.some((k) => k.startsWith("education")),
    experience: keys.some((k) => stepForField(k) === 2),
  };
  const p = form.personal;
  const name = p[nameKey(form.primaryLang)];
  const degree = (id: string) => DEGREES.find((d) => d.id === id)?.ar ?? "";

  return (
    <div ref={topRef} className="mx-auto max-w-xl pb-28 sm:pb-0">
      <h1 className="t-h2">قرينا سيرتك</h1>
      <p className="t-body mt-1">حدّد الوظيفة، وراجع اللي طلّعناه. إذا تمام، نكتبها لك.</p>

      <div className="mt-6 space-y-5">
        <TargetStep form={form} update={update} errors={errors} intro={false} />

        <ReviewSection title="بياناتك" at={1} issue={issue.personal} onEdit={onEdit}>
          <p className="font-medium text-ink">{name || <span className="text-bad">الاسم ناقص</span>}</p>
          <p dir="ltr" className="text-end">{[p.phone, p.email].filter(Boolean).join(" · ") || "—"}</p>
          <p>{p.city.trim() || <span className="text-bad">المدينة ناقصة</span>}</p>
        </ReviewSection>

        <ReviewSection title="تعليمك" at={1} issue={issue.education} onEdit={onEdit}>
          {cleaned.education.length === 0 ? (
            <p className="text-bad">ما لقينا مؤهل دراسي</p>
          ) : (
            cleaned.education.map((e) => (
              <p key={e.id}>
                {[degree(e.level), e.major].filter(Boolean).join(" ")} — {e.institution} {e.year && `(${e.year})`}
              </p>
            ))
          )}
        </ReviewSection>

        <ReviewSection title="خبراتك" at={2} issue={issue.experience} onEdit={onEdit}>
          {cleaned.experience.length === 0 ? (
            <p>ما لقينا خبرات</p>
          ) : (
            cleaned.experience.map((x) => (
              <p key={x.id}>
                <span className="font-medium text-ink">{x.title}</span> — {x.company}{" "}
                <span className="text-mute">{formatPeriod(x.start, x.end, x.current, "ar")}</span>
              </p>
            ))
          )}
        </ReviewSection>
      </div>

      <ActionBar>
        <button type="button" className="btn btn-primary btn-lg flex-1" onClick={onWrite}>
          اكتب سيرتي
          <NextIcon size={18} />
        </button>
      </ActionBar>
    </div>
  );
}

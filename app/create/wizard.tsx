"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackIcon, FileIcon, NextIcon } from "@/app/components/icons";
import { IlluBlank, IlluQuestions, IlluUpload, IlluWriting } from "@/app/components/illustrations";
import {
  cleanForm,
  emptyForm,
  FORM_STEPS,
  validateForm,
  validateStep,
  type FormErrors,
} from "@/lib/cv/form";
import type { CvForm, InterviewQuestion } from "@/lib/cv/types";
import { EducationStep, ExperienceStep, PersonalStep, SkillsStep, TargetStep } from "./steps";

const DRAFT_KEY = "cvfy:draft:v2";
const STEP_LABELS = ["الوظيفة", "بياناتك", "الخبرات", "التعليم", "المهارات"];

type Draft = {
  form: CvForm;
  step: number;
  cvId: string | null;
  /** Set when the user was sent to sign in right before generation. */
  pending: boolean;
};

type Stage = "loading" | "start" | "form" | "reading" | "interview" | "writing";

type WizardProps = {
  signedIn: boolean;
  email: string | null;
  editId: string | null;
  resume: boolean;
  fresh: boolean;
};

function readDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as Draft;
    return draft?.form?.v === 2 ? draft : null;
  } catch {
    return null;
  }
}

function writeDraft(draft: Draft | null) {
  try {
    if (draft) localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    else localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Private mode or full storage: the form still works, it just won't survive a reload.
  }
}

function hasContent(form: CvForm): boolean {
  return Boolean(
    form.target.jobTitle.trim() ||
      form.personal.nameAr.trim() ||
      form.experience.some((x) => x.title.trim() || x.description.trim())
  );
}

const WRITING_LINES = [
  "نرتّب خبراتك حسب أهميتها للوظيفة…",
  "نصيغ إنجازاتك بالأرقام اللي ذكرتها…",
  "نضيف الكلمات المفتاحية اللي تنطبق عليك…",
  "نفحص السيرة على معايير ATS…",
];

export default function Wizard({ signedIn, email, editId, resume, fresh }: WizardProps) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("loading");
  const [form, setForm] = useState<CvForm>(emptyForm);
  const [step, setStep] = useState(0);
  const [cvId, setCvId] = useState<string | null>(editId);
  const [errors, setErrors] = useState<FormErrors>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [savedDraft, setSavedDraft] = useState<Draft | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  /** Set once we hand off to sign-in, so a late autosave cannot clear the "pending" flag. */
  const leaving = useRef(false);

  const goLogin = useCallback(
    (next: string) => router.push(`/login?next=${encodeURIComponent(next)}`),
    [router]
  );

  /* ── Generation ── */

  const generate = useCallback(
    async (id: string, given: Record<string, string>) => {
      setStage("writing");
      setFailure(null);
      try {
        const res = await fetch("/api/cv/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, answers: given }),
        });
        if (res.status === 401) return goLogin("/create?resume=1");
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
    [goLogin, router]
  );

  const startInterview = useCallback(
    async (current: CvForm, id: string | null) => {
      setStage("reading");
      setFailure(null);
      try {
        const res = await fetch("/api/cv/interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ form: current, id }),
        });
        if (res.status === 401) {
          leaving.current = true;
          writeDraft({ form: current, step: FORM_STEPS.length - 1, cvId: id, pending: true });
          return goLogin("/create?resume=1");
        }
        const data = (await res.json().catch(() => ({}))) as {
          id?: string;
          questions?: InterviewQuestion[];
          answers?: Record<string, string>;
          error?: string;
          fields?: FormErrors;
        };
        if (res.status === 422 && data.fields) {
          setErrors(data.fields);
          const firstKey = Object.keys(data.fields)[0] ?? "";
          const idx = FORM_STEPS.findIndex((s) => firstKey.startsWith(s));
          setStep(idx >= 0 ? idx : 0);
          setStage("form");
          return;
        }
        if (!res.ok || !data.id) {
          setFailure(data.error || "ما قدرنا نكمل هالمرة.");
          return;
        }
        setCvId(data.id);
        writeDraft({ form: current, step: FORM_STEPS.length - 1, cvId: data.id, pending: false });
        const qs = data.questions ?? [];
        if (qs.length === 0) return generate(data.id, {});
        setQuestions(qs);
        setAnswers(data.answers ?? {});
        setStage("interview");
      } catch {
        setFailure("انقطع الاتصال. تأكد من الإنترنت وجرّب مرة ثانية.");
      }
    },
    [generate, goLogin]
  );

  /* ── Boot: edit an existing CV, resume after sign-in, or offer the saved draft ── */

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

      if (draft && resume && draft.pending && signedIn) {
        setForm(draft.form);
        setStep(draft.step);
        setCvId(draft.cvId);
        void startInterview(cleanForm(draft.form), draft.cvId);
        return;
      }

      if (draft && hasContent(draft.form)) setSavedDraft(draft);
      setStage("start");
    };

    void boot();
  }, [editId, fresh, resume, signedIn, goLogin, startInterview]);

  // Save as the user types, so a closed tab never costs them their work.
  useEffect(() => {
    if (stage !== "form") return;
    const timer = setTimeout(() => {
      if (!leaving.current) writeDraft({ form, step, cvId, pending: false });
    }, 400);
    return () => clearTimeout(timer);
  }, [form, step, cvId, stage]);

  useEffect(() => {
    if (stage !== "writing" && stage !== "reading") return;
    const timer = setInterval(() => setLineIndex((i) => (i + 1) % WRITING_LINES.length), 3200);
    return () => clearInterval(timer);
  }, [stage]);

  // Each new step or screen starts at the top (instant, not animated).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step, stage]);

  const update = useCallback((fn: (f: CvForm) => CvForm) => {
    setForm(fn);
    setErrors((prev) => (Object.keys(prev).length ? {} : prev));
  }, []);

  const beginForm = (initial: CvForm, at = 0) => {
    const withEmail =
      email && !initial.personal.email ? { ...initial, personal: { ...initial.personal, email } } : initial;
    setForm(withEmail);
    setStep(at);
    setStage("form");
  };

  const showErrors = (found: FormErrors) => {
    setErrors(found);
    requestAnimationFrame(() => {
      const first = Object.keys(found)[0];
      const node = first ? document.querySelector(`[data-field="${first}"]`) : null;
      (node ?? topRef.current)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const next = () => {
    const found = validateStep(FORM_STEPS[step], cleanForm(form));
    if (Object.keys(found).length > 0) return showErrors(found);
    setErrors({});

    if (step < FORM_STEPS.length - 1) {
      setStep(step + 1);
      return;
    }

    const cleaned = cleanForm(form);
    const all = validateForm(cleaned);
    if (Object.keys(all).length > 0) {
      const firstKey = Object.keys(all)[0];
      const idx = FORM_STEPS.findIndex((s) => firstKey.startsWith(s));
      setStep(idx >= 0 ? idx : 0);
      return showErrors(all);
    }

    if (!signedIn) {
      leaving.current = true;
      writeDraft({ form: cleaned, step, cvId, pending: true });
      return goLogin("/create?resume=1");
    }
    void startInterview(cleaned, cvId);
  };

  const upload = async (file: File) => {
    setUploading(true);
    setNotice(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/cv/parse", { method: "POST", body });
      if (res.status === 401) return goLogin("/create");
      const data = (await res.json().catch(() => ({}))) as { form?: CvForm; error?: string };
      if (!res.ok || !data.form) {
        setNotice(data.error || "ما قدرنا نقرأ الملف. تقدر تعبّي بياناتك يدوياً.");
        return;
      }
      setNotice("عبّينا بياناتك من سيرتك القديمة. راجعها وكمّل الناقص — وزوّد الأرقام وين ما تقدر.");
      beginForm(data.form);
    } catch {
      setNotice("انقطع الاتصال أثناء رفع الملف. جرّب مرة ثانية.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
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

  if (stage === "start") {
    return (
      <div ref={topRef} className="mx-auto max-w-2xl">
        <h1 className="t-h2">كيف تبغى تبدأ؟</h1>
        <p className="t-body mt-1">في الحالتين تشوف سيرتك مكتوبة قبل لا تدفع أي شي.</p>

        {notice && <p className="note note-warn mt-5" role="status">{notice}</p>}

        {savedDraft && (
          <div className="mt-6 flex flex-col gap-3 rounded-[var(--radius-card)] bg-marker-soft p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">عندك سيرة ما كمّلتها</p>
              <p className="t-small">{savedDraft.form.target.jobTitle || savedDraft.form.personal.nameAr || "مسودة محفوظة على جهازك"}</p>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => { setCvId(savedDraft.cvId); beginForm(savedDraft.form, savedDraft.step); }}>
              كمّل من وين وقفت
            </button>
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => { setCvId(null); beginForm(emptyForm()); }}
            className="card p-6 text-start transition-colors hover:border-ink"
          >
            <IlluBlank className="h-28 w-28" />
            <span className="t-h3 mt-4 block">أبدأ من الصفر</span>
            <span className="t-small mt-1 block">خمس خطوات قصيرة، تكتب فيها بأسلوبك العادي.</span>
          </button>

          <button
            type="button"
            disabled={uploading}
            onClick={() => (signedIn ? fileRef.current?.click() : goLogin("/create"))}
            className="card p-6 text-start transition-colors hover:border-ink disabled:opacity-60"
          >
            <IlluUpload className="h-28 w-28" />
            <span className="t-h3 mt-4 flex items-center gap-2">
              {uploading && <span className="spinner" />}
              {uploading ? "نقرأ سيرتك…" : "عندي سيرة قديمة"}
            </span>
            <span className="t-small mt-1 block">
              ارفعها (PDF أو Word) ونعبّي بياناتك عنك، وأنت تراجع.
              {!signedIn && " تحتاج تسجّل دخول أول."}
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
            }}
          />
        </div>
      </div>
    );
  }

  if (stage === "reading" || stage === "writing") {
    const reading = stage === "reading";
    return (
      <div ref={topRef} className="mx-auto flex min-h-[55vh] max-w-lg flex-col items-center justify-center text-center">
        {failure ? (
          <>
            <p className="note note-bad w-full" role="alert">{failure}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => (reading || !cvId ? void startInterview(cleanForm(form), cvId) : void generate(cvId, answers))}
              >
                جرّب مرة ثانية
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => { setFailure(null); setStage("form"); }}>
                ارجع لبياناتي
              </button>
            </div>
            <p className="t-small mt-4">بياناتك محفوظة، ما راح عليك شي.</p>
          </>
        ) : (
          <div role="status" aria-live="polite">
            <IlluWriting tile="none" className="mx-auto h-48 w-48" />
            <h1 className="t-h2 mt-4">{reading ? "نقرأ بياناتك" : "نكتب سيرتك"}</h1>
            <p className="t-body mt-2 min-h-8">
              {reading ? "نحدد الكلمات المفتاحية للوظيفة ونجهّز لك كم سؤال…" : WRITING_LINES[lineIndex]}
            </p>
            <p className="t-small mt-4">{reading ? "ثواني معدودة." : "تاخذ تقريباً نص دقيقة. خلّ الصفحة مفتوحة."}</p>
          </div>
        )}
      </div>
    );
  }

  if (stage === "interview" && cvId) {
    const answered = questions.filter((q) => (answers[q.id] ?? "").trim()).length;
    return (
      <div ref={topRef} className="mx-auto max-w-2xl">
        <div className="flex items-start gap-4">
          <IlluQuestions className="hidden h-24 w-24 shrink-0 sm:block" />
          <div>
            <h1 className="t-h2">كم سؤال قبل لا نكتب</h1>
            <p className="t-body mt-1">
              هذي الأسئلة هي اللي تفرّق سيرتك عن غيرها. جاوب بسطر واحد، واللي ما تعرف جوابه اتركه فاضي.
            </p>
          </div>
        </div>

        <ol className="mt-7 space-y-5">
          {questions.map((q, i) => (
            <li key={q.id} className="card p-4 sm:p-6">
              <label htmlFor={q.id} className="flex gap-3 font-medium leading-relaxed">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-marker text-sm">{i + 1}</span>
                <span>{q.question}</span>
              </label>
              <textarea
                id={q.id}
                rows={2}
                value={answers[q.id] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                placeholder={q.example ? `مثال: ${q.example}` : ""}
                dir="auto"
                className="field t-hand mt-3 min-h-[4.5rem] leading-[2]"
              />
            </li>
          ))}
        </ol>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" className="btn btn-quiet" onClick={() => setStage("form")}>
            <BackIcon size={16} />
            ارجع لبياناتي
          </button>
          <button type="button" className="btn btn-primary btn-lg" onClick={() => void generate(cvId, answers)}>
            {answered > 0 ? "اكتب سيرتي" : "اكتبها بدون إجابات"}
            <NextIcon size={18} />
          </button>
        </div>
      </div>
    );
  }

  /* ── The form ── */

  const stepProps = { form, update, errors };
  const last = step === FORM_STEPS.length - 1;

  return (
    <div ref={topRef} className="mx-auto max-w-2xl scroll-mt-24">
      <nav aria-label="خطوات إنشاء السيرة" className="mb-8">
        <ol className="flex gap-1.5">
          {STEP_LABELS.map((label, i) => (
            <li key={label} className="flex-1">
              <button
                type="button"
                disabled={i > step}
                onClick={() => i < step && setStep(i)}
                aria-current={i === step ? "step" : undefined}
                className="group block w-full text-start disabled:cursor-default"
              >
                <span className={`block h-1.5 rounded-full ${i < step ? "bg-ink" : i === step ? "bg-marker" : "bg-rule"}`} />
                <span className={`mt-2 hidden text-[0.8125rem] sm:block ${i === step ? "font-medium text-ink" : "text-mute"}`}>
                  {label}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-[0.8125rem] text-mute sm:hidden">
          الخطوة {step + 1} من {FORM_STEPS.length}: {STEP_LABELS[step]}
        </p>
      </nav>

      {notice && <p className="note note-info mb-6" role="status">{notice}</p>}

      {step === 0 && <TargetStep {...stepProps} />}
      {step === 1 && <PersonalStep {...stepProps} />}
      {step === 2 && <ExperienceStep {...stepProps} />}
      {step === 3 && <EducationStep {...stepProps} />}
      {step === 4 && <SkillsStep {...stepProps} />}

      {Object.keys(errors).length > 0 && (
        <p className="note note-bad mt-6" role="alert">فيه حقول تحتاج تعديل فوق.</p>
      )}

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-rule pt-6">
        {step > 0 ? (
          <button type="button" className="btn btn-ghost" onClick={() => { setErrors({}); setStep(step - 1); }}>
            <BackIcon size={16} />
            السابق
          </button>
        ) : (
          <button type="button" className="btn btn-quiet" onClick={() => setStage("start")}>
            <FileIcon size={16} />
            ارفع سيرة قديمة
          </button>
        )}
        <button type="button" className="btn btn-primary btn-lg" onClick={next}>
          {last ? "اكتب سيرتي" : "التالي"}
          <NextIcon size={18} />
        </button>
      </div>

      {last && (
        <p className="t-small mt-4 text-center">
          {signedIn ? "المعاينة مجانية. " : "بنطلب منك تسجيل دخول سريع عشان نحفظ سيرتك. المعاينة مجانية. "}
          باستمرارك توافق على <Link href="/terms" className="link">الشروط</Link> و<Link href="/privacy" className="link">الخصوصية</Link>.
        </p>
      )}
    </div>
  );
}

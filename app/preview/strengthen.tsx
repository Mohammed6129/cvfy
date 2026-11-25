"use client";

import { useState } from "react";
import type { InterviewQuestion } from "@/lib/cv/types";

type StrengthenProps = {
  cvId: string;
  /** Re-load the preview after the CV is rewritten. */
  onRewritten: () => Promise<unknown>;
};

type State = "idle" | "loading" | "asking" | "writing" | "done";

/**
 * Optional, after the first draft: up to 3 quick questions, then one rewrite.
 * Kept off the main path so nobody waits on questions before seeing a CV.
 */
export default function Strengthen({ cvId, onRewritten }: StrengthenProps) {
  const [state, setState] = useState<State>("idle");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setState("loading");
    setError(null);
    try {
      const res = await fetch(`/api/cv/${cvId}/questions`, { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as {
        questions?: InterviewQuestion[];
        answers?: Record<string, string>;
        error?: string;
      };
      if (!res.ok || !data.questions?.length) {
        setError(data.error || "ما قدرنا نجهّز الأسئلة. جرّب بعد شوي.");
        setState("idle");
        return;
      }
      setQuestions(data.questions);
      setAnswers(data.answers ?? {});
      setState("asking");
    } catch {
      setError("انقطع الاتصال. جرّب مرة ثانية.");
      setState("idle");
    }
  };

  const rewrite = async () => {
    setState("writing");
    setError(null);
    try {
      const res = await fetch("/api/cv/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cvId, answers }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || "ما قدرنا نعيد الكتابة هالمرة.");
        setState("asking");
        return;
      }
      await onRewritten();
      setState("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("انقطع الاتصال. جرّب مرة ثانية.");
      setState("asking");
    }
  };

  const answered = questions.filter((q) => (answers[q.id] ?? "").trim()).length;

  return (
    <section className="card p-5" aria-labelledby="strengthen-title">
      <h2 id="strengthen-title" className="t-h3">خلّ سيرتك أقوى</h2>

      {state === "done" ? (
        <p className="note note-ok mt-3">أعدنا كتابة سيرتك بإجاباتك.</p>
      ) : state === "asking" || state === "writing" ? (
        <>
          <p className="t-small mt-1">جاوب بسطر واحد، واللي ما تعرفه اتركه.</p>
          <ol className="mt-4 space-y-4">
            {questions.map((q, i) => (
              <li key={q.id}>
                <label htmlFor={`sq-${q.id}`} className="flex gap-2 text-[0.9375rem] font-medium leading-relaxed">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand-deep">{i + 1}</span>
                  <span>{q.question}</span>
                </label>
                <textarea
                  id={`sq-${q.id}`}
                  rows={2}
                  value={answers[q.id] ?? ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                  placeholder={q.example ? `مثال: ${q.example}` : ""}
                  dir="auto"
                  disabled={state === "writing"}
                  className="field t-hand mt-2 min-h-[4.25rem] leading-[2]"
                />
              </li>
            ))}
          </ol>
          {error && <p className="note note-bad mt-3" role="alert">{error}</p>}
          <button
            type="button"
            className="btn btn-primary btn-block mt-4"
            disabled={answered === 0 || state === "writing"}
            onClick={() => void rewrite()}
          >
            {state === "writing" ? (
              <>
                <span className="spinner" /> نعيد كتابتها…
              </>
            ) : (
              "أعد كتابة سيرتي بإجاباتي"
            )}
          </button>
        </>
      ) : (
        <>
          <p className="t-small mt-1">3 أسئلة سريعة عن أرقام شغلك، ونعيد كتابتها بها. مجاناً.</p>
          {error && <p className="note note-bad mt-3" role="alert">{error}</p>}
          <button type="button" className="btn btn-ghost btn-block mt-3" disabled={state === "loading"} onClick={() => void load()}>
            {state === "loading" ? <span className="spinner" /> : "جاوب 3 أسئلة"}
          </button>
        </>
      )}
    </section>
  );
}

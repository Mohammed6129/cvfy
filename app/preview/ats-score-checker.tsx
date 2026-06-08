"use client";

import { useCallback, useEffect, useState } from "react";
import type { AtsScoreResult, GeneratedCv } from "@/lib/cv-types";

type ScoreColor = {
  stroke: string;
  text: string;
  bg: string;
  label: string;
};

function getScoreColor(score: number): ScoreColor {
  if (score >= 80) {
    return {
      stroke: "#22c55e",
      text: "text-green-600",
      bg: "bg-green-50",
      label: "ممتاز",
    };
  }
  if (score >= 60) {
    return {
      stroke: "#eab308",
      text: "text-yellow-600",
      bg: "bg-yellow-50",
      label: "جيد",
    };
  }
  return {
    stroke: "#ef4444",
    text: "text-red-600",
    bg: "bg-red-50",
    label: "يحتاج تحسين",
  };
}

function CircularProgress({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const colors = getScoreColor(score);

  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg
        width="128"
        height="128"
        className="absolute -rotate-90"
        aria-hidden
      >
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="relative text-center">
        <span className={`text-3xl font-extrabold ${colors.text}`}>
          {score}%
        </span>
        <p className={`text-xs font-semibold ${colors.text}`}>
          {colors.label}
        </p>
      </div>
    </div>
  );
}

type AtsScoreCheckerProps = {
  cv: GeneratedCv;
};

export default function AtsScoreChecker({ cv }: AtsScoreCheckerProps) {
  const [result, setResult] = useState<AtsScoreResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const runCheck = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ats-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
        },
        body: JSON.stringify(cv),
      });

      const text = await response.text();
      let data: AtsScoreResult & { error?: string; debug?: string };

      try {
        data = JSON.parse(text);
      } catch {
        setError("استجابة غير صالحة من الخادم.");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setError(
          data.debug
            ? `${data.error} (${data.debug})`
            : data.error || "تعذر إجراء فحص ATS."
        );
        setLoading(false);
        return;
      }

      setResult(data);
      setLoading(false);
    } catch (err) {
      console.error("[ats-score-checker] Error:", err);
      setError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
      setLoading(false);
    }
  }, [cv]);

  useEffect(() => {
    runCheck();
  }, [runCheck]);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white px-5 py-8 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e8f2fc] border-t-[#378ADD]" />
          <p className="text-sm font-semibold text-slate-600">
            جاري تحليل توافق السيرة مع ATS...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
        <h3 className="mb-1 text-sm font-bold text-slate-800">فحص ATS</h3>
        <p className="mb-3 text-sm text-red-700">{error}</p>
        <button
          type="button"
          onClick={runCheck}
          className="text-sm font-semibold text-[#378ADD] hover:text-[#2a6bb8]"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!result) return null;

  const colors = getScoreColor(result.score);

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-center text-sm font-bold text-slate-800">
        فحص ATS — توافق السيرة الذاتية
      </h3>

      <div className="mb-6 flex justify-center">
        <CircularProgress score={result.score} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className={`rounded-lg p-4 ${colors.bg}`}>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-green-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
              ✓
            </span>
            ما تم اجتيازه
          </h4>
          <ul className="space-y-2">
            {result.passed.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-slate-700"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-slate-50 p-4">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-amber-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs text-white">
              !
            </span>
            يحتاج تحسين
          </h4>
          <ul className="space-y-2">
            {result.improvements.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-slate-700"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={runCheck}
          className="text-xs font-semibold text-[#378ADD] hover:text-[#2a6bb8]"
        >
          إعادة الفحص
        </button>
      </div>
    </div>
  );
}

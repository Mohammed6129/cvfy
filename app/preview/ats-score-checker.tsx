"use client";

import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "@/app/components/loading-spinner";
import { saveAtsResult } from "@/lib/cv-storage";
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
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg
        width="144"
        height="144"
        className="absolute -rotate-90"
        aria-hidden
      >
        <circle
          cx="72"
          cy="72"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
        />
        <circle
          cx="72"
          cy="72"
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="relative text-center">
        <span className={`text-4xl font-extrabold ${colors.text}`}>
          {score}%
        </span>
        <p className={`text-sm font-bold ${colors.text}`}>{colors.label}</p>
      </div>
    </div>
  );
}

function AtsLockedPreview() {
  return (
    <div className="rounded-xl border border-[#378ADD]/25 bg-gradient-to-b from-[#378ADD]/8 to-white p-6 text-center shadow-sm">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#378ADD]/10 text-2xl">
        🔒
      </div>
      <h3 className="mb-2 text-lg font-extrabold text-slate-900">
        سيرتك جاهزة!
      </h3>
      <p className="text-sm leading-relaxed text-slate-700">
        ادفع 99 ر.س لتحصل على: تقرير ATS كامل + نسختين PDF بالعربي والإنجليزي
      </p>
    </div>
  );
}

type AtsScoreCheckerProps = {
  cv: GeneratedCv;
  cvId?: string | null;
  isPaid: boolean;
};

export default function AtsScoreChecker({
  cv,
  cvId,
  isPaid,
}: AtsScoreCheckerProps) {
  const [result, setResult] = useState<AtsScoreResult | null>(null);
  const [loading, setLoading] = useState(false);
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
      if (cvId) {
        void saveAtsResult(cvId, data);
      }
      setLoading(false);
    } catch (err) {
      console.error("[ats-score-checker] Error:", err);
      setError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
      setLoading(false);
    }
  }, [cv, cvId]);

  useEffect(() => {
    if (!isPaid) return;
    void runCheck();
  }, [isPaid, runCheck]);

  if (!isPaid) {
    return <AtsLockedPreview />;
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
        <LoadingSpinner label="جاري تحليل توافق السيرة مع ATS..." />
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
      <h3 className="mb-1 text-center text-sm font-bold text-slate-800">
        فحص ATS — توافق السيرة الذاتية
      </h3>
      {result.summary && (
        <p className="mb-4 text-center text-sm text-slate-600">{result.summary}</p>
      )}

      <div className="mb-6 flex justify-center">
        <CircularProgress score={result.score} />
      </div>

      {result.categories.length > 0 && (
        <div className="mb-6 space-y-3">
          <h4 className="text-sm font-bold text-slate-800">تفاصيل التقييم</h4>
          {result.categories.map((cat) => {
            const pct = Math.round((cat.score / cat.maxScore) * 100);
            return (
              <div key={cat.name} className="rounded-lg bg-slate-50 p-3">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800">{cat.name}</span>
                  <span className="font-bold text-[#378ADD]">{pct}%</span>
                </div>
                <div className="mb-1 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-[#378ADD] transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {cat.note && (
                  <p className="text-xs text-slate-600">{cat.note}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

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

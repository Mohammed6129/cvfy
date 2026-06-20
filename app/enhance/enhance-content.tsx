"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CvLaptopLoader from "@/app/components/cv-laptop-loader";
import LoadingSpinner from "@/app/components/loading-spinner";
import {
  CURRENT_CV_ID_KEY,
  STORAGE_KEY,
  loadCvFromAccount,
  saveCvToAccount,
} from "@/lib/cv-storage";
import type { GeneratedCv } from "@/lib/cv-types";

const BRAND = "#378ADD";

const PROGRESS_STEPS = [
  { label: "تعبئة البيانات", status: "done" as const },
  { label: "التحسين بالذكاء الاصطناعي", status: "active" as const },
  { label: "التحميل", status: "pending" as const },
];

type EnhanceContentProps = {
  userName: string;
};

function loadCvFromSession(): GeneratedCv | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const cv = JSON.parse(stored) as GeneratedCv;
    if (cv?.content && typeof cv.content === "object") {
      return cv;
    }
    return null;
  } catch {
    return null;
  }
}

function StepIcon({ status }: { status: "done" | "active" | "pending" }) {
  if (status === "done") return <span aria-hidden>✅</span>;
  if (status === "active") return <span aria-hidden>🔄</span>;
  return <span aria-hidden>⬜</span>;
}

export default function EnhanceContent({ userName }: EnhanceContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cv, setCv] = useState<GeneratedCv | null>(null);
  const [cvId, setCvId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const paramId = searchParams.get("cv");
      const storedId = sessionStorage.getItem(CURRENT_CV_ID_KEY);
      const lookupId = paramId || storedId;

      if (lookupId) {
        const accountData = await loadCvFromAccount(lookupId);
        if (!cancelled && accountData?.cv?.content) {
          setCv(accountData.cv);
          setCvId(accountData.id);
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(accountData.cv));
          sessionStorage.setItem(CURRENT_CV_ID_KEY, accountData.id);
          setLoading(false);
          return;
        }
      }

      const sessionCv = loadCvFromSession();
      if (!cancelled && sessionCv) {
        setCv(sessionCv);
        setCvId(lookupId);
        setLoading(false);

        if (!lookupId) {
          const saved = await saveCvToAccount(sessionCv);
          if (!cancelled && saved?.id) {
            setCvId(saved.id);
            sessionStorage.setItem(CURRENT_CV_ID_KEY, saved.id);
            router.replace(`/enhance?cv=${saved.id}`);
          }
        }
        return;
      }

      if (!cancelled) {
        setError("لم نجد سيرة محفوظة. يرجى إعادة تعبئة النموذج.");
        setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  const handleEnhance = async () => {
    if (!cv || enhancing) return;
    setEnhancing(true);
    setError(null);

    try {
      const response = await fetch("/api/enhance-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
        },
        body: JSON.stringify({ ...cv, language: "both" }),
      });

      const text = await response.text();
      let result: GeneratedCv & { error?: string };

      try {
        result = JSON.parse(text);
      } catch {
        setError("استجابة غير صالحة من الخادم.");
        setEnhancing(false);
        return;
      }

      if (!response.ok) {
        setError(result.error || "تعذر تحسين السيرة الذاتية.");
        setEnhancing(false);
        return;
      }

      const enhanced: GeneratedCv = {
        ...result,
        contentEn: result.contentEn ?? cv.contentEn,
        aiEnhanced: true,
        language: "both",
      };

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(enhanced));
      await saveCvToAccount(enhanced, undefined, cvId);

      const destination = cvId ? `/preview?cv=${cvId}` : "/preview";
      router.push(destination);
    } catch {
      setError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
      setEnhancing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="جاري التحميل..." size="lg" />;
  }

  if (!cv) {
    return (
      <div className="mx-auto max-w-xl text-center">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <Link
          href="/create"
          className="glass-btn-primary inline-block px-8 py-3 text-sm"
        >
          العودة لإنشاء السيرة
        </Link>
      </div>
    );
  }

  if (enhancing) {
    return <CvLaptopLoader mode="enhance" />;
  }

  return (
    <div className="animate-fade-in mx-auto max-w-lg text-center">
      <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
        أهلاً {userName}! 👋
      </h1>
      <p className="mt-2 text-base text-white/75 sm:text-lg">
        سيرتك جاهزة للتحسين
      </p>

      <div className="glass-page-card-sm my-8 px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          {PROGRESS_STEPS.map((step, index) => (
            <div key={step.label} className="flex flex-1 items-center gap-2 text-sm">
              <StepIcon status={step.status} />
              <span
                className={`font-semibold ${
                  step.status === "active"
                    ? "text-[#FAC775]"
                    : step.status === "done"
                      ? "text-emerald-300"
                      : "text-white/45"
                }`}
              >
                {step.label}
              </span>
              {index < PROGRESS_STEPS.length - 1 && (
                <span className="mx-1 hidden text-white/30 sm:inline" aria-hidden>
                  →
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: "66%", backgroundColor: BRAND }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleEnhance}
        className="glass-btn-primary mx-auto px-8 py-3.5 text-base shadow-[0_4px_20px_rgba(255,255,255,0.2)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        حسّن السيرة الذاتية ✨
      </button>

      <p className="mt-3 text-xs text-white/55">عادةً يستغرق 30 ثانية</p>

      <p className="mt-6 text-sm text-white/55">
        <Link
          href={cvId ? `/create?edit=${cvId}` : "/create"}
          className="font-semibold text-[#FAC775] hover:underline"
        >
          تعديل البيانات
        </Link>
      </p>
    </div>
  );
}

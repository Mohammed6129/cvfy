"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "@/app/components/loading-spinner";
import { downloadCvAsPdf, downloadCvAsWord } from "@/lib/cv-export";
import {
  CURRENT_CV_ID_KEY,
  STORAGE_KEY,
  loadCvFromAccount,
  recordPayment,
  saveCvToAccount,
} from "@/lib/cv-storage";
import type { GeneratedCv } from "@/lib/cv-types";
import {
  PENDING_PLAN_KEY,
  isPaymentComplete,
  markPaymentComplete,
  type PlanId,
} from "@/lib/payment";
import AtsScoreChecker from "./ats-score-checker";
import ClassicCvTemplate from "./classic-cv-template";
import PaymentSection from "./payment-section";

export default function CvPreview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cv, setCv] = useState<GeneratedCv | null>(null);
  const [cvId, setCvId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [enhancing, setEnhancing] = useState(false);
  const [enhanceError, setEnhanceError] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadCv = async () => {
      const paramId = searchParams.get("cv");
      let loadedCv: GeneratedCv | null = null;
      let loadedId: string | null = paramId;

      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          loadedCv = JSON.parse(stored) as GeneratedCv;
        } catch {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      }

      const storedId = sessionStorage.getItem(CURRENT_CV_ID_KEY);
      if (!loadedId && storedId) loadedId = storedId;

      const accountData = await loadCvFromAccount(loadedId);
      if (accountData) {
        loadedCv = accountData.cv;
        loadedId = accountData.id;
        if (accountData.isPaid) setIsPaid(true);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(loadedCv));
        sessionStorage.setItem(CURRENT_CV_ID_KEY, loadedId);
      }

      if (cancelled) return;

      if (!loadedCv) {
        router.replace("/create");
        return;
      }

      setCv(loadedCv);
      setCvId(loadedId);

      const params = new URLSearchParams(window.location.search);
      const paymentStatus = params.get("status");
      const paymentId = params.get("id");

      if (paymentId && (paymentStatus === "paid" || paymentStatus === null)) {
        const pendingPlan = sessionStorage.getItem(PENDING_PLAN_KEY);
        const planId: PlanId =
          pendingPlan === "bilingual" ? "bilingual" : "single";
        markPaymentComplete(planId);
        sessionStorage.removeItem(PENDING_PLAN_KEY);
        setIsPaid(true);
        if (loadedId) {
          void recordPayment(loadedId, planId, paymentId);
        }
        window.history.replaceState({}, "", `/preview${loadedId ? `?cv=${loadedId}` : ""}`);
      } else if (isPaymentComplete()) {
        setIsPaid(true);
      }

      setLoading(false);
    };

    loadCv();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  const handlePaymentSuccess = useCallback(
    (planId: PlanId) => {
      setIsPaid(true);
      markPaymentComplete(planId);
      if (cvId) {
        void recordPayment(cvId, planId);
      }
    },
    [cvId]
  );

  const saveCv = (updated: GeneratedCv) => {
    setCv(updated);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    void saveCvToAccount(updated, undefined, cvId);
  };

  const handleEnhance = async () => {
    if (!cv || enhancing) return;

    setEnhancing(true);
    setEnhanceError(null);

    try {
      const response = await fetch("/api/enhance-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
        },
        body: JSON.stringify(cv),
      });

      const text = await response.text();
      let result: GeneratedCv & { error?: string; debug?: string };

      try {
        result = JSON.parse(text);
      } catch {
        setEnhanceError("استجابة غير صالحة من الخادم.");
        setEnhancing(false);
        return;
      }

      if (!response.ok) {
        setEnhanceError(
          result.debug
            ? `${result.error} (${result.debug})`
            : result.error || "تعذر تحسين السيرة الذاتية."
        );
        setEnhancing(false);
        return;
      }

      saveCv({ ...result, aiEnhanced: true });
      setEnhancing(false);
    } catch (error) {
      console.error("[cv-preview] Enhance failed:", error);
      setEnhanceError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
      setEnhancing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="جاري تحميل السيرة الذاتية..." size="lg" />;
  }

  if (!cv) return null;

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center print:hidden">
        <div className="mb-3 flex flex-wrap items-center justify-center gap-3">
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            معاينة السيرة الذاتية
          </h1>
          {cv.aiEnhanced && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f2fc] px-3 py-1 text-xs font-semibold text-[#378ADD]">
              ✨ تم التحسين بالذكاء الاصطناعي
            </span>
          )}
        </div>
        <p className="text-sm text-slate-600 sm:text-base">
          سيرة ذاتية احترافية لـ{" "}
          <span className="font-semibold text-[#378ADD]">{cv.name}</span>
        </p>
      </div>

      <div className="mb-6 space-y-4 print:hidden">
        <button
          type="button"
          onClick={handleEnhance}
          disabled={enhancing}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#378ADD] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#378ADD]/25 transition-all hover:bg-[#2a6bb8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {enhancing ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              جاري التحسين بالذكاء الاصطناعي...
            </>
          ) : (
            <>✨ حسّن سيرتي بالذكاء الاصطناعي</>
          )}
        </button>

        {enhanceError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {enhanceError}
          </div>
        )}

        <AtsScoreChecker cv={cv} cvId={cvId} />

        <PaymentSection
          isPaid={isPaid}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>

      <div
        className={`cv-preview relative overflow-hidden rounded-2xl border bg-white p-4 shadow-lg shadow-slate-200/60 sm:p-8 md:p-10 ${
          enhancing ? "pointer-events-none opacity-50" : "border-slate-200"
        } ${isPaid ? "cv-paid" : ""}`}
      >
        {!isPaid && (
          <div
            className="cv-watermark pointer-events-none absolute inset-0 z-10 flex items-center justify-center print:hidden"
            aria-hidden
          >
            <span className="rotate-[-35deg] select-none whitespace-nowrap text-2xl font-extrabold text-slate-400/25 sm:text-4xl md:text-5xl">
              CVfy - نموذج مجاني
            </span>
          </div>
        )}

        {enhancing && (
          <div className="relative z-20 mb-6 flex items-center justify-center gap-3 rounded-xl bg-[#e8f2fc] py-4 text-sm font-semibold text-[#378ADD] print:hidden">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#378ADD]/30 border-t-[#378ADD]" />
            جاري تحسين المحتوى...
          </div>
        )}
        <div className="relative z-0">
          <ClassicCvTemplate cv={cv} />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4 print:hidden">
        <div className="flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={cvId ? `/create?edit=${cvId}` : "/create"}
            className="flex-1 rounded-full border-2 border-[#378ADD] px-6 py-3 text-center text-sm font-semibold text-[#378ADD] transition-colors hover:bg-[#e8f2fc] sm:flex-none"
          >
            تعديل البيانات
          </Link>
          <button
            type="button"
            onClick={() => downloadCvAsPdf(cv)}
            disabled={!isPaid}
            className="flex-1 rounded-full bg-[#378ADD] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#378ADD]/25 transition-colors hover:bg-[#2a6bb8] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
          >
            {isPaid ? "تحميل PDF" : "تحميل PDF (يتطلب الدفع)"}
          </button>
          <button
            type="button"
            onClick={() => downloadCvAsWord(cv)}
            disabled={!isPaid}
            className="flex-1 rounded-full border-2 border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
          >
            {isPaid ? "تحميل Word" : "تحميل Word (يتطلب الدفع)"}
          </button>
        </div>
        {!isPaid && (
          <p className="text-center text-xs text-slate-500">
            أكمل الدفع أعلاه لإزالة العلامة المائية وتحميل السيرة الذاتية
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { loadCvFromAccount, saveCvToAccount } from "@/lib/cv-storage";
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

const STORAGE_KEY = "cvfy-generated-cv";

export default function CvPreview() {
  const router = useRouter();
  const [cv, setCv] = useState<GeneratedCv | null>(null);
  const [loading, setLoading] = useState(true);
  const [enhancing, setEnhancing] = useState(false);
  const [enhanceError, setEnhanceError] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadCv = async () => {
      let loadedCv: GeneratedCv | null = null;

      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          loadedCv = JSON.parse(stored) as GeneratedCv;
        } catch {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      }

      if (!loadedCv) {
        loadedCv = await loadCvFromAccount();
        if (loadedCv) {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(loadedCv));
        }
      }

      if (cancelled) return;

      if (!loadedCv) {
        router.replace("/create");
        return;
      }

      setCv(loadedCv);

      const params = new URLSearchParams(window.location.search);
      const paymentStatus = params.get("status");
      if (
        params.get("id") &&
        (paymentStatus === "paid" || paymentStatus === null)
      ) {
        const pendingPlan = sessionStorage.getItem(PENDING_PLAN_KEY);
        const planId: PlanId =
          pendingPlan === "bilingual" ? "bilingual" : "single";
        markPaymentComplete(planId);
        sessionStorage.removeItem(PENDING_PLAN_KEY);
        setIsPaid(true);
        window.history.replaceState({}, "", "/preview");
      } else if (isPaymentComplete()) {
        setIsPaid(true);
      }

      setLoading(false);
    };

    loadCv();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const handlePaymentSuccess = useCallback((planId: PlanId) => {
    setIsPaid(true);
    markPaymentComplete(planId);
  }, []);

  const saveCv = (updated: GeneratedCv) => {
    setCv(updated);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    void saveCvToAccount(updated);
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
        console.error("[cv-preview] Invalid JSON:", text);
        setEnhanceError("استجابة غير صالحة من الخادم.");
        setEnhancing(false);
        return;
      }

      if (!response.ok) {
        console.error("[cv-preview] Enhance error:", result);
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
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e8f2fc] border-t-[#378ADD]" />
      </div>
    );
  }

  if (!cv) {
    return null;
  }

  return (
    <div>
      <div className="mb-8 text-center print:hidden">
        <div className="mb-3 flex flex-wrap items-center justify-center gap-3">
          <h1 className="text-3xl font-extrabold text-slate-900">
            معاينة السيرة الذاتية
          </h1>
          {cv.aiEnhanced && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f2fc] px-3 py-1 text-xs font-semibold text-[#378ADD]">
              ✨ تم التحسين بالذكاء الاصطناعي
            </span>
          )}
        </div>
        <p className="text-slate-600">
          سيرة ذاتية احترافية لـ{" "}
          <span className="font-semibold text-[#378ADD]">{cv.name}</span>
        </p>
      </div>

      <div className="mb-6 space-y-4 print:hidden">
        <button
          type="button"
          onClick={handleEnhance}
          disabled={enhancing}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#378ADD] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#378ADD]/25 transition-colors hover:bg-[#2a6bb8] disabled:cursor-not-allowed disabled:opacity-60"
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

        <AtsScoreChecker cv={cv} />

        <PaymentSection
          isPaid={isPaid}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>

      <div
        className={`cv-preview relative overflow-hidden rounded-2xl border bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-10 md:p-12 ${
          enhancing ? "pointer-events-none opacity-50" : "border-slate-200"
        } ${isPaid ? "cv-paid" : ""}`}
      >
        {!isPaid && (
          <div
            className="cv-watermark pointer-events-none absolute inset-0 z-10 flex items-center justify-center print:hidden"
            aria-hidden
          >
            <span className="rotate-[-35deg] select-none whitespace-nowrap text-3xl font-extrabold text-slate-400/25 sm:text-4xl md:text-5xl">
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
        <div className="flex justify-center gap-4">
          <Link
            href="/create"
            className="rounded-full border-2 border-[#378ADD] px-8 py-3 text-sm font-semibold text-[#378ADD] transition-colors hover:bg-[#e8f2fc]"
          >
            تعديل البيانات
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            disabled={!isPaid}
            className="rounded-full bg-[#378ADD] px-8 py-3 text-sm font-semibold text-white shadow-md shadow-[#378ADD]/25 transition-colors hover:bg-[#2a6bb8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPaid ? "حمّل PDF" : "حمّل PDF (يتطلب الدفع)"}
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

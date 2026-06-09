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
} from "@/lib/cv-storage";
import type { GeneratedCv } from "@/lib/cv-types";
import {
  PENDING_PLAN_KEY,
  isPaymentComplete,
  markPaymentComplete,
  type PlanId,
} from "@/lib/payment";
import AtsScoreChecker from "./ats-score-checker";
import EnglishCvTemplate from "./english-cv-template";
import PaymentSection from "./payment-section";

function BlueCheckIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-[#378ADD]"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function CvPreview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cv, setCv] = useState<GeneratedCv | null>(null);
  const [cvId, setCvId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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
          const parsed = JSON.parse(stored) as GeneratedCv;
          if (parsed?.content && typeof parsed.content === "object") {
            loadedCv = parsed;
          }
        } catch (parseError) {
          console.error("[preview] sessionStorage parse failed:", parseError);
          sessionStorage.removeItem(STORAGE_KEY);
        }
      }

      const storedId = sessionStorage.getItem(CURRENT_CV_ID_KEY);
      if (!loadedId && storedId) loadedId = storedId;

      const accountData = await loadCvFromAccount(loadedId);
      if (accountData?.cv?.content) {
        loadedCv = accountData.cv;
        loadedId = accountData.id;
        if (accountData.isPaid) setIsPaid(true);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(loadedCv));
        sessionStorage.setItem(CURRENT_CV_ID_KEY, loadedId);
      }

      if (cancelled) return;

      if (!loadedCv?.content) {
        router.replace("/create");
        return;
      }

      setCv(loadedCv);
      setCvId(loadedId);

      const params = new URLSearchParams(window.location.search);
      const paymentStatus = params.get("status");
      const paymentId = params.get("id");

      if (paymentId && (paymentStatus === "paid" || paymentStatus === null)) {
        const planId: PlanId = "bilingual";
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

  const handleDownloadBoth = () => {
    if (!cv || !isPaid) return;
    downloadCvAsPdf(cv);
    window.setTimeout(() => downloadCvAsWord(cv), 600);
  };

  if (loading) {
    return <LoadingSpinner label="جاري تحميل السيرة الذاتية..." size="lg" />;
  }

  if (!cv) return null;

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center print:hidden">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          معاينة السيرة الذاتية
        </h1>
        {cv.aiEnhanced && (
          <div className="mt-3 flex items-center justify-center gap-1.5">
            <BlueCheckIcon />
            <span className="text-sm font-semibold text-[#378ADD]">
              تم التحسين بالذكاء الاصطناعي
            </span>
          </div>
        )}
        <p className="mt-3 text-sm text-slate-600 sm:text-base">
          سيرة ذاتية احترافية لـ{" "}
          <span className="font-semibold text-[#378ADD]">{cv.name}</span>
        </p>
      </div>

      <div className="mb-6 space-y-4 print:hidden">
        <AtsScoreChecker cv={cv} cvId={cvId} isPaid={isPaid} />

        {isPaid && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
            <p className="text-sm font-bold text-emerald-800">
              تم الدفع بنجاح! يمكنك الآن تحميل نسختيك بالعربي والإنجليزي.
            </p>
          </div>
        )}
      </div>

      <div
        className={`cv-preview relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 sm:p-8 md:p-10 ${
          isPaid ? "cv-paid" : "cv-locked"
        }`}
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

        <div className="relative z-0">
          <EnglishCvTemplate cv={cv} />

          {!isPaid && (
            <>
              <div
                className="cv-paywall-blur pointer-events-none absolute inset-x-0 top-1/2 bottom-0 z-20 print:hidden"
                aria-hidden
              />
              <div className="cv-paywall-overlay absolute inset-x-0 top-1/2 bottom-0 z-30 flex flex-col items-center justify-end px-4 pb-6 pt-16 sm:px-8 sm:pb-8 print:hidden">
                <div className="w-full max-w-md text-center">
                  <div className="mb-3 text-4xl" aria-hidden>
                    🔒
                  </div>
                  <p className="mb-5 text-sm font-semibold leading-relaxed text-slate-800 sm:text-base">
                    للوصول إلى السيرة الذاتية ونتيجة فحص الـ ATS — ادفع 99 ر.س
                  </p>
                  <PaymentSection
                    variant="overlay"
                    isPaid={isPaid}
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4 print:hidden">
        <div className="flex w-full max-w-lg flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href={cvId ? `/create?edit=${cvId}` : "/create"}
            className="w-full rounded-full border-2 border-[#378ADD] px-6 py-3 text-center text-sm font-semibold text-[#378ADD] transition-colors hover:bg-[#e8f2fc] sm:w-auto"
          >
            تعديل البيانات
          </Link>
          <button
            type="button"
            onClick={handleDownloadBoth}
            disabled={!isPaid}
            className="w-full rounded-full bg-[#378ADD] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#378ADD]/25 transition-colors hover:bg-[#2a6bb8] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isPaid ? "تحميل PDF و Word" : "تحميل PDF و Word (يتطلب الدفع)"}
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

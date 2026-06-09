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
        <AtsScoreChecker cv={cv} cvId={cvId} />

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
          <ClassicCvTemplate cv={cv} />

          {!isPaid && (
            <>
              <div
                className="cv-paywall-blur pointer-events-none absolute inset-x-0 top-1/2 bottom-0 z-20 print:hidden"
                aria-hidden
              />
              <div className="cv-paywall-overlay absolute inset-x-0 top-1/2 bottom-0 z-30 flex items-center justify-center p-4 sm:p-6 print:hidden">
                <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/95 p-6 text-center shadow-2xl shadow-slate-300/40 backdrop-blur-sm sm:p-8">
                  <div className="mb-3 text-4xl" aria-hidden>
                    🔒
                  </div>
                  <h3 className="mb-2 text-lg font-extrabold text-slate-900 sm:text-xl">
                    اكمل سيرتك الذاتية كاملة
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-slate-600 sm:text-base">
                    ادفع 99 ر.س واحصل على نسختيك كاملتين بالعربي والإنجليزي
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

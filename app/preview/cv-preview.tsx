"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "@/app/components/loading-spinner";
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
import EnglishCvTemplate from "./english-cv-template";
import PaymentSection from "./payment-section";

function BlueCheckIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-[#378ADD]"
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
        } catch {
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

  if (loading) {
    return <LoadingSpinner label="جاري تحميل السيرة الذاتية..." size="lg" />;
  }

  if (!cv) return null;

  return (
    <div className="animate-fade-in flex flex-col items-center print:hidden">
      {cv.aiEnhanced && (
        <div className="mb-3 flex items-center justify-center gap-1.5">
          <BlueCheckIcon />
          <span className="text-xs font-semibold text-[#378ADD] sm:text-sm">
            تم التحسين بالذكاء الاصطناعي
          </span>
        </div>
      )}

      <div
        className={`cv-preview-compact relative mx-auto h-[300px] max-h-[300px] w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md ${
          isPaid ? "cv-paid" : "cv-locked"
        }`}
      >
        <div className="absolute left-1/2 top-0 w-[200%] -translate-x-1/2 origin-top scale-50">
          <EnglishCvTemplate cv={cv} />
        </div>

        {!isPaid && (
          <>
            <div
              className="cv-paywall-blur pointer-events-none absolute inset-x-0 top-1/2 bottom-0 z-20"
              aria-hidden
            />
            <div className="cv-paywall-overlay absolute inset-x-0 top-1/2 bottom-0 z-30 flex items-center justify-center px-4">
              <div className="w-full max-w-[220px]">
                <PaymentSection
                  variant="overlay"
                  compact
                  isPaid={isPaid}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-3 flex items-center justify-center">
        <Link
          href={cvId ? `/create?edit=${cvId}` : "/create"}
          className="text-xs font-semibold text-[#378ADD] hover:underline sm:text-sm"
        >
          تعديل البيانات
        </Link>
      </div>
    </div>
  );
}

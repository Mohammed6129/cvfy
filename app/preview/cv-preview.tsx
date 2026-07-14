"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import LoadingSpinner from "@/app/components/loading-spinner";
import {
  CURRENT_CV_ID_KEY,
  STORAGE_KEY,
  loadCvFromAccount,
  recordPayment,
} from "@/lib/cv-storage";
import type { AtsScoreResult, GeneratedCv } from "@/lib/cv-types";
import {
  PENDING_PLAN_KEY,
  isPaymentComplete,
  markPaymentComplete,
  type PlanId,
} from "@/lib/payment";
import { saveCvFilesToProfile } from "@/lib/cv-file-storage";
import { createClient } from "@/lib/supabase/client";
import { isTestUserEmail } from "@/lib/test-user";
import PaymentSection from "./payment-section";
import PreviewCvCard from "./preview-cv-card";

function AiStamp() {
  return (
    <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#B5D4F4] bg-[#E6F1FB] px-3 py-2">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M8 2L9.67 6.26L14.26 6.76L10.82 9.82L11.74 14.36L8 12.22L4.26 14.36L5.18 9.82L1.74 6.76L6.33 6.26L8 2Z"
          fill="#378ADD"
        />
      </svg>
      <div>
        <p className="text-xs font-bold text-[#185FA5]">محسّنة بالذكاء الاصطناعي</p>
        <p className="text-[9px] text-[#378ADD]">صياغة احترافية تناسب سوق العمل السعودي</p>
      </div>
    </div>
  );
}

export default function CvPreview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cv, setCv] = useState<GeneratedCv | null>(null);
  const [cvId, setCvId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [isTestUser, setIsTestUser] = useState(false);
  const [atsResult, setAtsResult] = useState<AtsScoreResult | null>(null);
  const filesPersistedRef = useRef(false);

  const persistFilesToProfile = useCallback(async () => {
    if (!cv || filesPersistedRef.current) return;

    filesPersistedRef.current = true;
    try {
      await saveCvFilesToProfile(cv, atsResult);
    } catch (error) {
      filesPersistedRef.current = false;
      console.error("[cv-preview] profile file save failed:", error);
    }
  }, [cv, atsResult]);

  useEffect(() => {
    let cancelled = false;

    const loadCv = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const testUser = isTestUserEmail(user?.email);
      if (testUser) {
        setIsTestUser(true);
        setIsPaid(true);
        markPaymentComplete("bilingual");
      }
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
        if (accountData.atsResult) setAtsResult(accountData.atsResult);
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
      void persistFilesToProfile();
    },
    [cvId, persistFilesToProfile]
  );

  useEffect(() => {
    if (!loading && isTestUser && cv) {
      void persistFilesToProfile();
    }
  }, [loading, isTestUser, cv, persistFilesToProfile]);

  useEffect(() => {
    if (!loading && isPaid && cv && !isTestUser) {
      void persistFilesToProfile();
    }
  }, [loading, isPaid, cv, isTestUser, persistFilesToProfile]);

  if (loading) {
    return <LoadingSpinner label="جاري تحميل السيرة الذاتية..." size="lg" />;
  }

  if (!cv) return null;

  const editHref = cvId ? `/create?edit=${cvId}` : "/create";

  const paid = isPaid || isTestUser;

  return (
    <div className="animate-fade-in w-full" dir="rtl">
      <div className="mx-auto mb-5 flex max-w-[1100px] items-center justify-between">
        <h1 className="text-lg font-extrabold text-white sm:text-xl">
          سيرتك الذاتية
        </h1>
        {paid && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">
            ✓ مكتملة
          </span>
        )}
      </div>

      <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_300px]">
        <div>
          <PreviewCvCard cv={cv} isPaid={paid} />
          <p
            className="mt-2 text-center text-[10px] tracking-wide text-white/40"
            dir="ltr"
          >
            Page 1 of 1 · Preview
          </p>
          {cv.aiEnhanced && <AiStamp />}
        </div>

        <PaymentSection
          variant="preview"
          isPaid={isPaid}
          isTestUser={isTestUser}
          cv={cv}
          cvId={cvId}
          atsResult={atsResult}
          onAtsResult={setAtsResult}
          onPaymentSuccess={handlePaymentSuccess}
          onPersistFiles={persistFilesToProfile}
          editHref={editHref}
        />
      </div>
    </div>
  );
}

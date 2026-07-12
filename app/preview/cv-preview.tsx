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
import type { AtsGateInfo, AtsScoreResult, GeneratedCv } from "@/lib/cv-types";
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

function ScoreRing({ score }: { score: number }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const filled = (Math.min(100, Math.max(0, score)) / 100) * circumference;
  const color = score >= 80 ? "#34D399" : "#FAC775";

  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden>
      <circle
        cx="32"
        cy="32"
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="6"
      />
      <circle
        cx="32"
        cy="32"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circumference - filled}`}
        transform="rotate(-90 32 32)"
      />
      <text
        x="32"
        y="37"
        textAnchor="middle"
        fontSize="16"
        fontWeight="800"
        fill="#fff"
      >
        {score}%
      </text>
    </svg>
  );
}

function AtsScoreCard({ label, gate }: { label: string; gate: AtsGateInfo }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/[0.06] p-4">
      <ScoreRing score={gate.score} />
      <div className="flex flex-col gap-1 text-right">
        <span className="text-sm font-bold text-white">{label}</span>
        <span className="text-[11px] text-white/60">نسبة التوافق مع أنظمة ATS</span>
        {gate.score >= 80 && (
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
            ✓ مضمون التوافق
          </span>
        )}
      </div>
    </div>
  );
}

function AtsScoreBanner({ cv }: { cv: GeneratedCv }) {
  const entries = [
    { label: "السيرة الذاتية بالعربية", gate: cv.atsGate?.ar },
    { label: "CV in English", gate: cv.atsGate?.en },
  ].filter((entry): entry is { label: string; gate: AtsGateInfo } =>
    Boolean(entry.gate)
  );

  if (entries.length === 0) return null;

  return (
    <div className="mx-auto mb-5 grid max-w-[1100px] grid-cols-1 gap-3 sm:grid-cols-2">
      {entries.map((entry) => (
        <AtsScoreCard key={entry.label} label={entry.label} gate={entry.gate} />
      ))}
    </div>
  );
}

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

  return (
    <div className="animate-fade-in w-full" dir="rtl">
      <AtsScoreBanner cv={cv} />

      <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_300px]">
        <div>
          <PreviewCvCard cv={cv} isPaid={isPaid || isTestUser} />
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

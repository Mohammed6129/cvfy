"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  getMoyasarEnvironmentError,
  isMoyasarHttpsEnvironment,
  loadMoyasarAssets,
} from "@/lib/moyasar";
import MoyasarPaymentForm from "./moyasar-payment-form";
import type { AtsScoreResult, GeneratedCv } from "@/lib/cv-types";
import { saveAtsResult } from "@/lib/cv-storage";
import {
  downloadAtsReportPdf,
  downloadCvAsPdf,
  downloadCvAsWord,
  fetchAtsResult,
} from "@/lib/cv-export";
import {
  PENDING_PLAN_KEY,
  SINGLE_PLAN,
  markPaymentComplete,
  type PlanId,
} from "@/lib/payment";

type PaymentSectionProps = {
  onPaymentSuccess: (planId: PlanId) => void;
  isPaid: boolean;
  variant?: "default" | "overlay" | "preview";
  compact?: boolean;
  editHref?: string;
  isTestUser?: boolean;
  cv?: GeneratedCv | null;
  cvId?: string | null;
  atsResult?: AtsScoreResult | null;
  onAtsResult?: (result: AtsScoreResult) => void;
};

type DownloadKind = "pdf" | "word" | "ats" | null;

function StarIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 2.5L12.09 7.73L17.82 8.45L13.41 12.27L14.18 18L10 15.27L5.82 18L6.59 12.27L2.18 8.45L7.91 7.73L10 2.5Z"
        fill="#378ADD"
      />
    </svg>
  );
}

function LinesIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <line x1="2" y1="3.5" x2="11" y2="3.5" stroke="#3B6D11" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="2" y1="6.5" x2="9" y2="6.5" stroke="#3B6D11" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="2" y1="9.5" x2="11" y2="9.5" stroke="#3B6D11" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PaperIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <rect x="2.5" y="1.5" width="8" height="10" rx="1" stroke="#BA7517" strokeWidth="1.2" />
      <line x1="4.5" y1="4.5" x2="8.5" y2="4.5" stroke="#BA7517" strokeWidth="1" strokeLinecap="round" />
      <line x1="4.5" y1="7" x2="8" y2="7" stroke="#BA7517" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <circle cx="6.5" cy="6.5" r="4.5" stroke="#534AB7" strokeWidth="1.2" />
      <path
        d="M4 6.5L5.7 8.2L9.2 4.8"
        stroke="#534AB7"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="1.5" y="4" width="15" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <line x1="1.5" y1="7.5" x2="16.5" y2="7.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="3.5" y="10" width="4" height="1.5" rx="0.5" fill="currentColor" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M6 1L10 2.5V5.5C10 8 6 11 6 11C6 11 2 8 2 5.5V2.5L6 1Z"
        stroke="#888"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="4.5" stroke="#888" strokeWidth="1" />
      <path d="M6 3.5V6L7.8 7.2" stroke="#888" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

const PRICE_FEATURES = [
  { bg: "#EAF3DE", icon: <LinesIcon />, label: "نسختان عربي وإنجليزي" },
  { bg: "#FAEEDA", icon: <PaperIcon />, label: "PDF و Word" },
  { bg: "#EEEDFE", icon: <CheckCircleIcon />, label: "تقرير ATS" },
];

const TRUST_SIGNALS = [
  { icon: <ShieldIcon />, label: "دفع آمن" },
  { icon: <ClockIcon />, label: "تسليم فوري" },
  { icon: <StarIcon size={12} />, label: "جودة مضمونة" },
];

function PreviewPriceCard() {
  const plan = SINGLE_PLAN;

  return (
    <div className="relative w-full overflow-hidden rounded-[20px] border border-[#E0EDF8] bg-white p-5">
      <div
        className="pointer-events-none absolute -left-6 -top-6 h-[90px] w-[90px] rounded-full bg-[#E6F1FB] opacity-50"
        aria-hidden
      />

      <div className="relative flex items-start justify-between">
        <div className="text-right">
          <div className="flex items-baseline gap-1">
            <span
              className="leading-none text-[#0C447C]"
              style={{ fontSize: "40px", fontWeight: 800 }}
            >
              {plan.price}
            </span>
            <span className="text-sm font-semibold text-[#378ADD]">ر.س</span>
          </div>
          <p className="mt-0.5 text-[10px] text-[#999]">دفعة واحدة — بدون اشتراك</p>
        </div>

        <div className="flex items-center gap-1.5 rounded-[10px] bg-[#E6F1FB] px-2 py-1.5">
          <StarIcon />
          <div className="flex flex-col leading-tight">
            <span className="text-[8px] font-bold text-[#185FA5]">AI</span>
            <span className="text-[8px] font-bold text-[#185FA5]">مدعوم</span>
          </div>
        </div>
      </div>

      <div className="my-3 h-px bg-[#F0F7FF]" />

      <ul className="relative space-y-2.5">
        {PRICE_FEATURES.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-[11px] text-[#333]">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px]"
              style={{ backgroundColor: item.bg }}
            >
              {item.icon}
            </span>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TestModePanel({
  cv,
  cvId,
  atsResult,
  onAtsResult,
  editHref,
}: {
  cv: GeneratedCv | null | undefined;
  cvId?: string | null;
  atsResult?: AtsScoreResult | null;
  onAtsResult?: (result: AtsScoreResult) => void;
  editHref: string;
}) {
  const [downloading, setDownloading] = useState<DownloadKind>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCvPdf = async () => {
    if (!cv) return;
    setDownloading("pdf");
    setError(null);
    try {
      await downloadCvAsPdf(cv);
    } catch {
      setError("تعذر تحميل ملف PDF للسيرة.");
    } finally {
      setDownloading(null);
    }
  };

  const handleCvWord = () => {
    if (!cv) return;
    setError(null);
    try {
      downloadCvAsWord(cv);
    } catch {
      setError("تعذر تحميل ملف Word للسيرة.");
    }
  };

  const handleAtsPdf = async () => {
    if (!cv) return;
    setDownloading("ats");
    setError(null);
    try {
      let result = atsResult;
      if (!result) {
        result = await fetchAtsResult(cv);
        onAtsResult?.(result);
        if (cvId) {
          void saveAtsResult(cvId, result);
        }
      }
      await downloadAtsReportPdf(cv, result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تحميل تقرير ATS.");
    } finally {
      setDownloading(null);
    }
  };

  const buttonClass =
    "flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#378ADD] px-4 py-3 text-sm font-extrabold text-white transition-colors hover:bg-[#2a6bb8] disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-[20px] border border-[#C0DD97] bg-[#EAF3DE] p-4 text-center">
        <p className="text-sm font-bold text-[#27500A]">وضع تجريبي — تجاوز الدفع مفعّل</p>
      </div>

      <button
        type="button"
        onClick={() => void handleCvPdf()}
        disabled={!cv || downloading !== null}
        className={buttonClass}
      >
        {downloading === "pdf" ? "جاري التحميل..." : "تحميل السيرة PDF"}
      </button>

      <button
        type="button"
        onClick={handleCvWord}
        disabled={!cv || downloading !== null}
        className={buttonClass}
      >
        تحميل السيرة Word
      </button>

      <button
        type="button"
        onClick={() => void handleAtsPdf()}
        disabled={!cv || downloading !== null}
        className={buttonClass}
      >
        {downloading === "ats" ? "جاري إنشاء التقرير..." : "تحميل تقرير ATS"}
      </button>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-xs text-red-700">
          {error}
        </div>
      )}

      <Link href={editHref} className="text-center text-xs text-[#378ADD] underline">
        تعديل البيانات
      </Link>
    </div>
  );
}

export default function PaymentSection({
  onPaymentSuccess,
  isPaid,
  variant = "default",
  compact = false,
  editHref = "/create",
  isTestUser = false,
  cv = null,
  cvId = null,
  atsResult = null,
  onAtsResult,
}: PaymentSectionProps) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const plan = SINGLE_PLAN;
  const environmentError = getMoyasarEnvironmentError();

  useEffect(() => {
    if (isMoyasarHttpsEnvironment()) {
      loadMoyasarAssets().catch(() => {});
    }
  }, []);

  const handlePaymentSuccess = useCallback(() => {
    markPaymentComplete("bilingual");
    setPaymentSuccess(true);
    setShowPaymentForm(false);
    setPaymentError(null);
    onPaymentSuccess("bilingual");
    window.history.replaceState({}, "", "/preview");
  }, [onPaymentSuccess]);

  const handlePay = () => {
    setPaymentError(null);
    sessionStorage.setItem(PENDING_PLAN_KEY, "bilingual");
    setShowPaymentForm(true);
  };

  if (isTestUser && variant === "preview") {
    return (
      <TestModePanel
        cv={cv}
        cvId={cvId}
        atsResult={atsResult}
        onAtsResult={onAtsResult}
        editHref={editHref}
      />
    );
  }

  if (isPaid || paymentSuccess) {
    if (variant === "overlay") return null;

    const successBox = (
      <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 p-5 text-center">
        <p className="text-sm font-bold text-emerald-800">
          تم الدفع بنجاح! يمكنك الآن تحميل نسختيك بالعربي والإنجليزي.
        </p>
      </div>
    );

    if (variant === "preview") {
      return (
        <div className="flex flex-col gap-4">
          {successBox}
          <Link
            href={editHref}
            className="text-center text-xs text-[#378ADD] underline"
          >
            تعديل البيانات
          </Link>
        </div>
      );
    }

    return successBox;
  }

  if (environmentError) {
    const errorBox = (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
        <p className="text-sm font-semibold text-amber-900">{environmentError}</p>
      </div>
    );

    if (variant === "preview") {
      return (
        <div className="flex flex-col gap-4">
          <PreviewPriceCard />
          {errorBox}
          <Link
            href={editHref}
            className="text-center text-xs text-[#378ADD] underline"
          >
            تعديل البيانات
          </Link>
        </div>
      );
    }

    return errorBox;
  }

  if (variant === "preview") {
    return (
      <div className="flex flex-col gap-4">
        <PreviewPriceCard />

        {!showPaymentForm ? (
          <button
            type="button"
            onClick={handlePay}
            className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#378ADD] px-4 py-[15px] text-[15px] font-extrabold text-white transition-colors hover:bg-[#2a6bb8]"
          >
            <span>ادفع وحمّل الآن</span>
            <CardIcon />
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-[#e8f2fc] px-4 py-3">
              <p className="text-sm font-semibold text-[#378ADD]">
                {plan.title} — {plan.price} ر.س
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowPaymentForm(false);
                  setPaymentError(null);
                }}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                إلغاء
              </button>
            </div>
            <MoyasarPaymentForm
              planId="bilingual"
              onSuccess={handlePaymentSuccess}
              onError={setPaymentError}
            />
          </div>
        )}

        {paymentError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
            {paymentError}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4">
          {TRUST_SIGNALS.map((signal) => (
            <span
              key={signal.label}
              className="inline-flex items-center gap-1 text-[10px] text-[#888]"
            >
              {signal.icon}
              {signal.label}
            </span>
          ))}
        </div>

        <Link
          href={editHref}
          className="text-center text-xs text-[#378ADD] underline"
        >
          تعديل البيانات
        </Link>
      </div>
    );
  }

  const buttonClass = compact
    ? "flex w-full items-center justify-center rounded-lg bg-[#378ADD] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-[#378ADD]/25 transition-colors hover:bg-[#2a6bb8]"
    : "flex w-full items-center justify-center gap-2 rounded-xl bg-[#378ADD] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#378ADD]/25 transition-colors hover:bg-[#2a6bb8]";

  const payButton = !showPaymentForm ? (
    <button type="button" onClick={handlePay} className={buttonClass}>
      ادفع {plan.price} ر.س وحمّل النسختين
    </button>
  ) : (
    <div className={compact ? "space-y-2" : "space-y-4"}>
      <div
        className={`flex items-center justify-between rounded-xl bg-[#e8f2fc] ${compact ? "px-3 py-2" : "px-4 py-3"}`}
      >
        <p className={`font-semibold text-[#378ADD] ${compact ? "text-xs" : "text-sm"}`}>
          {plan.title} — {plan.price} ر.س
        </p>
        <button
          type="button"
          onClick={() => {
            setShowPaymentForm(false);
            setPaymentError(null);
          }}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          إلغاء
        </button>
      </div>
      <MoyasarPaymentForm
        planId="bilingual"
        onSuccess={handlePaymentSuccess}
        onError={setPaymentError}
      />
    </div>
  );

  if (variant === "overlay") {
    return (
      <div className="w-full">
        {payButton}
        {paymentError && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
            {paymentError}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <h3 className="mb-1 text-center text-sm font-bold text-slate-800">
        {plan.title}
      </h3>
      <p className="mb-2 text-center text-2xl font-extrabold text-[#378ADD]">
        {plan.price} <span className="text-sm text-slate-600">ر.س</span>
      </p>
      <p className="mb-4 text-center text-xs text-slate-500">{plan.description}</p>
      {payButton}
      {paymentError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
          {paymentError}
        </div>
      )}
    </div>
  );
}

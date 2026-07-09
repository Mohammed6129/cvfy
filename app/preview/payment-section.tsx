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
  isLanguageDeliverable,
} from "@/lib/cv-export";
import type { CvLanguage } from "@/lib/cv-types";
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
  onPersistFiles?: () => Promise<void>;
};

type DownloadKind = "pdf-ar" | "pdf-en" | "word-ar" | "word-en" | "ats" | null;

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
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="4.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
      <path d="M6 3.5V6L7.8 7.2" stroke="rgba(255,255,255,0.55)" strokeWidth="1" strokeLinecap="round" />
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
    <div className="relative w-full overflow-hidden glass-page-card p-5">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
        style={{ background: "linear-gradient(90deg, #FAC775, #F5D89A, #FAC775)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-6 -top-6 h-[90px] w-[90px] rounded-full bg-[#E6F1FB] opacity-50"
        aria-hidden
      />

      <div className="relative flex items-start justify-between">
        <div className="text-right">
          <div className="flex items-baseline gap-1">
            <span
              className="leading-none text-white"
              style={{ fontSize: "40px", fontWeight: 800 }}
            >
              {plan.price}
            </span>
            <span className="text-sm font-semibold text-white/70">ر.س</span>
          </div>
          <p className="mt-0.5 text-[10px] text-white/55">دفعة واحدة — بدون اشتراك</p>
        </div>

        <div
          className="flex items-center gap-1.5 rounded-[10px] px-2 py-1.5"
          style={{ background: "linear-gradient(135deg, #FAC775, #F0A93E)" }}
        >
          <StarIcon />
          <div className="flex flex-col leading-tight">
            <span className="text-[8px] font-bold text-[#142c54]">AI</span>
            <span className="text-[8px] font-bold text-[#142c54]">مدعوم</span>
          </div>
        </div>
      </div>

      <div className="my-3 h-px bg-white/15" />

      <p className="mb-2 flex items-center gap-1 text-[10px] text-white/40">
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
          <circle cx="5.5" cy="5.5" r="5" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M5.5 4.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="5.5" cy="3.2" r="0.55" fill="currentColor"/>
        </svg>
        السيرة الذاتية صفحة واحدة (A4) — محسّنة للطباعة
      </p>

      <ul className="relative space-y-2.5">
        {PRICE_FEATURES.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-[11px] text-white/85">
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

function PaymentMethodLogos() {
  const markClass = "flex h-[26px] items-center justify-center rounded-md bg-white px-2.5";

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className={markClass} title="Visa">
        <svg width="34" height="11" viewBox="0 0 48 16" aria-hidden>
          <text x="0" y="13" fontFamily="Arial, sans-serif" fontSize="16" fontStyle="italic" fontWeight="800" fill="#1A1F71">VISA</text>
        </svg>
      </span>
      <span className={markClass} title="mada">
        <svg width="34" height="14" viewBox="0 0 60 24" aria-hidden>
          <text x="0" y="17" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="700" fill="#66B245">m</text>
          <text x="13" y="17" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="700" fill="#5AA1DE">a</text>
          <text x="24" y="17" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="700" fill="#66B245">d</text>
          <text x="36" y="17" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="700" fill="#5AA1DE">a</text>
        </svg>
      </span>
      <span className={markClass} title="Tamara">
        <svg width="46" height="12" viewBox="0 0 90 20" aria-hidden>
          <text x="0" y="15" fontFamily="Arial, sans-serif" fontSize="17" fontWeight="800" fill="#EE5A9E">tamara</text>
        </svg>
      </span>
      <span className={markClass} title="Apple Pay">
        <svg width="44" height="18" viewBox="0 0 165 70" aria-hidden>
          <g fill="#000">
            <path d="M33.7 12.6c-2.1 2.5-5.5 4.5-8.8 4.2-.4-3.3 1.2-6.8 3.1-9 2.1-2.5 5.8-4.4 8.8-4.5.3 3.4-1 6.8-3.1 9.3z"/>
            <path d="M36.7 18.4c-4.9-.3-9.1 2.8-11.4 2.8-2.4 0-6-2.7-9.9-2.6-5.1.1-9.8 3-12.4 7.6-5.3 9.2-1.4 22.8 3.8 30.3 2.5 3.7 5.5 7.8 9.5 7.6 3.8-.1 5.3-2.5 9.9-2.5 4.6 0 6 2.5 10 2.4 4.2-.1 6.8-3.7 9.3-7.4 2.9-4.2 4.1-8.3 4.1-8.5-.1-.1-7.9-3.1-8-12.2-.1-7.6 6.2-11.2 6.5-11.4-3.6-5.2-9.1-5.8-11.1-6.1z"/>
          </g>
          <text x="52" y="46" fontFamily="Arial, sans-serif" fontSize="34" fontWeight="600" fill="#000">Pay</text>
        </svg>
      </span>
      <span className={markClass} title="Google Pay">
        <svg width="46" height="18" viewBox="0 0 96 40" aria-hidden>
          <text x="0" y="29" fontFamily="Arial, sans-serif" fontSize="26" fontWeight="500" fill="#5F6368">Pay</text>
          <g transform="translate(-4,4)">
            <path fill="#4285F4" d="M20.4 12.2c0-.7-.1-1.4-.2-2.1H12v4h4.7c-.2 1.1-.8 2-1.8 2.7v2.2h2.9c1.7-1.6 2.6-3.9 2.6-6.8z"/>
            <path fill="#34A853" d="M12 21c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.7H3.9v2.3C5.4 19 8.5 21 12 21z"/>
            <path fill="#FBBC05" d="M6.9 13.8c-.2-.5-.3-1.1-.3-1.8s.1-1.2.3-1.8V7.9H3.9C3.3 9.1 3 10.5 3 12s.3 2.9.9 4.1l3-2.3z"/>
            <path fill="#EA4335" d="M12 6.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6C16.4 3.9 14.4 3 12 3 8.5 3 5.4 5 3.9 7.9l3 2.3c.7-2.1 2.7-3.6 5.1-3.6z"/>
          </g>
        </svg>
      </span>
    </div>
  );
}

const downloadButtonPrimary =
  "flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#378ADD] px-4 py-3.5 text-sm font-extrabold text-white transition-colors hover:bg-[#2a6bb8] disabled:cursor-not-allowed disabled:opacity-60";
const downloadButtonSecondary =
  "flex w-full items-center justify-center gap-2 rounded-[14px] border border-[#378ADD]/40 bg-white px-4 py-2.5 text-sm font-semibold text-[#378ADD] transition-colors hover:bg-[#E6F1FB] disabled:cursor-not-allowed disabled:opacity-60";
function LanguageDownloadCard({
  cv,
  language,
  downloading,
  onPdf,
  onWord,
}: {
  cv: GeneratedCv;
  language: CvLanguage;
  downloading: DownloadKind;
  onPdf: () => void;
  onWord: () => void;
}) {
  const isArabic = language === "ar";
  const deliverable = isLanguageDeliverable(cv, language);
  const gate = cv.atsGate?.[language];
  const pdfKind: DownloadKind = isArabic ? "pdf-ar" : "pdf-en";

  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-bold text-white">
          {isArabic ? "🇸🇦 السيرة الذاتية بالعربية" : "🇺🇸 CV in English"}
        </span>
        {gate?.passed && (
          <span className="rounded-full bg-[#378ADD]/20 px-2 py-0.5 text-[10px] font-bold text-[#8FC4FF]">
            ATS {gate.score}%
          </span>
        )}
      </div>

      {deliverable ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPdf}
            disabled={downloading !== null}
            className={downloadButtonPrimary}
          >
            {downloading === pdfKind
              ? isArabic
                ? "جاري التحميل..."
                : "Downloading..."
              : isArabic
                ? "⬇ تحميل"
                : "⬇ Download"}
          </button>
          <button
            type="button"
            onClick={onWord}
            disabled={downloading !== null}
            className={`${downloadButtonSecondary} !w-auto shrink-0`}
          >
            Word
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-[#FAC775]/40 bg-[#FFF8EC] px-3 py-2.5 text-[11px] leading-relaxed text-[#8A5A0A]">
          {isArabic
            ? `لم تصل النسخة العربية للحد الأدنى لتوافق ATS (80%) بعد ${gate?.attempts ?? 3} محاولات تحسين تلقائية، ولذلك لن نسلّمها. عدّل بياناتك وأعد التوليد.`
            : `النسخة الإنجليزية لم تصل للحد الأدنى لتوافق ATS (80%) بعد ${gate?.attempts ?? 3} محاولات تحسين تلقائية، ولذلك لن نسلّمها. عدّل بياناتك وأعد التوليد.`}
        </div>
      )}
    </div>
  );
}

function CvDownloadButtons({
  cv,
  cvId,
  atsResult,
  onAtsResult,
  onPersistFiles,
  editHref,
}: {
  cv: GeneratedCv | null | undefined;
  cvId?: string | null;
  atsResult?: AtsScoreResult | null;
  onAtsResult?: (result: AtsScoreResult) => void;
  onPersistFiles?: () => Promise<void>;
  editHref: string;
}) {
  const [downloading, setDownloading] = useState<DownloadKind>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCvPdf = async (language: CvLanguage) => {
    if (!cv) return;
    setDownloading(language === "ar" ? "pdf-ar" : "pdf-en");
    setError(null);
    try {
      await downloadCvAsPdf(cv, language);
      if (onPersistFiles) {
        void onPersistFiles();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تحميل ملف PDF للسيرة.");
    } finally {
      setDownloading(null);
    }
  };

  const handleCvWord = (language: CvLanguage) => {
    if (!cv) return;
    setError(null);
    try {
      downloadCvAsWord(cv, language);
      if (onPersistFiles) {
        void onPersistFiles();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تحميل ملف Word للسيرة.");
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
      if (onPersistFiles) {
        void onPersistFiles();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تحميل تقرير ATS.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <>
      {/* Two fully independent language downloads — each button reflects
          only its own language's ATS-gate readiness. */}
      {cv && (
        <>
          <LanguageDownloadCard
            cv={cv}
            language="ar"
            downloading={downloading}
            onPdf={() => void handleCvPdf("ar")}
            onWord={() => handleCvWord("ar")}
          />
          <LanguageDownloadCard
            cv={cv}
            language="en"
            downloading={downloading}
            onPdf={() => void handleCvPdf("en")}
            onWord={() => handleCvWord("en")}
          />
        </>
      )}

      <button
        type="button"
        onClick={() => void handleAtsPdf()}
        disabled={!cv || downloading !== null}
        className={downloadButtonSecondary}
      >
        {downloading === "ats" ? "جاري التحميل..." : "تقرير ATS"}
      </button>

      {error && (
        <div className="rounded-xl border border-[#FAC775]/40 bg-[#FFF8EC] px-4 py-3 text-center text-xs text-[#8A5A0A]">
          {error}
        </div>
      )}

      <Link href={editHref} className="text-center text-xs text-[#378ADD] underline">
        تعديل البيانات
      </Link>
    </>
  );
}

function TestModePanel({
  cv,
  cvId,
  atsResult,
  onAtsResult,
  onPersistFiles,
  editHref,
}: {
  cv: GeneratedCv | null | undefined;
  cvId?: string | null;
  atsResult?: AtsScoreResult | null;
  onAtsResult?: (result: AtsScoreResult) => void;
  onPersistFiles?: () => Promise<void>;
  editHref: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-[20px] border border-[#C0DD97] bg-[#EAF3DE] p-4 text-center">
        <p className="text-sm font-bold text-[#27500A]">وضع تجريبي — تجاوز الدفع مفعّل</p>
      </div>

      <CvDownloadButtons
        cv={cv}
        cvId={cvId}
        atsResult={atsResult}
        onAtsResult={onAtsResult}
        onPersistFiles={onPersistFiles}
        editHref={editHref}
      />
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
  onPersistFiles,
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
        onPersistFiles={onPersistFiles}
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
        <div className="flex flex-col gap-3">
          {successBox}
          <CvDownloadButtons
            cv={cv}
            cvId={cvId}
            atsResult={atsResult}
            onAtsResult={onAtsResult}
            onPersistFiles={onPersistFiles}
            editHref={editHref}
          />
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
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handlePay}
              className="flex w-full items-center justify-center gap-2 rounded-[14px] px-4 py-[15px] text-[15px] font-extrabold text-white shadow-[0_8px_22px_rgba(55,138,221,0.4)] transition-transform hover:-translate-y-px"
              style={{ background: "linear-gradient(90deg, #2E75BF, #4C9CE8)" }}
            >
              <span>ادفع وحمّل الآن</span>
              <CardIcon />
            </button>
            <PaymentMethodLogos />
            <p className="text-center text-[10px] text-white/55">
              🔒 ضمان استرجاع كامل خلال 24 ساعة إذا لم تكن راضياً
            </p>
          </div>
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
          <div className="rounded-xl border border-[#FAC775]/40 bg-[#FFF8EC] px-4 py-3 text-center text-sm text-[#8A5A0A]">
            {paymentError}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4">
          {TRUST_SIGNALS.map((signal) => (
            <span
              key={signal.label}
              className="inline-flex items-center gap-1 text-[10px] text-white/55"
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
          <div className="mt-3 rounded-xl border border-[#FAC775]/40 bg-[#FFF8EC] px-4 py-3 text-center text-sm text-[#8A5A0A]">
            {paymentError}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-page-card p-5">
      <h3 className="mb-1 text-center text-sm font-bold text-white">
        {plan.title}
      </h3>
      <p className="mb-2 text-center text-2xl font-extrabold text-[#FAC775]">
        {plan.price} <span className="text-sm text-white/70">ر.س</span>
      </p>
      <p className="mb-4 text-center text-xs text-white/60">{plan.description}</p>
      {payButton}
      {paymentError && (
        <div className="mt-4 rounded-xl border border-[#FAC775]/40 bg-[#FFF8EC] px-4 py-3 text-center text-sm text-[#8A5A0A]">
          {paymentError}
        </div>
      )}
    </div>
  );
}

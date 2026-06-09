"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getMoyasarEnvironmentError,
  isMoyasarHttpsEnvironment,
  loadMoyasarAssets,
} from "@/lib/moyasar";
import MoyasarPaymentForm from "./moyasar-payment-form";
import {
  PENDING_PLAN_KEY,
  SINGLE_PLAN,
  markPaymentComplete,
  type PlanId,
} from "@/lib/payment";

type PaymentSectionProps = {
  onPaymentSuccess: (planId: PlanId) => void;
  isPaid: boolean;
  variant?: "default" | "overlay";
};

const PAYMENT_METHODS = [
  { id: "apple", label: "Apple Pay", icon: "" },
  { id: "google", label: "Google Pay", icon: "G" },
  { id: "mada", label: "مدى", icon: "مدى" },
  { id: "tamara", label: "تمارا", icon: "تمارا" },
];

export default function PaymentSection({
  onPaymentSuccess,
  isPaid,
  variant = "default",
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

  if (isPaid || paymentSuccess) {
    if (variant === "overlay") return null;
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
        <p className="text-sm font-bold text-emerald-800">
          تم الدفع بنجاح! يمكنك الآن تحميل نسختيك بالعربي والإنجليزي.
        </p>
      </div>
    );
  }

  if (environmentError) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
        <p className="text-sm font-semibold text-amber-900">{environmentError}</p>
      </div>
    );
  }

  const methodsRow = (
    <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
      {PAYMENT_METHODS.map((m) => (
        <span
          key={m.id}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700"
        >
          {m.icon || m.label}
        </span>
      ))}
    </div>
  );

  const sbcLogo = (
    <div className="mt-4 flex flex-col items-center gap-1 text-center">
      <div className="flex h-10 items-center justify-center rounded border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600">
        مركز الأعمال السعودي
      </div>
      <span className="text-[10px] text-slate-400">Saudi Business Center</span>
    </div>
  );

  const payButton = !showPaymentForm ? (
    <button
      type="button"
      onClick={handlePay}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#378ADD] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#378ADD]/25 transition-colors hover:bg-[#2a6bb8]"
    >
      ادفع {plan.price} ر.س وحمّل النسختين
    </button>
  ) : (
    <div className="space-y-4">
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
  );

  if (variant === "overlay") {
    return (
      <div className="w-full">
        {methodsRow}
        {payButton}
        {sbcLogo}
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
      {methodsRow}
      {payButton}
      {sbcLogo}
      {paymentError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
          {paymentError}
        </div>
      )}
    </div>
  );
}

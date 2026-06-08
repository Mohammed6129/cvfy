"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getMoyasarEnvironmentError,
  isMoyasarHttpsEnvironment,
  loadMoyasarAssets,
} from "@/lib/moyasar";
import MoyasarPaymentForm from "./moyasar-payment-form";
import {
  PLANS,
  PENDING_PLAN_KEY,
  markPaymentComplete,
  type PlanId,
} from "@/lib/payment";

type PaymentSectionProps = {
  onPaymentSuccess: (planId: PlanId) => void;
  isPaid: boolean;
  variant?: "default" | "overlay";
};

export default function PaymentSection({
  onPaymentSuccess,
  isPaid,
  variant = "default",
}: PaymentSectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("single");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const selected = PLANS.find((p) => p.id === selectedPlan)!;
  const environmentError = getMoyasarEnvironmentError();

  useEffect(() => {
    if (isMoyasarHttpsEnvironment()) {
      loadMoyasarAssets().catch(() => {});
    }
  }, []);

  const handlePaymentSuccess = useCallback(() => {
    markPaymentComplete(selectedPlan);
    setPaymentSuccess(true);
    setShowPaymentForm(false);
    setPaymentError(null);
    onPaymentSuccess(selectedPlan);
    window.history.replaceState({}, "", "/preview");
  }, [selectedPlan, onPaymentSuccess]);

  const handlePay = () => {
    setPaymentError(null);
    sessionStorage.setItem(PENDING_PLAN_KEY, selectedPlan);
    setShowPaymentForm(true);
  };

  if (isPaid || paymentSuccess) {
    if (variant === "overlay") return null;

    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
        <p className="text-sm font-bold text-emerald-800">
          تم الدفع بنجاح! يمكنك الآن تحميل سيرتك الذاتية بدون علامة مائية.
        </p>
      </div>
    );
  }

  if (environmentError) {
    const errorBox = (
      <div
        className={`rounded-xl border border-amber-200 bg-amber-50 p-4 text-center ${
          variant === "overlay" ? "" : "p-5"
        }`}
      >
        <p className="text-sm font-semibold text-amber-900">{environmentError}</p>
      </div>
    );
    return errorBox;
  }

  const payButton = !showPaymentForm ? (
    <button
      type="button"
      onClick={handlePay}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#378ADD] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#378ADD]/25 transition-colors hover:bg-[#2a6bb8]"
    >
      {variant === "overlay"
        ? "ادفع 69 ر.س وحمّل السيرة"
        : `ادفع وحمّل السيرة — ${selected.price} ر.س`}
    </button>
  ) : (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl bg-[#e8f2fc] px-4 py-3">
        <p className="text-sm font-semibold text-[#378ADD]">
          الدفع: {selected.title} — {selected.price} ر.س
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
        key={selectedPlan}
        planId={selectedPlan}
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
        اختر باقة التحميل
      </h3>
      <p className="mb-4 text-center text-xs text-slate-500">
        ادفع لإزالة العلامة المائية وتحميل سيرتك الذاتية
      </p>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            type="button"
            disabled={showPaymentForm}
            onClick={() => {
              setSelectedPlan(plan.id);
              setPaymentError(null);
            }}
            className={`rounded-xl border-2 p-4 text-right transition-all disabled:opacity-60 ${
              selectedPlan === plan.id
                ? "border-[#378ADD] bg-[#e8f2fc] shadow-md shadow-[#378ADD]/10"
                : "border-slate-200 bg-white hover:border-[#378ADD]/40"
            }`}
          >
            <p className="mb-1 font-bold text-slate-900">{plan.title}</p>
            <p className="mb-3 text-xs text-slate-500">{plan.description}</p>
            <p className="text-2xl font-extrabold text-[#378ADD]">
              {plan.price}
              <span className="mr-1 text-sm font-semibold text-slate-600">
                ر.س
              </span>
            </p>
          </button>
        ))}
      </div>

      {payButton}

      {paymentError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
          {paymentError}
        </div>
      )}
    </div>
  );
}

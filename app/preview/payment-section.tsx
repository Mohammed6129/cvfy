"use client";

import { useState } from "react";

type PlanId = "single" | "bilingual";

const PLANS: {
  id: PlanId;
  title: string;
  description: string;
  price: number;
}[] = [
  {
    id: "single",
    title: "سيرة بلغة واحدة",
    description: "تحميل السيرة الذاتية بلغة واحدة (عربية أو إنجليزية)",
    price: 69,
  },
  {
    id: "bilingual",
    title: "سيرة عربية + إنجليزية",
    description: "تحميل نسختين كاملتين بالعربية والإنجليزية",
    price: 99,
  },
];

export default function PaymentSection() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("single");
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);

  const selected = PLANS.find((p) => p.id === selectedPlan)!;

  const handlePay = () => {
    setPaymentMessage("سيتم تفعيل الدفع قريباً");
  };

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
            onClick={() => {
              setSelectedPlan(plan.id);
              setPaymentMessage(null);
            }}
            className={`rounded-xl border-2 p-4 text-right transition-all ${
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

      <button
        type="button"
        onClick={handlePay}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#378ADD] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#378ADD]/25 transition-colors hover:bg-[#2a6bb8]"
      >
        ادفع وحمّل السيرة — {selected.price} ر.س
      </button>

      {paymentMessage && (
        <div className="mt-4 rounded-xl border border-[#378ADD]/20 bg-[#e8f2fc] px-4 py-3 text-center text-sm font-semibold text-[#378ADD]">
          {paymentMessage}
        </div>
      )}
    </div>
  );
}

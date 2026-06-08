"use client";

import Script from "next/script";
import { useEffect, useId, useRef, useState } from "react";
import { PLANS, type PlanId } from "@/lib/payment";

type MoyasarPaymentFormProps = {
  planId: PlanId;
  onSuccess: () => void;
  onError: (message: string) => void;
};

export default function MoyasarPaymentForm({
  planId,
  onSuccess,
  onError,
}: MoyasarPaymentFormProps) {
  const reactId = useId();
  const formId = `moyasar-form-${reactId.replace(/:/g, "")}`;
  const [scriptReady, setScriptReady] = useState(false);
  const initializedRef = useRef(false);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  const plan = PLANS.find((p) => p.id === planId)!;
  const publishableKey = process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY;

  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.moyasar.com/mpf/0.3.0/moyasar.css";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    initializedRef.current = false;
  }, [planId]);

  useEffect(() => {
    if (!scriptReady || !publishableKey || initializedRef.current) return;

    const element = document.getElementById(formId);
    if (!element || !window.Moyasar) return;

    element.innerHTML = "";
    initializedRef.current = true;

    window.Moyasar.init({
      element: `#${formId}`,
      amount: plan.amountHalalas,
      currency: "SAR",
      description: `CVfy - ${plan.title}`,
      publishable_api_key: publishableKey,
      callback_url: `${window.location.origin}/preview`,
      methods: ["creditcard"],
      supported_networks: ["mada", "visa", "mastercard", "amex"],
      language: "ar",
      fixed_width: false,
      on_completed: async (payment) => {
        if (payment.status === "paid") {
          onSuccessRef.current();
        }
      },
      on_failure: async (error) => {
        onErrorRef.current(
          error || "فشلت عملية الدفع. يرجى المحاولة مرة أخرى."
        );
      },
      on_redirect: async () => {
        onSuccessRef.current();
      },
    });
  }, [scriptReady, publishableKey, planId, formId, plan]);

  if (!publishableKey) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        مفتاح الدفع غير مُهيّأ. يرجى إضافة NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY.
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://cdn.moyasar.com/mpf/0.3.0/moyasar.min.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div id={formId} className="mysr-form w-full" />
    </>
  );
}

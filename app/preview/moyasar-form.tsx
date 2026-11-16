"use client";

import { useEffect, useRef, useState } from "react";
import { getMoyasarEnvironmentError, getMoyasarPublishableKey, loadMoyasarAssets } from "@/lib/moyasar";
import type { Plan } from "@/lib/pricing";

type MoyasarFormProps = {
  plan: Plan;
  cvId: string;
  userId: string;
  /** Called when a wallet payment (Apple Pay) completes without a redirect. */
  onPaid: (paymentId: string) => void;
  onError: (message: string) => void;
};

/**
 * Moyasar's hosted card form. Card data goes straight from the browser to
 * Moyasar; we only receive a payment id, which the server then verifies.
 */
export default function MoyasarForm({ plan, cvId, userId, onPaid, onError }: MoyasarFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const handlers = useRef({ onPaid, onError });

  // Keep the latest callbacks without re-creating the payment form.
  useEffect(() => {
    handlers.current = { onPaid, onError };
  });

  const envError = getMoyasarEnvironmentError();

  useEffect(() => {
    const key = getMoyasarPublishableKey();
    if (envError || !key) return;

    let cancelled = false;
    const container = containerRef.current;

    loadMoyasarAssets()
      .then(() => {
        if (cancelled || !container || !window.Moyasar) return;
        container.innerHTML = "";

        const googleMerchant = process.env.NEXT_PUBLIC_MOYASAR_GOOGLE_MERCHANT_ID?.trim();
        const methods = ["creditcard", "applepay", ...(googleMerchant ? ["googlepay"] : [])];

        window.Moyasar.init({
          element: container,
          amount: plan.amountHalalas,
          currency: "SAR",
          country: "SA",
          description: `CVfy — ${plan.name}`,
          publishable_api_key: key,
          // Moyasar appends ?id=…&status=…; the server re-checks both.
          callback_url: `${window.location.origin}/preview?cv=${encodeURIComponent(cvId)}&plan=${plan.id}`,
          metadata: { cv_id: cvId, plan: plan.id, user_id: userId },
          methods,
          supported_networks: ["mada", "visa", "mastercard"],
          language: "ar",
          fixed_width: false,
          show_footer: false,
          apple_pay: {
            country: "SA",
            label: "CVfy",
            validate_merchant_url: "https://api.moyasar.com/v1/applepay/initiate",
          },
          ...(googleMerchant
            ? {
                google_pay: {
                  country: "SA",
                  label: "CVfy",
                  merchant_id: googleMerchant,
                  gateway_merchant_id: process.env.NEXT_PUBLIC_MOYASAR_GATEWAY_MERCHANT_ID?.trim() || undefined,
                  environment: "PRODUCTION" as const,
                  auth_methods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                },
              }
            : {}),
          on_completed: async (payment) => {
            if (payment.status === "paid") handlers.current.onPaid(payment.id);
          },
          on_failure: async (error) => {
            handlers.current.onError(typeof error === "string" && error ? error : "ما تمت عملية الدفع. جرّب مرة ثانية.");
          },
        });
        setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
      if (container) container.innerHTML = "";
    };
  }, [plan.id, plan.amountHalalas, plan.name, cvId, userId, envError]);

  if (envError) return <p className="note note-warn">{envError}</p>;

  return (
    <div>
      {state === "loading" && (
        <p className="flex items-center justify-center gap-2 py-6 text-sm text-mute" role="status">
          <span className="spinner" /> نجهّز نموذج الدفع…
        </p>
      )}
      {state === "error" && <p className="note note-bad">ما قدرنا نحمّل نموذج الدفع. حدّث الصفحة وجرّب مرة ثانية.</p>}
      <div ref={containerRef} className="mysr-form" dir="rtl" />
    </div>
  );
}

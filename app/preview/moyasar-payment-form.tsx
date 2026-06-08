"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  getMoyasarCallbackUrl,
  getMoyasarEnvironmentError,
  getMoyasarPublishableKey,
  loadMoyasarAssets,
} from "@/lib/moyasar";
import { PLANS, type PlanId } from "@/lib/payment";

type MoyasarPaymentFormProps = {
  planId: PlanId;
  onSuccess: () => void;
  onError: (message: string) => void;
};

type LoadState = "loading" | "ready" | "error";

export default function MoyasarPaymentForm({
  planId,
  onSuccess,
  onError,
}: MoyasarPaymentFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  const plan = PLANS.find((p) => p.id === planId)!;
  const environmentError = getMoyasarEnvironmentError();
  const publishableKey = getMoyasarPublishableKey();
  const googleMerchantId =
    process.env.NEXT_PUBLIC_MOYASAR_GOOGLE_MERCHANT_ID?.trim() || "";
  const gatewayMerchantId =
    process.env.NEXT_PUBLIC_MOYASAR_GATEWAY_MERCHANT_ID?.trim() || "";

  const googlePay = useMemo(() => {
    if (!googleMerchantId) return undefined;

    return {
      country: "SA",
      label: "CVfy",
      merchant_id: googleMerchantId,
      gateway_merchant_id: gatewayMerchantId || undefined,
      environment: "PRODUCTION" as const,
      auth_methods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
    };
  }, [googleMerchantId, gatewayMerchantId]);

  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  useEffect(() => {
    if (environmentError || !publishableKey) {
      setLoadState("error");
      return;
    }

    let cancelled = false;

    const initForm = async () => {
      setLoadState("loading");

      try {
        await loadMoyasarAssets();

        if (cancelled || !containerRef.current || !window.Moyasar) {
          return;
        }

        containerRef.current.innerHTML = "";

        const methods = ["creditcard", "applepay"];
        if (googlePay) {
          methods.push("googlepay");
        }

        window.Moyasar.init({
          element: containerRef.current,
          amount: plan.amountHalalas,
          currency: "SAR",
          country: "SA",
          description: `CVfy - ${plan.title}`,
          publishable_api_key: publishableKey,
          callback_url: getMoyasarCallbackUrl(),
          methods,
          supported_networks: ["mada", "visa", "mastercard", "amex"],
          language: "ar",
          fixed_width: false,
          payment_options: {
            country: "SA",
            label: "CVfy",
          },
          apple_pay: {
            country: "SA",
            label: "CVfy",
            validate_merchant_url:
              "https://api.moyasar.com/v1/applepay/initiate",
          },
          ...(googlePay ? { google_pay: googlePay } : {}),
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
          on_redirect: async (url) => {
            const redirectUrl = new URL(url);
            const status = redirectUrl.searchParams.get("status");

            if (status === "paid") {
              onSuccessRef.current();
              window.history.replaceState({}, "", "/preview");
              return;
            }

            window.location.href = url;
          },
        });

        if (!cancelled) {
          setLoadState("ready");
        }
      } catch (error) {
        console.error("[moyasar] init failed:", error);
        if (!cancelled) {
          setLoadState("error");
          onErrorRef.current(
            "تعذر تحميل نموذج الدفع. تأكد من اتصال الإنترنت وأعد المحاولة."
          );
        }
      }
    };

    initForm();

    return () => {
      cancelled = true;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [
    planId,
    plan.amountHalalas,
    plan.title,
    environmentError,
    publishableKey,
    googleMerchantId,
    gatewayMerchantId,
    googlePay,
  ]);

  if (environmentError) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {environmentError}
      </div>
    );
  }

  return (
    <div className="relative space-y-3">
      {loadState === "loading" && (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#378ADD]" />
          جاري تحميل نموذج الدفع...
        </div>
      )}

      {loadState === "error" && !environmentError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          تعذر تحميل نموذج الدفع. يرجى المحاولة مرة أخرى.
        </div>
      )}

      <div
        ref={containerRef}
        className="mysr-form min-h-[120px] w-full rounded-xl border border-slate-100 bg-white p-2"
      />
    </div>
  );
}

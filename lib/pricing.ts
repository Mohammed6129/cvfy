import type { PlanId } from "@/lib/cv/types";

/**
 * Single source of truth for prices. Change a number here and it updates
 * everywhere: landing page, paywall, Moyasar amount and server-side checks.
 * Prices are in SAR and are the final amount charged (if the business is
 * VAT-registered, they are VAT-inclusive).
 */
export type Plan = {
  id: PlanId;
  name: string;
  price: number;
  amountHalalas: number;
  tagline: string;
  /** What the plan unlocks on the CV record. */
  grants: "basic" | "full";
  features: string[];
};

export const PLANS: Record<PlanId, Plan> = {
  basic: {
    id: "basic",
    name: "الأساسية",
    price: 29,
    amountHalalas: 2900,
    tagline: "سيرة وحدة بلغة وحدة",
    grants: "basic",
    features: [
      "سيرة كاملة بلغة وحدة (عربي أو إنجليزي)",
      "ملف PDF وملف Word قابل للتعديل",
      "تقرير فحص ATS",
      "تعديلات لمدة 7 أيام",
    ],
  },
  full: {
    id: "full",
    name: "الكاملة",
    price: 49,
    amountHalalas: 4900,
    tagline: "كل اللي تحتاجه للتقديم",
    grants: "full",
    features: [
      "سيرتين: عربي وإنجليزي",
      "PDF و Word لكل لغة",
      "تقرير ATS ومطابقة مع إعلان الوظيفة",
      "رسالة تقديم جاهزة للإيميل والواتساب",
      "نبذة وعنوان لحسابك في LinkedIn",
      "تعديلات وإعادة مطابقة لوظائف ثانية لمدة 30 يوم",
    ],
  },
  upgrade: {
    id: "upgrade",
    name: "ترقية للكاملة",
    price: 25,
    amountHalalas: 2500,
    tagline: "أضف اللغة الثانية وكل الإضافات",
    grants: "full",
    features: [],
  },
};

export const DEFAULT_PLAN: PlanId = "full";

/** Regenerations allowed per CV — keeps AI spend bounded. */
export const GENERATION_LIMITS = {
  beforePayment: 3,
  basic: 6,
  full: 15,
};

/** Days after payment during which edits/regenerations stay open. */
export const EDIT_WINDOW_DAYS = { basic: 7, full: 30 };

export function getPlan(id: string | null | undefined): Plan | null {
  if (id === "basic" || id === "full" || id === "upgrade") return PLANS[id];
  return null;
}

export function formatPrice(sar: number): string {
  return `${sar} ريال`;
}

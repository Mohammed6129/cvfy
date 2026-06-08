export type PlanId = "single" | "bilingual";

export const PAYMENT_STORAGE_KEY = "cvfy-payment-paid";
export const PAYMENT_PLAN_KEY = "cvfy-payment-plan";
export const PENDING_PLAN_KEY = "cvfy-payment-pending-plan";

export const PLANS: {
  id: PlanId;
  title: string;
  description: string;
  price: number;
  amountHalalas: number;
}[] = [
  {
    id: "single",
    title: "سيرة بلغة واحدة",
    description: "تحميل السيرة الذاتية بلغة واحدة (عربية أو إنجليزية)",
    price: 69,
    amountHalalas: 6900,
  },
  {
    id: "bilingual",
    title: "سيرة عربية + إنجليزية",
    description: "تحميل نسختين كاملتين بالعربية والإنجليزية",
    price: 99,
    amountHalalas: 9900,
  },
];

export function isPaymentComplete(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(PAYMENT_STORAGE_KEY) === "true";
}

export function markPaymentComplete(planId: PlanId): void {
  sessionStorage.setItem(PAYMENT_STORAGE_KEY, "true");
  sessionStorage.setItem(PAYMENT_PLAN_KEY, planId);
}

export function getPaidPlan(): PlanId | null {
  if (typeof window === "undefined") return null;
  const plan = sessionStorage.getItem(PAYMENT_PLAN_KEY);
  return plan === "single" || plan === "bilingual" ? plan : null;
}

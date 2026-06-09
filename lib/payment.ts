export type PlanId = "bilingual";

export const PAYMENT_STORAGE_KEY = "cvfy-payment-paid";
export const PAYMENT_PLAN_KEY = "cvfy-payment-plan";
export const PENDING_PLAN_KEY = "cvfy-payment-pending-plan";

export const SINGLE_PLAN = {
  id: "bilingual" as PlanId,
  title: "النسختان العربية والإنجليزية",
  description: "تحميل السيرة الذاتية كاملة بالعربي والإنجليزي بدون علامة مائية",
  price: 99,
  amountHalalas: 9900,
};

export const PLANS = [SINGLE_PLAN];

export function isPaymentComplete(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(PAYMENT_STORAGE_KEY) === "true";
}

export function markPaymentComplete(planId: PlanId = "bilingual"): void {
  sessionStorage.setItem(PAYMENT_STORAGE_KEY, "true");
  sessionStorage.setItem(PAYMENT_PLAN_KEY, planId);
}

export function getPaidPlan(): PlanId | null {
  if (typeof window === "undefined") return null;
  const plan = sessionStorage.getItem(PAYMENT_PLAN_KEY);
  return plan === "bilingual" ? plan : null;
}

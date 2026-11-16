/**
 * Payment verification against Moyasar's API.
 *
 * The browser only ever tells us "payment X is for CV Y". We then ask
 * Moyasar directly whether X is really paid, for the right amount, and
 * tagged with this CV — nothing the browser says is trusted.
 */
import { getPlan, type Plan } from "@/lib/pricing";

type MoyasarPayment = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  metadata?: Record<string, string> | null;
};

export type VerifyResult =
  | { ok: true; plan: Plan; amount: number; verified: boolean }
  | { ok: false; reason: "not_paid" | "mismatch" | "unreachable" | "not_configured" };

export function isMoyasarVerificationConfigured(): boolean {
  const key = process.env.MOYASAR_SECRET_KEY?.trim();
  return Boolean(key && /^sk_(test|live)_/.test(key));
}

export async function verifyMoyasarPayment(input: {
  paymentId: string;
  cvId: string;
  userId: string;
  claimedPlanId: string;
}): Promise<VerifyResult> {
  const claimedPlan = getPlan(input.claimedPlanId);
  if (!claimedPlan) return { ok: false, reason: "mismatch" };

  const secret = process.env.MOYASAR_SECRET_KEY?.trim();
  if (!isMoyasarVerificationConfigured() || !secret) {
    return { ok: false, reason: "not_configured" };
  }

  if (!/^[\w-]{8,64}$/.test(input.paymentId)) return { ok: false, reason: "mismatch" };

  let payment: MoyasarPayment;
  try {
    const response = await fetch(`https://api.moyasar.com/v1/payments/${input.paymentId}`, {
      headers: { Authorization: `Basic ${Buffer.from(`${secret}:`).toString("base64")}` },
      cache: "no-store",
    });
    if (response.status === 404) return { ok: false, reason: "mismatch" };
    if (!response.ok) return { ok: false, reason: "unreachable" };
    payment = (await response.json()) as MoyasarPayment;
  } catch (error) {
    console.error("[payments] Moyasar lookup failed:", error);
    return { ok: false, reason: "unreachable" };
  }

  if (payment.status !== "paid" && payment.status !== "captured") {
    return { ok: false, reason: "not_paid" };
  }

  // The amount decides the plan — a 29 SAR payment can never unlock the 49 SAR plan.
  const plan = getPlan(payment.metadata?.plan) ?? claimedPlan;
  const tiedToCv = payment.metadata?.cv_id === input.cvId;
  const tiedToUser = !payment.metadata?.user_id || payment.metadata.user_id === input.userId;

  if (payment.currency !== "SAR" || payment.amount !== plan.amountHalalas || !tiedToCv || !tiedToUser) {
    console.error("[payments] verification mismatch", {
      paymentId: payment.id,
      amount: payment.amount,
      expected: plan.amountHalalas,
      tiedToCv,
      tiedToUser,
    });
    return { ok: false, reason: "mismatch" };
  }

  return { ok: true, plan, amount: payment.amount, verified: true };
}

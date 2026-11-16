import { NextResponse } from "next/server";
import { isMockMode } from "@/lib/ai/client";
import { getPlan } from "@/lib/pricing";
import { jsonError, unauthorized } from "@/lib/server/http";
import { verifyMoyasarPayment } from "@/lib/server/payments";
import { findPaymentCv, getCv, markPaid } from "@/lib/server/repo";
import { getSessionUser } from "@/lib/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Called when the shopper returns from Moyasar. The payment is looked up
 * at Moyasar with the secret key before anything is unlocked.
 */
export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  let body: { cvId?: string; paymentId?: string; plan?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("بيانات غير صالحة.", 400);
  }

  const { cvId, paymentId } = body;
  const claimed = getPlan(body.plan);
  if (!cvId || !paymentId || !claimed) return jsonError("بيانات الدفع ناقصة.", 400);

  const row = await getCv(user.id, cvId);
  if (!row?.stored) return jsonError("ما لقينا هذي السيرة.", 404);

  // A payment unlocks exactly one CV, once.
  const usedFor = await findPaymentCv(paymentId);
  if (usedFor && usedFor !== cvId) return jsonError("عملية الدفع هذي مستخدمة لسيرة ثانية.", 409);
  if (usedFor === cvId && row.isPaid) return NextResponse.json({ ok: true, plan: row.paidPlan });

  let plan = claimed;
  let amount = claimed.amountHalalas;

  if (!isMockMode()) {
    const result = await verifyMoyasarPayment({ paymentId, cvId, userId: user.id, claimedPlanId: claimed.id });

    if (!result.ok && result.reason === "not_configured") {
      // Until MOYASAR_SECRET_KEY is added the old behaviour is kept so paying
      // customers are never locked out — but nothing is verified. Add the key.
      console.error("[payments] MOYASAR_SECRET_KEY is missing — payment accepted WITHOUT verification:", paymentId);
    } else if (!result.ok) {
      const message =
        result.reason === "not_paid"
          ? "عملية الدفع ما اكتملت. ما انخصم منك شي — جرّب مرة ثانية."
          : result.reason === "unreachable"
            ? "ما قدرنا نتأكد من الدفع الحين. حدّث الصفحة بعد دقيقة — دفعتك محفوظة."
            : "بيانات الدفع ما تطابق هذي السيرة.";
      return jsonError(message, 402, { code: result.reason });
    } else {
      plan = result.plan;
      amount = result.amount;
    }
  }

  if (plan.id === "upgrade" && !(row.isPaid && row.paidPlan === "basic")) {
    return jsonError("الترقية متاحة لمن اشترى الباقة الأساسية.", 409);
  }

  const now = new Date().toISOString();
  await markPaid({
    userId: user.id,
    id: row.id,
    plan: plan.grants,
    planId: plan.id,
    paymentId,
    amountHalalas: amount,
    stored: {
      ...row.stored,
      meta: { ...row.stored.meta, paidAt: row.stored.meta.paidAt ?? now, plan: plan.grants, updatedAt: now },
    },
  });

  return NextResponse.json({ ok: true, plan: plan.grants });
}

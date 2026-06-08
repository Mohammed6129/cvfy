import { NextResponse } from "next/server";
import { PLANS, type PlanId } from "@/lib/payment";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  let body: { cvId?: string; planId?: PlanId; paymentId?: string | null };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }

  if (!body.cvId || !body.planId) {
    return NextResponse.json({ error: "بيانات الدفع ناقصة" }, { status: 400 });
  }

  const plan = PLANS.find((p) => p.id === body.planId);
  if (!plan) {
    return NextResponse.json({ error: "باقة غير صالحة" }, { status: 400 });
  }

  const { error: paymentError } = await supabase.from("payments").insert({
    user_id: user.id,
    cv_id: body.cvId,
    moyasar_payment_id: body.paymentId ?? null,
    plan_id: body.planId,
    amount_halalas: plan.amountHalalas,
    status: "paid",
  });

  if (paymentError) {
    console.error("[api/payments] insert error:", paymentError);
  }

  const { error: cvError } = await supabase
    .from("cvs")
    .update({
      is_paid: true,
      paid_plan: body.planId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.cvId)
    .eq("user_id", user.id);

  if (cvError) {
    console.error("[api/payments] cv update error:", cvError);
    return NextResponse.json(
      { error: "تعذر تسجيل الدفع." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

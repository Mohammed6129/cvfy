import { NextResponse } from "next/server";
import type {
  AtsScoreResult,
  CvFormData,
  CvRecord,
  GeneratedCv,
} from "@/lib/cv-types";
import { createClient } from "@/lib/supabase/server";

function mapRow(row: {
  id: string;
  title: string;
  generated_cv: GeneratedCv;
  form_data: CvFormData | null;
  is_paid: boolean;
  paid_plan: string | null;
  ats_result: AtsScoreResult | null;
  updated_at: string;
  created_at: string;
}): CvRecord {
  return {
    id: row.id,
    title: row.title,
    generatedCv: row.generated_cv,
    formData: row.form_data,
    isPaid: row.is_paid,
    paidPlan: row.paid_plan,
    atsResult: row.ats_result,
    updatedAt: row.updated_at,
    createdAt: row.created_at,
  };
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const list = searchParams.get("list") === "true";
  const cvId = searchParams.get("id");

  if (list) {
    const { data, error } = await supabase
      .from("cvs")
      .select(
        "id, title, generated_cv, form_data, is_paid, paid_plan, ats_result, updated_at, created_at"
      )
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("[api/cvs] list error:", error);
      return NextResponse.json(
        { error: "تعذر تحميل السير الذاتية." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      cvs: (data ?? []).map(mapRow),
    });
  }

  let query = supabase
    .from("cvs")
    .select(
      "id, title, generated_cv, form_data, is_paid, paid_plan, ats_result, updated_at, created_at"
    )
    .eq("user_id", user.id);

  if (cvId) {
    query = query.eq("id", cvId);
  } else {
    query = query.order("updated_at", { ascending: false }).limit(1);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error("[api/cvs] GET error:", error);
    return NextResponse.json(
      { error: "تعذر تحميل السيرة الذاتية." },
      { status: 500 }
    );
  }

  if (!data?.generated_cv) {
    return NextResponse.json({ cv: null });
  }

  return NextResponse.json({
    id: data.id,
    cv: data.generated_cv as GeneratedCv,
    formData: data.form_data as CvFormData | null,
    isPaid: data.is_paid,
    paidPlan: data.paid_plan,
    atsResult: data.ats_result,
    updatedAt: data.updated_at,
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  let body: {
    formData?: CvFormData;
    generatedCv?: GeneratedCv;
    cvId?: string | null;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }

  if (!body.generatedCv) {
    return NextResponse.json(
      { error: "السيرة الذاتية مطلوبة" },
      { status: 400 }
    );
  }

  const title = body.generatedCv.name
    ? `سيرة ${body.generatedCv.name}`
    : "سيرتي الذاتية";

  const payload = {
    user_id: user.id,
    title,
    form_data: body.formData ?? null,
    generated_cv: body.generatedCv,
    updated_at: new Date().toISOString(),
  };

  if (body.cvId) {
    const { data, error } = await supabase
      .from("cvs")
      .update(payload)
      .eq("id", body.cvId)
      .eq("user_id", user.id)
      .select("id")
      .single();

    if (error) {
      console.error("[api/cvs] update error:", error);
      return NextResponse.json(
        { error: "تعذر حفظ السيرة الذاتية." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data.id });
  }

  const { data, error } = await supabase
    .from("cvs")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    console.error("[api/cvs] insert error:", error);
    return NextResponse.json(
      { error: "تعذر حفظ السيرة الذاتية." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, id: data.id });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  let body: { cvId?: string; atsResult?: AtsScoreResult };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }

  if (!body.cvId || !body.atsResult) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }

  const { error } = await supabase
    .from("cvs")
    .update({
      ats_result: body.atsResult,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.cvId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[api/cvs] PATCH error:", error);
    return NextResponse.json({ error: "تعذر الحفظ." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const cvId = new URL(request.url).searchParams.get("id");
  if (!cvId) {
    return NextResponse.json({ error: "معرّف السيرة مطلوب" }, { status: 400 });
  }

  const { error } = await supabase
    .from("cvs")
    .delete()
    .eq("id", cvId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[api/cvs] DELETE error:", error);
    return NextResponse.json({ error: "تعذر الحذف." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

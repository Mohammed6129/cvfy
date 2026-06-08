import { NextResponse } from "next/server";
import type { CvFormData, GeneratedCv } from "@/lib/cv-types";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("cvs")
    .select("generated_cv, form_data, updated_at")
    .eq("user_id", user.id)
    .maybeSingle();

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
    cv: data.generated_cv as GeneratedCv,
    formData: data.form_data as CvFormData | null,
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

  let body: { formData?: CvFormData; generatedCv?: GeneratedCv };

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

  const { error } = await supabase.from("cvs").upsert(
    {
      user_id: user.id,
      form_data: body.formData ?? null,
      generated_cv: body.generatedCv,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("[api/cvs] POST error:", error);
    return NextResponse.json(
      { error: "تعذر حفظ السيرة الذاتية." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

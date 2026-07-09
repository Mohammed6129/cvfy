import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "cvs";
const SIGNED_URL_TTL = 3600;

type ProfileRow = {
  cv_pdf_ar_url: string | null;
  cv_pdf_en_url: string | null;
  cv_word_ar_url: string | null;
  cv_word_en_url: string | null;
  ats_report_url: string | null;
  cv_generated_at: string | null;
  is_paid: boolean;
};

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, error: NextResponse.json({ error: "غير مصرح" }, { status: 401 }) };
  }

  return { user, error: null };
}

async function createSignedUrl(path: string | null | undefined) {
  if (!path) return null;

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.storage
      .from(BUCKET)
      .createSignedUrl(path, SIGNED_URL_TTL);

    if (error || !data?.signedUrl) {
      console.error("[api/cv-files] signed url error:", error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error("[api/cv-files] admin client error:", error);
    return null;
  }
}

export async function GET() {
  const { user, error } = await getAuthenticatedUser();
  if (error || !user) return error;

  const supabase = await createClient();
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "cv_pdf_ar_url, cv_pdf_en_url, cv_word_ar_url, cv_word_en_url, ats_report_url, cv_generated_at, is_paid"
    )
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[api/cv-files] profile read error:", profileError);
    return NextResponse.json({ error: "تعذر قراءة الملف الشخصي." }, { status: 500 });
  }

  if (!profile) {
    return NextResponse.json({ error: "لا توجد ملفات محفوظة بعد." }, { status: 404 });
  }

  const row = profile as ProfileRow;
  const [pdfAr, pdfEn, wordAr, wordEn, ats] = await Promise.all([
    createSignedUrl(row.cv_pdf_ar_url),
    createSignedUrl(row.cv_pdf_en_url),
    createSignedUrl(row.cv_word_ar_url),
    createSignedUrl(row.cv_word_en_url),
    createSignedUrl(row.ats_report_url),
  ]);

  return NextResponse.json({
    ...row,
    signedUrls: {
      pdfAr,
      pdfEn,
      wordAr,
      wordEn,
      ats,
    },
  });
}

type UploadSpec = {
  field: string;
  path: string;
  column: string;
  contentType: string;
};

export async function POST(request: Request) {
  const { user, error } = await getAuthenticatedUser();
  if (error || !user) return error;

  const formData = await request.formData();
  const atsPdf = formData.get("atsPdf");

  if (!(atsPdf instanceof Blob)) {
    return NextResponse.json({ error: "ملفات غير مكتملة." }, { status: 400 });
  }

  const userId = user.id;

  // Each language version is an independent file with its own storage
  // identifier. A language whose ATS gate failed is simply absent.
  const specs: UploadSpec[] = [
    {
      field: "cvPdfAr",
      path: `${userId}/cv-ar.pdf`,
      column: "cv_pdf_ar_url",
      contentType: "application/pdf",
    },
    {
      field: "cvPdfEn",
      path: `${userId}/cv-en.pdf`,
      column: "cv_pdf_en_url",
      contentType: "application/pdf",
    },
    {
      field: "cvWordAr",
      path: `${userId}/cv-ar.doc`,
      column: "cv_word_ar_url",
      contentType: "application/msword",
    },
    {
      field: "cvWordEn",
      path: `${userId}/cv-en.doc`,
      column: "cv_word_en_url",
      contentType: "application/msword",
    },
    {
      field: "atsPdf",
      path: `${userId}/ats-report.pdf`,
      column: "ats_report_url",
      contentType: "application/pdf",
    },
  ];

  const present = specs.filter((spec) => formData.get(spec.field) instanceof Blob);
  const hasCvFile = present.some((spec) => spec.field !== "atsPdf");

  if (!hasCvFile) {
    return NextResponse.json(
      { error: "لا توجد نسخة سيرة ذاتية صالحة للحفظ." },
      { status: 400 }
    );
  }

  try {
    const admin = createAdminClient();
    const storage = admin.storage.from(BUCKET);

    const uploads = await Promise.all(
      present.map((spec) =>
        storage.upload(spec.path, formData.get(spec.field) as Blob, {
          upsert: true,
          contentType: spec.contentType,
        })
      )
    );

    const failed = uploads.find((u) => u.error);
    if (failed?.error) {
      console.error("[api/cv-files] upload error:", failed.error);
      return NextResponse.json({ error: "تعذر رفع الملفات." }, { status: 500 });
    }

    const generatedAt = new Date().toISOString();

    const profileUpdate: Record<string, unknown> = {
      id: userId,
      cv_generated_at: generatedAt,
      is_paid: true,
      updated_at: generatedAt,
    };
    present.forEach((spec, i) => {
      profileUpdate[spec.column] = uploads[i].data?.path ?? spec.path;
    });

    const { error: profileError } = await admin
      .from("profiles")
      .upsert(profileUpdate, { onConflict: "id" });

    if (profileError) {
      console.error("[api/cv-files] profile upsert error:", profileError);
      return NextResponse.json({ error: "تعذر حفظ روابط الملفات." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      saved: present.map((spec) => spec.column),
      cv_generated_at: generatedAt,
      is_paid: true,
    });
  } catch (uploadError) {
    console.error("[api/cv-files] upload failed:", uploadError);
    return NextResponse.json(
      {
        error:
          uploadError instanceof Error
            ? uploadError.message
            : "تعذر حفظ الملفات في التخزين.",
      },
      { status: 500 }
    );
  }
}

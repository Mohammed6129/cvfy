import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "cvs";
const SIGNED_URL_TTL = 3600;

type ProfileRow = {
  cv_pdf_url: string | null;
  cv_word_url: string | null;
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
    .select("cv_pdf_url, cv_word_url, ats_report_url, cv_generated_at, is_paid")
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
  const [pdf, word, ats] = await Promise.all([
    createSignedUrl(row.cv_pdf_url),
    createSignedUrl(row.cv_word_url),
    createSignedUrl(row.ats_report_url),
  ]);

  return NextResponse.json({
    ...row,
    signedUrls: {
      pdf,
      word,
      ats,
    },
  });
}

export async function POST(request: Request) {
  const { user, error } = await getAuthenticatedUser();
  if (error || !user) return error;

  const formData = await request.formData();
  const cvPdf = formData.get("cvPdf");
  const cvWord = formData.get("cvWord");
  const atsPdf = formData.get("atsPdf");

  if (!(cvPdf instanceof Blob) || !(cvWord instanceof Blob) || !(atsPdf instanceof Blob)) {
    return NextResponse.json({ error: "ملفات غير مكتملة." }, { status: 400 });
  }

  const userId = user.id;
  const pdfPath = `${userId}/cv.pdf`;
  const wordPath = `${userId}/cv.docx`;
  const atsPath = `${userId}/ats-report.pdf`;

  try {
    const admin = createAdminClient();
    const storage = admin.storage.from(BUCKET);

    const [pdfUpload, wordUpload, atsUpload] = await Promise.all([
      storage.upload(pdfPath, cvPdf, {
        upsert: true,
        contentType: "application/pdf",
      }),
      storage.upload(wordPath, cvWord, {
        upsert: true,
        contentType: "application/msword",
      }),
      storage.upload(atsPath, atsPdf, {
        upsert: true,
        contentType: "application/pdf",
      }),
    ]);

    if (pdfUpload.error || wordUpload.error || atsUpload.error) {
      console.error("[api/cv-files] upload errors:", {
        pdf: pdfUpload.error,
        word: wordUpload.error,
        ats: atsUpload.error,
      });
      return NextResponse.json({ error: "تعذر رفع الملفات." }, { status: 500 });
    }

    const generatedAt = new Date().toISOString();
    const isPaid = true;

    const { error: profileError } = await admin.from("profiles").upsert(
      {
        id: userId,
        cv_pdf_url: pdfUpload.data?.path ?? pdfPath,
        cv_word_url: wordUpload.data?.path ?? wordPath,
        ats_report_url: atsUpload.data?.path ?? atsPath,
        cv_generated_at: generatedAt,
        is_paid: isPaid,
        updated_at: generatedAt,
      },
      { onConflict: "id" }
    );

    if (profileError) {
      console.error("[api/cv-files] profile upsert error:", profileError);
      return NextResponse.json({ error: "تعذر حفظ روابط الملفات." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      cv_pdf_url: pdfUpload.data?.path ?? pdfPath,
      cv_word_url: wordUpload.data?.path ?? wordPath,
      ats_report_url: atsUpload.data?.path ?? atsPath,
      cv_generated_at: generatedAt,
      is_paid: isPaid,
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

import type { AtsScoreResult, GeneratedCv } from "@/lib/cv-types";
import { buildAllCvFileBlobs, fetchAtsResult } from "@/lib/cv-export";

export type ProfileFilesResponse = {
  cv_pdf_url: string | null;
  cv_word_url: string | null;
  ats_report_url: string | null;
  cv_generated_at: string | null;
  is_paid: boolean;
  signedUrls: {
    pdf: string | null;
    word: string | null;
    ats: string | null;
  };
};

export async function saveCvFilesToProfile(
  cv: GeneratedCv,
  atsResult?: AtsScoreResult | null
): Promise<boolean> {
  let result = atsResult;
  if (!result) {
    result = await fetchAtsResult(cv);
  }

  const blobs = await buildAllCvFileBlobs(cv, result);
  const formData = new FormData();
  formData.append("cvPdf", blobs.cvPdf, "cv.pdf");
  formData.append("cvWord", blobs.cvWord, "cv.docx");
  formData.append("atsPdf", blobs.atsPdf, "ats-report.pdf");

  const response = await fetch("/api/cv-files", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || "تعذر حفظ الملفات في الملف الشخصي.");
  }

  return true;
}

export async function fetchProfileFiles(): Promise<ProfileFilesResponse | null> {
  const response = await fetch("/api/cv-files", {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || "تعذر تحميل ملفاتك.");
  }

  return (await response.json()) as ProfileFilesResponse;
}

import type { AtsScoreResult, CvFormData, CvRecord, GeneratedCv } from "@/lib/cv-types";

export const CURRENT_CV_ID_KEY = "cvfy-current-cv-id";
export const STORAGE_KEY = "cvfy-generated-cv";

export async function saveCvToAccount(
  generatedCv: GeneratedCv,
  formData?: CvFormData,
  cvId?: string | null
): Promise<{ id: string } | null> {
  try {
    const response = await fetch("/api/cvs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
      },
      body: JSON.stringify({ generatedCv, formData, cvId }),
    });

    if (!response.ok) return null;
    const data = (await response.json()) as { id?: string };
    if (data.id) {
      sessionStorage.setItem(CURRENT_CV_ID_KEY, data.id);
    }
    return data.id ? { id: data.id } : null;
  } catch (error) {
    console.error("[cv-storage] save failed:", error);
    return null;
  }
}

export async function loadCvFromAccount(
  cvId?: string | null
): Promise<{ cv: GeneratedCv; id: string; isPaid: boolean; formData: CvFormData | null } | null> {
  try {
    const query = cvId ? `?id=${encodeURIComponent(cvId)}` : "";
    const response = await fetch(`/api/cvs${query}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      cv?: GeneratedCv | null;
      id?: string;
      isPaid?: boolean;
      formData?: CvFormData | null;
    };

    if (!data.cv || !data.id) return null;

    return {
      cv: data.cv,
      id: data.id,
      isPaid: Boolean(data.isPaid),
      formData: data.formData ?? null,
    };
  } catch (error) {
    console.error("[cv-storage] load failed:", error);
    return null;
  }
}

export async function listCvsFromAccount(): Promise<CvRecord[]> {
  try {
    const response = await fetch("/api/cvs?list=true", {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) return [];
    const data = (await response.json()) as { cvs?: CvRecord[] };
    return data.cvs ?? [];
  } catch (error) {
    console.error("[cv-storage] list failed:", error);
    return [];
  }
}

export async function deleteCvFromAccount(cvId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/cvs?id=${encodeURIComponent(cvId)}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error("[cv-storage] delete failed:", error);
    return false;
  }
}

export async function recordPayment(
  cvId: string,
  planId: string,
  paymentId?: string | null
): Promise<boolean> {
  try {
    const response = await fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
      },
      body: JSON.stringify({ cvId, planId, paymentId }),
    });
    return response.ok;
  } catch (error) {
    console.error("[cv-storage] payment record failed:", error);
    return false;
  }
}

export async function saveAtsResult(
  cvId: string,
  result: AtsScoreResult
): Promise<boolean> {
  try {
    const response = await fetch("/api/cvs", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
      },
      body: JSON.stringify({ cvId, atsResult: result }),
    });
    return response.ok;
  } catch (error) {
    console.error("[cv-storage] ats save failed:", error);
    return false;
  }
}

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

    const responseText = await response.text();

    if (!response.ok) {
      console.error(
        "[cv-storage] save failed:",
        response.status,
        responseText.slice(0, 500)
      );
      return null;
    }

    let data: { id?: string; error?: string };
    try {
      data = JSON.parse(responseText) as { id?: string; error?: string };
    } catch (parseError) {
      console.error("[cv-storage] save response parse failed:", parseError);
      return null;
    }

    if (data.id) {
      sessionStorage.setItem(CURRENT_CV_ID_KEY, data.id);
      console.log("[cv-storage] CV saved with id:", data.id);
    } else {
      console.warn("[cv-storage] save ok but no id returned:", data);
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

    const responseText = await response.text();

    if (!response.ok) {
      console.error(
        "[cv-storage] load failed:",
        response.status,
        responseText.slice(0, 300)
      );
      return null;
    }

    let data: {
      cv?: GeneratedCv | null;
      id?: string;
      isPaid?: boolean;
      formData?: CvFormData | null;
    };

    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("[cv-storage] load response parse failed:", parseError);
      return null;
    }

    if (!data.cv || !data.id) {
      console.warn("[cv-storage] load returned empty cv:", data);
      return null;
    }

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

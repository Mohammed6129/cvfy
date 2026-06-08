import type { CvFormData, GeneratedCv } from "@/lib/cv-types";

export async function saveCvToAccount(
  generatedCv: GeneratedCv,
  formData?: CvFormData
): Promise<boolean> {
  try {
    const response = await fetch("/api/cvs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
      },
      body: JSON.stringify({ generatedCv, formData }),
    });

    return response.ok;
  } catch (error) {
    console.error("[cv-storage] save failed:", error);
    return false;
  }
}

export async function loadCvFromAccount(): Promise<GeneratedCv | null> {
  try {
    const response = await fetch("/api/cvs", {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { cv?: GeneratedCv | null };
    return data.cv ?? null;
  } catch (error) {
    console.error("[cv-storage] load failed:", error);
    return null;
  }
}

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CvLaptopLoader, {
  type LanguageProgress,
  type LanguageStage,
} from "@/app/components/cv-laptop-loader";
import {
  CURRENT_CV_ID_KEY,
  STORAGE_KEY,
  loadCvFromAccount,
  saveCvToAccount,
} from "@/lib/cv-storage";
import type { GeneratedCv } from "@/lib/cv-types";

type EnhanceContentProps = {
  userName: string;
};

function loadCvFromSession(): GeneratedCv | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const cv = JSON.parse(stored) as GeneratedCv;
    if (cv?.content && typeof cv.content === "object") {
      return cv;
    }
    return null;
  } catch {
    return null;
  }
}

export default function EnhanceContent({ userName: _userName }: EnhanceContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cv, setCv] = useState<GeneratedCv | null>(null);
  const [cvId, setCvId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<LanguageProgress>({
    ar: "pending",
    en: "pending",
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const paramId = searchParams.get("cv");
      const storedId = sessionStorage.getItem(CURRENT_CV_ID_KEY);
      const lookupId = paramId || storedId;

      if (lookupId) {
        const accountData = await loadCvFromAccount(lookupId);
        if (!cancelled && accountData?.cv?.content) {
          setCv(accountData.cv);
          setCvId(accountData.id);
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(accountData.cv));
          sessionStorage.setItem(CURRENT_CV_ID_KEY, accountData.id);
          setLoading(false);
          return;
        }
      }

      const sessionCv = loadCvFromSession();
      if (!cancelled && sessionCv) {
        let resolvedId = lookupId;

        if (!lookupId) {
          const saved = await saveCvToAccount(sessionCv);
          if (!cancelled && saved?.id) {
            resolvedId = saved.id;
            sessionStorage.setItem(CURRENT_CV_ID_KEY, saved.id);
          }
        }

        if (!cancelled) {
          setCv(sessionCv);
          setCvId(resolvedId);
          setLoading(false);
        }
        return;
      }

      if (!cancelled) {
        setError("لم نجد سيرة محفوظة. يرجى إعادة تعبئة النموذج.");
        setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  // Auto-trigger enhancement as soon as CV is loaded
  useEffect(() => {
    if (!loading && cv && !enhancing && !error) {
      void handleEnhance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, cv]);

  const handleEnhance = async () => {
    if (!cv || enhancing) return;
    setEnhancing(true);
    setError(null);
    setProgress({ ar: "enhancing", en: "enhancing" });

    try {
      const response = await fetch("/api/enhance-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ ...cv, language: "both" }),
      });

      // Non-stream responses are validation/config errors (JSON body).
      const contentType = response.headers.get("content-type") ?? "";
      if (!response.ok || !contentType.includes("ndjson")) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error || "تعذر تحسين السيرة الذاتية.");
        setEnhancing(false);
        return;
      }

      if (!response.body) {
        setError("استجابة غير صالحة من الخادم.");
        setEnhancing(false);
        return;
      }

      // Read the live NDJSON progress stream line by line.
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let result: GeneratedCv | null = null;

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex = buffer.indexOf("\n");
        while (newlineIndex !== -1) {
          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);
          newlineIndex = buffer.indexOf("\n");
          if (!line) continue;

          try {
            const event = JSON.parse(line) as {
              type: string;
              lang?: "ar" | "en";
              stage?: LanguageStage;
              cv?: GeneratedCv;
              error?: string;
            };

            if (event.type === "progress" && event.lang && event.stage) {
              const lang = event.lang;
              const stage = event.stage;
              setProgress((prev) => ({ ...prev, [lang]: stage }));
            } else if (event.type === "result" && event.cv) {
              result = event.cv;
            } else if (event.type === "error") {
              setError(event.error || "تعذر تحسين السيرة الذاتية.");
              setEnhancing(false);
              return;
            }
          } catch {
            // Skip malformed lines
          }
        }
      }

      if (!result) {
        setError("استجابة غير صالحة من الخادم.");
        setEnhancing(false);
        return;
      }

      const enhanced: GeneratedCv = {
        ...result,
        contentEn: result.contentEn ?? cv.contentEn,
        aiEnhanced: true,
        language: "both",
      };

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(enhanced));
      await saveCvToAccount(enhanced, undefined, cvId);

      const destination = cvId ? `/preview?cv=${cvId}` : "/preview";
      router.push(destination);
    } catch {
      setError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
      setEnhancing(false);
    }
  };

  if (error) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
        <div className="flex justify-center gap-3">
          {cv && (
            <button
              type="button"
              onClick={() => {
                setError(null);
                void handleEnhance();
              }}
              className="glass-btn-primary inline-block px-6 py-3 text-sm"
            >
              إعادة المحاولة
            </button>
          )}
          <Link
            href="/create"
            className="glass-btn-secondary inline-block px-6 py-3 text-sm"
          >
            العودة لإنشاء السيرة
          </Link>
        </div>
      </div>
    );
  }

  return (
    <CvLaptopLoader
      mode="enhance"
      name={cv?.name}
      email={cv?.email}
      jobTitle={(cv?.contentEn ?? cv?.content)?.headline}
      languageProgress={progress}
    />
  );
}

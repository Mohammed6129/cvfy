"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CvLaptopLoader from "@/app/components/cv-laptop-loader";
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

    try {
      const response = await fetch("/api/enhance-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
        },
        body: JSON.stringify({ ...cv, language: "both" }),
      });

      const text = await response.text();
      let result: GeneratedCv & { error?: string };

      try {
        result = JSON.parse(text);
      } catch {
        setError("استجابة غير صالحة من الخادم.");
        setEnhancing(false);
        return;
      }

      if (!response.ok) {
        setError(result.error || "تعذر تحسين السيرة الذاتية.");
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

  return <CvLaptopLoader mode="enhance" />;
}

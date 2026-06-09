"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/app/components/loading-spinner";
import {
  CURRENT_CV_ID_KEY,
  STORAGE_KEY,
  loadCvFromAccount,
  saveCvToAccount,
} from "@/lib/cv-storage";
import type { GeneratedCv } from "@/lib/cv-types";

const BRAND = "#378ADD";

export default function EnhanceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cv, setCv] = useState<GeneratedCv | null>(null);
  const [cvId, setCvId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const paramId = searchParams.get("cv");
    void loadCvFromAccount(paramId).then((data) => {
      if (!data) {
        router.replace("/create");
        return;
      }
      setCv(data.cv);
      setCvId(data.id);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data.cv));
      sessionStorage.setItem(CURRENT_CV_ID_KEY, data.id);
      setLoading(false);
    });
  }, [router, searchParams]);

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

      const enhanced = { ...result, aiEnhanced: true, language: "both" as const };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(enhanced));
      await saveCvToAccount(enhanced, undefined, cvId);
      router.push(cvId ? `/preview?cv=${cvId}` : "/preview");
    } catch {
      setError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
      setEnhancing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="جاري التحميل..." size="lg" />;
  }

  if (enhancing) {
    return (
      <div className="animate-fade-in rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-lg">
        <div className="mx-auto mb-6 h-14 w-14 animate-spin rounded-full border-4 border-[#e8f2fc] border-t-[#378ADD]" />
        <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
          جاري تحسين سيرتك الذاتية ✨
        </h2>
        <p className="mt-2 text-slate-600">
          الذكاء الاصطناعي يجعلها متوافقة مع نظام ATS
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in mx-auto max-w-xl text-center">
      <div className="mb-8 rounded-2xl border border-[#378ADD]/15 bg-[#378ADD]/5 px-5 py-4 text-sm leading-relaxed text-slate-700">
        تم حفظ بياناتك بنجاح. الخطوة التالية: تحسين السيرة بالذكاء الاصطناعي
        لتطابق نظام ATS — وستحصل على نسختين بالعربي والإنجليزي.
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleEnhance}
        className="w-full rounded-2xl px-8 py-5 text-lg font-extrabold text-white shadow-lg shadow-[#378ADD]/30 transition-transform hover:scale-[1.02] active:scale-[0.98] sm:text-xl"
        style={{ backgroundColor: BRAND }}
      >
        حسّن السيرة الذاتية واجعلها تطابق نظام ATS ✨
      </button>

      <p className="mt-6 text-sm text-slate-500">
        <Link href="/create" className="font-semibold text-[#378ADD] hover:underline">
          تعديل البيانات
        </Link>
      </p>
    </div>
  );
}

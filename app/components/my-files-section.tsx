"use client";

import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "@/app/components/loading-spinner";
import { fetchProfileFiles, type ProfileFilesResponse } from "@/lib/cv-file-storage";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ar-SA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function openSignedUrl(url: string | null) {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}

export default function MyFilesSection() {
  const [files, setFiles] = useState<ProfileFilesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProfileFiles();
      setFiles(data);
    } catch (err) {
      setFiles(null);
      setError(err instanceof Error ? err.message : "تعذر تحميل الملفات.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const buttonClass =
    "inline-flex w-full items-center justify-center rounded-xl bg-[#378ADD] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#2a6bb8] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto";

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-1 text-lg font-extrabold text-slate-900">ملفاتي</h2>
      <p className="mb-5 text-sm text-slate-600">
        السيرة الذاتية وتقرير ATS المحفوظة في حسابك
      </p>

      {loading && <LoadingSpinner label="جاري تحميل الملفات..." />}

      {!loading && error && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </p>
      )}

      {!loading && !error && !files && (
        <p className="text-sm text-slate-600">
          لا توجد ملفات محفوظة بعد. أكمل الدفع أو استخدم الوضع التجريبي لتوليد الملفات.
        </p>
      )}

      {!loading && files && (
        <div className="space-y-4">
          {files.cv_generated_at && (
            <p className="text-xs text-slate-500">
              تاريخ التوليد: {formatDate(files.cv_generated_at)}
            </p>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => openSignedUrl(files.signedUrls.pdf)}
              disabled={!files.signedUrls.pdf}
              className={buttonClass}
            >
              تحميل السيرة PDF
            </button>
            <button
              type="button"
              onClick={() => openSignedUrl(files.signedUrls.word)}
              disabled={!files.signedUrls.word}
              className={buttonClass}
            >
              تحميل السيرة Word
            </button>
            <button
              type="button"
              onClick={() => openSignedUrl(files.signedUrls.ats)}
              disabled={!files.signedUrls.ats}
              className={buttonClass}
            >
              تحميل تقرير ATS
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

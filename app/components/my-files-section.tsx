"use client";

import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "@/app/components/loading-spinner";
import { fetchProfileFiles, type ProfileFilesResponse } from "@/lib/cv-file-storage";

type FileKind = "pdf" | "word" | "ats";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ar-SA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

const DOWNLOAD_FILENAMES: Record<FileKind, string> = {
  pdf: "CV.pdf",
  word: "CV.docx",
  ats: "ATS-Report.pdf",
};

async function downloadSignedUrl(url: string | null, filename: string) {
  if (!url) return;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("تعذر تحميل الملف.");
  }
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(blobUrl);
}

export default function MyFilesSection() {
  const [files, setFiles] = useState<ProfileFilesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<FileKind | null>(null);

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

  const handleDownload = async (kind: FileKind, url: string | null) => {
    setError(null);
    setDownloading(kind);
    try {
      await downloadSignedUrl(url, DOWNLOAD_FILENAMES[kind]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تحميل الملف.");
    } finally {
      setDownloading(null);
    }
  };

  const buttonClass =
    "glass-btn-primary inline-flex w-full items-center justify-center px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto";

  return (
    <section className="glass-page-card p-6">
      <h2 className="mb-1 text-lg font-extrabold text-white">ملفاتي</h2>
      <p className="mb-5 text-sm text-white/70">
        السيرة الذاتية وتقرير ATS المحفوظة في حسابك
      </p>

      {loading && <LoadingSpinner label="جاري تحميل الملفات..." />}

      {!loading && error && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </p>
      )}

      {!loading && !error && !files && (
        <p className="text-sm text-white/70">
          لا توجد ملفات محفوظة بعد. أكمل الدفع أو استخدم الوضع التجريبي لتوليد الملفات.
        </p>
      )}

      {!loading && files && (
        <div className="space-y-4">
          {files.cv_generated_at && (
            <p className="text-xs text-white/55">
              تاريخ التوليد: {formatDate(files.cv_generated_at)}
            </p>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => void handleDownload("pdf", files.signedUrls.pdf)}
              disabled={!files.signedUrls.pdf || downloading !== null}
              className={buttonClass}
            >
              {downloading === "pdf" ? "جاري التحميل..." : "تحميل السيرة PDF"}
            </button>
            <button
              type="button"
              onClick={() => void handleDownload("word", files.signedUrls.word)}
              disabled={!files.signedUrls.word || downloading !== null}
              className={buttonClass}
            >
              {downloading === "word" ? "جاري التحميل..." : "تحميل السيرة Word"}
            </button>
            <button
              type="button"
              onClick={() => void handleDownload("ats", files.signedUrls.ats)}
              disabled={!files.signedUrls.ats || downloading !== null}
              className={buttonClass}
            >
              {downloading === "ats" ? "جاري التحميل..." : "تحميل تقرير ATS"}
            </button>
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

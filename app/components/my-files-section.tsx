"use client";

import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "@/app/components/loading-spinner";
import { fetchProfileFiles, type ProfileFilesResponse } from "@/lib/cv-file-storage";

type FileKind = "pdfAr" | "pdfEn" | "wordAr" | "wordEn" | "ats";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ar-SA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

const FILE_LABELS: Record<FileKind, string> = {
  pdfAr: "السيرة بالعربية PDF",
  pdfEn: "CV in English PDF",
  wordAr: "السيرة بالعربية Word",
  wordEn: "CV in English Word",
  ats: "تقرير ATS",
};

const DOWNLOAD_FILENAMES: Record<FileKind, string> = {
  pdfAr: "CV-AR.pdf",
  pdfEn: "CV-EN.pdf",
  wordAr: "CV-AR.doc",
  wordEn: "CV-EN.doc",
  ats: "ATS-Report.pdf",
};

const FILE_KINDS: FileKind[] = ["pdfAr", "pdfEn", "wordAr", "wordEn", "ats"];

export default function MyFilesSection() {
  const [files, setFiles] = useState<ProfileFilesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Blob object URLs prepared up front so every button is a plain
  // <a download> anchor — the tap downloads instantly inside the user
  // gesture, which is what keeps mobile browsers from opening a tab.
  const [blobUrls, setBlobUrls] = useState<Partial<Record<FileKind, string>>>({});

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

  useEffect(() => {
    if (!files) return;
    let cancelled = false;
    const created: string[] = [];

    const prefetch = async () => {
      const entries = await Promise.all(
        FILE_KINDS.map(async (kind) => {
          const signed = files.signedUrls[kind];
          if (!signed) return [kind, undefined] as const;
          try {
            const response = await fetch(signed);
            if (!response.ok) return [kind, undefined] as const;
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            created.push(url);
            return [kind, url] as const;
          } catch {
            return [kind, undefined] as const;
          }
        })
      );

      if (cancelled) return;
      setBlobUrls(Object.fromEntries(entries));
    };

    void prefetch();

    return () => {
      cancelled = true;
      created.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const buttonClass =
    "glass-btn-primary inline-flex w-full items-center justify-center px-4 py-3 text-sm sm:w-auto";
  const disabledClass =
    "glass-btn-primary inline-flex w-full cursor-not-allowed items-center justify-center px-4 py-3 text-sm opacity-50 sm:w-auto";

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
            {FILE_KINDS.map((kind) => {
              const available = Boolean(files.signedUrls[kind]);
              const blobUrl = blobUrls[kind];

              if (!available) {
                return (
                  <span key={kind} className={disabledClass}>
                    {FILE_LABELS[kind]}
                  </span>
                );
              }

              if (!blobUrl) {
                return (
                  <span key={kind} className={disabledClass}>
                    <span
                      className="ml-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"
                      aria-hidden
                    />
                    {FILE_LABELS[kind]}
                  </span>
                );
              }

              return (
                <a
                  key={kind}
                  href={blobUrl}
                  download={DOWNLOAD_FILENAMES[kind]}
                  className={buttonClass}
                >
                  ⬇ {FILE_LABELS[kind]}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

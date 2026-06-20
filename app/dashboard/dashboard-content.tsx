"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "@/app/components/loading-spinner";
import {
  CURRENT_CV_ID_KEY,
  STORAGE_KEY,
  deleteCvFromAccount,
  listCvsFromAccount,
} from "@/lib/cv-storage";
import type { CvRecord } from "@/lib/cv-types";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ar-SA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function DashboardContent() {
  const router = useRouter();
  const [cvs, setCvs] = useState<CvRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const data = await listCvsFromAccount();
    setCvs(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCv = (id: string, cv: CvRecord["generatedCv"]) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cv));
    sessionStorage.setItem(CURRENT_CV_ID_KEY, id);
    router.push(`/preview?cv=${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه السيرة الذاتية؟")) return;
    setDeletingId(id);
    const ok = await deleteCvFromAccount(id);
    setDeletingId(null);
    if (ok) {
      setCvs((prev) => prev.filter((c) => c.id !== id));
    } else {
      setError("تعذر حذف السيرة الذاتية.");
    }
  };

  if (loading) {
    return <LoadingSpinner label="جاري تحميل سيرك الذاتية..." />;
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
            سيري الذاتية
          </h1>
          <p className="mt-1 text-sm text-white/70">
            عرض وتعديل وإعادة إنشاء سيرك الذاتية المحفوظة
          </p>
        </div>
        <Link
          href="/create"
          className="glass-btn-primary px-6 py-3 text-sm shadow-[0_4px_16px_rgba(255,255,255,0.15)]"
        >
          + إنشاء سيرة جديدة
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {cvs.length === 0 ? (
        <div className="glass-page-card-sm border-dashed p-10 text-center">
          <p className="mb-4 text-white/70">لم تنشئ أي سيرة ذاتية بعد.</p>
          <Link href="/create" className="glass-btn-primary px-6 py-3 text-sm">
            ابدأ الآن
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {cvs.map((record) => (
            <article
              key={record.id}
              className="glass-page-card p-5 transition-all hover:border-white/30"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold text-white">
                    {record.generatedCv.name}
                  </h2>
                  <p className="text-sm text-white/60">{record.title}</p>
                </div>
                {record.isPaid && (
                  <span className="shrink-0 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    مدفوعة
                  </span>
                )}
              </div>

              <p className="mb-4 text-xs text-white/55">
                آخر تحديث: {formatDate(record.updatedAt)}
              </p>

              {record.isPaid && record.atsResult && (
                <p className="mb-4 text-sm">
                  <span className="font-semibold text-[#FAC775]">
                    {record.atsResult.score}%
                  </span>
                  <span className="text-white/70"> توافق ATS</span>
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openCv(record.id, record.generatedCv)}
                  className="glass-btn-primary rounded-lg px-4 py-2 text-xs"
                >
                  معاينة
                </button>
                <Link
                  href={`/create?edit=${record.id}`}
                  className="glass-btn-secondary rounded-lg px-4 py-2 text-xs"
                >
                  تعديل
                </Link>
                <Link
                  href={`/create?edit=${record.id}&regenerate=1`}
                  className="rounded-lg border border-white/25 px-4 py-2 text-xs font-semibold text-white/85 hover:bg-white/10"
                >
                  إعادة إنشاء
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(record.id)}
                  disabled={deletingId === record.id}
                  className="rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {deletingId === record.id ? "جاري الحذف..." : "حذف"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

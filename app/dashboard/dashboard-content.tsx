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
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            سيري الذاتية
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            عرض وتعديل وإعادة إنشاء سيرك الذاتية المحفوظة
          </p>
        </div>
        <Link
          href="/create"
          className="inline-flex items-center justify-center rounded-full bg-[#378ADD] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#378ADD]/25 transition-colors hover:bg-[#2a6bb8]"
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
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="mb-4 text-slate-600">لم تنشئ أي سيرة ذاتية بعد.</p>
          <Link
            href="/create"
            className="inline-flex rounded-full bg-[#378ADD] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2a6bb8]"
          >
            ابدأ الآن
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {cvs.map((record) => (
            <article
              key={record.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold text-slate-900">
                    {record.generatedCv.name}
                  </h2>
                  <p className="text-sm text-slate-500">{record.title}</p>
                </div>
                {record.isPaid && (
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    مدفوعة
                  </span>
                )}
              </div>

              <p className="mb-4 text-xs text-slate-500">
                آخر تحديث: {formatDate(record.updatedAt)}
              </p>

              {record.atsResult && (
                <p className="mb-4 text-sm">
                  <span className="font-semibold text-[#378ADD]">
                    {record.atsResult.score}%
                  </span>
                  <span className="text-slate-600"> توافق ATS</span>
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openCv(record.id, record.generatedCv)}
                  className="rounded-lg bg-[#378ADD] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2a6bb8]"
                >
                  معاينة
                </button>
                <Link
                  href={`/create?edit=${record.id}`}
                  className="rounded-lg border border-[#378ADD] px-4 py-2 text-xs font-semibold text-[#378ADD] hover:bg-[#e8f2fc]"
                >
                  تعديل
                </Link>
                <Link
                  href={`/create?edit=${record.id}&regenerate=1`}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
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

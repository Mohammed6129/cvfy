"use client";

import { useRef, useState } from "react";
import type { CvFormData } from "@/lib/cv-types";

type PartialFormData = Partial<CvFormData>;

type CvUploadProps = {
  onParsed: (formData: PartialFormData) => void;
  onError: (message: string | null) => void;
};

async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".txt")) {
    return (await file.text()).trim();
  }

  const form = new FormData();
  form.append("file", file);

  if (name.endsWith(".pdf")) {
    const res = await fetch("/api/parse-pdf", { method: "POST", body: form });
    const json = (await res.json()) as { text?: string; error?: string };

    if (!res.ok) {
      throw new Error(json.error || "فشل استخراج نص PDF");
    }

    return json.text?.trim() ?? "";
  }

  if (name.endsWith(".docx")) {
    const res = await fetch("/api/parse-cv?extract=true", {
      method: "POST",
      body: form,
    });
    const json = (await res.json()) as { text?: string; error?: string };

    if (!res.ok) {
      throw new Error(json.error || "فشل استخراج نص Word");
    }

    return json.text?.trim() ?? "";
  }

  if (name.endsWith(".doc")) {
    throw new Error("ملفات .doc القديمة غير مدعومة. حوّل الملف إلى DOCX أو PDF.");
  }

  throw new Error("نوع الملف غير مدعوم. استخدم PDF أو Word.");
}

export default function CvUpload({ onParsed, onError }: CvUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    onError(null);

    try {
      const text = await extractTextFromFile(file);

      if (!text) {
        throw new Error("لم نتمكن من استخراج نص من الملف.");
      }

      console.log("[cv-upload] Extracted text length:", text.length);

      const res = await fetch("/api/parse-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const json = (await res.json()) as {
        formData?: PartialFormData;
        error?: string;
      };

      if (!res.ok) {
        throw new Error(json.error || "فشل تحليل الملف");
      }

      if (json.formData) {
        onParsed(json.formData);
      }
    } catch (error) {
      console.error("[cv-upload] Upload failed:", error);
      onError(
        error instanceof Error ? error.message : "تعذر قراءة الملف"
      );
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="mb-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4 sm:p-5">
      <p className="mb-3 text-sm font-bold text-slate-800">
        عندك سيرة قديمة؟ ارفعها هنا
      </p>
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleUpload(file);
        }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
        className="rounded-xl border-2 border-[#378ADD]/30 bg-white px-5 py-2.5 text-sm font-semibold text-[#378ADD] hover:bg-[#e8f2fc] disabled:opacity-60"
      >
        {uploading ? "جاري الاستخراج..." : "رفع سيرة (PDF أو Word)"}
      </button>
    </div>
  );
}

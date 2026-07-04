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
    <div className="mb-8 flex flex-col items-center gap-2.5 rounded-2xl border border-dashed border-white/25 bg-white/10 p-6 text-center transition-colors hover:border-[#6FB6FF]/60 hover:bg-white/[0.09] sm:p-7">
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden>
        <rect x="14" y="8" width="34" height="46" rx="4" fill="#2C5590" stroke="#6FB6FF" strokeWidth="1.5"/>
        <line x1="20" y1="18" x2="42" y2="18" stroke="#8FC4FF" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="20" y1="24" x2="42" y2="24" stroke="#8FC4FF" strokeWidth="1.4" strokeLinecap="round" opacity="0.7"/>
        <line x1="20" y1="30" x2="34" y2="30" stroke="#8FC4FF" strokeWidth="1.4" strokeLinecap="round" opacity="0.7"/>
        <circle cx="52" cy="46" r="16" fill="#FAC775"/>
        <path d="M45 46l5 5 9-10" stroke="#142c54" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

      <p className="text-sm font-bold text-white">عندك سيرة قديمة؟</p>
      <p className="text-xs text-white/55">ارفعها وخلّي الذكاء الاصطناعي يعبّي بياناتك تلقائياً</p>

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
      <div className="mt-1 flex items-center justify-center gap-3">
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 rounded-[11px] border border-[#E0EDF8] bg-white px-5 py-2.5 text-sm font-semibold text-[#378ADD] transition-colors hover:bg-[#f4f8ff] disabled:opacity-60"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M10 3v10M10 3l-3.5 3.5M10 3l3.5 3.5" stroke="#378ADD" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 14v1.5A1.5 1.5 0 0 0 5.5 17h9a1.5 1.5 0 0 0 1.5-1.5V14" stroke="#378ADD" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          {uploading ? "جاري الاستخراج..." : "اختر ملف"}
        </button>
        <span className="text-[10px] text-white/35">PDF · Word</span>
      </div>
    </div>
  );
}

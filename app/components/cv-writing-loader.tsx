"use client";

import { useEffect, useState } from "react";

type CvWritingLoaderProps = {
  mode: "generate" | "enhance";
};

const ENHANCE_MESSAGES = [
  "جاري تحليل خبراتك...",
  "جاري صياغة الإنجازات باحترافية...",
  "جاري مطابقة كلمات نظام ATS...",
  "اللمسات الأخيرة...",
];

const GENERATE_LINES = [
  { delay: 0, text: "John Smith", className: "text-base font-bold" },
  { delay: 400, text: "Marketing Manager", className: "text-sm font-semibold text-[#378ADD]" },
  { delay: 800, text: "john.smith@email.com · +966 5XX XXX XXX", className: "text-xs text-slate-500" },
  { delay: 1200, text: "PROFESSIONAL SUMMARY", className: "text-xs font-bold tracking-wide" },
  { delay: 1500, text: "Results-driven marketing professional with 5+ years...", className: "text-xs text-slate-600" },
  { delay: 1900, text: "WORK EXPERIENCE", className: "text-xs font-bold tracking-wide" },
  { delay: 2200, text: "Senior Marketing Specialist — ABC Corp", className: "text-xs font-semibold" },
  { delay: 2500, text: "• Led digital campaigns increasing ROI by 40%", className: "text-xs text-slate-600" },
  { delay: 2800, text: "• Managed cross-functional teams of 8 members", className: "text-xs text-slate-600" },
];

const ENHANCE_LINES = [
  ...GENERATE_LINES,
  { delay: 3100, text: "SKILLS", className: "text-xs font-bold tracking-wide" },
  { delay: 3400, text: "Digital Marketing • SEO • Analytics • Leadership", className: "text-xs text-slate-600" },
  { delay: 3700, text: "EDUCATION", className: "text-xs font-bold tracking-wide" },
  { delay: 4000, text: "B.A. Business Administration — University", className: "text-xs text-slate-600" },
];

export default function CvWritingLoader({ mode }: CvWritingLoaderProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const lines = mode === "enhance" ? ENHANCE_LINES : GENERATE_LINES;
  const title =
    mode === "enhance"
      ? ENHANCE_MESSAGES[messageIndex]
      : "جاري إنشاء سيرتك الذاتية...";

  useEffect(() => {
    setVisibleCount(0);
    const lineList = mode === "enhance" ? ENHANCE_LINES : GENERATE_LINES;
    const timers = lineList.map((line, index) =>
      window.setTimeout(() => setVisibleCount(index + 1), line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [mode]);

  useEffect(() => {
    if (mode !== "enhance") return;
    const interval = window.setInterval(() => {
      setMessageIndex((i) => (i + 1) % ENHANCE_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [mode]);

  return (
    <div
      className="animate-fade-in mx-auto max-w-lg rounded-2xl border border-slate-100 bg-white px-6 py-8 text-center shadow-lg sm:px-10 sm:py-10"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto mb-6 w-full max-w-xs sm:max-w-sm">
        <div className="cv-writing-paper relative mx-auto aspect-[3/4] w-full max-w-[220px] rounded-lg border-2 border-[#378ADD]/30 bg-white p-4 shadow-lg shadow-[#378ADD]/10 sm:max-w-[260px] sm:p-5">
          <div className="absolute inset-x-3 top-3 h-1 rounded bg-[#378ADD]/15" />
          <div className="mt-4 space-y-2 text-left" dir="ltr">
            {lines.map((line, index) => (
              <p
                key={`${line.text}-${index}`}
                className={`cv-writing-line ${line.className} ${
                  index < visibleCount ? "cv-writing-line-visible" : ""
                }`}
              >
                {line.text}
              </p>
            ))}
          </div>
        </div>
      </div>

      <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
        {title}
        {mode === "generate" && (
          <span className="cv-gen-dots" aria-hidden="true">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        )}
      </h2>

      {mode === "enhance" && (
        <p className="mt-2 text-sm text-slate-500">عادةً يستغرق 30 ثانية</p>
      )}
    </div>
  );
}

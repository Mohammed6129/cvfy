"use client";

import { useEffect, useState } from "react";

export type LanguageStage =
  | "pending"
  | "enhancing"
  | "checking"
  | "retrying"
  | "template"
  | "passed";

export type LanguageProgress = {
  ar: LanguageStage;
  en: LanguageStage;
};

type CvLaptopLoaderProps = {
  mode: "generate" | "enhance";
  name?: string;
  email?: string;
  jobTitle?: string;
  languageProgress?: LanguageProgress;
};

const SUBTITLES = {
  generate: "فريقنا يبني سيرتك الذاتية الآن...",
  enhance: "نصقل إنجازاتك ونجعلها تتحدث عنك...",
};

const FALLBACK_LINES = [
  "John Smith",
  "Marketing Manager",
  "john.smith@email.com",
  "PROFESSIONAL SUMMARY",
  "Results-driven professional with 5+ years...",
  "Senior Specialist — ABC Corp",
];

function buildLines(mode: "generate" | "enhance", name?: string, email?: string, jobTitle?: string) {
  const generateLines = name || email || jobTitle
    ? [
        name || FALLBACK_LINES[0],
        jobTitle || FALLBACK_LINES[1],
        email || FALLBACK_LINES[2],
        "PROFESSIONAL SUMMARY",
        "Results-driven professional with 5+ years...",
        `Senior ${jobTitle || "Specialist"}`,
      ]
    : FALLBACK_LINES;

  return mode === "enhance"
    ? [...generateLines, "SKILLS: Marketing • SEO • Analytics", "B.A. Business Administration"]
    : generateLines;
}

export default function CvLaptopLoader({ mode, name, email, jobTitle, languageProgress }: CvLaptopLoaderProps) {
  const lines = buildLines(mode, name, email, jobTitle);
  const subtitle = SUBTITLES[mode];

  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [completedLines, setCompletedLines] = useState<string[]>([]);

  useEffect(() => {
    setLineIndex(0);
    setCharIndex(0);
    setCompletedLines([]);
  }, [mode]);

  useEffect(() => {
    const currentLine = lines[lineIndex] ?? "";

    if (charIndex < currentLine.length) {
      const timer = window.setTimeout(() => setCharIndex((c) => c + 1), 38);
      return () => clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setCompletedLines((prev) => [...prev, currentLine]);
      const nextIndex = lineIndex + 1;

      if (nextIndex >= lines.length) {
        setCompletedLines([]);
        setLineIndex(0);
        setCharIndex(0);
        return;
      }

      setLineIndex(nextIndex);
      setCharIndex(0);
    }, 320);

    return () => clearTimeout(timer);
  }, [charIndex, lineIndex, lines]);

  const activeLine = lines[lineIndex] ?? "";
  const typingText = activeLine.slice(0, charIndex);

  return (
    <div
      className="glass-page-card animate-fade-in mx-auto max-w-md px-6 py-8 text-center sm:px-8 sm:py-10"
      role="status"
      aria-live="polite"
      aria-label={subtitle}
    >
      <div className="laptop-loader mx-auto mb-6 w-full max-w-[280px]">
        <svg
          viewBox="0 0 280 200"
          className="mx-auto h-auto w-full"
          aria-hidden
        >
          <defs>
            <filter id="laptop-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect
            x="48"
            y="148"
            width="184"
            height="14"
            rx="3"
            fill="#e2e8f0"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          <rect
            x="56"
            y="160"
            width="168"
            height="28"
            rx="6"
            fill="#f1f5f9"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          <rect x="72" y="170" width="18" height="8" rx="1.5" fill="#cbd5e1" opacity="0.7" />
          <rect x="96" y="170" width="18" height="8" rx="1.5" fill="#cbd5e1" opacity="0.7" />
          <rect x="120" y="170" width="18" height="8" rx="1.5" fill="#cbd5e1" opacity="0.7" />
          <rect x="144" y="170" width="18" height="8" rx="1.5" fill="#cbd5e1" opacity="0.7" />
          <rect x="168" y="170" width="18" height="8" rx="1.5" fill="#cbd5e1" opacity="0.7" />
          <rect x="192" y="170" width="18" height="8" rx="1.5" fill="#cbd5e1" opacity="0.7" />

          <rect
            x="40"
            y="142"
            width="200"
            height="6"
            rx="2"
            fill="#94a3b8"
          />

          <g className="laptop-lid">
            <rect
              x="52"
              y="24"
              width="176"
              height="118"
              rx="8"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="2"
            />
            <rect
              x="56"
              y="32"
              width="168"
              height="102"
              rx="4"
              className="laptop-screen-glow"
              fill="#0f172a"
              stroke="#378ADD"
              strokeWidth="2"
              filter="url(#laptop-glow)"
            />
          </g>
        </svg>

        <div
          className="laptop-screen-content"
          dir="ltr"
          aria-hidden
        >
          {completedLines.map((line) => (
            <p key={`done-${line}`} className="laptop-screen-line">
              {line}
            </p>
          ))}
          {typingText && (
            <p className="laptop-screen-line laptop-screen-line-active">
              {typingText}
              <span className="laptop-typing-cursor" />
            </p>
          )}
          {!typingText && completedLines.length === 0 && (
            <p className="laptop-screen-line laptop-screen-line-active">
              <span className="laptop-typing-cursor" />
            </p>
          )}
        </div>
      </div>

      <p className="mb-4 text-base font-semibold text-white sm:text-lg">{subtitle}</p>

      <div className="h-2 overflow-hidden rounded-full bg-white/15">
        <div
          className="progress-shimmer relative h-full w-[55%] rounded-full"
          style={{
            background: "linear-gradient(90deg, #FAC775, #F5D89A)",
            boxShadow: "0 0 10px 2px rgba(250,199,117,0.5)",
          }}
        />
      </div>

      {mode === "enhance" && languageProgress && (
        <LiveLanguageProgress progress={languageProgress} />
      )}
    </div>
  );
}

// Live per-language pipeline status driven by real server events —
// each language row reflects its own actual stage, including retries.
const STAGE_LABELS: Record<"ar" | "en", Record<LanguageStage, string>> = {
  ar: {
    pending: "في الانتظار...",
    enhancing: "جاري صياغة السيرة العربية...",
    checking: "جاري فحص توافق ATS...",
    retrying: "جاري تحسين إضافي (محاولة ثانية)...",
    template: "السيرة العربية جاهزة",
    passed: "السيرة العربية جاهزة",
  },
  en: {
    pending: "في الانتظار...",
    enhancing: "جاري صياغة السيرة الإنجليزية...",
    checking: "جاري فحص توافق ATS...",
    retrying: "جاري تحسين إضافي (محاولة ثانية)...",
    template: "السيرة الإنجليزية جاهزة",
    passed: "السيرة الإنجليزية جاهزة",
  },
};

const DONE_STAGES: LanguageStage[] = ["template", "passed"];

function LanguageProgressRow({
  title,
  stage,
}: {
  title: string;
  stage: LanguageStage;
}) {
  const done = DONE_STAGES.includes(stage);
  const active = !done && stage !== "pending";

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-xs transition-all duration-300 ${
        done
          ? "bg-[#378ADD]/10"
          : active
          ? "bg-[#FAC775]/10"
          : "bg-white/[0.04]"
      }`}
    >
      <span className="flex items-center gap-2">
        {done ? (
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#378ADD] text-[10px] text-white">
            ✓
          </span>
        ) : active ? (
          <span
            className="h-[16px] w-[16px] animate-spin rounded-full border-2 border-[#FAC775] border-t-transparent"
            aria-hidden
          />
        ) : (
          <span className="h-[16px] w-[16px] rounded-full border-2 border-white/25" aria-hidden />
        )}
        <span className={`font-bold ${done ? "text-white/85" : active ? "text-[#FAC775]" : "text-white/40"}`}>
          {title}
        </span>
      </span>
      <span className={done ? "text-white/60" : active ? "text-[#FAC775]/90" : "text-white/35"}>
        {done ? "✓ جاهزة" : null}
      </span>
    </div>
  );
}

function LiveLanguageProgress({ progress }: { progress: LanguageProgress }) {
  return (
    <div className="mt-5 space-y-2 text-right" dir="rtl">
      <LanguageProgressRow
        title={STAGE_LABELS.ar[progress.ar]}
        stage={progress.ar}
      />
      <LanguageProgressRow
        title={STAGE_LABELS.en[progress.en]}
        stage={progress.en}
      />
    </div>
  );
}

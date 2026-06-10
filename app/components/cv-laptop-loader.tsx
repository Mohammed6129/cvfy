"use client";

import { useEffect, useState } from "react";

type CvLaptopLoaderProps = {
  mode: "generate" | "enhance";
};

const SUBTITLES = {
  generate: "فريقنا يبني سيرتك الآن...",
  enhance: "نصقل إنجازاتك ونجعلها تتحدث عنك...",
};

const GENERATE_LINES = [
  "John Smith",
  "Marketing Manager",
  "john.smith@email.com",
  "PROFESSIONAL SUMMARY",
  "Results-driven professional with 5+ years...",
  "Senior Specialist — ABC Corp",
];

const ENHANCE_LINES = [
  ...GENERATE_LINES,
  "SKILLS: Marketing • SEO • Analytics",
  "B.A. Business Administration",
];

export default function CvLaptopLoader({ mode }: CvLaptopLoaderProps) {
  const lines = mode === "enhance" ? ENHANCE_LINES : GENERATE_LINES;
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
      className="animate-fade-in mx-auto max-w-md rounded-2xl border border-slate-100 bg-white px-6 py-8 text-center shadow-lg sm:px-8 sm:py-10"
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
              x="60"
              y="32"
              width="160"
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

      <p className="text-base font-semibold text-slate-700 sm:text-lg">{subtitle}</p>
    </div>
  );
}

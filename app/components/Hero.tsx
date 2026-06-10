"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SINGLE_PLAN } from "@/lib/payment";
import HeroCvCard from "./hero-cv-card";

function formatCount(n: number) {
  return `${n.toLocaleString("en-US")}+`;
}

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 2.5L12.09 7.73L17.82 8.45L13.41 12.27L14.18 18L10 15.27L5.82 18L6.59 12.27L2.18 8.45L7.91 7.73L10 2.5Z"
        fill="#378ADD"
      />
    </svg>
  );
}

function LinesIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <line x1="2" y1="3" x2="10" y2="3" stroke="#3B6D11" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="2" y1="6" x2="8" y2="6" stroke="#3B6D11" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="2" y1="9" x2="10" y2="9" stroke="#3B6D11" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PaperIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <rect x="2.5" y="1.5" width="7" height="9" rx="1" stroke="#BA7517" strokeWidth="1.2" />
      <line x1="4.5" y1="4" x2="7.5" y2="4" stroke="#BA7517" strokeWidth="1" strokeLinecap="round" />
      <line x1="4.5" y1="6" x2="7" y2="6" stroke="#BA7517" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="4.5" stroke="#534AB7" strokeWidth="1.2" />
      <path
        d="M3.5 6L5.2 7.7L8.5 4.5"
        stroke="#534AB7"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const PRICE_FEATURES = [
  {
    bg: "#EAF3DE",
    icon: <LinesIcon />,
    label: "نسختان عربي وإنجليزي",
  },
  {
    bg: "#FAEEDA",
    icon: <PaperIcon />,
    label: "PDF و Word",
  },
  {
    bg: "#EEEDFE",
    icon: <CheckCircleIcon />,
    label: "تقرير ATS",
  },
];

function HeroPriceCard() {
  return (
    <div className="relative w-full overflow-hidden rounded-[20px] border border-[#E6F1FB] bg-white p-5">
      <div
        className="pointer-events-none absolute -left-5 -top-5 h-[100px] w-[100px] rounded-full bg-[#E6F1FB] opacity-60"
        aria-hidden
      />

      <div className="relative flex items-start justify-between">
        <div className="text-right">
          <div className="flex items-baseline gap-1">
            <span
              className="leading-none text-[#0C447C]"
              style={{ fontSize: "38px", fontWeight: 800 }}
            >
              {SINGLE_PLAN.price}
            </span>
            <span className="text-sm font-semibold text-[#378ADD]">ر.س</span>
          </div>
          <p className="mt-0.5 text-[10px] text-[#888]">دفعة واحدة — بدون اشتراك</p>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg bg-[#E6F1FB] px-2 py-1.5">
          <StarIcon />
          <div className="flex flex-col leading-tight">
            <span className="text-[8px] font-bold text-[#185FA5]">AI</span>
            <span className="text-[8px] font-bold text-[#185FA5]">مدعوم</span>
          </div>
        </div>
      </div>

      <div className="my-3 h-px bg-[#F0F7FF]" />

      <ul className="relative space-y-2">
        {PRICE_FEATURES.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-[11px] text-[#333]">
            <span
              className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[7px]"
              style={{ backgroundColor: item.bg }}
            >
              {item.icon}
            </span>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Hero() {
  const [counter, setCounter] = useState(4237);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (Math.random() < 0.55) {
        setCounter((c) => c + 1);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      dir="rtl"
      className="bg-[linear-gradient(160deg,#F4F9FF_0%,#fff_60%)]"
    >
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-10 px-6 pb-12 pt-16 md:grid-cols-2 md:px-12 md:pb-12 md:pt-16">
        {/* العمود الأيمن — النص */}
        <div className="text-right">
          <span className="mb-4 inline-flex rounded-full bg-[#E6F1FB] px-3.5 py-1 text-xs font-semibold text-[#378ADD]">
            متوافق مع أنظمة ATS
          </span>

          <h1
            className="mb-4 leading-tight text-[#0C447C]"
            style={{ fontSize: "36px", fontWeight: 800 }}
          >
            سيرة تليق بطموحك —
            <span className="block text-[#378ADD]">نبنيها لك في دقائق</span>
          </h1>

          <p className="mb-6 max-w-lg text-sm leading-relaxed text-[#555]">
            في دقائق تحصل على سيرة احترافية بالعربي والإنجليزي، محسّنة بالذكاء
            الاصطناعي وجاهزة لسوق العمل السعودي.
          </p>

          <Link
            href="/login?next=/create"
            className="mb-6 inline-flex items-center gap-2 rounded-[10px] bg-[#378ADD] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#2a6bb8]"
            style={{ padding: "14px 28px" }}
          >
            ابدأ الآن ←
          </Link>

          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#555]">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C55E] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22C55E]" />
            </span>
            <span id="cnt" className="font-bold text-[#0C447C] tabular-nums">
              {formatCount(counter)}
            </span>
            <span>سيرة ذاتية أنجزناها — والعدد يكبر كل يوم</span>
          </div>

          <div>
            <p className="text-xl font-bold text-[#378ADD]">48%</p>
            <p className="text-[10px] text-[#555]">أكثر حظاً في الحصول على مقابلة</p>
          </div>
        </div>

        {/* العمود الأيسر — السعر + السيرة */}
        <div className="relative mx-auto flex w-full max-w-[340px] flex-col gap-3 md:mx-0 md:justify-self-end">
          <div
            className="pointer-events-none absolute -left-6 top-1/2 z-0 h-56 w-56 -translate-y-1/2 rounded-full bg-[#EEF5FC]"
            aria-hidden
          />

          <div className="relative z-10">
            <HeroPriceCard />
          </div>

          <div className="relative z-10">
            <div className="absolute -right-2 -top-2 z-20 rounded-full bg-[#E6F1FB] px-2.5 py-1 text-[10px] font-bold text-[#378ADD] shadow-sm">
              تحسين AI
            </div>
            <div className="absolute -bottom-2 -left-2 z-20 rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[10px] font-bold text-[#16A34A] shadow-sm">
              ATS Score: 94%
            </div>
            <HeroCvCard />
          </div>
        </div>
      </div>
    </section>
  );
}

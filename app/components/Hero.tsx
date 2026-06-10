"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SINGLE_PLAN } from "@/lib/payment";
import HeroCvCard from "./hero-cv-card";

function formatCount(n: number) {
  return `${n.toLocaleString("en-US")}+`;
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
            سيرتك تفتح الأبواب —
            <span className="block text-[#378ADD]">نحن نبنيها لك</span>
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

          <div className="flex items-center gap-4">
            <div>
              <p className="text-xl font-bold text-[#378ADD]">48%</p>
              <p className="text-[10px] text-[#555]">أكثر حظاً في الحصول على مقابلة</p>
            </div>
            <div className="h-8 w-px shrink-0 bg-[#D8EAF8]" aria-hidden />
            <div>
              <p className="text-xl font-bold text-[#D97706]">{SINGLE_PLAN.price} ر.س</p>
              <p className="text-[10px] text-[#555]">نسختان + ATS + Word و PDF</p>
            </div>
          </div>
        </div>

        {/* العمود الأيسر — السيرة */}
        <div className="relative mx-auto w-full max-w-[340px] md:mx-0 md:justify-self-end">
          <div
            className="pointer-events-none absolute -left-6 top-1/2 z-0 h-56 w-56 -translate-y-1/2 rounded-full bg-[#EEF5FC]"
            aria-hidden
          />

          <div className="absolute -left-2 top-0 z-20 rounded-lg bg-[#0C447C] px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
            {SINGLE_PLAN.price} ر.س — دفعة واحدة
          </div>
          <div className="absolute -right-2 -top-2 z-20 rounded-full bg-[#E6F1FB] px-2.5 py-1 text-[10px] font-bold text-[#378ADD] shadow-sm">
            تحسين AI
          </div>
          <div className="absolute -bottom-2 -left-2 z-20 rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[10px] font-bold text-[#16A34A] shadow-sm">
            ATS Score: 94%
          </div>

          <div className="relative z-10">
            <HeroCvCard />
          </div>
        </div>
      </div>
    </section>
  );
}

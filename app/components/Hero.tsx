"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SINGLE_PLAN } from "@/lib/payment";

const PRICE_ITEMS = ["نسختان", "PDF و Word", "تقرير ATS"];
const SKILLS = ["React", "Node.js", "Python", "AWS"];

function formatCount(n: number) {
  return `${n.toLocaleString("en-US")}+`;
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M6 1.2L7.545 4.38L11.1 4.86L8.55 7.26L9.09 10.8L6 9.12L2.91 10.8L3.45 7.26L0.9 4.86L4.455 4.38L6 1.2Z"
        fill="#378ADD"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="4.5" stroke="#F59E0B" strokeWidth="1.2" />
      <path d="M6 3.5V6L7.8 7.2" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircleDark() {
  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0C447C]">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
        <path
          d="M2 5L4.2 7.2L8 3.2"
          stroke="white"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function GreenCheckIcon() {
  return (
    <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#22C55E]">
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
        <path
          d="M1.5 4L3 5.5L6.5 2"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function MailIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
      <rect x="0.5" y="1.5" width="7" height="5" rx="0.5" stroke="#85B7EB" strokeWidth="0.8" />
      <path d="M0.5 2L4 4.5L7.5 2" stroke="#85B7EB" strokeWidth="0.8" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
      <circle cx="4" cy="2.5" r="1.5" stroke="#85B7EB" strokeWidth="0.8" />
      <path d="M1 7c0-1.7 1.3-3 3-3s3 1.3 3 3" stroke="#85B7EB" strokeWidth="0.8" />
    </svg>
  );
}

function CvBar({ width }: { width: string }) {
  return <div className={`h-1 rounded-full bg-[#CBD5E1] ${width}`} />;
}

export default function Hero() {
  const [counter, setCounter] = useState(4215);

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
      className="bg-gradient-to-b from-[#F0F7FF] to-white"
      style={{ padding: "36px 32px 32px" }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-7 lg:grid-cols-2">
        {/* العمود الأيمن — النص */}
        <div className="text-right">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-[50px] border border-[#B5D4F4] bg-[#E6F1FB] px-3.5 py-1 text-[12px] font-medium text-[#185FA5]">
            <StarIcon />
            متوافق مع أنظمة ATS
          </span>

          <div className="mb-4 inline-flex w-full max-w-sm flex-col rounded-[10px] border border-[#D8EAF8] bg-white px-3 py-2 text-right">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C55E] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22C55E]" />
              </span>
              <span id="cnt" className="text-[18px] font-bold text-[#0C447C] tabular-nums">
                {formatCount(counter)}
              </span>
              <span className="text-xs font-semibold text-[#378ADD]">سيرة ذاتية أنجزناها</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#64748b]">
              <ClockIcon />
              <span>والعدد يكبر كل يوم</span>
            </div>
          </div>

          <h1
            className="mb-2.5 leading-tight text-[#0C447C]"
            style={{ fontSize: "27px", fontWeight: 800 }}
          >
            سيرتك تفتح الأبواب —
            <span className="block text-[#378ADD]">نحن نبنيها لك</span>
          </h1>

          <p className="mb-4 max-w-md text-[13px] leading-relaxed text-[#566573]">
            في دقائق تحصل على سيرة احترافية بالعربي والإنجليزي، محسّنة بالذكاء
            الاصطناعي.
          </p>

          <Link
            href="/login?next=/create"
            className="mb-5 inline-flex items-center gap-2.5 rounded-[9px] bg-[#378ADD] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#2a6bb8]"
            style={{ padding: "12px 20px", fontWeight: 700 }}
          >
            <CheckCircleDark />
            <span>ابدأ الآن</span>
            <span className="text-base leading-none" aria-hidden>
              ←
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div>
              <p className="text-lg font-bold text-[#378ADD]">48%</p>
              <p className="text-[10px] text-[#566573]">أكثر حظاً في الحصول على مقابلة</p>
            </div>
            <div className="h-8 w-px shrink-0 bg-[#D8EAF8]" aria-hidden />
            <div>
              <p className="text-lg font-bold text-[#D97706]">{SINGLE_PLAN.price} ر.س</p>
              <p className="text-[10px] text-[#566573]">نسختان + ATS + Word و PDF</p>
            </div>
          </div>
        </div>

        {/* العمود الأيسر — السيرة + السعر */}
        <div className="relative mx-auto w-[210px] lg:mx-0 lg:ms-auto">
          <div className="absolute -right-2 -top-2 z-20 rounded-full bg-[#E6F1FB] px-2 py-0.5 text-[9px] font-bold text-[#378ADD] shadow-sm">
            تحسين AI
          </div>
          <div className="absolute -bottom-2 -left-2 z-20 rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[9px] font-bold text-[#16A34A] shadow-sm">
            ATS Score: 94%
          </div>

          <div className="flex items-center justify-between rounded-t-[12px] bg-[#0C447C] px-4 py-3">
            <ul className="space-y-1">
              {PRICE_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-1 text-[8px] text-white/90">
                  <GreenCheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="shrink-0 text-left" dir="ltr">
              <div className="flex items-baseline gap-0.5">
                <span className="text-[30px] font-bold leading-none text-white">
                  {SINGLE_PLAN.price}
                </span>
                <span className="text-[11px] text-[#85B7EB]">ر.س</span>
              </div>
              <p className="mt-0.5 text-[9px] text-[#85B7EB]">دفعة واحدة — بدون اشتراك</p>
            </div>
          </div>

          <div
            className="overflow-hidden rounded-b-[12px] border border-t-0 border-[#C8DCF0] bg-white"
            dir="ltr"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            <div className="bg-[#1a2e4a] px-2.5 py-2">
              <p className="text-[11px] font-bold text-white">Faisal Ali</p>
              <p className="text-[9px] text-[#85B7EB]">Senior Software Engineer</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[7px] text-[#85B7EB]">
                <span className="inline-flex items-center gap-0.5">
                  <MailIcon />
                  faisal@email.com
                </span>
                <span>|</span>
                <span className="inline-flex items-center gap-0.5">
                  <PersonIcon />
                  Riyadh, KSA
                </span>
              </div>
            </div>

            <div className="space-y-2.5 px-2.5 py-2">
              <div>
                <p className="mb-1 text-[7px] font-bold tracking-wide text-[#0C447C]">
                  PROFESSIONAL SUMMARY
                </p>
                <div className="space-y-0.5">
                  <CvBar width="w-[90%]" />
                  <CvBar width="w-[80%]" />
                  <CvBar width="w-[60%]" />
                </div>
              </div>

              <div>
                <p className="mb-1 text-[7px] font-bold tracking-wide text-[#0C447C]">
                  WORK EXPERIENCE
                </p>
                <div className="mb-1.5">
                  <p className="text-[7px] font-bold text-[#0C447C]">Senior Software Engineer</p>
                  <p className="text-[6px] text-[#64748b]">Saudi Aramco · 2021 — Present</p>
                  <div className="mt-0.5 space-y-0.5">
                    <CvBar width="w-full" />
                    <CvBar width="w-4/5" />
                  </div>
                </div>
                <div>
                  <p className="text-[7px] font-bold text-[#0C447C]">Software Developer</p>
                  <p className="text-[6px] text-[#64748b]">STC · 2018 — 2021</p>
                  <div className="mt-0.5 space-y-0.5">
                    <CvBar width="w-full" />
                    <CvBar width="w-11/12" />
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-1 text-[7px] font-bold tracking-wide text-[#0C447C]">SKILLS</p>
                <div className="flex flex-wrap gap-1">
                  {SKILLS.map((skill) => (
                    <span
                      key={skill}
                      className="rounded bg-[#EEF5FC] px-1 py-0.5 text-[6px] font-semibold text-[#378ADD]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

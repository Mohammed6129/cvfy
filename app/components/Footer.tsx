import type { ReactNode } from "react";
import Link from "next/link";
import BrandLogo, { FOOTER_LOGO_HEIGHT, LogoIcon } from "./brand-logo";

type FooterProps = {
  variant?: "default" | "glass";
};

function ContactRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "12px",
        justifyContent: "flex-start",
      }}
    >
      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)" }}>
        {label}
      </span>
      {children}
    </div>
  );
}

function GlassFooterTop() {
  return (
    <div style={{ background: "#0a1628" }}>
      <div
        dir="rtl"
        className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-10 px-6 pb-7 pt-12 md:grid-cols-[1fr_auto] md:gap-10 md:px-14"
      >
        <div className="text-right">
          <h3 className="mb-2.5 text-[17px] font-extrabold text-white">
            تواصل معنا
          </h3>
          <p className="mb-5 text-xs leading-relaxed text-white/60">
            نسعد بتواصلك معنا، وفريقنا جاهز لتقديم الدعم في أي وقت.
          </p>

          <div>
            <ContactRow label="support@cvfy.sa">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <rect
                  x="1"
                  y="3"
                  width="14"
                  height="10"
                  rx="1.5"
                  stroke="#85B7EB"
                  strokeWidth="1.2"
                />
                <path d="M1.5 4l6 5 6-5" stroke="#85B7EB" strokeWidth="1.2" />
              </svg>
            </ContactRow>

            <ContactRow label="+966 50 000 0000">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M2.5 2h2l1 2.5-1.2 1c.7 1.4 1.8 2.5 3.2 3.2l1-1.2L11 8.5v2c0 1-.8 1.5-1.7 1.3C5.5 11 2.5 8 1.7 4.2 1.5 3.3 2 2.5 2.5 2z"
                  stroke="#85B7EB"
                  strokeWidth="1.2"
                />
              </svg>
            </ContactRow>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "0",
                justifyContent: "flex-start",
              }}
            >
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)" }}>
                cvfy.sa
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <rect
                  x="2"
                  y="2"
                  width="12"
                  height="12"
                  rx="3"
                  stroke="#85B7EB"
                  strokeWidth="1.2"
                />
                <circle cx="8" cy="8" r="2" stroke="#85B7EB" strokeWidth="1.2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 text-center md:max-w-[260px] md:justify-self-center">
          <LogoIcon height={FOOTER_LOGO_HEIGHT} />
          <p className="max-w-[220px] text-[11px] leading-relaxed text-white/55">
            منشئ سيرة ذاتية احترافية بالذكاء الاصطناعي، مصمم لسوق العمل السعودي.
          </p>
        </div>
      </div>
    </div>
  );
}

function GlassFooterBottom() {
  return (
    <div
      dir="rtl"
      style={{
        background: "#050d1a",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
      className="px-6 py-[18px] md:px-14"
    >
      <div className="mx-auto flex max-w-[1100px] items-center justify-start">
        <span className="text-[11px] text-white/40">
          © جميع الحقوق محفوظة 2026 — CVfy
        </span>
      </div>
    </div>
  );
}

export default function Footer({ variant = "default" }: FooterProps) {
  if (variant === "glass") {
    return (
      <footer>
        <GlassFooterTop />
        <GlassFooterBottom />
      </footer>
    );
  }

  return (
    <footer className="border-t border-slate-100 bg-white px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex justify-center md:justify-start">
          <BrandLogo asLink={false} />
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-slate-600">
          <Link href="/about-ats" className="hover:text-[#378ADD]">
            ما هو ATS؟
          </Link>
          <Link href="/terms" className="hover:text-[#378ADD]">
            شروط الاستخدام
          </Link>
          <Link href="/privacy" className="hover:text-[#378ADD]">
            سياسة الخصوصية
          </Link>
          <Link href="/#faq" className="hover:text-[#378ADD]">
            الأسئلة الشائعة
          </Link>
        </nav>
        <p className="text-center text-sm text-slate-400 md:text-left">
          © {new Date().getFullYear()} CVfy. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}

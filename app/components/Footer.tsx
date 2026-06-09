import Link from "next/link";
import BrandLogo from "./brand-logo";

export default function Footer() {
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

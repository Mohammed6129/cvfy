import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="text-center md:text-right">
          <p className="text-xl font-extrabold text-[#378ADD]">CVfy</p>
          <p className="text-sm text-slate-500">هويتك المهنية — لسوق العمل السعودي</p>
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

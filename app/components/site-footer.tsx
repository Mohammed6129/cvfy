import Link from "next/link";
import { LogoMark } from "./logo";

export default function SiteFooter() {
  return (
    <footer className="no-print mt-auto bg-ink text-white">
      <div className="wrap flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <LogoMark size="sm" inverse />
          <p className="mt-3 text-[0.875rem] leading-[1.8] text-white/70">
            تكتب بأسلوبك، ونسلّمك سيرة ذاتية بالعربي والإنجليزي مطابقة للوظيفة اللي تبغاها.
          </p>
        </div>

        <nav aria-label="روابط الموقع" className="grid grid-cols-2 gap-x-10 gap-y-3 text-[0.9375rem] text-white/85 sm:grid-cols-3">
          <Link href="/create" className="hover:text-white hover:underline">ابدأ سيرتك</Link>
          <Link href="/#pricing" className="hover:text-white hover:underline">الأسعار</Link>
          <Link href="/about-ats" className="hover:text-white hover:underline">وش هو ATS؟</Link>
          <Link href="/my-cvs" className="hover:text-white hover:underline">سيري الذاتية</Link>
          <Link href="/terms" className="hover:text-white hover:underline">الشروط والاسترجاع</Link>
          <Link href="/privacy" className="hover:text-white hover:underline">الخصوصية</Link>
        </nav>

        <div className="text-[0.9375rem]">
          <p className="font-medium">تحتاج مساعدة؟</p>
          <a href="mailto:support@cvfy.sa" dir="ltr" className="text-[#9fc0ff] underline underline-offset-4 hover:text-white">
            support@cvfy.sa
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="wrap py-4 text-[0.8125rem] text-white/55">© {new Date().getFullYear()} CVfy. صُنع في السعودية.</p>
      </div>
    </footer>
  );
}

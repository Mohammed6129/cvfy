import Link from "next/link";
import { LogoMark } from "./logo";

export default function SiteFooter() {
  return (
    <footer className="no-print mt-auto border-t border-rule bg-desk">
      <div className="wrap flex flex-col gap-8 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <LogoMark size="sm" />
          <p className="t-small mt-3">
            تكتب بأسلوبك، ونسلّمك سيرة ذاتية بالعربي والإنجليزي مطابقة للوظيفة اللي تبغاها.
          </p>
        </div>

        <nav aria-label="روابط الموقع" className="grid grid-cols-2 gap-x-10 gap-y-2 text-[0.9375rem] sm:grid-cols-3">
          <Link href="/create" className="hover:underline">ابدأ سيرتك</Link>
          <Link href="/#pricing" className="hover:underline">الأسعار</Link>
          <Link href="/about-ats" className="hover:underline">وش هو ATS؟</Link>
          <Link href="/my-cvs" className="hover:underline">سيري الذاتية</Link>
          <Link href="/terms" className="hover:underline">الشروط والاسترجاع</Link>
          <Link href="/privacy" className="hover:underline">الخصوصية</Link>
        </nav>

        <div className="text-[0.9375rem]">
          <p className="font-medium">تحتاج مساعدة؟</p>
          <a href="mailto:support@cvfy.sa" dir="ltr" className="link">support@cvfy.sa</a>
        </div>
      </div>
      <div className="border-t border-rule">
        <p className="wrap py-4 text-[0.8125rem] font-light text-mute">
          © {new Date().getFullYear()} CVfy. صُنع في السعودية.
        </p>
      </div>
    </footer>
  );
}

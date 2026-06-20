import Link from "next/link";
import GlassPageLayout from "@/app/components/glass-page-layout";

export default function NotFound() {
  return (
    <GlassPageLayout mainClassName="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="glass-page-card max-w-md px-8 py-12">
        <p className="mb-2 text-6xl font-extrabold text-[#FAC775]">404</p>
        <h1 className="mb-3 text-2xl font-bold text-white">
          الصفحة غير موجودة
        </h1>
        <p className="mb-8 text-white/70">
          عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما تم نقلها أو
          حذفها.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="glass-btn-primary px-8 py-3 text-sm"
          >
            العودة للرئيسية
          </Link>
          <Link
            href="/create"
            className="glass-btn-secondary px-8 py-3 text-sm"
          >
            إنشاء سيرة ذاتية
          </Link>
        </div>
      </div>
    </GlassPageLayout>
  );
}

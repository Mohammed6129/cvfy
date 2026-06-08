import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-white px-6 py-20 text-center">
      <p className="mb-2 text-6xl font-extrabold text-[#378ADD]">404</p>
      <h1 className="mb-3 text-2xl font-bold text-slate-900">
        الصفحة غير موجودة
      </h1>
      <p className="mb-8 max-w-md text-slate-600">
        عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما تم نقلها أو
        حذفها.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-full bg-[#378ADD] px-8 py-3 text-sm font-semibold text-white hover:bg-[#2a6bb8]"
        >
          العودة للرئيسية
        </Link>
        <Link
          href="/create"
          className="rounded-full border-2 border-[#378ADD] px-8 py-3 text-sm font-semibold text-[#378ADD] hover:bg-[#e8f2fc]"
        >
          إنشاء سيرة ذاتية
        </Link>
      </div>
    </div>
  );
}

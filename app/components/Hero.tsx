import Link from "next/link";
import StartNowLink from "./start-now-link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-6 pb-20 pt-16 md:pb-28 md:pt-24">
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#378ADD]/5 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#378ADD]/5 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-6 inline-block rounded-full border border-[#378ADD]/20 bg-white px-4 py-1.5 text-sm font-medium text-[#378ADD]">
            منصة السيرة الذاتية الأولى بالعربية
          </span>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl lg:text-6xl">
            أنشئ سيرتك الذاتية
            <span className="block text-[#378ADD]">الاحترافية في دقائق</span>
          </h1>

          <p className="mb-10 text-lg leading-relaxed text-slate-600 md:text-xl">
            CVfy يساعدك على بناء هويتك المهنية بقوالب عصرية وتحسين ذكي
            يزيد فرصك في الحصول على وظيفة أحلامك.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <StartNowLink className="w-full rounded-full bg-[#378ADD] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#378ADD]/30 transition-colors hover:bg-[#2a6bb8] sm:w-auto">
              ابدأ الآن
            </StartNowLink>
            <Link
              href="#features"
              className="w-full rounded-full bg-[#378ADD] px-8 py-3.5 text-base font-semibold text-white shadow-md shadow-[#378ADD]/20 transition-colors hover:bg-[#2a6bb8] sm:w-auto"
            >
              اكتشف المميزات
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/60 md:p-8">
          <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="h-10 w-10 rounded-full bg-[#378ADD]/15" />
            <div className="text-right">
              <p className="font-semibold text-slate-800">أحمد محمد</p>
              <p className="text-sm text-slate-500">مهندس برمجيات</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-3 w-3/4 rounded-full bg-[#378ADD]/20" />
            <div className="h-3 w-full rounded-full bg-slate-100" />
            <div className="h-3 w-5/6 rounded-full bg-slate-100" />
            <div className="mt-4 flex gap-2">
              <span className="rounded-md bg-[#e8f2fc] px-3 py-1 text-xs font-medium text-[#378ADD]">
                React
              </span>
              <span className="rounded-md bg-[#e8f2fc] px-3 py-1 text-xs font-medium text-[#378ADD]">
                Node.js
              </span>
              <span className="rounded-md bg-[#e8f2fc] px-3 py-1 text-xs font-medium text-[#378ADD]">
                TypeScript
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

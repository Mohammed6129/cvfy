import Link from "next/link";
import StartNowLink from "./start-now-link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-20">
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
            🇸🇦 مصمم للسوق السعودي — متوافق مع ATS
          </span>

          <h1 className="mb-6 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
            أنشئ سيرتك الذاتية
            <span className="block text-[#378ADD]">الاحترافية في دقائق</span>
          </h1>

          <p className="mb-10 text-base leading-relaxed text-slate-600 sm:text-lg md:text-xl">
            CVfy يساعدك على بناء سيرة ذاتية كلاسيكية متوافقة مع أنظمة التوظيف،
            مع تحسين بالذكاء الاصطناعي وفحص ATS فوري — بالعربية وبالإنجليزية.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <StartNowLink className="w-full rounded-full bg-[#378ADD] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#378ADD]/30 transition-all hover:bg-[#2a6bb8] hover:shadow-xl sm:w-auto">
              ابدأ مجاناً
            </StartNowLink>
            <Link
              href="#features"
              className="w-full rounded-full border-2 border-[#378ADD] px-8 py-3.5 text-base font-semibold text-[#378ADD] transition-colors hover:bg-[#e8f2fc] sm:w-auto"
            >
              اكتشف المميزات
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/60 sm:mt-16 sm:p-8">
          <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="h-10 w-10 rounded-full bg-[#378ADD]/15" />
            <div className="text-right">
              <p className="font-semibold text-slate-800">أحمد محمد</p>
              <p className="text-sm text-slate-500">مهندس برمجيات | الرياض</p>
            </div>
            <span className="mr-auto rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
              ATS 87%
            </span>
          </div>
          <div className="space-y-3">
            <div className="h-3 w-3/4 rounded-full bg-[#378ADD]/20" />
            <div className="h-3 w-full rounded-full bg-slate-100" />
            <div className="h-3 w-5/6 rounded-full bg-slate-100" />
            <div className="mt-4 flex flex-wrap gap-2">
              {["React", "Node.js", "TypeScript"].map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-[#e8f2fc] px-3 py-1 text-xs font-medium text-[#378ADD]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";

function AiIllustration() {
  return (
    <div className="flex items-center justify-center rounded-3xl bg-[#E6F1FB] p-8">
      <div
        className="w-full max-w-[220px] overflow-hidden rounded-xl border border-[#C8DCF0] bg-white shadow-md"
        dir="ltr"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        <div className="bg-[#1a2e4a] px-3 py-2">
          <p className="text-[10px] font-bold text-white">Faisal Ali</p>
          <p className="text-[8px] text-[#85B7EB]">Senior Software Engineer</p>
        </div>
        <div className="space-y-2 px-3 py-2.5">
          <p className="text-[7px] font-bold text-[#0C447C]">EXPERIENCE</p>
          <div className="space-y-1">
            <div className="h-1 w-full rounded-full bg-[#CBD5E1]" />
            <div className="h-1 w-4/5 rounded-full bg-[#378ADD]/40" />
            <div className="h-1 w-full rounded-full bg-[#378ADD]/60" />
          </div>
          <span className="inline-block rounded-full bg-[#E6F1FB] px-2 py-0.5 text-[7px] font-bold text-[#378ADD]">
            ✦ AI Enhanced
          </span>
        </div>
      </div>
    </div>
  );
}

function AtsIllustration() {
  return (
    <div className="flex items-center justify-center rounded-3xl bg-[#EEEDFE] p-8">
      <div className="relative flex h-40 w-40 items-center justify-center">
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 160 160" aria-hidden>
          <circle cx="80" cy="80" r="68" fill="none" stroke="#E0DFF8" strokeWidth="12" />
          <circle
            cx="80"
            cy="80"
            r="68"
            fill="none"
            stroke="#7C6FE0"
            strokeWidth="12"
            strokeDasharray="427"
            strokeDashoffset="68"
            strokeLinecap="round"
          />
        </svg>
        <div className="text-center">
          <p className="text-3xl font-extrabold text-[#7C6FE0]">94%</p>
          <p className="text-xs font-semibold text-[#555]">ATS Score</p>
        </div>
      </div>
    </div>
  );
}

export default function HomeFeatures() {
  return (
    <section className="bg-[#F8FAFE]" dir="rtl">
      <div className="mx-auto max-w-[1100px] space-y-12 px-6 py-12 md:px-12">
        {/* الصف الأول */}
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <span className="mb-3 inline-block rounded-full bg-[#E6F1FB] px-3 py-1 text-xs font-semibold text-[#378ADD]">
              تحسين بالذكاء الاصطناعي
            </span>
            <h2 className="mb-3 text-xl font-extrabold text-[#0C447C]">
              AI يصيغ خبراتك باحترافية تلقائياً
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-[#555]">
              مو لازم تعرف تكتب بالإنجليزي باحتراف — الذكاء الاصطناعي يأخذ كلامك
              العادي ويحوّله لجمل قوية تلفت انتباه أصحاب العمل.
            </p>
            <Link
              href="/login?next=/create"
              className="text-sm font-bold text-[#378ADD] transition-colors hover:text-[#2a6bb8]"
            >
              ابدأ الآن ←
            </Link>
          </div>
          <AiIllustration />
        </div>

        {/* الصف الثاني */}
        <div className="grid items-center gap-8 md:grid-cols-2">
          <AtsIllustration />
          <div>
            <span className="mb-3 inline-block rounded-full bg-[#EEEDFE] px-3 py-1 text-xs font-semibold text-[#7C6FE0]">
              فحص ATS
            </span>
            <h2 className="mb-3 text-xl font-extrabold text-[#0C447C]">
              سيرتك تتجاوز أنظمة الفرز الآلي
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-[#555]">
              75% من السير تُحذف تلقائياً قبل ما يشوفها أي إنسان. نحن نضمن إن
              سيرتك تعدّي هذا الفرز وتوصل للمسؤول فعلياً.
            </p>
            <Link
              href="/about-ats"
              className="text-sm font-bold text-[#378ADD] transition-colors hover:text-[#2a6bb8]"
            >
              اعرف أكثر ←
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

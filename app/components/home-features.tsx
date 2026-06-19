import Image from "next/image";

export default function HomeFeatures() {
  return (
    <section className="px-6 py-12 md:px-12" dir="rtl">
      <div className="glass-feature-card mx-auto max-w-[1100px] rounded-[20px] p-8">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="flex justify-center md:justify-start">
            <Image
              src="/illustrations/resume.svg"
              alt="سيرة ذاتية احترافية منظمة"
              width={320}
              height={218}
              className="h-auto w-full max-w-[320px] opacity-90"
            />
          </div>

          <div className="text-right">
            <span className="glass-surface-sm mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white">
              تحسين بالذكاء الاصطناعي
            </span>
            <h2 className="mb-3 text-xl font-extrabold text-white md:text-2xl">
              AI يصيغ خبراتك باحترافية تلقائياً
            </h2>
            <p className="text-sm leading-relaxed text-white/80">
              مو لازم تعرف تكتب بالإنجليزي باحتراف — الذكاء الاصطناعي يأخذ كلامك
              العادي ويحوّله لجمل قوية تلفت انتباه أصحاب العمل.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import StartNowLink from "./start-now-link";

export default function HomeTrustSection() {
  return (
    <section className="px-6 py-12 md:px-12" dir="rtl">
      <div className="glass-feature-card mx-auto max-w-[1100px] rounded-3xl p-8">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="flex justify-center md:justify-end">
            <Image
              src="/illustrations/hiring.svg"
              alt="فريق توظيف يراجع طلبات التقديم"
              width={320}
              height={290}
              className="h-auto w-full max-w-[320px] opacity-90"
            />
          </div>

          <div className="text-right">
            <span className="glass-surface-sm mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white">
              ثقة عملائنا
            </span>
            <h2 className="mb-3 text-xl font-extrabold text-white md:text-2xl">
              آلاف الباحثين عن عمل اختاروا CVfy
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-white/80">
              سيرة ذاتية احترافية فتحت لعملائنا أبواب فرص حقيقية في أكبر الشركات
              السعودية.
            </p>
            <StartNowLink className="inline-flex items-center rounded-full bg-white px-7 py-3.5 text-sm font-extrabold text-[#0C447C] shadow-[0_4px_20px_rgba(255,255,255,0.25)] transition-opacity hover:opacity-95">
              ابدأ الآن ←
            </StartNowLink>
          </div>
        </div>
      </div>
    </section>
  );
}

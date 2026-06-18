import Image from "next/image";
import StartNowLink from "./start-now-link";

export default function HomeTrustSection() {
  return (
    <section className="bg-[#F8FAFE] px-6 py-12 md:px-12" dir="rtl">
      <div className="mx-auto grid max-w-[1100px] items-center gap-10 md:grid-cols-2">
        <div className="flex justify-center md:justify-end">
          <Image
            src="/illustrations/hiring.svg"
            alt="فريق توظيف يراجع طلبات التقديم"
            width={320}
            height={290}
            className="h-auto w-full max-w-[320px]"
          />
        </div>

        <div className="text-right">
          <span className="mb-3 inline-block rounded-full bg-[#E6F1FB] px-3 py-1 text-xs font-semibold text-[#378ADD]">
            ثقة عملائنا
          </span>
          <h2 className="mb-3 text-xl font-extrabold text-[#0C447C] md:text-2xl">
            آلاف الباحثين عن عمل اختاروا CVfy
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-[#555]">
            سيرة ذاتية احترافية فتحت لعملائنا أبواب فرص حقيقية في أكبر الشركات
            السعودية.
          </p>
          <StartNowLink className="inline-flex items-center gap-2 rounded-[10px] bg-[#378ADD] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#2a6bb8]">
            ابدأ الآن ←
          </StartNowLink>
        </div>
      </div>
    </section>
  );
}

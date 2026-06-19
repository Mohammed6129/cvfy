import StartNowLink from "./start-now-link";

export default function HomeCta() {
  return (
    <section className="px-6 py-14 text-center md:px-12 md:py-[56px]" dir="rtl">
      <div className="glass-surface mx-auto max-w-[1100px] rounded-[28px] px-6 py-10 md:px-12">
        <h2 className="mb-3 text-2xl font-extrabold text-white">
          75% من السير تُتجاهل — لا تكن منهم
        </h2>
        <p className="mb-6 text-sm text-white/75">
          ابنِ سيرتك الآن بالذكاء الاصطناعي وضمان التوافق مع ATS
        </p>
        <StartNowLink className="inline-flex items-center rounded-full bg-white px-7 py-3.5 text-sm font-extrabold text-[#0C447C] shadow-[0_4px_20px_rgba(255,255,255,0.25)] transition-opacity hover:opacity-95">
          ابدأ الآن ←
        </StartNowLink>
      </div>
    </section>
  );
}

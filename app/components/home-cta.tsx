import Link from "next/link";

export default function HomeCta() {
  return (
    <section className="bg-[#0C447C] text-center" dir="rtl">
      <div className="mx-auto max-w-[1100px] px-6 py-14 md:px-12">
        <h2 className="mb-3 text-2xl font-extrabold text-white">
          75% من السير تُتجاهل — لا تكن منهم
        </h2>
        <p className="mb-6 text-sm text-[#85B7EB]">
          ابنِ سيرتك الآن بالذكاء الاصطناعي وضمان التوافق مع ATS
        </p>
        <Link
          href="/login?next=/create"
          className="inline-flex items-center gap-2 rounded-[10px] bg-[#378ADD] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#2a6bb8]"
        >
          ابدأ الآن ←
        </Link>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "ما هو ATS؟ — CVfy",
  description: "شرح مبسط لنظام ATS ولماذا سيرتك الذاتية الاحترافية بالأبيض والأسود أفضل.",
};

export default function AboutAtsPage() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="mb-6 text-3xl font-extrabold text-slate-900 sm:text-4xl">
          ما هو <span className="text-[#378ADD]">ATS</span>؟
        </h1>

        <div className="space-y-6 text-base leading-8 text-slate-700">
          <p>
            تخيّل أن عند الشركة صندوق ذكي يقرأ آلاف السير الذاتية بسرعة البرق.
            هذا الصندوق اسمه <strong>ATS</strong> — نظام تتبع المتقدمين.
          </p>
          <p>
            لما ترسل سيرتك، الصندوق يبحث عن كلمات مهمة: مسمّاك الوظيفي، خبراتك،
            تواريخك، مهاراتك. إذا كانت سيرتك واضحة ومنظمة، الصندوق يقول: «هذا
            مرشح مناسب!» ويرفعها للموظف البشري.
          </p>
          <p>
            إذا كانت سيرتك ملونة وفوضوية أو ناقصة التواريخ، الصندوق قد لا يفهمها
            ويتجاهلها — حتى لو أنت مؤهل!
          </p>

          <h2 className="pt-4 text-xl font-extrabold text-slate-900">
            لماذا السيرة بالأبيض والأسود أفضل؟
          </h2>
          <p>
            السيرة الاحترافية الرسمية (أبيض وأسود، خط Times New Roman، بدون صور
            أو ألوان) مثل الورقة الرسمية في المدرسة — واضحة، نظيفة، وسهلة القراءة
            للصندوق الذكي وللموظف البشري.
          </p>
          <p>
            السيرة الملونة والمزخرفة قد تبدو جميلة للعين، لكن الصندوق الذكي لا
            «يشوف» الجمال — يقرأ النص فقط. كلما كانت أبسط وأوضح، كلما زادت فرصتك.
          </p>
        </div>

        <Link
          href="/create"
          className="mt-10 inline-block rounded-full bg-[#378ADD] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#378ADD]/25 hover:bg-[#2a6bb8]"
        >
          ابدأ الآن
        </Link>
      </main>
      <Footer />
    </div>
  );
}

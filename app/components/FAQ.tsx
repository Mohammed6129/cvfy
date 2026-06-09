const FAQ_ITEMS = [
  {
    q: "كم تكلفة CVfy؟",
    a: "باقة واحدة شاملة بـ 99 ر.س — تحصل على نسختين كاملتين بالعربي والإنجليزي مع تحميل PDF وWord بدون علامة مائية.",
  },
  {
    q: "هل السيرة متوافقة مع ATS؟",
    a: "نعم، نستخدم تنسيقاً رسمياً واضحاً (أبيض وأسود) مع فحص ATS بالذكاء الاصطناعي يعرض لك نسبة التوافق وتوصيات التحسين.",
  },
  {
    q: "هل أحصل على نسختين عربي وإنجليزي؟",
    a: "نعم دائماً. كل سيرة تُنشأ بنسختين عربي وإنجليزي — والنسخة الإنجليزية تُفضّلها الشركات والجهات أكثر.",
  },
  {
    q: "كيف أحمّل سيرتي بعد الدفع؟",
    a: "بعد الدفع الناجح (99 ر.س) تُزال العلامة المائية ويظهر زر تحميل PDF وWord في صفحة المعاينة.",
  },
  {
    q: "هل بياناتي آمنة؟",
    a: "نعم، سيرك الذاتية محفوظة في حسابك الخاص ولا نشارك بياناتك مع أطراف ثالثة لأغراض تسويقية.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-3 text-center text-3xl font-extrabold text-slate-900">
          الأسئلة الشائعة
        </h2>
        <p className="mb-10 text-center text-slate-600">
          إجابات سريعة عن أكثر ما يُسأل عنه
        </p>
        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <summary className="cursor-pointer list-none text-base font-bold text-slate-900 marker:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span className="text-[#378ADD] transition-transform group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

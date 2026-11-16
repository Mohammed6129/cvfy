import { PLANS } from "@/lib/pricing";

const ITEMS: { q: string; a: string }[] = [
  {
    q: "لازم أدفع عشان أشوف النتيجة؟",
    a: "لا. تعبّي بياناتك، نكتب سيرتك، وتشوف المعاينة وتقرير ATS كامل مجاناً. الدفع فقط إذا قررت تحمّل الملفات.",
  },
  {
    q: "وش الفرق بينكم وبين إني أكتبها مع ChatGPT؟",
    a: "ChatGPT يكتب من اللي تعطيه، ويعطيك نص تنسّقه بنفسك. CVfy يسألك أسئلة تطلّع أرقامك وإنجازاتك، يطابق سيرتك مع كلمات إعلان الوظيفة ويوريك الناقص، ويسلّمك ملف PDF و Word بتنسيق تقرأه أنظمة الفرز، بالعربي والإنجليزي.",
  },
  {
    q: "هل تضمنون إن سيرتي تعدّي نظام ATS؟",
    a: "ما فيه نظام ATS واحد، وأي أحد يضمن لك القبول يبيعك وهم. اللي نضمنه: ملف نصي بعمود واحد وعناوين قياسية يقرأه أي نظام، وتقرير يوريك بالضبط أي كلمات مفتاحية من الإعلان موجودة في سيرتك وأيها ناقص.",
  },
  {
    q: "أقدّم بالسيرة العربية ولا الإنجليزية؟",
    a: "الشركات الكبيرة والبنوك وأغلب بوابات التوظيف تفضّل الإنجليزي، وأنظمتها تقرأه أدق. العربي مناسب للجهات الحكومية وبعض الشركات المحلية. إذا مو متأكد خذ الثنتين وقدّم باللي يطلبه الإعلان.",
  },
  {
    q: "أنا حديث تخرج وما عندي خبرة، ينفع؟",
    a: "ينفع. نبني سيرتك على تعليمك ومشروع تخرجك وتدريبك (تعاوني أو تمهير) ودوراتك وتطوعك، ونسألك عنها بطريقة تطلّع منها شي يستاهل ينكتب.",
  },
  {
    q: "أقدر أعدّل بعد الدفع؟",
    a: `إيه. تعدّل بياناتك وتعيد الإنشاء لمدة 7 أيام في الباقة الأساسية و30 يوم في الكاملة. وفي الكاملة تقدر تعيد مطابقة سيرتك مع إعلان وظيفة ثانية بدون ما تدفع من جديد. وملف Word تعدّله بنفسك أي وقت.`,
  },
  {
    q: "هل تكتبون معلومات ما قلتها؟",
    a: "لا. ما نضيف رقم ولا مهارة ولا شهادة ما ذكرتها. الكلمات المفتاحية اللي ما لها أساس في كلامك نحطها لك في قائمة «ناقصة» وأنت تقرر.",
  },
  {
    q: "وش يصير ببياناتي؟",
    a: "تنحفظ في حسابك عشان ترجع لها وتعدّلها، وما نبيعها ولا نشاركها لأغراض تسويقية. تقدر تحذف سيرتك من حسابك أي وقت.",
  },
  {
    q: "وإذا ما عجبتني بعد الدفع؟",
    a: `راسلنا خلال 24 ساعة من الدفع على support@cvfy.sa ونرجّع لك المبلغ كامل (${PLANS.basic.price} أو ${PLANS.full.price} ريال حسب باقتك).`,
  },
];

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 bg-desk py-16 md:py-24">
      <div className="wrap wrap-narrow">
        <h2 className="t-h2">أسئلة تتكرر</h2>
        <div className="mt-8 divide-y divide-rule border-y border-rule">
          {ITEMS.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden className="relative h-4 w-4 shrink-0 text-mute">
                  <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded bg-current" />
                  <span className="absolute inset-y-0 start-1/2 w-0.5 -translate-x-1/2 rounded bg-current transition-transform group-open:scale-y-0 rtl:translate-x-1/2" />
                </span>
              </summary>
              <p className="t-body pb-5 pe-8">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

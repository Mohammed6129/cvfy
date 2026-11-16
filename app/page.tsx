import type { Metadata } from "next";
import Link from "next/link";
import Faq from "./components/home/faq";
import HeroDemo from "./components/home/hero-demo";
import Pricing from "./components/home/pricing";
import SampleSwitcher from "./components/home/sample-switcher";
import { ChatIcon, FileIcon, ShieldIcon, TargetIcon } from "./components/icons";
import PageShell from "./components/page-shell";
import { PLANS } from "@/lib/pricing";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const DIFFERENCES = [
  {
    icon: <ChatIcon size={22} />,
    title: "يسألك الأسئلة الصح",
    body: "ChatGPT يكتب من اللي تعطيه وبس. CVfy يقرأ خبراتك ويسألك 3 إلى 5 أسئلة تطلّع الأرقام والإنجازات اللي ما كنت بتذكرها: كم عميل، كم ريال، كم بالمئة.",
  },
  {
    icon: <TargetIcon size={22} />,
    title: "يطابق سيرتك مع إعلان الوظيفة",
    body: "تلصق نص الإعلان، ونطلّع كلماته المفتاحية ونكتب سيرتك بها. وبعدين نوريك بالاسم: أي كلمة موجودة في سيرتك وأي كلمة ناقصة.",
  },
  {
    icon: <FileIcon size={22} />,
    title: "ملف جاهز للتقديم، مو نص",
    body: "تستلم PDF و Word بعمود واحد وعناوين قياسية تقرأها أنظمة الفرز. ما تحتاج تفتح وورد وتقعد ساعتين تضبط الهوامش والخطوط.",
  },
  {
    icon: <ShieldIcon size={22} />,
    title: "ما يألّف عليك",
    body: "ما نضيف رقم ولا مهارة ولا شهادة ما قلتها. كل سطر في سيرتك تقدر تدافع عنه في المقابلة.",
  },
];

const STEPS = [
  {
    title: "عبّي بياناتك بأسلوبك",
    body: "خمس خطوات قصيرة، وتكتب خبراتك مثل ما تسولف — حتى لو بالعامي. وإذا عندك سيرة قديمة ارفعها ونعبّي البيانات عنك.",
  },
  {
    title: "جاوب على كم سؤال",
    body: "نسألك عن الأشياء اللي تفرق في سيرتك: حجم شغلك، نتائجه، والأدوات اللي استخدمتها. كل سؤال جوابه سطر واحد.",
  },
  {
    title: "شوف سيرتك وقرّر",
    body: "تشوف المعاينة وتقرير ATS مجاناً. إذا عجبتك ادفع مرة وحدة وحمّل ملفاتك، وإذا لا ما عليك شي.",
  },
];

const DELIVERABLES = [
  { title: "سيرة بالإنجليزي وسيرة بالعربي", body: "كل لغة مكتوبة من الأساس بأعرافها، مو ترجمة حرفية للثانية." },
  { title: "PDF و Word لكل لغة", body: "PDF للتقديم المباشر، و Word حقيقي تعدّله بنفسك أي وقت وترفعه لبوابات التوظيف." },
  { title: "تقرير فحص ATS", body: "فحص بقواعد واضحة يوريك وش الناجح ووش يحتاج تعديل — مو رقم عشوائي." },
  { title: "مطابقة مع إعلان الوظيفة", body: "نسبة التغطية وقائمة الكلمات المفتاحية الموجودة والناقصة." },
  { title: "رسالة تقديم جاهزة", body: "نص قصير بالعربي والإنجليزي ترسله مع سيرتك بالإيميل أو الواتساب." },
  { title: "نبذة وعنوان LinkedIn", body: "تنسخها لحسابك مباشرة، متوافقة مع سيرتك." },
];

export default function HomePage() {
  return (
    <PageShell>
      {/* ── Hero ── */}
      <section className="wrap grid gap-10 pb-16 pt-10 md:grid-cols-[1.02fr_0.98fr] md:items-center md:gap-14 md:pb-24 md:pt-16">
        <div>
          <h1 className="t-display">
            سولف لنا عن شغلك،
            <br />
            ونكتبها لك سيرة على مقاس الوظيفة
          </h1>
          <p className="t-lead mt-5 max-w-[34rem]">
            تكتب خبراتك بأسلوبك العادي، نسألك كم سؤال، ونسلّمك سيرة ذاتية بالعربي والإنجليزي مطابقة لإعلان الوظيفة اللي تبغاها.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/create" className="btn btn-primary btn-lg">
              ابدأ سيرتك مجاناً
            </Link>
            <Link href="#sample" className="btn btn-ghost btn-lg">
              شوف مثال
            </Link>
          </div>
          <p className="t-small mt-4">
            المعاينة مجانية. تدفع مرة وحدة من {PLANS.basic.price} ريال إذا عجبتك النتيجة — بدون اشتراك.
          </p>
        </div>

        <HeroDemo />
      </section>

      {/* ── Why not just ChatGPT ── */}
      <section className="border-y border-rule py-16 md:py-24">
        <div className="wrap">
          <div className="max-w-2xl">
            <h2 className="t-h2">«طيب ليش ما أكتبها بنفسي مع ChatGPT؟»</h2>
            <p className="t-lead mt-3">
              تقدر، وبتطلع بنص مرتّب يشبه ألف سيرة ثانية. اللي يوصّلك للمقابلة شي غير: سيرة فيها أرقامك أنت، ومكتوبة على مقاس الوظيفة.
            </p>
          </div>

          <dl className="mt-10 grid gap-x-12 gap-y-9 md:grid-cols-2">
            {DIFFERENCES.map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-marker text-ink">
                  {item.icon}
                </span>
                <div>
                  <dt className="t-h3">{item.title}</dt>
                  <dd className="t-body mt-1">{item.body}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="scroll-mt-20 py-16 md:py-24">
        <div className="wrap">
          <h2 className="t-h2">من أول سطر لملف جاهز في حدود عشر دقايق</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative border-t-2 border-ink pt-5">
                <span className="text-[2.5rem] font-light leading-none text-mute" aria-hidden>
                  {i + 1}
                </span>
                <h3 className="t-h3 mt-3">{step.title}</h3>
                <p className="t-body mt-1">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── What you get + sample ── */}
      <section id="sample" className="scroll-mt-20 bg-desk py-16 md:py-24">
        <div className="wrap grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
          <div>
            <h2 className="t-h2">وش تستلم بالضبط</h2>
            <p className="t-lead mt-3">ملفات تقدّم بها اليوم، مو مسودة تحتاج شغل.</p>
            <dl className="mt-8 space-y-5">
              {DELIVERABLES.map((item) => (
                <div key={item.title} className="border-s-2 border-ink ps-4">
                  <dt className="font-medium">{item.title}</dt>
                  <dd className="t-small mt-0.5">{item.body}</dd>
                </div>
              ))}
            </dl>
          </div>

          <SampleSwitcher />
        </div>
      </section>

      <Pricing />
      <Faq />

      {/* ── Closing ── */}
      <section className="py-16 md:py-24">
        <div className="wrap wrap-narrow text-center">
          <h2 className="t-h2">جرّبها على سيرتك، والحكم لك</h2>
          <p className="t-lead mx-auto mt-3 max-w-xl">
            عشر دقايق وتشوف سيرتك مكتوبة ونتيجة فحصها. ما تحتاج بطاقة عشان تبدأ.
          </p>
          <Link href="/create" className="btn btn-primary btn-lg mt-8">
            ابدأ سيرتك مجاناً
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

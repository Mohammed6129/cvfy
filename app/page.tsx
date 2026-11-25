import type { Metadata } from "next";
import Link from "next/link";
import Faq from "./components/home/faq";
import HeroDemo from "./components/home/hero-demo";
import Pricing from "./components/home/pricing";
import SampleSwitcher from "./components/home/sample-switcher";
import { ChatIcon, CheckIcon, DownloadIcon, FileIcon, PenIcon, ShieldIcon, TargetIcon } from "./components/icons";
import PageShell from "./components/page-shell";
import UploadCv from "./components/upload-cv";
import { isMockMode } from "@/lib/ai/client";
import { PLANS } from "@/lib/pricing";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const DIFFERENCES = [
  {
    icon: <ChatIcon size={22} />,
    title: "يطلّع إنجازك من كلامك العادي",
    body: "تكتب بالعامي، ونطلّع منه الإنجاز والرقم ونصيغه بلغة التوظيف. وإذا تبي سيرتك أقوى، نسألك 3 أسئلة سريعة تطلّع الأرقام اللي ما كنت بتذكرها.",
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

const TRUST = ["تقرأها أنظمة ATS", "المعاينة مجانية", "PDF و Word", "عربي وإنجليزي"];

const STEPS = [
  {
    icon: <PenIcon size={22} />,
    title: "عبّي بياناتك بأسلوبك",
    body: "ثلاث خطوات قصيرة، وتكتب خبراتك مثل ما تسولف — حتى لو بالعامي. وإذا عندك سيرة قديمة ارفعها ونعبّي عنك.",
  },
  {
    icon: <FileIcon size={22} />,
    title: "شوف سيرتك مكتوبة",
    body: "خلال أقل من دقيقة تشوف سيرتك وتقرير فحص ATS، مجاناً وبدون تسجيل.",
  },
  {
    icon: <DownloadIcon size={22} />,
    title: "ادفع وحمّل",
    body: "إذا عجبتك ادفع مرة وحدة بأبل باي أو مدى وحمّل PDF و Word. وإذا لا، ما عليك شي.",
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
  const mock = isMockMode();
  return (
    <PageShell>
      {/* ── Hero ── */}
      <section className="wrap grid gap-10 pb-14 pt-8 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-14 md:pb-24 md:pt-16">
        <div>
          <h1 className="t-display">سيرة ذاتية احترافية جاهزة للتقديم، بالعربي والإنجليزي</h1>
          <p className="t-lead mt-4 max-w-[34rem]">
            اكتب خبراتك بكلامك العادي، ونصيغها لك سيرة على مقاس إعلان الوظيفة، بلغة التوظيف وبتنسيق تقرأه أنظمة الفرز.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-start">
            <Link href="/create" className="btn btn-primary btn-lg">
              أنشئ سيرتك الحين
            </Link>
            <UploadCv mock={mock} className="btn btn-ghost btn-lg w-full sm:w-auto">
              ارفع سيرتك القديمة
            </UploadCv>
          </div>
          <ul className="mt-7 grid grid-cols-2 gap-x-4 gap-y-3 sm:max-w-md" aria-label="باختصار">
            {TRUST.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[0.9375rem] font-medium text-ink">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ok text-white" aria-hidden>
                  <CheckIcon size={13} />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="t-small mt-6">
            بدون تسجيل وبدون اشتراك. تدفع مرة وحدة من {PLANS.basic.price} ريال إذا عجبتك.{" "}
            <Link href="#sample" className="link">شوف مثال كامل</Link>
          </p>
        </div>

        <HeroDemo />
      </section>

      {/* ── Why not just ChatGPT ── */}
      <section className="bg-desk py-16 md:py-24">
        <div className="wrap">
          <div className="max-w-2xl">
            <h2 className="t-h2">«طيب ليش ما أكتبها بنفسي مع ChatGPT؟»</h2>
            <p className="t-lead mt-3">
              تقدر، وبتطلع بنص مرتّب يشبه ألف سيرة ثانية. اللي يوصّلك للمقابلة شي غير: سيرة فيها أرقامك أنت، ومكتوبة على مقاس الوظيفة.
            </p>
          </div>

          <dl className="mt-10 grid gap-4 md:grid-cols-2 md:gap-5">
            {DIFFERENCES.map((item) => (
              <div key={item.title} className="card p-5 md:p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-control)] bg-brand-soft text-brand">
                  {item.icon}
                </span>
                <dt className="t-h3 mt-4">{item.title}</dt>
                <dd className="t-body mt-1">{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="scroll-mt-20 py-16 md:py-24">
        <div className="wrap">
          <h2 className="t-h2">من أول سطر لملف جاهز في حدود عشر دقايق</h2>
          <ol className="relative mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
            <span className="absolute inset-x-[16%] top-6 hidden h-px bg-rule md:block" aria-hidden />
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative flex gap-4 md:block">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-[1.125rem] font-bold text-white ring-8 ring-paper md:mx-auto">
                  {i + 1}
                </span>
                <div className="md:mt-5 md:text-center">
                  <h3 className="t-h3 flex items-center gap-2 md:justify-center">
                    <span className="text-brand" aria-hidden>{step.icon}</span>
                    {step.title}
                  </h3>
                  <p className="t-body mt-1">{step.body}</p>
                </div>
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
                <div key={item.title} className="flex gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand" aria-hidden>
                    <CheckIcon size={14} />
                  </span>
                  <div>
                    <dt className="font-semibold">{item.title}</dt>
                    <dd className="t-small mt-0.5">{item.body}</dd>
                  </div>
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
      <section className="px-4 py-14 md:py-20">
        <div className="wrap wrap-narrow rounded-[1.5rem] bg-brand px-6 py-12 text-center text-white md:px-12 md:py-14">
          <h2 className="t-h2">جرّبها على سيرتك، والحكم لك</h2>
          <p className="mx-auto mt-3 max-w-xl text-[1.0625rem] leading-[1.9] text-white/85">
            دقايق وتشوف سيرتك مكتوبة ونتيجة فحصها. ما تحتاج تسجيل ولا بطاقة عشان تبدأ.
          </p>
          <Link href="/create" className="btn btn-lg mt-8 bg-paper font-semibold text-brand-deep hover:bg-brand-soft">
            أنشئ سيرتك مجاناً
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

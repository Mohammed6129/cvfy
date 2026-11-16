import Link from "next/link";
import { CheckIcon } from "@/app/components/icons";
import { PLANS } from "@/lib/pricing";

const METHODS = ["مدى", "Visa", "Mastercard", "Apple Pay"];

/** Accepted methods as plain labels; the real brand marks appear inside Moyasar's checkout. */
export function PaymentMarks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-1.5 ${className}`} aria-label="طرق الدفع المتاحة">
      {METHODS.map((m) => (
        <li key={m} className="rounded-md border border-rule bg-paper px-2 py-0.5 text-[0.75rem] font-medium text-graphite">
          {m}
        </li>
      ))}
    </ul>
  );
}

export default function Pricing() {
  const { basic, full } = PLANS;

  return (
    <section id="pricing" className="scroll-mt-20 py-16 md:py-24">
      <div className="wrap">
        <div className="max-w-2xl">
          <h2 className="t-h2">تدفع مرة وحدة، بعد ما تشوف سيرتك</h2>
          <p className="t-lead mt-3">
            الإنشاء والمعاينة وتقرير ATS مجاناً. الدفع فقط لما تبغى تحمّل الملفات — بدون اشتراك وبدون تجديد تلقائي.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-[1fr_1.15fr] md:items-start">
          <div className="card p-6 md:p-8">
            <h3 className="t-h3">{basic.name}</h3>
            <p className="t-small">{basic.tagline}</p>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="text-[2.75rem] font-semibold leading-none">{basic.price}</span>
              <span className="text-graphite">ريال</span>
            </p>
            <ul className="mt-6 space-y-3">
              {basic.features.map((f) => (
                <li key={f} className="flex gap-3 text-[0.9375rem]">
                  <CheckIcon className="mt-1 shrink-0 text-ok" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[var(--radius-card)] border-2 border-ink bg-paper p-6 md:p-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="t-h3">{full.name}</h3>
                <p className="t-small">{full.tagline}</p>
              </div>
              <span className="rounded-full bg-marker px-3 py-1 text-[0.8125rem] font-medium">ننصحك فيها</span>
            </div>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="text-[2.75rem] font-semibold leading-none">{full.price}</span>
              <span className="text-graphite">ريال</span>
            </p>
            <ul className="mt-6 space-y-3">
              {full.features.map((f) => (
                <li key={f} className="flex gap-3 text-[0.9375rem]">
                  <CheckIcon className="mt-1 shrink-0 text-ok" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/create" className="btn btn-primary btn-lg btn-block mt-8">
              ابدأ سيرتك مجاناً
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <PaymentMarks />
          <p className="t-small">السعر اللي تشوفه هو اللي تدفعه، بدون رسوم إضافية.</p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { PaymentMarks } from "@/app/components/home/pricing";
import { CheckIcon, LockIcon } from "@/app/components/icons";
import type { CvLang, PlanId } from "@/lib/cv/types";
import { PLANS } from "@/lib/pricing";
import MoyasarForm from "./moyasar-form";

type PaywallProps = {
  cvId: string;
  userId: string;
  primaryLang: CvLang;
  /** "upgrade" when the customer already holds the basic plan. */
  mode: "buy" | "upgrade";
  mock: boolean;
  onPaid: (paymentId: string, plan: PlanId) => void;
};

export default function Paywall({ cvId, userId, primaryLang, mode, mock, onPaid }: PaywallProps) {
  const [planId, setPlanId] = useState<PlanId>(mode === "upgrade" ? "upgrade" : "full");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const plan = PLANS[planId];
  const langName = primaryLang === "en" ? "الإنجليزية" : "العربية";

  const options: { id: PlanId; title: string; note: string }[] =
    mode === "upgrade"
      ? []
      : [
          { id: "full", title: PLANS.full.name, note: "العربي والإنجليزي + رسالة التقديم + LinkedIn + تعديلات 30 يوم" },
          { id: "basic", title: PLANS.basic.name, note: `النسخة ${langName} فقط، PDF و Word` },
        ];

  return (
    <section id="pay" className="scroll-mt-24 rounded-[var(--radius-card)] border-2 border-ink bg-paper p-5" aria-labelledby="pay-title">
      <h2 id="pay-title" className="t-h3 flex items-center gap-2">
        <LockIcon size={18} />
        {mode === "upgrade" ? "أضف اللغة الثانية وكل الإضافات" : "افتح سيرتك وحمّلها"}
      </h2>

      {mode === "upgrade" ? (
        <ul className="mt-3 space-y-2">
          {["السيرة باللغة الثانية (PDF و Word)", "رسالة تقديم بالعربي والإنجليزي", "نبذة وعنوان LinkedIn", "تعديلات وإعادة مطابقة لمدة 30 يوم"].map((f) => (
            <li key={f} className="flex gap-2 text-[0.9375rem]">
              <CheckIcon className="mt-1 shrink-0 text-ok" size={16} />
              {f}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 space-y-2.5" role="radiogroup" aria-label="اختر الباقة">
          {options.map((o) => {
            const selected = planId === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => { setPlanId(o.id); setPaying(false); setError(null); }}
                className={`flex w-full items-start gap-3 rounded-[var(--radius-control)] border p-3.5 text-start transition-colors ${
                  selected ? "border-ink bg-marker-soft" : "border-rule hover:border-ink"
                }`}
              >
                <span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-ink" : "border-mute"}`}>
                  {selected && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="font-medium">{o.title}</span>
                    <span className="shrink-0 font-semibold">{PLANS[o.id].price} ريال</span>
                  </span>
                  <span className="t-small block">{o.note}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {error && <p className="note note-bad mt-4" role="alert">{error}</p>}

      {!paying ? (
        <button type="button" className="btn btn-primary btn-lg btn-block mt-4" onClick={() => { setError(null); setPaying(true); }}>
          ادفع {plan.price} ريال وحمّل ملفاتك
        </button>
      ) : (
        <div className="mt-4">
          <MoyasarForm plan={plan} cvId={cvId} userId={userId} onPaid={(id) => onPaid(id, plan.id)} onError={setError} />
          {mock && (
            <button type="button" className="btn btn-marker btn-block mt-3" onClick={() => onPaid("mock-payment", plan.id)}>
              دفع تجريبي (بيئة التطوير)
            </button>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2 border-t border-rule pt-4">
        <PaymentMarks />
        <p className="t-small">دفعة وحدة بدون اشتراك. إذا ما عجبتك راسلنا خلال 24 ساعة ونرجّع لك المبلغ كامل.</p>
      </div>
    </section>
  );
}

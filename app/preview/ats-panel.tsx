import Link from "next/link";
import { CheckIcon, XIcon } from "@/app/components/icons";
import type { AtsReport } from "@/lib/cv/types";

function tone(score: number) {
  if (score >= 85) return { label: "ممتازة", color: "var(--color-ok)" };
  if (score >= 70) return { label: "جيدة", color: "var(--color-ok)" };
  if (score >= 55) return { label: "تحتاج تقوية", color: "var(--color-warn)" };
  return { label: "ضعيفة", color: "var(--color-bad)" };
}

/** The ATS report. Shown in full before payment: it is the proof, not the product. */
export default function AtsPanel({ report, editHref, canEdit }: { report: AtsReport; editHref: string; canEdit: boolean }) {
  const { label, color } = tone(report.score);
  const missing = report.keywords.filter((k) => !k.found);
  const found = report.keywords.filter((k) => k.found);
  const failed = report.groups.flatMap((g) => g.checks).filter((c) => !c.pass);

  return (
    <section className="card p-5" aria-labelledby="ats-title">
      <h2 id="ats-title" className="t-h3">فحص ATS</h2>

      <div className="mt-3 flex items-end gap-3">
        <span className="text-[3rem] font-semibold leading-none" style={{ color }}>
          <bdi dir="ltr">
            {report.score}
            <span className="text-[1.25rem]">%</span>
          </bdi>
        </span>
        <span className="pb-1 text-sm text-graphite">جاهزية {label}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-desk" aria-hidden>
        <div className="h-full rounded-full" style={{ width: `${report.score}%`, background: color }} />
      </div>

      <ul className="mt-4 space-y-2">
        {report.groups.map((group) => {
          const passed = group.checks.filter((c) => c.pass).length;
          return (
            <li key={group.id} className="flex items-center justify-between gap-3 text-[0.9375rem]">
              <span>{group.label}</span>
              <span className={passed === group.checks.length ? "text-ok" : "text-warn"}>
                {passed} من {group.checks.length}
              </span>
            </li>
          );
        })}
      </ul>

      {report.keywords.length > 0 && (
        <div className="mt-5 border-t border-rule pt-4">
          <p className="font-medium">
            {report.fromJobAd ? "المطابقة مع إعلان الوظيفة" : "كلمات مجالك المفتاحية"}:{" "}
            <bdi dir="ltr">{report.matchPercent}%</bdi>
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {found.map((k) => (
              <span key={k.term} className="rounded-md bg-marker px-2 py-0.5 text-[0.8125rem] text-brand-deep">
                {k.term}
              </span>
            ))}
            {missing.map((k) => (
              <span key={k.term} className="rounded-md border border-dashed border-mute px-2 py-0.5 text-[0.8125rem] text-graphite">
                {k.term}
              </span>
            ))}
          </div>
          <p className="hint">
            المظلّل موجود في سيرتك. {missing.length > 0 && "المنقّط ناقص — ما أضفناه لأنك ما ذكرته."}
          </p>
          {missing.length > 0 && canEdit && (
            <p className="t-small mt-2">
              عندك خبرة فعلية في وحدة من الناقص؟{" "}
              <Link href={editHref} className="link">أضفها في بياناتك</Link> وأعد الإنشاء.
            </p>
          )}
        </div>
      )}

      <details className="group mt-4 border-t border-rule pt-3">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-[0.9375rem] font-medium [&::-webkit-details-marker]:hidden">
          التقرير بالتفصيل
          <span className="text-sm font-normal text-mute group-open:hidden">
            {failed.length === 0 ? "كل البنود ناجحة" : `${failed.length} بند يحتاج تعديل`}
          </span>
        </summary>
        <div className="mt-2 space-y-4">
          {report.groups.map((group) => (
            <div key={group.id}>
              <p className="text-[0.8125rem] font-medium text-mute">{group.label}</p>
              <ul className="mt-1.5 space-y-2.5">
                {group.checks.map((check) => (
                  <li key={check.id} className="flex gap-2.5">
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        check.pass ? "bg-ok-soft text-ok" : "bg-bad-soft text-bad"
                      }`}
                    >
                      {check.pass ? <CheckIcon size={12} /> : <XIcon size={12} />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.9375rem]">{check.label}</span>
                      <span className="block text-[0.8125rem] font-light leading-relaxed text-graphite">{check.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="hint">
            الفحص يقيس جاهزية الملف للقراءة الآلية وتغطيته للكلمات المفتاحية. ما فيه نظام ATS موحّد، والنتيجة مو ضمان للقبول.
          </p>
        </div>
      </details>
    </section>
  );
}

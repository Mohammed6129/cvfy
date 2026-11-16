"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import CvSheet from "@/app/components/cv-sheet";
import { LockIcon, PenIcon } from "@/app/components/icons";
import { arCount } from "@/lib/cv/text";
import type { CvLang, CvView, PlanId } from "@/lib/cv/types";
import { PLANS } from "@/lib/pricing";
import AtsPanel from "./ats-panel";
import Downloads from "./downloads";
import Paywall from "./paywall";

type PreviewClientProps = {
  cvId: string;
  userId: string;
  mock: boolean;
  /** Present when the shopper has just come back from Moyasar. */
  payment: { id: string; status: string; message: string; plan: string } | null;
};

type Loaded = { view: CvView | null; legacy: boolean; jobTitle: string };

const LANG_TAB: Record<CvLang, string> = { en: "الإنجليزية", ar: "العربية" };

export default function PreviewClient({ cvId, userId, mock, payment }: PreviewClientProps) {
  const router = useRouter();
  const [data, setData] = useState<Loaded | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lang, setLang] = useState<CvLang>("en");
  const [verifying, setVerifying] = useState(Boolean(payment && payment.status === "paid"));
  const [payMessage, setPayMessage] = useState<{ kind: "ok" | "bad"; text: string } | null>(null);
  const [completing, setCompleting] = useState(false);
  const booted = useRef(false);
  const completed = useRef(false);

  const complete = useCallback(async () => {
    if (completed.current) return;
    completed.current = true;
    setCompleting(true);
    try {
      const res = await fetch(`/api/cv/${cvId}/complete`, { method: "POST" });
      const json = (await res.json().catch(() => ({}))) as { view?: CvView };
      if (res.ok && json.view) setData((prev) => (prev ? { ...prev, view: json.view! } : prev));
      else completed.current = false;
    } catch {
      completed.current = false;
    } finally {
      setCompleting(false);
    }
  }, [cvId]);

  const load = useCallback(async (): Promise<Loaded | null> => {
    try {
      const res = await fetch(`/api/cv/${cvId}`, { cache: "no-store" });
      if (res.status === 401) {
        router.push(`/login?next=${encodeURIComponent(`/preview?cv=${cvId}`)}`);
        return null;
      }
      if (res.status === 404) {
        setLoadError("ما لقينا هذي السيرة في حسابك.");
        return null;
      }
      const json = (await res.json()) as Loaded;
      if (!json.view) {
        // Saved as a draft but never written — send them back to finish it.
        router.replace(`/create?edit=${cvId}`);
        return null;
      }
      setData(json);
      setLang((current) => (json.view?.docs[current] ? current : json.view!.primaryLang));

      // Full plan: write the second language and the extras once, right after
      // payment or after a regeneration.
      const v = json.view;
      const other: CvLang = v.primaryLang === "en" ? "ar" : "en";
      if (v.paid && v.plan === "full" && !json.legacy && (!v.docs[other] || !v.extras)) void complete();
      return json;
    } catch {
      setLoadError("ما قدرنا نحمّل سيرتك. تأكد من الإنترنت وحدّث الصفحة.");
      return null;
    }
  }, [cvId, router, complete]);

  const verify = useCallback(
    async (paymentId: string, plan: string) => {
      setVerifying(true);
      setPayMessage(null);
      try {
        const res = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cvId, paymentId, plan }),
        });
        const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
        if (res.ok && json.ok) {
          setPayMessage({ kind: "ok", text: "تم الدفع. ملفاتك جاهزة للتحميل." });
          completed.current = false;
          await load();
          // Bring the confirmation and the download list into view.
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          setPayMessage({ kind: "bad", text: json.error || "ما قدرنا نتأكد من الدفع." });
        }
      } catch {
        setPayMessage({ kind: "bad", text: "انقطع الاتصال أثناء تأكيد الدفع. حدّث الصفحة — دفعتك محفوظة." });
      } finally {
        setVerifying(false);
      }
    },
    [cvId, load]
  );

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    const boot = async () => {
      if (payment) {
        // Drop the payment query string so a refresh never re-submits it.
        window.history.replaceState({}, "", `/preview?cv=${encodeURIComponent(cvId)}`);
        if (payment.status === "paid") {
          await verify(payment.id, payment.plan || "full");
          return;
        }
        setPayMessage({ kind: "bad", text: "ما تمت عملية الدفع، وما انخصم منك شي. تقدر تجرّب مرة ثانية." });
      }
      await load();
    };
    void boot();
  }, [cvId, load, payment, verify]);

  const view = data?.view ?? null;

  if (loadError) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="note note-bad" role="alert">{loadError}</p>
        <Link href="/my-cvs" className="btn btn-primary mt-5">سيري الذاتية</Link>
      </div>
    );
  }

  if (!view || !data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-mute" role="status">
        <span className="spinner" />
        <span>{verifying ? "نتأكد من الدفع…" : "نحمّل سيرتك…"}</span>
      </div>
    );
  }

  const doc = view.docs[lang] ?? view.docs[view.primaryLang]!;
  const report = view.ats[lang] ?? view.ats[view.primaryLang];
  const langs = (["en", "ar"] as const).filter((l) => view.docs[l]);
  const editHref = `/create?edit=${view.id}`;
  const canEdit = !data.legacy && view.generationsLeft > 0;
  const highlight = view.paid ? (report?.keywords.filter((k) => k.found).map((k) => k.term) ?? []) : [];

  return (
    <div className="wrap pb-28 pt-6 md:pb-12 md:pt-10">
      <header className="mb-6 max-w-3xl">
        <h1 className="t-h2">{view.paid ? "سيرتك جاهزة للتقديم" : "سيرتك انكتبت"}</h1>
        <p className="t-body mt-1">
          {view.paid
            ? "حمّل ملفاتك من القائمة. وإذا قدّمت على وظيفة ثانية، عدّل الإعلان وأعد المطابقة."
            : `كتبنا لك ${arCount(view.stats.bullets, ["إنجاز", "إنجازين", "إنجازات", "إنجازاً"])} و${arCount(view.stats.skills, ["مهارة", "مهارتين", "مهارات", "مهارة"])}${data.jobTitle ? ` على مقاس «${data.jobTitle}»` : ""}. هذي معاينة: الجزء الواضح من سيرتك الفعلية، والباقي ينفتح بعد الدفع.`}
        </p>
      </header>

      {payMessage && (
        <p className={`note mb-5 ${payMessage.kind === "ok" ? "note-ok" : "note-bad"}`} role="status">
          {payMessage.text}
        </p>
      )}
      {verifying && (
        <p className="note note-info mb-5 flex items-center gap-2" role="status">
          <span className="spinner" /> نتأكد من الدفع…
        </p>
      )}
      {data.legacy && (
        <p className="note note-info mb-5">
          هذي سيرة من النسخة السابقة للموقع. تقدر تحمّل ملفاتها، وإذا تبغى تعدّل ابدأ{" "}
          <Link href="/create?new=1" className="link">سيرة جديدة</Link>.
        </p>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_23rem]">
        {/* ── The sheet ── */}
        <div className={`min-w-0 ${view.paid ? "order-2 lg:order-1" : ""}`}>
          {langs.length > 1 && (
            <div role="tablist" aria-label="لغة السيرة" className="mb-3 inline-flex rounded-full border border-rule bg-paper p-1">
              {langs.map((l) => (
                <button
                  key={l}
                  type="button"
                  role="tab"
                  aria-selected={lang === l}
                  onClick={() => setLang(l)}
                  className={`min-h-10 rounded-full px-5 text-sm ${lang === l ? "bg-ink font-medium text-white" : "text-graphite hover:text-ink"}`}
                >
                  {LANG_TAB[l]}
                </button>
              ))}
            </div>
          )}

          <div className="relative text-[clamp(7.5px,2.45vw,12.5px)]">
            <CvSheet doc={doc} highlight={highlight} className={view.locked ? "select-none" : ""} />

            {view.locked && (
              <a
                href="#pay"
                className="absolute inset-x-[8%] bottom-[9%] hidden items-center lg:flex justify-between gap-3 rounded-[var(--radius-card)] bg-ink px-5 py-4 text-[1rem] text-white shadow-[var(--shadow-pop)] hover:bg-ink-soft"
              >
                <span className="flex items-center gap-3">
                  <LockIcon size={20} />
                  <span>
                    <span className="block font-medium">الباقي مقفول</span>
                    <span className="block text-[0.8125rem] font-light text-white/75">يظهر كامل ويتحمّل بعد الدفع</span>
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-marker px-3 py-1 text-sm font-semibold text-ink">
                  من {PLANS.basic.price} ريال
                </span>
              </a>
            )}
          </div>

          {view.showcase && view.locked && (
            <section className="card mt-6 p-5" aria-labelledby="showcase-title">
              <h2 id="showcase-title" className="t-h3">من كلامك لسيرتك</h2>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-1.5 text-[0.8125rem] font-medium text-mute">أنت كتبت</p>
                  <p className="t-hand rounded-[var(--radius-control)] bg-desk px-4 py-3 leading-[2]">{view.showcase.before}</p>
                </div>
                <div>
                  <p className="mb-1.5 text-[0.8125rem] font-medium text-mute">وصارت في سيرتك</p>
                  <p
                    dir={view.primaryLang === "en" ? "ltr" : "rtl"}
                    className={`rounded-[var(--radius-control)] border border-rule px-4 py-3 leading-relaxed ${view.primaryLang === "en" ? "text-left" : ""}`}
                  >
                    {view.showcase.after}
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* ── Side column ── */}
        <aside className={`space-y-5 lg:sticky lg:top-24 ${view.paid ? "order-1 lg:order-2" : ""}`}>
          {view.paid ? (
            <Downloads view={view} completing={completing} />
          ) : (
            <Paywall
              cvId={view.id}
              userId={userId}
              primaryLang={view.primaryLang}
              mode="buy"
              mock={mock}
              onPaid={(id: string, plan: PlanId) => void verify(id, plan)}
            />
          )}

          {report && <AtsPanel report={report} editHref={editHref} canEdit={canEdit} />}

          {view.paid && view.plan === "basic" && !data.legacy && (
            <Paywall
              cvId={view.id}
              userId={userId}
              primaryLang={view.primaryLang}
              mode="upgrade"
              mock={mock}
              onPaid={(id: string, plan: PlanId) => void verify(id, plan)}
            />
          )}

          {!data.legacy && (
            <section className="card p-5">
              <h2 className="t-h3">تبغى تغيّر شي؟</h2>
              {canEdit ? (
                <>
                  <p className="t-small mt-1">
                    عدّل بياناتك أو بدّل إعلان الوظيفة ونعيد كتابة السيرة. باقي لك{" "}
                    {arCount(view.generationsLeft, ["مرة", "مرتين", "مرات", "مرة"])}.
                  </p>
                  <Link href={editHref} className="btn btn-ghost btn-block mt-3">
                    <PenIcon size={16} />
                    عدّل البيانات وأعد الإنشاء
                  </Link>
                </>
              ) : (
                <p className="t-small mt-1">
                  {view.paid
                    ? "انتهت فترة التعديل لهذي السيرة. ملف Word تقدر تعدّله بنفسك أي وقت."
                    : "خلّصت مرات إعادة الإنشاء المجانية. بعد الدفع تنفتح لك مرات إضافية."}
                </p>
              )}
            </section>
          )}
        </aside>
      </div>

      {/* Mobile: the pay action is always one thumb away. */}
      {view.locked && (
        <div className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-rule bg-paper/95 p-3 backdrop-blur-md lg:hidden">
          <a href="#pay" className="btn btn-primary btn-block">
            <LockIcon size={18} />
            افتح سيرتك كاملة — من {PLANS.basic.price} ريال
          </a>
        </div>
      )}
    </div>
  );
}

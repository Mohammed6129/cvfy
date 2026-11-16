"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, DownloadIcon } from "@/app/components/icons";
import type { CvLang, CvView } from "@/lib/cv/types";

function FileLink({ href, title, note }: { href: string; title: string; note: string }) {
  return (
    <a href={href} download className="flex min-h-14 items-center justify-between gap-3 rounded-[var(--radius-control)] border border-rule px-4 py-2.5 hover:border-ink">
      <span>
        <span className="block font-medium">{title}</span>
        <span className="block text-[0.8125rem] font-light text-graphite">{note}</span>
      </span>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white">
        <DownloadIcon size={16} />
      </span>
    </a>
  );
}

function CopyBlock({ title, text, dir = "rtl" }: { title: string; text: string; dir?: "rtl" | "ltr" }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked: the text is selectable, so nothing is lost.
    }
  };

  return (
    <div className="rounded-[var(--radius-control)] border border-rule">
      <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-2">
        <p className="text-[0.9375rem] font-medium">{title}</p>
        <button type="button" onClick={copy} className="btn btn-quiet btn-sm">
          {copied ? <CheckIcon size={16} className="text-ok" /> : <CopyIcon size={16} />}
          {copied ? "انتسخ" : "انسخ"}
        </button>
      </div>
      <p dir={dir} className={`max-h-56 overflow-y-auto whitespace-pre-line px-4 py-3 text-[0.9375rem] leading-relaxed text-graphite ${dir === "ltr" ? "text-left" : ""}`}>
        {text}
      </p>
    </div>
  );
}

const LANG_NAME: Record<CvLang, string> = { en: "الإنجليزية", ar: "العربية" };

/** Shown after payment: every file, plus the texts that go with the application. */
export default function Downloads({ view, completing }: { view: CvView; completing: boolean }) {
  const langs = (["en", "ar"] as const).filter((l) => view.docs[l]);
  const file = (lang: CvLang, format: string) => `/api/cv/${view.id}/file?lang=${lang}&format=${format}`;
  const other: CvLang = view.primaryLang === "en" ? "ar" : "en";

  return (
    <section className="card p-5" aria-labelledby="files-title">
      <h2 id="files-title" className="t-h3">ملفاتك</h2>

      <div className="mt-3 space-y-5">
        {langs.map((lang) => (
          <div key={lang}>
            <p className="mb-2 text-[0.8125rem] font-medium text-mute">النسخة {LANG_NAME[lang]}</p>
            <div className="space-y-2">
              <FileLink href={file(lang, "pdf")} title="PDF" note="للتقديم المباشر والإيميل" />
              <FileLink
                href={file(lang, "docx")}
                title="Word"
                note={lang === "ar" ? "الأضمن للرفع على بوابات التوظيف بالعربي" : "قابل للتعديل وللرفع على بوابات التوظيف"}
              />
              {view.ats[lang] && <FileLink href={file(lang, "report")} title="تقرير ATS" note="PDF بالعربي" />}
            </div>
          </div>
        ))}

        {view.plan === "full" && !view.docs[other] && (
          <p className="note note-info flex items-center gap-2" role="status">
            {completing && <span className="spinner shrink-0" />}
            {completing ? `نكتب نسختك ${LANG_NAME[other]} ورسالة التقديم… تقريباً نص دقيقة.` : `النسخة ${LANG_NAME[other]} لسا ما تجهزت. حدّث الصفحة.`}
          </p>
        )}
      </div>

      {view.extras && (
        <div className="mt-6 space-y-3 border-t border-rule pt-5">
          <h3 className="font-medium">نصوص ترسلها مع سيرتك</h3>
          <CopyBlock title="رسالة تقديم — إنجليزي" text={view.extras.coverLetter.en} dir="ltr" />
          <CopyBlock title="رسالة تقديم — عربي" text={view.extras.coverLetter.ar} />
          <CopyBlock title="عنوان LinkedIn" text={view.extras.linkedInHeadline} dir="ltr" />
          <CopyBlock title="نبذة LinkedIn (About)" text={view.extras.linkedInAbout} dir="ltr" />
        </div>
      )}
    </section>
  );
}

"use client";

import { useState } from "react";
import CvSheet from "@/app/components/cv-sheet";
import {
  SAMPLE_AR,
  SAMPLE_EN,
  SAMPLE_KEYWORDS_AR,
  SAMPLE_KEYWORDS_EN,
} from "@/lib/cv/sample";
import type { CvLang } from "@/lib/cv/types";

export default function SampleSwitcher() {
  const [lang, setLang] = useState<CvLang>("en");

  return (
    <div>
      <div role="tablist" aria-label="لغة المثال" className="mb-3 inline-flex rounded-full border border-rule bg-paper p-1">
        {(["en", "ar"] as const).map((l) => (
          <button
            key={l}
            role="tab"
            type="button"
            aria-selected={lang === l}
            onClick={() => setLang(l)}
            className={`min-h-10 rounded-full px-5 text-sm transition-colors ${
              lang === l ? "bg-ink font-medium text-white" : "text-graphite hover:text-ink"
            }`}
          >
            {l === "en" ? "النسخة الإنجليزية" : "النسخة العربية"}
          </button>
        ))}
      </div>

      <div className="text-[clamp(7.5px,2.35vw,11.5px)]">
        <CvSheet
          doc={lang === "en" ? SAMPLE_EN : SAMPLE_AR}
          highlight={lang === "en" ? SAMPLE_KEYWORDS_EN : SAMPLE_KEYWORDS_AR}
        />
      </div>
      <p className="t-small mt-3">مثال توضيحي لشخصية غير حقيقية.</p>
    </div>
  );
}

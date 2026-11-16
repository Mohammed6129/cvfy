import type { ReactNode } from "react";
import PageShell from "./page-shell";

/** Long-form reading pages: one column, comfortable measure. */
export default function ProsePage({ title, lead, children }: { title: string; lead?: string; children: ReactNode }) {
  return (
    <PageShell>
      <article className="wrap wrap-narrow py-10 md:py-16">
        <h1 className="t-display text-[clamp(1.75rem,5vw,2.75rem)]">{title}</h1>
        {lead && <p className="t-lead mt-4">{lead}</p>}
        <div className="mt-8 space-y-4 text-[1.0625rem] leading-[2] text-graphite [&_h2]:mt-10 [&_h2]:text-[1.375rem] [&_h2]:font-semibold [&_h2]:leading-snug [&_h2]:text-ink [&_li]:ps-1 [&_strong]:font-medium [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:ps-6">
          {children}
        </div>
      </article>
    </PageShell>
  );
}

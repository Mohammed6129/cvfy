import { writeExtras } from "@/lib/ai/extras";
import { writeCv } from "@/lib/ai/write";
import { criticalFixes, runAtsCheck } from "@/lib/ats/check";
import { truncate } from "@/lib/cv/text";
import type { CvDoc, CvForm, CvLang, CvStored, Interview } from "@/lib/cv/types";

const REWRITE_BUDGET_MS = 22_000;

/** Write one language version and score it; one automatic rewrite if the draft has avoidable flaws. */
async function writeAndCheck(form: CvForm, interview: Interview | null, lang: CvLang) {
  const job = interview?.job ?? null;
  const fromJobAd = form.target.jobAd.trim().length > 80;

  const started = Date.now();
  const first = await writeCv(form, interview, lang);
  let doc = first.doc;
  let report = runAtsCheck(doc, job, { fromJobAd });

  // A second pass only when there is time for it inside one serverless invocation.
  const fixes = criticalFixes(doc, report);
  if (fixes.length > 0 && Date.now() - started < REWRITE_BUDGET_MS) {
    try {
      const second = await writeCv(form, interview, lang, fixes);
      const secondReport = runAtsCheck(second.doc, job, { fromJobAd });
      if (secondReport.score >= report.score) {
        doc = second.doc;
        report = secondReport;
      }
    } catch (error) {
      console.error("[generate] rewrite pass failed, keeping first draft:", error);
    }
  }

  return { doc, report };
}

function buildShowcase(form: CvForm, doc: CvDoc): CvStored["showcase"] {
  const firstExp = doc.experience[0];
  if (firstExp) {
    const source = form.experience.find((x) => x.id === firstExp.refId);
    if (source?.description && firstExp.bullets[0]) {
      return { before: truncate(source.description, 170), after: firstExp.bullets[0] };
    }
  }
  const firstProject = doc.projects[0];
  if (firstProject?.bullets[0] && form.projects[0]?.description) {
    return { before: truncate(form.projects[0].description, 170), after: firstProject.bullets[0] };
  }
  return null;
}

/** The free step: the primary-language CV + its ATS report. */
export async function generatePrimary(
  form: CvForm,
  interview: Interview | null,
  previous: CvStored | null
): Promise<CvStored> {
  const lang = form.primaryLang;
  const { doc, report } = await writeAndCheck(form, interview, lang);
  const now = new Date().toISOString();

  return {
    v: 2,
    primaryLang: lang,
    // A regenerated CV invalidates the other language and the extras; they are rebuilt on demand.
    docs: { [lang]: doc },
    ats: { [lang]: report },
    extras: null,
    showcase: buildShowcase(form, doc),
    meta: {
      generations: (previous?.meta.generations ?? 0) + 1,
      createdAt: previous?.meta.createdAt ?? now,
      updatedAt: now,
      paidAt: previous?.meta.paidAt ?? null,
      plan: previous?.meta.plan ?? null,
    },
  };
}

/** The paid step (full plan): second language + cover letter + LinkedIn texts. */
export async function completeFull(
  form: CvForm,
  interview: Interview | null,
  stored: CvStored
): Promise<CvStored> {
  const other: CvLang = stored.primaryLang === "en" ? "ar" : "en";
  const needsDoc = !stored.docs[other];
  const needsExtras = !stored.extras;
  if (!needsDoc && !needsExtras) return stored;

  const [second, extras] = await Promise.all([
    needsDoc ? writeAndCheck(form, interview, other) : Promise.resolve(null),
    needsExtras
      ? writeExtras(form, stored.docs).catch((error) => {
          console.error("[generate] extras failed:", error);
          return null;
        })
      : Promise.resolve(stored.extras),
  ]);

  return {
    ...stored,
    docs: second ? { ...stored.docs, [other]: second.doc } : stored.docs,
    ats: second ? { ...stored.ats, [other]: second.report } : stored.ats,
    extras: extras ?? stored.extras,
    meta: { ...stored.meta, updatedAt: new Date().toISOString() },
  };
}

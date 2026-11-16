/**
 * What leaves the server.
 *
 * Until a CV is paid for, the browser gets a redacted copy: the user's own
 * facts (name, employers, dates, degree) plus one real sample of the writing,
 * with every other written line replaced by placeholder words. The real text
 * is never sent, so it cannot be copied from the page source or the network tab.
 */
import { LOCK } from "@/lib/cv/lock";
import { wordCount } from "@/lib/cv/text";
import type { CvDoc, CvLang, CvListItem, CvView } from "@/lib/cv/types";
import { EDIT_WINDOW_DAYS, GENERATION_LIMITS } from "@/lib/pricing";
import type { CvRow } from "./repo";
import type { SessionUser } from "./session";

const FILLER: Record<CvLang, string[]> = {
  en: ["managed", "delivery", "across", "teams", "improved", "reporting", "process", "clients", "quality", "results", "with", "and", "operations", "support", "planning", "by"],
  ar: ["إدارة", "تطوير", "فريق", "العمل", "تقارير", "العملاء", "تحسين", "متابعة", "وفق", "الجودة", "مع", "تنفيذ", "خطط", "الأداء", "نتائج", "في"],
};

function filler(words: number, lang: CvLang, seed: number): string {
  const pool = FILLER[lang];
  const out: string[] = [];
  for (let i = 0; i < Math.max(3, words); i++) out.push(pool[(seed * 7 + i * 5) % pool.length]);
  return `${LOCK}${out.join(" ")}`;
}

function firstSentence(text: string): { head: string; restWords: number } {
  const match = text.match(/^(.{20,160}?[.؟!])\s/);
  const head = match ? match[1] : text.split(/\s+/).slice(0, 14).join(" ");
  return { head, restWords: Math.max(8, wordCount(text) - wordCount(head)) };
}

export function redactDoc(doc: CvDoc): CvDoc {
  const { head, restWords } = firstSentence(doc.summary);
  let seed = 1;

  return {
    ...doc,
    summary: `${head} ${filler(restWords, doc.lang, seed++)}`,
    experience: doc.experience.map((x, xi) => ({
      ...x,
      bullets: x.bullets.map((b, bi) => (xi === 0 && bi === 0 ? b : filler(wordCount(b), doc.lang, seed++))),
    })),
    projects: doc.projects.map((p, pi) => ({
      ...p,
      bullets: p.bullets.map((b, bi) =>
        doc.experience.length === 0 && pi === 0 && bi === 0 ? b : filler(wordCount(b), doc.lang, seed++)
      ),
    })),
    skills: doc.skills.map((g, gi) => ({
      ...g,
      items: g.items.map((item, ii) => (gi === 0 && ii < 3 ? item : filler(Math.max(1, wordCount(item)), doc.lang, seed++))),
    })),
  };
}

function docStats(doc: CvDoc | undefined) {
  if (!doc) return { bullets: 0, skills: 0, words: 0 };
  const bullets = [...doc.experience.flatMap((x) => x.bullets), ...doc.projects.flatMap((p) => p.bullets)];
  return {
    bullets: bullets.length,
    skills: doc.skills.reduce((n, g) => n + g.items.length, 0),
    words: wordCount([doc.summary, ...bullets].join(" ")),
  };
}

export function accessFor(row: CvRow, user: SessionUser): { paid: boolean; plan: "basic" | "full" | null } {
  if (user.isTester) return { paid: true, plan: "full" };
  if (!row.isPaid) return { paid: false, plan: null };
  return { paid: true, plan: row.paidPlan === "basic" ? "basic" : "full" };
}

export function generationsLeft(row: CvRow, user: SessionUser): number {
  const stored = row.stored;
  const used = stored?.meta.generations ?? 0;
  const { paid, plan } = accessFor(row, user);
  if (!paid || !plan) return Math.max(0, GENERATION_LIMITS.beforePayment - used);

  const paidAt = stored?.meta.paidAt ? new Date(stored.meta.paidAt).getTime() : Date.now();
  const windowMs = EDIT_WINDOW_DAYS[plan] * 24 * 3600 * 1000;
  if (!user.isTester && Date.now() - paidAt > windowMs) return 0;
  return Math.max(0, GENERATION_LIMITS[plan] - used);
}

export function buildView(row: CvRow, user: SessionUser): CvView | null {
  const stored = row.stored;
  if (!stored) return null;

  const { paid, plan } = accessFor(row, user);
  const primary = stored.primaryLang;
  const primaryDoc = stored.docs[primary];
  if (!primaryDoc) return null;

  let docs: CvView["docs"];
  let ats: CvView["ats"];

  if (!paid) {
    docs = { [primary]: redactDoc(primaryDoc) };
    ats = { [primary]: stored.ats[primary] };
  } else if (plan === "basic") {
    docs = { [primary]: primaryDoc };
    ats = { [primary]: stored.ats[primary] };
  } else {
    docs = stored.docs;
    ats = stored.ats;
  }

  return {
    id: row.id,
    paid,
    plan,
    primaryLang: primary,
    docs,
    locked: !paid,
    ats,
    extras: paid && plan === "full" ? stored.extras : null,
    showcase: stored.showcase,
    stats: docStats(primaryDoc),
    generationsLeft: row.legacy ? 0 : generationsLeft(row, user),
    updatedAt: row.updatedAt,
  };
}

export function toListItem(row: CvRow, user: SessionUser): CvListItem {
  const { paid, plan } = accessFor(row, user);
  const primary = row.stored?.primaryLang;
  return {
    id: row.id,
    title: row.title,
    jobTitle: row.form?.target.jobTitle ?? (primary ? (row.stored?.docs[primary]?.headline ?? "") : ""),
    paid,
    plan,
    hasDoc: Boolean(primary && row.stored?.docs[primary]),
    score: primary ? (row.stored?.ats[primary]?.score ?? null) : null,
    updatedAt: row.updatedAt,
  };
}

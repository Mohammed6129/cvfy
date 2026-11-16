/** Text hygiene shared by the writer, the ATS checker and the file renderers. */

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/gu;
const BOX = /[│┃─━┌┐└┘├┤┬┴┼═║╔╗╚╝▪■□●○◆◇★☆✓✔✗✘➤➔►▶]/g;

/** One clean line: no emoji, no decorative glyphs, no markdown, single spaces. */
export function cleanLine(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(EMOJI, "")
    .replace(BOX, "")
    .replace(/\*\*|__|`/g, "")
    .replace(/^[\s•\-–—*·]+/, "")
    .replace(/[\t\r\n]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,،؛:])/g, "$1")
    .trim();
}

export function cleanList(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of input) {
    const line = cleanLine(item);
    const key = line.toLowerCase();
    if (line && !seen.has(key)) {
      seen.add(key);
      out.push(line);
    }
  }
  return out;
}

export function wordCount(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

/** Fold Arabic spelling variants and case so keyword matching is fair. */
export function normalizeForMatch(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ً-ْـ]/g, "") // tashkeel + tatweel
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}+#.]+/gu, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function truncate(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : max)}…`;
}

/**
 * Arabic counted nouns: 1 → «إنجاز واحد», 2 → «إنجازان», 3–10 → «5 إنجازات», 11+ → «12 إنجازاً».
 * `forms` = [singular, dual, plural, accusative singular].
 */
export function arCount(n: number, forms: [string, string, string, string]): string {
  if (n === 1) return `${forms[0]} ${forms[0].endsWith("ة") ? "واحدة" : "واحد"}`;
  if (n === 2) return forms[1];
  const mod = n % 100;
  if (mod >= 3 && mod <= 10) return `${n} ${forms[2]}`;
  return `${n} ${forms[3]}`;
}

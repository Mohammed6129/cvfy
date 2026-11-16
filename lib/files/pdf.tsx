/**
 * PDF output — real text, single column, embedded fonts.
 *
 * Why this layout: applicant tracking systems read a PDF top-to-bottom as a
 * stream of text. One column, standard headings, no tables, text boxes,
 * icons or images means the parser sees exactly what the recruiter sees.
 */
import {
  Document,
  type DocumentProps,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { ReactElement, ReactNode } from "react";
import type { AtsReport, CvDoc, CvLang } from "@/lib/cv/types";
import {
  READEX_AR_BOLD,
  READEX_AR_REGULAR,
  READEX_AR_SEMIBOLD,
  READEX_LATIN_BOLD,
  READEX_LATIN_REGULAR,
  READEX_LATIN_SEMIBOLD,
} from "./font-data";

let fontsReady = false;

function ensureFonts() {
  if (fontsReady) return;
  Font.register({
    family: "ReadexArabic",
    fonts: [
      { src: READEX_AR_REGULAR, fontWeight: 400 },
      { src: READEX_AR_SEMIBOLD, fontWeight: 600 },
      { src: READEX_AR_BOLD, fontWeight: 700 },
    ],
  });
  Font.register({
    family: "ReadexLatin",
    fonts: [
      { src: READEX_LATIN_REGULAR, fontWeight: 400 },
      { src: READEX_LATIN_SEMIBOLD, fontWeight: 600 },
      { src: READEX_LATIN_BOLD, fontWeight: 700 },
    ],
  });
  // Never split a word across lines — hyphenated words break keyword matching.
  Font.registerHyphenationCallback((word) => [word]);
  fontsReady = true;
}

/**
 * Every render must start from freshly parsed font files.
 *
 * The font engine caches glyph objects on the parsed font, and embedding one
 * document can leave some of them without their character codes. Reused for
 * the next document, those glyphs lose Arabic letter joining (a wrong «ه»,
 * no «الله» ligature) and drop out of the PDF's text layer — exactly the
 * kind of damage an ATS would choke on. Renders are also queued, so two
 * requests in the same server instance never share half-used fonts.
 */
type FontSourceInternals = { data: unknown; loadResultPromise: unknown };

function resetParsedFonts() {
  const families = Font.getRegisteredFonts() as unknown as Record<string, { sources?: FontSourceInternals[] }>;
  for (const family of ["ReadexArabic", "ReadexLatin"]) {
    for (const source of families[family]?.sources ?? []) {
      source.data = null;
      source.loadResultPromise = null;
    }
  }
}

let renderQueue: Promise<unknown> = Promise.resolve();

function renderFresh(build: () => ReactElement<DocumentProps>): Promise<Buffer> {
  const job = renderQueue.then(() => {
    ensureFonts();
    resetParsedFonts();
    return renderToBuffer(build());
  });
  renderQueue = job.catch(() => undefined);
  return job;
}

export const SECTION_TITLES: Record<CvLang, Record<string, string>> = {
  en: {
    summary: "Professional Summary",
    experience: "Work Experience",
    projects: "Projects",
    education: "Education",
    skills: "Skills",
    certificates: "Certifications",
    languages: "Languages",
  },
  ar: {
    summary: "الملخص المهني",
    experience: "الخبرات العملية",
    projects: "المشاريع",
    education: "التعليم",
    skills: "المهارات",
    certificates: "الشهادات والدورات",
    languages: "اللغات",
  },
};

const INK = "#0F1B3D";
const BODY = "#1F2937";
const SOFT = "#4B5563";
const RULE = "#C9D0DC";

/** Arabic glyphs first, Latin glyphs (tool names, numbers, emails) from the matching Latin cut. */
const AR_FONT = ["ReadexArabic", "ReadexLatin"];

function makeStyles(lang: CvLang, dense: boolean) {
  const rtl = lang === "ar";
  const base = rtl ? (dense ? 9 : 9.6) : dense ? 9.4 : 10;
  const align = rtl ? "right" : "left";
  const dir = rtl ? "rtl" : "ltr";
  const row = rtl ? "row-reverse" : "row";
  const lh = rtl ? 1.62 : 1.42;

  return {
    rtl,
    sheet: StyleSheet.create({
      page: {
        fontFamily: rtl ? AR_FONT : "Helvetica",
        fontSize: base,
        color: BODY,
        paddingTop: dense ? 30 : 38,
        paddingBottom: dense ? 30 : 38,
        paddingHorizontal: dense ? 40 : 46,
        lineHeight: lh,
      },
      name: {
        fontSize: rtl ? 19 : 21,
        fontFamily: rtl ? AR_FONT : "Helvetica-Bold",
        fontWeight: 700,
        color: INK,
        textAlign: align,
        direction: dir,
        lineHeight: 1.25,
      },
      headline: {
        fontSize: base + 1.2,
        color: INK,
        textAlign: align,
        direction: dir,
        marginTop: 2,
        fontFamily: rtl ? AR_FONT : "Helvetica",
        fontWeight: rtl ? 600 : 400,
      },
      contact: {
        fontSize: base - 0.8,
        color: SOFT,
        textAlign: align,
        direction: dir,
        marginTop: 4,
      },
      section: { marginTop: dense ? 9 : 12 },
      sectionTitle: {
        fontSize: base + 0.8,
        fontFamily: rtl ? AR_FONT : "Helvetica-Bold",
        fontWeight: 700,
        color: INK,
        textAlign: align,
        direction: dir,
        paddingBottom: 2.5,
        marginBottom: 5,
        borderBottomWidth: 0.8,
        borderBottomColor: RULE,
      },
      para: { textAlign: align, direction: dir },
      itemHead: { flexDirection: row, justifyContent: "space-between", alignItems: "flex-start" },
      itemTitle: {
        flex: 1,
        fontFamily: rtl ? AR_FONT : "Helvetica-Bold",
        fontWeight: rtl ? 600 : 700,
        color: INK,
        textAlign: align,
        direction: dir,
        fontSize: base + 0.3,
      },
      itemMeta: {
        fontSize: base - 0.6,
        color: SOFT,
        textAlign: rtl ? "left" : "right",
        direction: dir,
        marginLeft: rtl ? 0 : 10,
        marginRight: rtl ? 10 : 0,
      },
      itemSub: { color: SOFT, textAlign: align, direction: dir, fontSize: base - 0.2 },
      item: { marginBottom: dense ? 5 : 7 },
      bulletRow: { flexDirection: row, marginTop: 1.5 },
      bulletDot: { width: 10, textAlign: align, direction: dir, color: SOFT },
      bulletText: { flex: 1, textAlign: align, direction: dir },
      skillLine: { textAlign: align, direction: dir, marginBottom: 2 },
      // Nested runs need their own direction, or mixed Arabic/Latin lines reorder wrongly.
      bold: { fontFamily: rtl ? AR_FONT : "Helvetica-Bold", fontWeight: rtl ? 600 : 700, color: INK, direction: dir },
    }),
  };
}

/**
 * Contact details as separate runs. In an Arabic line, phone numbers and
 * emails each keep their own left-to-right direction, so "+966…" never
 * flips — without inserting invisible direction marks into the text.
 */
function ContactRow({ parts, s, rtl }: { parts: string[]; s: ReturnType<typeof makeStyles>["sheet"]; rtl: boolean }) {
  if (!rtl) return <Text style={s.contact}>{parts.join("  |  ")}</Text>;
  return (
    <View style={{ flexDirection: "row-reverse", flexWrap: "wrap", marginTop: 4 }}>
      {parts.map((part, i) => (
        <View key={i} style={{ flexDirection: "row-reverse" }}>
          {i > 0 && <Text style={[s.contact, { marginTop: 0, marginHorizontal: 5, color: RULE }]}>|</Text>}
          <Text style={[s.contact, { marginTop: 0, direction: /[\u0600-\u06FF]/.test(part) ? "rtl" : "ltr" }]}>{part}</Text>
        </View>
      ))}
    </View>
  );
}

function Section({
  title,
  s,
  children,
}: {
  title: string;
  s: ReturnType<typeof makeStyles>["sheet"];
  children: ReactNode;
}) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle} minPresenceAhead={36}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function Bullets({ items, s }: { items: string[]; s: ReturnType<typeof makeStyles>["sheet"] }) {
  return (
    <>
      {items.map((item, i) => (
        <View key={i} style={s.bulletRow} wrap={false}>
          <Text style={s.bulletDot}>•</Text>
          <Text style={s.bulletText}>{item}</Text>
        </View>
      ))}
    </>
  );
}

function estimateLines(doc: CvDoc): number {
  const perLine = doc.lang === "ar" ? 105 : 110;
  const lines = (text: string) => Math.max(1, Math.ceil(text.length / perLine));
  let total = 5 + lines(doc.summary) + 2;
  for (const x of doc.experience) total += 2.4 + x.bullets.reduce((n, b) => n + lines(b), 0);
  for (const p of doc.projects) total += 1.6 + p.bullets.reduce((n, b) => n + lines(b), 0);
  total += doc.education.length * 2.2 + 2;
  total += doc.skills.length * 1.3 + 2;
  total += doc.certificates.length * 1.2 + (doc.certificates.length ? 2 : 0);
  total += 3;
  return total;
}

// Note: <Document language> is deliberately not set. With a language tag the
// layout engine picks regional letter variants (e.g. a different medial Heh)
// and drops the «الله» ligature in some weights.
export function CvPdf({ doc }: { doc: CvDoc }): ReactElement<DocumentProps> {
  // Tighten spacing when the content would spill a few lines onto page 2.
  const dense = estimateLines(doc) > 50;
  const { sheet: s, rtl } = makeStyles(doc.lang, dense);
  const t = SECTION_TITLES[doc.lang];
  const sep = rtl ? "، " : ", ";

  const experience = doc.experience.length > 0 && (
    <Section title={t.experience} s={s}>
      {doc.experience.map((x, i) => (
        <View key={i} style={s.item}>
          <View style={s.itemHead} wrap={false}>
            <Text style={s.itemTitle}>{x.title}</Text>
            <Text style={s.itemMeta}>{x.period}</Text>
          </View>
          <Text style={s.itemSub}>{x.company}</Text>
          <Bullets items={x.bullets} s={s} />
        </View>
      ))}
    </Section>
  );

  const projects = doc.projects.length > 0 && (
    <Section title={t.projects} s={s}>
      {doc.projects.map((p, i) => (
        <View key={i} style={s.item}>
          <Text style={s.itemTitle}>{p.name}</Text>
          <Bullets items={p.bullets} s={s} />
        </View>
      ))}
    </Section>
  );

  const education = doc.education.length > 0 && (
    <Section title={t.education} s={s}>
      {doc.education.map((e, i) => (
        <View key={i} style={s.item} wrap={false}>
          <View style={s.itemHead}>
            <Text style={s.itemTitle}>{e.degree}</Text>
            <Text style={s.itemMeta}>{e.year}</Text>
          </View>
          <Text style={s.itemSub}>{[e.institution, e.detail].filter(Boolean).join(rtl ? " — " : " — ")}</Text>
        </View>
      ))}
    </Section>
  );

  return (
    <Document
      title={`${doc.name} — CV`}
      author={doc.name}
      subject={doc.headline}
      creator="CVfy"
      producer="CVfy"
    >
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{doc.name}</Text>
        {doc.headline ? <Text style={s.headline}>{doc.headline}</Text> : null}
        <ContactRow parts={doc.contact} s={s} rtl={rtl} />

        {doc.summary ? (
          <Section title={t.summary} s={s}>
            <Text style={s.para}>{doc.summary}</Text>
          </Section>
        ) : null}

        {doc.educationFirst ? (
          <>
            {education}
            {projects}
            {experience}
          </>
        ) : (
          <>
            {experience}
            {projects}
            {education}
          </>
        )}

        {doc.skills.length > 0 && (
          <Section title={t.skills} s={s}>
            {doc.skills.map((g, i) => (
              <Text key={i} style={s.skillLine}>
                {g.label ? <Text style={s.bold}>{`${g.label}: `}</Text> : null}
                {g.items.join(sep)}
              </Text>
            ))}
          </Section>
        )}

        {doc.certificates.length > 0 && (
          <Section title={t.certificates} s={s}>
            {doc.certificates.map((c, i) => (
              <Text key={i} style={s.skillLine}>
                <Text style={s.bold}>{c.name}</Text>
                {[c.issuer, c.year].filter(Boolean).length > 0 ? ` — ${[c.issuer, c.year].filter(Boolean).join(sep)}` : ""}
              </Text>
            ))}
          </Section>
        )}

        {doc.languages.length > 0 && (
          <Section title={t.languages} s={s}>
            <Text style={s.para}>
              {doc.languages.map((l) => (l.level ? `${l.name} (${l.level})` : l.name)).join(sep)}
            </Text>
          </Section>
        )}
      </Page>
    </Document>
  );
}

export async function renderCvPdf(doc: CvDoc): Promise<Buffer> {
  return renderFresh(() => CvPdf({ doc }));
}

/* ───────────── ATS report (Arabic) ───────────── */

export async function renderReportPdf(input: {
  name: string;
  jobTitle: string;
  report: AtsReport;
  langLabel: string;
}): Promise<Buffer> {
  const { sheet: s } = makeStyles("ar", false);
  const { report } = input;
  const found = report.keywords.filter((k) => k.found);
  const missing = report.keywords.filter((k) => !k.found);
  const r = { textAlign: "right" as const, direction: "rtl" as const };

  return renderFresh(() => (
    <Document title={`تقرير ATS — ${input.name}`} creator="CVfy" producer="CVfy">
      <Page size="A4" style={s.page}>
        <Text style={s.name}>تقرير فحص التوافق مع أنظمة التوظيف (ATS)</Text>
        <Text style={s.contact}>
          {`${input.name}  |  ${input.jobTitle}  |  ${input.langLabel}`}
        </Text>

        <View style={{ marginTop: 14, padding: 12, backgroundColor: "#F4F6FA", borderRadius: 6 }}>
          <Text style={{ ...r, fontSize: 26, fontWeight: 700, color: INK, lineHeight: 1.2 }}>{`${report.score}%`}</Text>
          <Text style={{ ...r, color: SOFT }}>
            {report.keywords.length > 0
              ? `النتيجة الكلية — تطابق الكلمات المفتاحية ${report.matchPercent}%`
              : "النتيجة الكلية"}
          </Text>
        </View>

        {report.groups.map((group) => (
          <Section key={group.id} title={group.label} s={s}>
            {group.checks.map((check) => (
              <View key={check.id} style={{ marginBottom: 5 }} wrap={false}>
                <Text style={{ ...r, fontWeight: 600, color: check.pass ? "#18794E" : "#C62F2F" }}>
                  {`${check.pass ? "ناجح" : "يحتاج تعديل"} — ${check.label}`}
                </Text>
                <Text style={{ ...r, color: SOFT }}>{check.detail}</Text>
              </View>
            ))}
          </Section>
        ))}

        {report.keywords.length > 0 && (
          <Section title="الكلمات المفتاحية" s={s}>
            <Text style={{ ...r, marginBottom: 4 }}>
              <Text style={s.bold}>موجودة في سيرتك: </Text>
              {found.length ? found.map((k) => k.term).join("، ") : "—"}
            </Text>
            <Text style={r}>
              <Text style={s.bold}>غير موجودة: </Text>
              {missing.length ? missing.map((k) => k.term).join("، ") : "لا يوجد — تغطية كاملة"}
            </Text>
            {missing.length > 0 && (
              <Text style={{ ...r, color: SOFT, marginTop: 4 }}>
                إذا عندك خبرة فعلية في أي كلمة من غير الموجودة، أضفها في بياناتك وأعد إنشاء السيرة. لا تضف مهارة ما تملكها — بتنسأل عنها في المقابلة.
              </Text>
            )}
          </Section>
        )}

        <Text style={{ ...r, color: SOFT, fontSize: 8, marginTop: 16 }}>
          هذا الفحص يقيس جاهزية الملف للقراءة الآلية وتغطيته للكلمات المفتاحية. لا يوجد نظام ATS موحّد، والنتيجة ليست ضماناً للقبول في أي وظيفة.
        </Text>
      </Page>
    </Document>
  ));
}

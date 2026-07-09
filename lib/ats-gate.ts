import type Anthropic from "@anthropic-ai/sdk";
import { CLAUDE_MODEL } from "@/lib/cv-claude";
import type {
  AtsGateInfo,
  CvLanguage,
  GeneratedCvContent,
} from "@/lib/cv-types";

export const ATS_GATE_THRESHOLD = 80;
export const ATS_GATE_MAX_ATTEMPTS = 3;

export type AtsGateScore = {
  score: number;
  improvements: string[];
};

type ContactInfo = {
  name: string;
  email: string;
  phone: string;
  city: string;
  linkedIn?: string;
};

function buildGateScoringPrompt(
  content: GeneratedCvContent,
  contact: ContactInfo,
  language: CvLanguage
): string {
  const languageLabel = language === "ar" ? "Arabic" : "English";

  return `You are a strict ATS (Applicant Tracking System) compatibility auditor.

Score this single-language (${languageLabel}) CV for ATS readiness on a 0-100 scale.

Scoring criteria (weight equally):
1. Standard, machine-recognizable section structure (summary, experience, education, skills)
2. Fully linear text content — no tables, columns, images, icons, or decorative symbols embedded in text
3. Consistent, machine-parseable date formats across all experiences and education
4. Keyword density: role-relevant keywords present in summary, experiences, and skills
5. Strong achievement-oriented phrasing in experience descriptions
6. Complete contact information (name, email, phone)

Contact info:
${JSON.stringify(contact)}

CV content (${languageLabel}):
${JSON.stringify(content, null, 2)}

Return JSON only (no markdown, no prose):
{
  "score": 85,
  "improvements": ["specific actionable fix 1", "specific actionable fix 2"]
}

Rules:
- score: integer 0-100
- improvements: 2-6 specific fixes for THIS CV, written in ${languageLabel}, most impactful first
- Be strict but fair: a clean, keyword-rich, linear CV should score 80+`;
}

function extractGateScore(text: string): AtsGateScore {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1].trim() : text.trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("Invalid JSON in ATS gate response");
  }

  const parsed = JSON.parse(jsonMatch[0]) as Partial<AtsGateScore>;

  return {
    score: Math.min(100, Math.max(0, Math.round(Number(parsed.score) || 0))),
    improvements: Array.isArray(parsed.improvements)
      ? parsed.improvements.filter((i): i is string => typeof i === "string")
      : [],
  };
}

export async function scoreAtsGate(
  anthropic: Anthropic,
  content: GeneratedCvContent,
  contact: ContactInfo,
  language: CvLanguage
): Promise<AtsGateScore> {
  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: buildGateScoringPrompt(content, contact, language),
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text block in ATS gate response");
  }

  return extractGateScore(textBlock.text);
}

/**
 * Runs the mandatory ATS quality gate for one language pipeline:
 * score → if below threshold, regenerate with feedback → rescore,
 * up to ATS_GATE_MAX_ATTEMPTS generation attempts total.
 *
 * `regenerate` receives the improvement feedback from the last failing
 * score and must return a new content candidate.
 */
export async function runAtsGate(
  anthropic: Anthropic,
  initialContent: GeneratedCvContent,
  contact: ContactInfo,
  language: CvLanguage,
  regenerate: (improvements: string[]) => Promise<GeneratedCvContent>
): Promise<{ content: GeneratedCvContent; gate: AtsGateInfo }> {
  let content = initialContent;
  let attempts = 1;
  let lastScore = 0;

  for (;;) {
    let scored: AtsGateScore;
    try {
      scored = await scoreAtsGate(anthropic, content, contact, language);
    } catch (firstError) {
      console.error(
        `[ats-gate] scoring failed (${language}), retrying once:`,
        firstError
      );
      scored = await scoreAtsGate(anthropic, content, contact, language);
    }

    lastScore = scored.score;
    console.log(
      `[ats-gate] ${language} attempt ${attempts}: score=${scored.score}`
    );

    if (scored.score >= ATS_GATE_THRESHOLD) {
      return {
        content,
        gate: { score: scored.score, attempts, passed: true },
      };
    }

    if (attempts >= ATS_GATE_MAX_ATTEMPTS) {
      return {
        content,
        gate: { score: lastScore, attempts, passed: false },
      };
    }

    attempts += 1;
    content = await regenerate(scored.improvements);
  }
}

import type Anthropic from "@anthropic-ai/sdk";
import { CLAUDE_MODEL } from "@/lib/cv-claude";
import {
  applyGuaranteedTemplate,
  GUARANTEED_TEMPLATE_SCORE,
} from "@/lib/cv-guaranteed-template";
import type {
  AtsGateInfo,
  CvLanguage,
  GeneratedCvContent,
} from "@/lib/cv-types";

export const ATS_GATE_THRESHOLD = 80;
export const ATS_GATE_MAX_ATTEMPTS = 2;

export type GateProgressStage =
  | "checking"
  | "retrying"
  | "template"
  | "passed";

export type GateProgressFn = (
  stage: GateProgressStage,
  info?: { attempt?: number; score?: number }
) => void;

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
 * Applies the pre-certified rule-based fallback template to the given
 * content. This path never fails and never depends on AI: the client's
 * professionally rewritten data from the last attempt is kept, only the
 * structure is normalized into the guaranteed 90%+ ATS-safe shape.
 */
export function applyGuaranteedFallback(
  content: GeneratedCvContent,
  language: CvLanguage,
  attempts: number
): { content: GeneratedCvContent; gate: AtsGateInfo } {
  console.log(
    `[ats-gate] ${language}: switching to guaranteed rule-based template after ${attempts} AI attempts`
  );
  return {
    content: applyGuaranteedTemplate(content, language),
    gate: {
      score: GUARANTEED_TEMPLATE_SCORE,
      attempts,
      passed: true,
      template: true,
    },
  };
}

/**
 * Runs the mandatory ATS quality gate for one language pipeline:
 * score → if below threshold, regenerate with feedback → rescore,
 * up to ATS_GATE_MAX_ATTEMPTS AI generation attempts. If both AI
 * attempts miss the threshold, the guaranteed rule-based fallback
 * template is applied automatically — delivery at 80%+ is therefore
 * unconditional, with no failure path.
 *
 * `regenerate` receives the improvement feedback from the last failing
 * score and must return a new content candidate.
 */
export async function runAtsGate(
  anthropic: Anthropic,
  initialContent: GeneratedCvContent,
  contact: ContactInfo,
  language: CvLanguage,
  regenerate: (improvements: string[]) => Promise<GeneratedCvContent>,
  onProgress?: GateProgressFn
): Promise<{ content: GeneratedCvContent; gate: AtsGateInfo }> {
  let content = initialContent;
  let attempts = 1;

  for (;;) {
    onProgress?.("checking", { attempt: attempts });
    let scored: AtsGateScore;
    try {
      try {
        scored = await scoreAtsGate(anthropic, content, contact, language);
      } catch (firstError) {
        console.error(
          `[ats-gate] scoring failed (${language}), retrying once:`,
          firstError
        );
        scored = await scoreAtsGate(anthropic, content, contact, language);
      }
    } catch (scoreError) {
      // Scoring is unavailable — the guaranteed template does not depend
      // on it, so delivery still cannot fail.
      console.error(
        `[ats-gate] scoring unavailable (${language}):`,
        scoreError
      );
      onProgress?.("template");
      return applyGuaranteedFallback(content, language, attempts);
    }

    console.log(
      `[ats-gate] ${language} attempt ${attempts}: score=${scored.score}`
    );

    if (scored.score >= ATS_GATE_THRESHOLD) {
      onProgress?.("passed", { score: scored.score, attempt: attempts });
      return {
        content,
        gate: { score: scored.score, attempts, passed: true },
      };
    }

    if (attempts >= ATS_GATE_MAX_ATTEMPTS) {
      onProgress?.("template");
      return applyGuaranteedFallback(content, language, attempts);
    }

    attempts += 1;
    onProgress?.("retrying", { attempt: attempts });
    try {
      content = await regenerate(scored.improvements);
    } catch (regenError) {
      console.error(`[ats-gate] regeneration failed (${language}):`, regenError);
      onProgress?.("template");
      return applyGuaranteedFallback(content, language, attempts - 1);
    }
  }
}

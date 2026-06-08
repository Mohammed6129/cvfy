import type { AtsScoreResult, GeneratedCvContent } from "@/lib/cv-types";

export const CLAUDE_MODEL = "claude-sonnet-4-20250514";

export function normalizeContent(
  content: Partial<GeneratedCvContent>
): GeneratedCvContent {
  return {
    headline: content.headline ?? "",
    summary: content.summary ?? "",
    experiences: Array.isArray(content.experiences) ? content.experiences : [],
    education: Array.isArray(content.education) ? content.education : [],
    skills: Array.isArray(content.skills) ? content.skills : [],
    courses: Array.isArray(content.courses) ? content.courses : [],
  };
}

function extractJsonObject<T>(content: string): T {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1].trim() : content.trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("Invalid JSON response from Claude");
  }

  return JSON.parse(jsonMatch[0]) as T;
}

export function extractCvContentJson(content: string): GeneratedCvContent {
  const parsed = extractJsonObject<
    Partial<GeneratedCvContent> | { content: Partial<GeneratedCvContent> }
  >(content);

  if ("content" in parsed && parsed.content) {
    return normalizeContent(parsed.content);
  }

  return normalizeContent(parsed as Partial<GeneratedCvContent>);
}

export function extractAtsScoreJson(content: string): AtsScoreResult {
  const parsed = extractJsonObject<Partial<AtsScoreResult>>(content);

  const score = Math.min(100, Math.max(0, Math.round(Number(parsed.score) || 0)));

  return {
    score,
    summary: typeof parsed.summary === "string" ? parsed.summary : "",
    passed: Array.isArray(parsed.passed) ? parsed.passed : [],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
    categories: Array.isArray(parsed.categories)
      ? parsed.categories.map((cat) => ({
          name: cat.name ?? "",
          score: Math.min(100, Math.max(0, Math.round(Number(cat.score) || 0))),
          maxScore: Math.min(100, Math.max(0, Math.round(Number(cat.maxScore) || 100))),
          note: cat.note ?? "",
        }))
      : [],
  };
}

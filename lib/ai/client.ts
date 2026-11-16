import Anthropic from "@anthropic-ai/sdk";
import { getAnthropicApiKey } from "@/lib/anthropic-env";

/**
 * Model choice (Nov 2026 lineup):
 *  - writer: the CV itself — quality is the product.
 *  - fast:   extraction and other mechanical work.
 * Both can be overridden from the environment without a code change.
 */
export const MODELS = {
  writer: process.env.ANTHROPIC_MODEL_WRITER?.trim() || "claude-sonnet-5-5",
  fast: process.env.ANTHROPIC_MODEL_FAST?.trim() || "claude-haiku-5-5",
};

type Effort = "low" | "medium" | "high";

/**
 * How hard the writer model thinks before answering. "low" keeps a CV well
 * inside a 60-second serverless limit; raise it (CVFY_WRITER_EFFORT=medium)
 * together with `maxDuration` in app/api/cv/generate/route.ts if your Vercel
 * plan allows longer functions.
 */
export const WRITER_EFFORT: Effort = (() => {
  const value = process.env.CVFY_WRITER_EFFORT?.trim();
  return value === "medium" || value === "high" ? value : "low";
})();

/** Local development without an API key: canned AI answers, in-memory storage. Never active in production. */
export function isMockMode(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.CVFY_MOCK === "1";
}

export class AiUnavailableError extends Error {
  constructor(message = "AI service is not configured") {
    super(message);
    this.name = "AiUnavailableError";
  }
}

let client: Anthropic | null = null;

function getClient(): Anthropic {
  const apiKey = getAnthropicApiKey();
  if (!apiKey) throw new AiUnavailableError();
  if (!client) client = new Anthropic({ apiKey, maxRetries: 1, timeout: 50_000 });
  return client;
}

type JsonCall = {
  model: string;
  system: string;
  user: string;
  /** JSON Schema the answer must satisfy (structured outputs). */
  schema: Record<string, unknown>;
  effort?: Effort;
  maxTokens?: number;
};

/**
 * One model call that returns schema-valid JSON.
 * Uses structured outputs, so there is no "please return JSON" parsing lottery.
 */
export async function callJson<T>({
  model,
  system,
  user,
  schema,
  effort = "low",
  maxTokens = 10000,
}: JsonCall): Promise<T> {
  const anthropic = getClient();

  const message = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: user }],
    output_config: {
      effort,
      format: { type: "json_schema", schema },
    },
  });

  if (message.stop_reason === "refusal") {
    throw new Error("The model declined this request");
  }
  if (message.stop_reason === "max_tokens") {
    throw new Error("The model ran out of output tokens");
  }

  const text = message.content
    .filter((block) => block.type === "text")
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("")
    .trim();

  if (!text) throw new Error("Empty model response");

  try {
    return JSON.parse(text) as T;
  } catch {
    // Belt and braces: tolerate a fenced block if a model ever wraps it.
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Model response was not JSON");
    return JSON.parse(match[0]) as T;
  }
}

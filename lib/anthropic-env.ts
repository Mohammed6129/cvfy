const PLACEHOLDER_MARKERS = [
  "your-anthropic-api-key",
  "your_anthropic",
  "المفتاح_الجديد",
  "changeme",
  "replace-me",
];

function isPlaceholderKey(key: string): boolean {
  const normalized = key.trim().toLowerCase();
  if (!normalized) return true;
  return PLACEHOLDER_MARKERS.some((marker) => normalized.includes(marker));
}

/** Server-side Anthropic API key from ANTHROPIC_API_KEY (never NEXT_PUBLIC_). */
export function getAnthropicApiKey(): string | undefined {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key || isPlaceholderKey(key)) return undefined;
  if (!key.startsWith("sk-ant-")) return undefined;
  return key;
}

export function getAnthropicKeyDebugInfo(): {
  present: boolean;
  valid: boolean;
  prefix?: string;
} {
  const raw = process.env.ANTHROPIC_API_KEY?.trim();
  const valid = Boolean(getAnthropicApiKey());
  return {
    present: Boolean(raw),
    valid,
    prefix: valid ? `${raw!.slice(0, 12)}...` : undefined,
  };
}

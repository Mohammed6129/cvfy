const PLACEHOLDER_MARKERS = [
  "your-supabase",
  "your-project-id",
  "changeme",
];

function isPlaceholder(value: string | undefined): boolean {
  if (!value?.trim()) return true;
  const normalized = value.trim().toLowerCase();
  return PLACEHOLDER_MARKERS.some((marker) => normalized.includes(marker));
}

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url || isPlaceholder(url)) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is missing or invalid. Set it in .env.local and Vercel Environment Variables."
    );
  }
  return url;
}

/** Supports legacy anon JWT and new publishable keys (sb_publishable_...). */
export function getSupabaseAnonKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!key || isPlaceholder(key)) {
    throw new Error(
      "Supabase publishable key is missing or invalid. Set NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) in Vercel."
    );
  }

  return key;
}

export function getSupabaseEnvStatus(): {
  urlPresent: boolean;
  keyPresent: boolean;
  keyPrefix?: string;
} {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  let keyPrefix: string | undefined;
  if (key && !isPlaceholder(key)) {
    if (key.startsWith("sb_publishable_")) keyPrefix = "sb_publishable_...";
    else if (key.startsWith("eyJ")) keyPrefix = "eyJ... (anon JWT)";
    else keyPrefix = `${key.slice(0, 8)}...`;
  }

  return {
    urlPresent: Boolean(url && !isPlaceholder(url)),
    keyPresent: Boolean(key && !isPlaceholder(key)),
    keyPrefix,
  };
}

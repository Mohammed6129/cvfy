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

/**
 * Preview links use the project's public (anon) settings committed here, so
 * they keep working whatever the Vercel Preview variables hold. Both values
 * are public: the browser receives them on every page load anyway.
 * The live site (production) still reads its own Vercel variables.
 */
const PREVIEW_SUPABASE = {
  url: "https://yerhkzrpdofcnddegfyh.supabase.co",
  anonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllcmhrenJwZG9mY25kZGVnZnloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NjA5MTAsImV4cCI6MjA5NjQzNjkxMH0.C0dIwaNGVWLmwNc2WRTcsrEnHid616ll44sjIuZcWM4",
};

function isPreviewDeployment(): boolean {
  return process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "preview";
}

export function getSupabaseUrl(): string {
  if (isPreviewDeployment()) return PREVIEW_SUPABASE.url;
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
  if (isPreviewDeployment()) return PREVIEW_SUPABASE.anonKey;
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

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export const DEFAULT_POST_AUTH_PATH = "/create";

export function getAuthCallbackUrl(next = DEFAULT_POST_AUTH_PATH): string {
  const nextPath =
    next.startsWith("/") && !next.startsWith("//") ? next : DEFAULT_POST_AUTH_PATH;
  return `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(nextPath)}`;
}

export function mapAuthError(message: string): string {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("provider is not enabled") ||
    normalized.includes("unsupported provider")
  ) {
    return "لم يتم تفعيل Google في Supabase. فعّله من Authentication → Providers → Google وأضف Client ID و Client Secret.";
  }

  if (normalized.includes("redirect") && normalized.includes("url")) {
    return "رابط إعادة التوجيه غير مسموح. أضف /auth/callback إلى Redirect URLs في Supabase.";
  }

  if (normalized.includes("invalid api key") || normalized.includes("invalid x-api-key")) {
    return "إعدادات Supabase غير صحيحة. تحقق من NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY.";
  }

  return "فشل تسجيل الدخول بواسطة Google. يرجى المحاولة مرة أخرى.";
}

export function getRedirectOrigin(request: Request, requestUrl: URL): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";

  if (isLocalEnv) {
    return requestUrl.origin;
  }

  if (forwardedHost) {
    return `https://${forwardedHost}`;
  }

  return getSiteUrl();
}

function normalizeSiteUrl(url: string): string {
  return url.trim().replace(/\/$/, "");
}

/** Canonical app URL — prefers NEXT_PUBLIC_SITE_URL, then Vercel host, then localhost. */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return normalizeSiteUrl(configured);

  if (process.env.VERCEL === "1") {
    const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    if (productionHost) return `https://${productionHost}`;

    const deploymentHost = process.env.VERCEL_URL;
    if (deploymentHost) return `https://${deploymentHost}`;
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

/** Post-OAuth redirect base URL — prefers NEXT_PUBLIC_SITE_URL, then request origin on HTTPS. */
export function getRedirectOrigin(_request: Request, requestUrl: URL): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return getSiteUrl();
  }

  if (process.env.NODE_ENV === "development") {
    return requestUrl.origin;
  }

  if (requestUrl.protocol === "https:") {
    return requestUrl.origin;
  }

  return getSiteUrl();
}

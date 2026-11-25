export const TEST_USER_EMAIL = "test@cvfy.sa";

export function isTestUserEmail(email?: string | null): boolean {
  return email === TEST_USER_EMAIL;
}

/**
 * The one-tap developer sign-in exists on Vercel preview links and local
 * development only — never on the live site (VERCEL_ENV=production).
 */
export function isTesterLoginEnabled(): boolean {
  if (process.env.VERCEL_ENV === "production") return false;
  return process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV !== "production";
}

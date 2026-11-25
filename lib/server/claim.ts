/**
 * Guest → account handover.
 *
 * A visitor builds and even pays for a CV as a guest (anonymous session).
 * When they sign in, their guest CVs must follow them. Signing in replaces
 * the guest session, so just before it we leave a signed, short-lived note
 * in an httpOnly cookie saying "these CVs belong to guest X". After sign-in
 * the note is checked and the rows are moved to the real account.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { isMockMode } from "@/lib/ai/client";
import { transferCvs } from "./repo";

export const CLAIM_COOKIE = "cvfy_claim";
export const CLAIM_MAX_AGE_SECONDS = 7 * 24 * 3600;

function secret(): string | null {
  if (isMockMode()) return "cvfy-mock-claim";
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || null;
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

/** Token for the guest's own id; null when the server cannot sign (no secret configured). */
export function signClaim(guestId: string): string | null {
  const key = secret();
  if (!key || !guestId || guestId.includes(".")) return null;
  const payload = `${guestId}.${Date.now() + CLAIM_MAX_AGE_SECONDS * 1000}`;
  return `${payload}.${sign(payload, key)}`;
}

/** The guest id inside a valid, unexpired token — otherwise null. */
export function readClaim(token: string | undefined | null): string | null {
  const key = secret();
  if (!key || !token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [guestId, expires, signature] = parts;
  if (!guestId || Number(expires) < Date.now()) return null;

  const expected = Buffer.from(sign(`${guestId}.${expires}`, key));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  return guestId;
}

/** Move the guest's CVs to `userId`. Never throws: a failed handover must not break sign-in. */
export async function finishClaim(token: string | undefined | null, userId: string): Promise<number> {
  const guestId = readClaim(token);
  if (!guestId || guestId === userId) return 0;
  try {
    return await transferCvs(guestId, userId);
  } catch (error) {
    console.error("[claim] moving guest CVs failed:", error);
    return 0;
  }
}

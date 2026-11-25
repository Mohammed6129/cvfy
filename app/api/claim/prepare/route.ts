import { NextResponse } from "next/server";
import { CLAIM_COOKIE, CLAIM_MAX_AGE_SECONDS, signClaim } from "@/lib/server/claim";
import { getSessionUser } from "@/lib/server/session";

export const dynamic = "force-dynamic";

/** Called by the sign-in page while the visitor is still a guest. */
export async function POST() {
  const user = await getSessionUser();
  if (!user?.isAnonymous) return NextResponse.json({ ok: false });

  const token = signClaim(user.id);
  if (!token) return NextResponse.json({ ok: false });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(CLAIM_COOKIE, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: CLAIM_MAX_AGE_SECONDS,
  });
  return response;
}

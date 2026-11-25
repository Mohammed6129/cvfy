import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CLAIM_COOKIE, finishClaim } from "@/lib/server/claim";
import { getSessionUser, isMember } from "@/lib/server/session";

export const dynamic = "force-dynamic";

/** Called right after a password or SMS sign-in (OAuth goes through /auth/callback instead). */
export async function POST() {
  const user = await getSessionUser();
  if (!isMember(user)) return NextResponse.json({ moved: 0 });

  const token = (await cookies()).get(CLAIM_COOKIE)?.value;
  const moved = token ? await finishClaim(token, user.id) : 0;

  const response = NextResponse.json({ moved });
  if (token) response.cookies.set(CLAIM_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}

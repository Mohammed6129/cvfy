import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isMockMode } from "@/lib/ai/client";
import { MOCK_USER_COOKIE } from "@/lib/server/session";

/** Local development only (CVFY_MOCK=1): start a guest session, like Supabase anonymous sign-in. */
export async function POST() {
  if (!isMockMode()) return new NextResponse(null, { status: 404 });
  if ((await cookies()).get(MOCK_USER_COOKIE)?.value) return NextResponse.json({ ok: true });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(MOCK_USER_COOKIE, `guest-${Math.random().toString(36).slice(2, 10)}`, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
  return response;
}

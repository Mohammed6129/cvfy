import { NextResponse } from "next/server";
import { isMockMode } from "@/lib/ai/client";
import { MOCK_USER_COOKIE } from "@/lib/server/session";

/** Local development only (CVFY_MOCK=1): sign in without Supabase. 404 everywhere else. */
export async function POST() {
  if (!isMockMode()) return new NextResponse(null, { status: 404 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(MOCK_USER_COOKIE, "1", { path: "/", httpOnly: true, sameSite: "lax" });
  return response;
}

export async function DELETE() {
  if (!isMockMode()) return new NextResponse(null, { status: 404 });
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(MOCK_USER_COOKIE);
  return response;
}

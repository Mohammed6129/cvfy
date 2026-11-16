import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/** Keeps the Supabase session cookie fresh on page navigations. */
export async function proxy(request: NextRequest) {
  if (process.env.NODE_ENV !== "production" && process.env.CVFY_MOCK === "1") {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|fonts/|api|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2)$).*)",
  ],
};

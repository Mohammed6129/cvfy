import { NextResponse } from "next/server";
import { AiUnavailableError } from "@/lib/ai/client";

export function jsonError(message: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export const unauthorized = () => jsonError("سجّل دخولك عشان تكمل.", 401, { code: "auth" });

/** Map failures to messages a user can act on; details stay in the server log. */
export function aiFailure(scope: string, error: unknown) {
  console.error(`[${scope}]`, error);
  if (error instanceof AiUnavailableError) {
    return jsonError("خدمة الكتابة غير مفعّلة حالياً. جرّب بعد قليل.", 503, { code: "ai_unavailable" });
  }
  return jsonError("ما قدرنا نكمل الطلب هالمرة. بياناتك محفوظة — جرّب مرة ثانية.", 502, { code: "ai_failed" });
}

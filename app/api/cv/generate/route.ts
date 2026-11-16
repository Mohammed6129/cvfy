import { NextResponse } from "next/server";
import { aiFailure, jsonError, unauthorized } from "@/lib/server/http";
import { generatePrimary } from "@/lib/server/generate";
import { getCv, saveCv } from "@/lib/server/repo";
import { getSessionUser } from "@/lib/server/session";
import { generationsLeft } from "@/lib/server/view";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Step 2: write the primary-language CV and its ATS report. */
export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  let body: { id?: string; answers?: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return jsonError("بيانات غير صالحة.", 400);
  }
  if (!body.id) return jsonError("معرّف السيرة مطلوب.", 400);

  const row = await getCv(user.id, body.id);
  if (!row?.form) return jsonError("ما لقينا هذي السيرة.", 404);

  if (row.stored && generationsLeft(row, user) <= 0) {
    return jsonError("خلّصت عدد مرات إعادة الإنشاء لهذي السيرة.", 429, { code: "limit" });
  }

  const interview = row.interview
    ? {
        ...row.interview,
        answers: Object.fromEntries(
          row.interview.questions.map((q) => [
            q.id,
            String(body.answers?.[q.id] ?? row.interview?.answers[q.id] ?? "").trim().slice(0, 600),
          ])
        ),
      }
    : null;

  try {
    const stored = await generatePrimary(row.form, interview, row.stored);
    await saveCv({ userId: user.id, id: row.id, form: row.form, interview, stored });
    return NextResponse.json({ id: row.id });
  } catch (error) {
    return aiFailure("generate", error);
  }
}

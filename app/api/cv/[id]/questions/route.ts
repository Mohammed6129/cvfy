import { NextResponse } from "next/server";
import { writeQuestions } from "@/lib/ai/interview";
import { aiFailure, jsonError, unauthorized } from "@/lib/server/http";
import { getCv, saveCv } from "@/lib/server/repo";
import { getSessionUser } from "@/lib/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Ctx = { params: Promise<{ id: string }> };

/** "Make it stronger": up to 3 follow-up questions, written once per CV and job. */
export async function POST(_request: Request, { params }: Ctx) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const row = await getCv(user.id, id);
  if (!row?.form) return jsonError("ما لقينا هذي السيرة.", 404);

  const interview = row.interview ?? { job: { titleEn: "", titleAr: "", keywords: [] }, questions: [], answers: {} };
  if (interview.questions.length > 0) {
    return NextResponse.json({ questions: interview.questions, answers: interview.answers });
  }

  try {
    const questions = await writeQuestions(row.form, row.interview?.job ?? null);
    const updated = { ...interview, questions, answers: {} };
    await saveCv({ userId: user.id, id: row.id, form: row.form, interview: updated });
    return NextResponse.json({ questions, answers: {} });
  } catch (error) {
    return aiFailure("questions", error);
  }
}

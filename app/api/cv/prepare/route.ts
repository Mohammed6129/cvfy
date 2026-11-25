import { NextResponse } from "next/server";
import { profileJob } from "@/lib/ai/interview";
import { cleanForm, validateForm } from "@/lib/cv/form";
import type { CvForm, Interview } from "@/lib/cv/types";
import { aiFailure, jsonError, unauthorized } from "@/lib/server/http";
import { countRecentCvs, getCv, saveCv } from "@/lib/server/repo";
import { getSessionUser } from "@/lib/server/session";
import { generationsLeft } from "@/lib/server/view";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** New CVs per 24h. Guests get fewer: a guest session costs nothing to create. */
const DAILY_LIMIT = { member: 6, guest: 3 };

/**
 * Step 1 of writing: save the form and profile the target job (title +
 * keywords). The browser calls /api/cv/generate right after, with no screen
 * in between — follow-up questions are offered later, on the preview.
 */
export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  let body: { form?: CvForm; id?: string | null };
  try {
    body = await request.json();
  } catch {
    return jsonError("بيانات غير صالحة.", 400);
  }
  if (!body.form) return jsonError("بيانات النموذج ناقصة.", 400);

  const form = cleanForm(body.form);
  const errors = validateForm(form);
  if (Object.keys(errors).length > 0) {
    return jsonError("فيه حقول تحتاج تعديل.", 422, { fields: errors });
  }

  const existing = body.id ? await getCv(user.id, body.id) : null;
  if (body.id && !existing) return jsonError("ما لقينا هذي السيرة.", 404);
  if (existing?.legacy) return jsonError("هذي سيرة من النسخة القديمة — ابدأ سيرة جديدة.", 409);

  if (existing?.stored && generationsLeft(existing, user) <= 0) {
    return jsonError("خلّصت عدد مرات إعادة الإنشاء لهذي السيرة.", 429, { code: "limit" });
  }
  const limit = user.isAnonymous ? DAILY_LIMIT.guest : DAILY_LIMIT.member;
  if (!existing && !user.isTester && (await countRecentCvs(user.id)) >= limit) {
    return jsonError("وصلت الحد اليومي لإنشاء السير. جرّب بكرة.", 429, { code: "daily_limit" });
  }

  // Same job as last time → keep the job profile, and any questions already answered.
  const sameJob =
    existing?.interview &&
    existing.form?.target.jobTitle === form.target.jobTitle &&
    existing.form?.target.jobAd === form.target.jobAd;

  let interview: Interview;
  if (sameJob && existing?.interview) {
    interview = existing.interview;
  } else {
    try {
      interview = { job: await profileJob(form), questions: [], answers: {} };
    } catch (error) {
      return aiFailure("prepare", error);
    }
  }

  const id = await saveCv({ userId: user.id, id: existing?.id, form, interview });
  return NextResponse.json({ id });
}

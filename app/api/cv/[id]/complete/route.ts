import { NextResponse } from "next/server";
import { aiFailure, jsonError, unauthorized } from "@/lib/server/http";
import { completeFull } from "@/lib/server/generate";
import { getCv, saveCv, updateStored } from "@/lib/server/repo";
import { getSessionUser } from "@/lib/server/session";
import { accessFor, buildView } from "@/lib/server/view";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Ctx = { params: Promise<{ id: string }> };

/** After payment (full plan): write the second language, cover letter and LinkedIn texts. */
export async function POST(_request: Request, { params }: Ctx) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const row = await getCv(user.id, id);
  if (!row?.stored) return jsonError("ما لقينا هذي السيرة.", 404);

  const access = accessFor(row, user);
  if (!access.paid || access.plan !== "full") {
    return jsonError("هذي الميزة ضمن الباقة الكاملة.", 402, { code: "payment_required" });
  }
  if (!row.form) {
    // Legacy CVs already hold both languages; nothing to add.
    return NextResponse.json({ view: buildView(row, user) });
  }

  try {
    const stored = await completeFull(row.form, row.interview, row.stored);

    // The form asked for the name in one language only; keep the one the
    // writer produced for the other, so the next edit shows (and can fix) it.
    const other = stored.primaryLang === "en" ? "ar" : "en";
    const key = other === "en" ? "nameEn" : "nameAr";
    const writtenName = stored.docs[other]?.name;
    if (!row.form.personal[key] && writtenName) {
      const form = { ...row.form, personal: { ...row.form.personal, [key]: writtenName } };
      await saveCv({ userId: user.id, id: row.id, form, interview: row.interview, stored });
    } else if (stored !== row.stored) {
      await updateStored(user.id, row.id, stored);
    }
    return NextResponse.json({ view: buildView({ ...row, stored }, user) });
  } catch (error) {
    return aiFailure("complete", error);
  }
}

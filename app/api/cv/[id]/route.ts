import { NextResponse } from "next/server";
import { jsonError, unauthorized } from "@/lib/server/http";
import { deleteCv, getCv } from "@/lib/server/repo";
import { getSessionUser } from "@/lib/server/session";
import { buildView } from "@/lib/server/view";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Ctx) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const row = await getCv(user.id, id);
  if (!row) return jsonError("ما لقينا هذي السيرة.", 404);

  const wantsForm = new URL(request.url).searchParams.get("form") === "1";

  return NextResponse.json({
    view: buildView(row, user),
    // The form is the user's own input, so it is always theirs to read back.
    form: wantsForm ? row.form : undefined,
    legacy: row.legacy,
    jobTitle: row.form?.target.jobTitle ?? "",
    hasJobAd: Boolean(row.form?.target.jobAd),
  });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { id } = await params;
  await deleteCv(user.id, id);
  return NextResponse.json({ ok: true });
}

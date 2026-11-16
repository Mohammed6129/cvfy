import { NextResponse } from "next/server";
import { unauthorized } from "@/lib/server/http";
import { listCvs } from "@/lib/server/repo";
import { getSessionUser } from "@/lib/server/session";
import { toListItem } from "@/lib/server/view";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const rows = await listCvs(user.id);
  return NextResponse.json({ cvs: rows.map((row) => toListItem(row, user)) });
}

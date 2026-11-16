/**
 * All reads and writes of CV rows go through here, on the server.
 *
 * With SUPABASE_SERVICE_ROLE_KEY set, the service role is used and every
 * query is scoped by user id in code — this is what lets payment state and
 * unpaid CV text stay out of the browser's reach (see supabase/schema.sql).
 * Without it we fall back to the signed-in user's own client so the site
 * keeps working, just without that extra protection.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { isMockMode } from "@/lib/ai/client";
import type { CvForm, CvStored, Interview } from "@/lib/cv/types";
import { legacyToStored } from "./legacy";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type CvRow = {
  id: string;
  userId: string;
  title: string;
  form: CvForm | null;
  interview: Interview | null;
  stored: CvStored | null;
  /** Row created by the pre-2026-11 version of the site. */
  legacy: boolean;
  isPaid: boolean;
  paidPlan: string | null;
  createdAt: string;
  updatedAt: string;
};

type DbRow = {
  id: string;
  user_id: string;
  title: string;
  form_data: unknown;
  generated_cv: unknown;
  is_paid: boolean;
  paid_plan: string | null;
  created_at: string;
  updated_at: string;
};

const COLUMNS = "id, user_id, title, form_data, generated_cv, is_paid, paid_plan, created_at, updated_at";

let warnedNoServiceRole = false;

async function db(): Promise<SupabaseClient> {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) return createAdminClient();
  if (!warnedNoServiceRole) {
    warnedNoServiceRole = true;
    console.warn("[repo] SUPABASE_SERVICE_ROLE_KEY is not set — using the user's session. Set it to enforce the paywall server-side.");
  }
  return createClient();
}

function toRow(row: DbRow): CvRow {
  const formData = row.form_data as { v?: number; form?: CvForm; interview?: Interview | null } | null;
  const generated = row.generated_cv as (CvStored & { v?: number }) | null;
  const isV2 = formData?.v === 2;
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    form: isV2 ? (formData?.form ?? null) : null,
    interview: isV2 ? (formData?.interview ?? null) : null,
    stored:
      generated?.v === 2
        ? "docs" in generated
          ? generated
          : null
        : legacyToStored(row.generated_cv, row.updated_at, row.is_paid),
    legacy: !isV2,
    isPaid: row.is_paid,
    paidPlan: row.paid_plan,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/* ───────────── In-memory store for local development ───────────── */

const g = globalThis as unknown as { __cvfyMock?: Map<string, DbRow> };
const mock = () => (g.__cvfyMock ??= new Map<string, DbRow>());

/* ───────────── Queries ───────────── */

export async function getCv(userId: string, id: string): Promise<CvRow | null> {
  if (isMockMode()) {
    const row = mock().get(id);
    return row && row.user_id === userId ? toRow(row) : null;
  }
  const client = await db();
  const { data, error } = await client.from("cvs").select(COLUMNS).eq("id", id).eq("user_id", userId).maybeSingle();
  if (error) throw new Error(`cvs select failed: ${error.message}`);
  return data ? toRow(data as DbRow) : null;
}

export async function listCvs(userId: string): Promise<CvRow[]> {
  if (isMockMode()) {
    return [...mock().values()]
      .filter((r) => r.user_id === userId)
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      .map(toRow);
  }
  const client = await db();
  const { data, error } = await client
    .from("cvs")
    .select(COLUMNS)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(`cvs list failed: ${error.message}`);
  return (data ?? []).map((r) => toRow(r as DbRow));
}

/** CVs this user started in the last 24h — a simple brake on AI spend. */
export async function countRecentCvs(userId: string): Promise<number> {
  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  if (isMockMode()) {
    return [...mock().values()].filter((r) => r.user_id === userId && r.created_at > since).length;
  }
  const client = await db();
  const { count, error } = await client
    .from("cvs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gt("created_at", since);
  if (error) return 0;
  return count ?? 0;
}

export async function saveCv(input: {
  userId: string;
  id?: string | null;
  form: CvForm;
  interview: Interview | null;
  stored?: CvStored | null;
}): Promise<string> {
  const now = new Date().toISOString();
  const title = input.form.target.jobTitle
    ? `${input.form.target.jobTitle} — ${input.form.personal.nameAr || input.form.personal.nameEn}`.slice(0, 140)
    : "سيرتي الذاتية";
  const formData = { v: 2, form: input.form, interview: input.interview };

  if (isMockMode()) {
    const id = input.id ?? `mock-${Math.random().toString(36).slice(2, 10)}`;
    const existing = mock().get(id);
    mock().set(id, {
      id,
      user_id: input.userId,
      title,
      form_data: formData,
      generated_cv: input.stored ?? existing?.generated_cv ?? { v: 2, pending: true },
      is_paid: existing?.is_paid ?? false,
      paid_plan: existing?.paid_plan ?? null,
      created_at: existing?.created_at ?? now,
      updated_at: now,
    });
    return id;
  }

  const client = await db();

  if (input.id) {
    const patch: Record<string, unknown> = { title, form_data: formData, updated_at: now };
    if (input.stored) patch.generated_cv = input.stored;
    const { data, error } = await client
      .from("cvs")
      .update(patch)
      .eq("id", input.id)
      .eq("user_id", input.userId)
      .select("id")
      .maybeSingle();
    if (error) throw new Error(`cvs update failed: ${error.message}`);
    if (data?.id) return data.id as string;
  }

  const { data, error } = await client
    .from("cvs")
    .insert({
      user_id: input.userId,
      title,
      form_data: formData,
      // The column is NOT NULL; a draft carries a marker until it is generated.
      generated_cv: input.stored ?? { v: 2, pending: true },
      updated_at: now,
    })
    .select("id")
    .single();
  if (error) throw new Error(`cvs insert failed: ${error.message}`);
  return data.id as string;
}

export async function updateStored(userId: string, id: string, stored: CvStored): Promise<void> {
  const now = new Date().toISOString();
  if (isMockMode()) {
    const row = mock().get(id);
    if (row && row.user_id === userId) mock().set(id, { ...row, generated_cv: stored, updated_at: now });
    return;
  }
  const client = await db();
  const { error } = await client
    .from("cvs")
    .update({ generated_cv: stored, updated_at: now })
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw new Error(`cvs update failed: ${error.message}`);
}

export async function markPaid(input: {
  userId: string;
  id: string;
  plan: "basic" | "full";
  stored: CvStored;
  paymentId: string | null;
  planId: string;
  amountHalalas: number;
}): Promise<void> {
  const now = new Date().toISOString();
  if (isMockMode()) {
    const row = mock().get(input.id);
    if (row) mock().set(input.id, { ...row, is_paid: true, paid_plan: input.plan, generated_cv: input.stored, updated_at: now });
    return;
  }
  const client = await db();

  const { error: payError } = await client.from("payments").insert({
    user_id: input.userId,
    cv_id: input.id,
    moyasar_payment_id: input.paymentId,
    plan_id: input.planId,
    amount_halalas: input.amountHalalas,
    status: "paid",
  });
  if (payError) console.error("[repo] payments insert failed:", payError.message);

  const { error } = await client
    .from("cvs")
    .update({ is_paid: true, paid_plan: input.plan, generated_cv: input.stored, updated_at: now })
    .eq("id", input.id)
    .eq("user_id", input.userId);
  if (error) throw new Error(`cvs mark paid failed: ${error.message}`);
}

/** True when this Moyasar payment was already used to unlock a CV. */
export async function findPaymentCv(paymentId: string): Promise<string | null> {
  if (isMockMode()) return null;
  const client = await db();
  const { data } = await client.from("payments").select("cv_id").eq("moyasar_payment_id", paymentId).limit(1).maybeSingle();
  return (data?.cv_id as string | undefined) ?? null;
}

export async function deleteCv(userId: string, id: string): Promise<void> {
  if (isMockMode()) {
    const row = mock().get(id);
    if (row?.user_id === userId) mock().delete(id);
    return;
  }
  const client = await db();
  const { error } = await client.from("cvs").delete().eq("id", id).eq("user_id", userId);
  if (error) throw new Error(`cvs delete failed: ${error.message}`);
}

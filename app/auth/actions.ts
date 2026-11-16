"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isMockMode } from "@/lib/ai/client";
import { MOCK_USER_COOKIE } from "@/lib/server/session";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  if (isMockMode()) {
    (await cookies()).delete(MOCK_USER_COOKIE);
  } else {
    const supabase = await createClient();
    await supabase.auth.signOut({ scope: "global" });
  }
  revalidatePath("/", "layout");
  redirect("/");
}

import { createHmac } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";
import { isTesterLoginEnabled, PREVIEW_TESTER_EMAIL, TEST_USER_EMAIL } from "@/lib/test-user";

export const dynamic = "force-dynamic";

/**
 * Preview links only: sign in as the internal test account (test@cvfy.sa),
 * which skips payment so the whole flow can be tried end to end.
 * The account is created on first use; its password is derived from the
 * service-role key and never leaves the server.
 */
export async function POST(request: NextRequest) {
  if (!isTesterLoginEnabled()) return new NextResponse(null, { status: 404 });

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  let response = NextResponse.json({ ok: true });
  const supabase = createRouteHandlerClient(request, {
    getAll: () => request.cookies.getAll(),
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
      response = NextResponse.json({ ok: true });
      cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
    },
  });

  // Without the service-role key: a separate preview account that signs itself up
  // with the public key. Its password comes from a server-only secret.
  if (!serviceKey) {
    const secret = process.env.ANTHROPIC_API_KEY?.trim() || process.env.MOYASAR_SECRET_KEY?.trim();
    if (!secret) return NextResponse.json({ error: "ما فيه مفتاح سري على السيرفر نبني منه حساب المطور." }, { status: 503 });
    const pw = createHmac("sha256", secret).update("cvfy-preview-tester").digest("base64url");
    const signIn = await supabase.auth.signInWithPassword({ email: PREVIEW_TESTER_EMAIL, password: pw });
    if (!signIn.error) return response;
    const signUp = await supabase.auth.signUp({
      email: PREVIEW_TESTER_EMAIL,
      password: pw,
      options: { data: { full_name: "حساب المطور" } },
    });
    if (signUp.error) {
      console.error("[dev/tester] preview sign-up failed:", signUp.error.message);
      return NextResponse.json({ error: `ما قدرنا ننشئ حساب المطور: ${signUp.error.message}` }, { status: 500 });
    }
    if (!signUp.data.session) {
      return NextResponse.json(
        { error: "Supabase يطلب تأكيد الإيميل للحسابات الجديدة. أضف SUPABASE_SERVICE_ROLE_KEY في Vercel أو أوقف تأكيد الإيميل." },
        { status: 503 },
      );
    }
    return response;
  }

  const password = createHmac("sha256", serviceKey).update("cvfy-tester-login").digest("base64url");
  const first = await supabase.auth.signInWithPassword({ email: TEST_USER_EMAIL, password });
  if (!first.error) return response;

  // First use (or the password changed): make sure the account exists with this password.
  try {
    const admin = createAdminClient();
    let userId: string | null = null;
    for (let page = 1; page <= 20 && !userId; page++) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) throw error;
      userId = data.users.find((u) => u.email === TEST_USER_EMAIL)?.id ?? null;
      if (data.users.length < 1000) break;
    }
    if (userId) {
      const { error } = await admin.auth.admin.updateUserById(userId, { password, email_confirm: true });
      if (error) throw error;
    } else {
      const { error } = await admin.auth.admin.createUser({
        email: TEST_USER_EMAIL,
        password,
        email_confirm: true,
        user_metadata: { full_name: "حساب المطور" },
      });
      if (error) throw error;
    }
  } catch (error) {
    console.error("[dev/tester] could not prepare the test account:", error);
    return NextResponse.json({ error: "ما قدرنا نجهّز حساب المطور. شيّك على مفتاح Supabase." }, { status: 500 });
  }

  const second = await supabase.auth.signInWithPassword({ email: TEST_USER_EMAIL, password });
  if (second.error) {
    console.error("[dev/tester] sign-in failed:", second.error.message);
    return NextResponse.json({ error: "ما قدرنا ندخل بحساب المطور." }, { status: 500 });
  }
  return response;
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTurnstileToken } from "@/lib/turnstile";
import PhoneOtpForm from "@/app/login/phone-otp-form";
import { mapAuthError } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";
type Method = "email" | "phone";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

type LoginFormProps = {
  nextPath: string;
  authError: string | null;
  authErrorDescription: string | null;
  mock: boolean;
  /** Signing in from a guest session: their CVs move to the account afterwards. */
  guest: boolean;
};

/** After any non-redirect sign-in: move the guest's CVs to the account. Never blocks sign-in. */
async function claimGuestCvs() {
  await fetch("/api/claim/finish", { method: "POST" }).catch(() => null);
}

function initialError(code: string | null, description: string | null): string | null {
  if (code === "auth_callback_error") return "ما اكتمل تسجيل الدخول. جرّب مرة ثانية.";
  if (code === "oauth_error") return description ? mapAuthError(description) : "انلغى تسجيل الدخول أو فشل التحقق.";
  return null;
}

export default function LoginForm({ nextPath, authError, authErrorDescription, mock, guest }: LoginFormProps) {
  const router = useRouter();
  const fromBuilder = nextPath.startsWith("/create");
  // People arriving from the builder or saving a guest CV are almost always new: start on sign-up.
  const [mode, setMode] = useState<AuthMode>(fromBuilder || guest ? "signup" : "login");
  const [method, setMethod] = useState<Method>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(initialError(authError, authErrorDescription));

  // Leave the signed "these CVs are mine" note before the guest session is replaced.
  useEffect(() => {
    if (guest) void fetch("/api/claim/prepare", { method: "POST" }).catch(() => null);
  }, [guest]);

  const callbackUrl = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;

  const done = async () => {
    if (guest) await claimGuestCvs();
    router.push(nextPath);
    router.refresh();
  };

  const reset = () => {
    setError(null);
    setMessage(null);
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    reset();
    const supabase = createClient();
    // Needed only if bot protection is switched on in Supabase; null otherwise.
    const captchaToken = (await getTurnstileToken()) ?? undefined;

    if (mode === "login") {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password, options: { captchaToken } });
      if (signInError) {
        setError("البريد أو كلمة المرور غير صحيحة.");
        setLoading(false);
        return;
      }
      return done();
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      // After confirming by email the user lands back where they left off.
      options: { emailRedirectTo: callbackUrl(), captchaToken },
    });
    if (signUpError) {
      setError(
        /already registered/i.test(signUpError.message)
          ? "هذا البريد مسجّل من قبل. سجّل دخولك بدل إنشاء حساب."
          : "ما قدرنا ننشئ الحساب. تأكد من البريد، وكلمة المرور 6 خانات على الأقل."
      );
      setLoading(false);
      return;
    }
    if (data.session) return done();

    setMessage("أرسلنا لك رابط تأكيد على بريدك. افتحه من نفس هذا الجهاز وبنرجّعك تكمل من وين وقفت.");
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    reset();
    const supabase = createClient();
    const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl(), queryParams: { prompt: "select_account" } },
    });
    if (oauthError) {
      setError(mapAuthError(oauthError.message));
      setLoading(false);
      return;
    }
    if (data.url) return window.location.assign(data.url);
    setError("ما قدرنا نبدأ الدخول عبر Google.");
    setLoading(false);
  };

  const handleMock = async () => {
    setLoading(true);
    await fetch("/api/dev/login", { method: "POST" });
    await done();
  };

  const tab = (id: Method, label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={method === id}
      onClick={() => { setMethod(id); reset(); }}
      className={`min-h-11 flex-1 rounded-[0.625rem] text-[0.9375rem] transition-colors ${
        method === id ? "bg-paper font-medium text-ink shadow-sm" : "text-graphite hover:text-ink"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full max-w-md">
      <h1 className="t-h2">
        {guest ? "احفظ سيرتك في حسابك" : fromBuilder ? "سجّل عشان نحفظ سيرتك" : mode === "login" ? "سجّل دخولك" : "أنشئ حسابك"}
      </h1>
      <p className="t-body mt-1">
        {guest
          ? "سجّل بأي طريقة تحت، وسيرتك تنتقل لحسابك وترجع لها من أي جهاز."
          : fromBuilder
            ? "آخر خطوة قبل لا نكتب سيرتك. اللي عبّيته محفوظ وبنكمل من وين وقفت."
            : "عشان نحفظ سيرتك وترجع لها من أي جهاز."}
      </p>

      <div className="card mt-6 p-5 sm:p-7">
        {error && <p className="note note-bad mb-4" role="alert">{error}</p>}
        {message && <p className="note note-ok mb-4" role="status">{message}</p>}

        {mock && (
          <button type="button" onClick={handleMock} disabled={loading} className="btn btn-marker btn-block mb-3">
            دخول تجريبي (بيئة التطوير)
          </button>
        )}

        <button type="button" onClick={handleGoogle} disabled={loading} className="btn btn-ghost btn-lg btn-block">
          <GoogleIcon />
          كمّل بحساب Google
        </button>

        <div className="my-5 flex items-center gap-3 text-sm text-mute" aria-hidden>
          <span className="h-px flex-1 bg-rule" />
          أو
          <span className="h-px flex-1 bg-rule" />
        </div>

        <div role="tablist" aria-label="طريقة الدخول" className="mb-5 flex gap-1 rounded-[var(--radius-control)] bg-desk p-1">
          {tab("email", "البريد الإلكتروني")}
          {tab("phone", "رقم الجوال")}
        </div>

        {method === "phone" ? (
          <PhoneOtpForm nextPath={nextPath} loading={loading} setLoading={setLoading} onError={setError} onMessage={setMessage} onSignedIn={guest ? claimGuestCvs : undefined} />
        ) : (
          <form className="space-y-4" onSubmit={handleEmail}>
            <div>
              <label htmlFor="email" className="label">البريد الإلكتروني</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                disabled={loading}
                className="field text-left"
              />
            </div>
            <div>
              <label htmlFor="password" className="label">كلمة المرور</label>
              <input
                id="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
                minLength={6}
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="field text-left"
              />
              {mode === "signup" && <p className="hint">6 خانات على الأقل.</p>}
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-block">
              {loading ? <span className="spinner" /> : mode === "login" ? "دخول" : "أنشئ الحساب"}
            </button>
            <p className="text-center text-[0.9375rem] text-graphite">
              {mode === "login" ? "ما عندك حساب؟" : "عندك حساب؟"}{" "}
              <button
                type="button"
                className="link"
                onClick={() => { setMode(mode === "login" ? "signup" : "login"); reset(); }}
              >
                {mode === "login" ? "أنشئ حساب جديد" : "سجّل دخولك"}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

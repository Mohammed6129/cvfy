"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PhoneOtpForm from "@/app/login/phone-otp-form";
import { GLASS_INPUT_CLASS } from "@/app/components/home-glass-shell";
import { DEFAULT_POST_AUTH_PATH, getAuthCallbackUrl, mapAuthError } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";
type LoginMethod = "email" | "phone";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

type LoginFormProps = {
  initialMode?: AuthMode;
  authError?: string | null;
  authErrorDescription?: string | null;
  nextPath?: string;
};

function getInitialAuthError(
  authError?: string | null,
  authErrorDescription?: string | null
): string | null {
  if (authError === "auth_callback_error") {
    return "فشل إكمال تسجيل الدخول. يرجى المحاولة مرة أخرى.";
  }

  if (authError === "oauth_error") {
    return authErrorDescription
      ? mapAuthError(authErrorDescription)
      : "تم إلغاء تسجيل الدخول أو فشلت المصادقة.";
  }

  return null;
}

export default function LoginForm({
  initialMode = "login",
  authError,
  authErrorDescription,
  nextPath = DEFAULT_POST_AUTH_PATH,
}: LoginFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    getInitialAuthError(authError, authErrorDescription)
  );

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (mode === "login") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
        setLoading(false);
        return;
      }

      router.push(nextPath);
      router.refresh();
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push(nextPath);
      router.refresh();
      return;
    }

    setMessage(
      "تم إنشاء حسابك بنجاح! تحقق من بريدك الإلكتروني لتأكيد الحساب."
    );
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
        : getAuthCallbackUrl(nextPath);

    const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (oauthError) {
      setError(mapAuthError(oauthError.message));
      setLoading(false);
      return;
    }

    if (data.url) {
      window.location.assign(data.url);
      return;
    }

    setError("تعذر بدء تسجيل الدخول عبر Google.");
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-extrabold text-white">
          {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
        </h1>
        <p className="text-white/70">
          {mode === "login"
            ? "مرحباً بعودتك! سجّل دخولك لمتابعة بناء سيرتك الذاتية."
            : "أنشئ حسابك وابدأ في بناء هويتك المهنية اليوم."}
        </p>
      </div>

      <div className="glass-page-card p-6 sm:p-8">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <div className="mb-6 flex rounded-xl bg-white/10 p-1">
          <button
            type="button"
            onClick={() => {
              setLoginMethod("email");
              setError(null);
              setMessage(null);
            }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              loginMethod === "email"
                ? "bg-white text-[#0C447C] shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            البريد الإلكتروني
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod("phone");
              setError(null);
              setMessage(null);
            }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              loginMethod === "phone"
                ? "bg-white text-[#0C447C] shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            رقم الجوال
          </button>
        </div>

        {loginMethod === "phone" ? (
          <PhoneOtpForm
            nextPath={nextPath}
            loading={loading}
            setLoading={setLoading}
            onError={setError}
            onMessage={setMessage}
          />
        ) : (
        <form className="space-y-5" onSubmit={handleEmailAuth}>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-white/85"
            >
              البريد الإلكتروني
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              dir="ltr"
              disabled={loading}
              className={GLASS_INPUT_CLASS + " text-left disabled:opacity-60"}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-white/85"
            >
              كلمة المرور
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              dir="ltr"
              disabled={loading}
              className={GLASS_INPUT_CLASS + " text-left disabled:opacity-60"}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glass-btn-primary w-full py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "جاري التحميل..."
              : mode === "login"
                ? "تسجيل الدخول"
                : "إنشاء حساب"}
          </button>
        </form>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-transparent px-4 text-sm text-white/55">أو</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/25 bg-white/10 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <GoogleIcon />
            تسجيل الدخول بواسطة Google
          </button>

          <button
            type="button"
            disabled
            className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-slate-900 bg-slate-900 py-3 text-sm font-semibold text-white opacity-60"
          >
            <AppleIcon />
            تسجيل الدخول بواسطة Apple
          </button>
        </div>
      </div>

      {loginMethod === "email" && (
      <p className="mt-8 text-center text-sm text-white/70">
        {mode === "login" ? (
          <>
            ليس لديك حساب؟{" "}
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
                setMessage(null);
              }}
              className="font-semibold text-[#FAC775] transition-colors hover:text-white"
            >
              إنشاء حساب جديد
            </button>
          </>
        ) : (
          <>
            لديك حساب بالفعل؟{" "}
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
                setMessage(null);
              }}
              className="font-semibold text-[#FAC775] transition-colors hover:text-white"
            >
              تسجيل الدخول
            </button>
          </>
        )}
      </p>
      )}

      <p className="mt-4 text-center">
        <Link
          href="/"
          className="text-sm text-white/55 transition-colors hover:text-[#FAC775]"
        >
          العودة إلى الصفحة الرئيسية
        </Link>
      </p>
    </div>
  );
}

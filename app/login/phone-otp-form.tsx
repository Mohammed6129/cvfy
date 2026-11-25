"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatSaudiPhone, mapPhoneAuthError } from "@/lib/phone";
import { createClient } from "@/lib/supabase/client";
import { getTurnstileToken } from "@/lib/turnstile";

type PhoneOtpFormProps = {
  nextPath: string;
  loading: boolean;
  setLoading: (value: boolean) => void;
  onError: (message: string | null) => void;
  onMessage: (message: string | null) => void;
  /** Runs after a successful sign-in, before leaving the page. */
  onSignedIn?: () => Promise<void>;
};

export default function PhoneOtpForm({ nextPath, loading, setLoading, onError, onMessage, onSignedIn }: PhoneOtpFormProps) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    onError(null);
    onMessage(null);

    const full = formatSaudiPhone(phone);
    if (!full) return onError("اكتب رقم جوال سعودي صحيح، مثال: 0501234567");

    setLoading(true);
    const captchaToken = (await getTurnstileToken()) ?? undefined;
    const { error } = await createClient().auth.signInWithOtp({ phone: full, options: { captchaToken } });
    setLoading(false);
    if (error) return onError(mapPhoneAuthError(error.message));

    setSentTo(full);
    onMessage("أرسلنا لك رمز التحقق برسالة نصية.");
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    onError(null);
    onMessage(null);
    if (!sentTo) return;
    if (otp.trim().length < 4) return onError("اكتب رمز التحقق.");

    setLoading(true);
    const { error } = await createClient().auth.verifyOtp({ phone: sentTo, token: otp.trim(), type: "sms" });
    if (error) {
      setLoading(false);
      return onError(mapPhoneAuthError(error.message));
    }
    if (onSignedIn) await onSignedIn();
    router.push(nextPath);
    router.refresh();
  };

  if (!sentTo) {
    return (
      <form className="space-y-4" onSubmit={sendOtp}>
        <div>
          <label htmlFor="phone" className="label">رقم الجوال</label>
          <div dir="ltr" className="field flex items-center gap-2 p-0 focus-within:border-pen focus-within:shadow-[0_0_0_3px_var(--color-pen-soft)]">
            <span className="border-e border-rule px-3 text-graphite">+966</span>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="5xxxxxxxx"
              disabled={loading}
              className="min-h-[2.875rem] flex-1 bg-transparent pe-3 text-base outline-none"
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-block">
          {loading ? <span className="spinner" /> : "أرسل رمز التحقق"}
        </button>
      </form>
    );
  }

  return (
    <form className="space-y-4" onSubmit={verifyOtp}>
      <div>
        <label htmlFor="otp" className="label">
          رمز التحقق المرسل إلى <bdi dir="ltr">{sentTo}</bdi>
        </label>
        <input
          id="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          maxLength={6}
          dir="ltr"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          disabled={loading}
          className="field text-center text-xl tracking-[0.4em]"
        />
      </div>
      <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-block">
        {loading ? <span className="spinner" /> : "تأكيد ودخول"}
      </button>
      <button
        type="button"
        disabled={loading}
        className="btn btn-quiet btn-block"
        onClick={() => { setSentTo(null); setOtp(""); onError(null); onMessage(null); }}
      >
        غيّر الرقم
      </button>
    </form>
  );
}

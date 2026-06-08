"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatSaudiPhone, mapPhoneAuthError } from "@/lib/phone";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#378ADD] focus:ring-2 focus:ring-[#378ADD]/20 disabled:opacity-60";

type PhoneOtpFormProps = {
  nextPath: string;
  loading: boolean;
  setLoading: (value: boolean) => void;
  onError: (message: string | null) => void;
  onMessage: (message: string | null) => void;
};

export default function PhoneOtpForm({
  nextPath,
  loading,
  setLoading,
  onError,
  onMessage,
}: PhoneOtpFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [formattedPhone, setFormattedPhone] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    onError(null);
    onMessage(null);

    const fullPhone = formatSaudiPhone(phone);
    if (!fullPhone) {
      onError("يرجى إدخال رقم جوال سعودي صحيح (مثال: 501234567).");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      phone: fullPhone,
    });

    if (error) {
      onError(mapPhoneAuthError(error.message));
      setLoading(false);
      return;
    }

    setFormattedPhone(fullPhone);
    setOtpSent(true);
    onMessage("تم إرسال رمز التحقق إلى جوالك.");
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    onError(null);
    onMessage(null);

    if (!formattedPhone) {
      onError("يرجى إرسال رمز التحقق أولاً.");
      return;
    }

    if (otp.trim().length < 4) {
      onError("يرجى إدخال رمز التحقق.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otp.trim(),
      type: "sms",
    });

    if (error) {
      onError(mapPhoneAuthError(error.message));
      setLoading(false);
      return;
    }

    router.push(nextPath);
    router.refresh();
  };

  const handleChangeNumber = () => {
    setOtpSent(false);
    setOtp("");
    setFormattedPhone(null);
    onError(null);
    onMessage(null);
  };

  if (!otpSent) {
    return (
      <form className="space-y-5" onSubmit={handleSendOtp}>
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            رقم الجوال
          </label>
          <div
            dir="ltr"
            className="flex overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors focus-within:border-[#378ADD] focus-within:ring-2 focus-within:ring-[#378ADD]/20"
          >
            <span className="flex items-center border-r border-slate-200 bg-[#e8f2fc] px-4 text-sm font-bold text-[#378ADD]">
              +966
            </span>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="5xxxxxxxx"
              disabled={loading}
              className="flex-1 px-4 py-3 text-left text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-60"
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            أدخل رقمك بدون الصفر الأول (مثال: 501234567)
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#378ADD] py-3.5 text-base font-semibold text-white shadow-md shadow-[#378ADD]/25 transition-colors hover:bg-[#2a6bb8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "جاري الإرسال..." : "إرسال رمز التحقق"}
        </button>
      </form>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleVerifyOtp}>
      <div className="rounded-xl border border-[#378ADD]/20 bg-[#e8f2fc] px-4 py-3 text-sm text-[#378ADD]">
        تم إرسال الرمز إلى{" "}
        <span dir="ltr" className="font-bold">
          {formattedPhone}
        </span>
      </div>

      <div>
        <label
          htmlFor="otp"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          رمز التحقق
        </label>
        <input
          id="otp"
          name="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="123456"
          dir="ltr"
          disabled={loading}
          className={`${inputClass} text-center text-lg tracking-[0.3em]`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#378ADD] py-3.5 text-base font-semibold text-white shadow-md shadow-[#378ADD]/25 transition-colors hover:bg-[#2a6bb8] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "جاري التحقق..." : "تأكيد وتسجيل الدخول"}
      </button>

      <button
        type="button"
        onClick={handleChangeNumber}
        disabled={loading}
        className="w-full text-sm font-semibold text-slate-500 transition-colors hover:text-[#378ADD] disabled:opacity-60"
      >
        تغيير رقم الجوال
      </button>
    </form>
  );
}

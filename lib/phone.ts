const SAUDI_MOBILE_REGEX = /^5\d{8}$/;

export function normalizeSaudiLocalNumber(input: string): string {
  let digits = input.replace(/\D/g, "");

  if (digits.startsWith("966")) {
    digits = digits.slice(3);
  }

  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return digits;
}

export function formatSaudiPhone(input: string): string | null {
  const digits = normalizeSaudiLocalNumber(input);

  if (!SAUDI_MOBILE_REGEX.test(digits)) {
    return null;
  }

  return `+966${digits}`;
}

export function mapPhoneAuthError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid") && normalized.includes("phone")) {
    return "رقم الجوال غير صالح. أدخل رقماً سعودياً يبدأ بـ 5.";
  }

  if (normalized.includes("token") || normalized.includes("otp")) {
    return "رمز التحقق غير صحيح أو منتهي الصلاحية.";
  }

  if (
    normalized.includes("rate limit") ||
    normalized.includes("too many")
  ) {
    return "تم إرسال عدد كبير من الطلبات. يرجى الانتظار قليلاً.";
  }

  if (
    normalized.includes("phone provider") ||
    normalized.includes("sms")
  ) {
    return "خدمة الرسائل غير مفعّلة. فعّل Phone Auth في Supabase.";
  }

  return "تعذر إكمال تسجيل الدخول برقم الجوال. يرجى المحاولة مرة أخرى.";
}

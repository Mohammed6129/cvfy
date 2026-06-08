export const MOYASAR_JS_URL =
  "https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.2.9/dist/moyasar.umd.js";
export const MOYASAR_CSS_URL =
  "https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.2.9/dist/moyasar.css";

let loadPromise: Promise<void> | null = null;

function isPlaceholderKey(key: string | undefined): boolean {
  return !key || key.includes("your-moyasar");
}

function isValidMoyasarKey(key: string): boolean {
  return key.startsWith("pk_test_") || key.startsWith("pk_live_");
}

/** Moyasar requires HTTPS — unavailable on http://localhost. */
export function isMoyasarHttpsEnvironment(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.protocol.toLowerCase() === "https:";
}

/** Publishable key from NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY (pk_test or pk_live). */
export function getMoyasarPublishableKey(): string | undefined {
  if (!isMoyasarHttpsEnvironment()) return undefined;

  const key = process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY?.trim();
  if (isPlaceholderKey(key) || !key || !isValidMoyasarKey(key)) return undefined;
  return key;
}

export function getMoyasarEnvironmentError(): string | null {
  if (typeof window !== "undefined" && !isMoyasarHttpsEnvironment()) {
    return "الدفع متاح على الموقع المباشر فقط";
  }

  const key = process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY?.trim();
  if (isPlaceholderKey(key) || !key) {
    return "مفتاح الدفع غير مُهيّأ. أضف NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY إلى .env.local ثم أعد تشغيل الخادم.";
  }

  if (!isValidMoyasarKey(key)) {
    return "مفتاح Moyasar غير صالح. استخدم pk_test_ أو pk_live_ من لوحة Moyasar.";
  }

  return null;
}

export function getMoyasarCallbackUrl(): string {
  if (typeof window === "undefined") return "/preview";
  return `${window.location.origin}/preview`;
}

export function loadMoyasarAssets(): Promise<void> {
  if (typeof window === "undefined" || !isMoyasarHttpsEnvironment()) {
    return Promise.resolve();
  }

  if (window.Moyasar) {
    return Promise.resolve();
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${MOYASAR_CSS_URL}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = MOYASAR_CSS_URL;
      document.head.appendChild(link);
    }

    const existingScript = document.querySelector(
      `script[src="${MOYASAR_JS_URL}"]`
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.Moyasar) {
        resolve();
        return;
      }
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load Moyasar script")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = MOYASAR_JS_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Moyasar script"));
    document.body.appendChild(script);
  });

  return loadPromise;
}

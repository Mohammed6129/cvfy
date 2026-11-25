/**
 * Optional Cloudflare Turnstile token for guest sign-in. Active only when
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY is set (and the matching secret is entered
 * in Supabase → Auth → Bot protection). Without it, returns null right away.
 */
type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("turnstile failed to load"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export async function getTurnstileToken(timeoutMs = 10_000): Promise<string | null> {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  if (!siteKey || typeof window === "undefined") return null;

  try {
    await loadScript();
  } catch {
    return null;
  }
  const api = window.turnstile;
  if (!api) return null;

  return new Promise<string | null>((resolve) => {
    const host = document.createElement("div");
    host.style.position = "fixed";
    host.style.bottom = "1rem";
    host.style.insetInlineStart = "1rem";
    host.style.zIndex = "60";
    document.body.appendChild(host);

    let widgetId = "";
    const finish = (token: string | null) => {
      clearTimeout(timer);
      try {
        if (widgetId) api.remove(widgetId);
      } catch {
        // already gone
      }
      host.remove();
      resolve(token);
    };
    const timer = setTimeout(() => finish(null), timeoutMs);

    widgetId = api.render(host, {
      sitekey: siteKey,
      appearance: "interaction-only",
      callback: (token: string) => finish(token),
      "error-callback": () => finish(null),
    });
  });
}

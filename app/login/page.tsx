import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";
import { DEFAULT_POST_AUTH_PATH } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function getPostLoginPath(next?: string): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }
  return DEFAULT_POST_AUTH_PATH;
}

export const metadata: Metadata = {
  title: "تسجيل الدخول — CVfy",
  description: "سجّل دخولك إلى CVfy لإدارة سيرتك الذاتية الاحترافية.",
};

type LoginPageProps = {
  searchParams: Promise<{
    mode?: string;
    error?: string;
    error_description?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const initialMode = params.mode === "signup" ? "signup" : "login";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && !params.error) {
    redirect(getPostLoginPath(params.next));
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <header className="border-b border-[#378ADD]/15 bg-white px-4 py-4 sm:px-6">
        <Link href="/" className="group mx-auto flex w-full max-w-md flex-col gap-0.5">
          <span className="text-2xl font-extrabold text-[#378ADD]">CVfy</span>
          <span className="text-xs font-medium text-slate-500 transition-colors group-hover:text-[#378ADD]">
            هويتك المهنية
          </span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <LoginForm
          initialMode={initialMode}
          authError={params.error ?? null}
          authErrorDescription={params.error_description ?? null}
          nextPath={getPostLoginPath(params.next)}
        />
      </main>
    </div>
  );
}

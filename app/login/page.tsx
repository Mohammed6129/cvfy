import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AppHeader from "@/app/components/app-header";
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
      <AppHeader maxWidth="2xl" />

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <LoginForm
          initialMode={initialMode}
          nextPath={getPostLoginPath(params.next)}
        />
      </main>
    </div>
  );
}

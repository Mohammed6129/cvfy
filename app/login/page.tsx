import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "تسجيل الدخول — CVfy",
  description: "سجّل دخولك إلى CVfy لإدارة سيرتك الذاتية الاحترافية.",
};

type LoginPageProps = {
  searchParams: Promise<{
    mode?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const initialMode = params.mode === "signup" ? "signup" : "login";

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
        <LoginForm initialMode={initialMode} authError={params.error ?? null} />
      </main>
    </div>
  );
}

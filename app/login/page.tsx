import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageShell from "@/app/components/page-shell";
import { isMockMode } from "@/lib/ai/client";
import { getSessionUser } from "@/lib/server/session";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  robots: { index: false },
};

function safeNext(next?: string): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/my-cvs";
}

type Props = {
  searchParams: Promise<{ error?: string; error_description?: string; next?: string; save?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const [params, user] = await Promise.all([searchParams, getSessionUser()]);
  const nextPath = safeNext(params.next);

  // A guest (anonymous session) is here to keep their CVs: show the form, don't bounce them.
  if (user && !user.isAnonymous && !params.error) redirect(nextPath);

  return (
    <PageShell variant="focus" footer={false}>
      <div className="wrap flex justify-center py-10 md:py-16">
        <LoginForm
          nextPath={nextPath}
          authError={params.error ?? null}
          authErrorDescription={params.error_description ?? null}
          mock={isMockMode()}
          guest={Boolean(user?.isAnonymous)}
        />
      </div>
    </PageShell>
  );
}

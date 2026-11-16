import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageShell from "@/app/components/page-shell";
import { isMockMode } from "@/lib/ai/client";
import { getSessionUser } from "@/lib/server/session";
import PreviewClient from "./preview-client";

export const metadata: Metadata = {
  title: "معاينة سيرتك",
  robots: { index: false },
};

type Props = {
  searchParams: Promise<{ cv?: string; id?: string; status?: string; message?: string; plan?: string }>;
};

export default async function PreviewPage({ searchParams }: Props) {
  const [params, user] = await Promise.all([searchParams, getSessionUser()]);

  if (!params.cv) redirect("/my-cvs");
  if (!user) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    redirect(`/login?next=${encodeURIComponent(`/preview?${query}`)}`);
  }

  // Moyasar sends the shopper back with ?id=<payment>&status=<paid|failed>.
  const payment = params.id
    ? { id: params.id, status: params.status ?? "", message: params.message ?? "", plan: params.plan ?? "" }
    : null;

  return (
    <PageShell variant="focus" desk footer={false}>
      <PreviewClient cvId={params.cv} userId={user.id} mock={isMockMode()} payment={payment} />
    </PageShell>
  );
}

import type { Metadata } from "next";
import PageShell from "@/app/components/page-shell";
import { getSessionUser } from "@/lib/server/session";
import Wizard from "./wizard";

export const metadata: Metadata = {
  title: "أنشئ سيرتك",
  description: "عبّي بياناتك بأسلوبك وشوف سيرتك مكتوبة ومفحوصة قبل لا تدفع.",
};

type Props = {
  searchParams: Promise<{ edit?: string; resume?: string; new?: string }>;
};

export default async function CreatePage({ searchParams }: Props) {
  const [params, user] = await Promise.all([searchParams, getSessionUser()]);

  return (
    <PageShell variant="focus" footer={false}>
      <div className="wrap py-8 md:py-12">
        <Wizard
          signedIn={Boolean(user)}
          email={user?.email ?? null}
          editId={params.edit ?? null}
          resume={params.resume === "1"}
          fresh={params.new === "1"}
        />
      </div>
    </PageShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import PageShell from "@/app/components/page-shell";
import { getSessionUser, isMember } from "@/lib/server/session";

export const metadata: Metadata = {
  title: "حسابي",
  robots: { index: false },
};

export default async function AccountPage() {
  const user = await getSessionUser();
  // Guests sign in first; their CVs move to the account on the way.
  if (!isMember(user)) redirect("/login?next=/account");

  return (
    <PageShell>
      <div className="wrap wrap-narrow py-10 md:py-14">
        <h1 className="t-h2">حسابي</h1>

        <dl className="card mt-8 divide-y divide-rule">
          <div className="flex items-center justify-between gap-4 p-5">
            <dt className="text-graphite">الاسم</dt>
            <dd className="font-medium">{user.name}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 p-5">
            <dt className="text-graphite">البريد الإلكتروني</dt>
            <dd className="font-medium" dir="ltr">{user.email ?? "—"}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/my-cvs" className="btn btn-primary">سيري الذاتية</Link>
          <form action={signOut}>
            <button type="submit" className="btn btn-ghost">تسجيل الخروج</button>
          </form>
        </div>

        <p className="t-small mt-10">
          تبغى تحذف حسابك وكل بياناتك؟ راسلنا من بريدك المسجّل على{" "}
          <a href="mailto:support@cvfy.sa" className="link" dir="ltr">support@cvfy.sa</a> ونحذفه لك.
        </p>
      </div>
    </PageShell>
  );
}

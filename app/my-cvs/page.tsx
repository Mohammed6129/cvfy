import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PlusIcon } from "@/app/components/icons";
import PageShell from "@/app/components/page-shell";
import { listCvs } from "@/lib/server/repo";
import { getSessionUser } from "@/lib/server/session";
import { toListItem } from "@/lib/server/view";
import DeleteButton from "./delete-button";

export const metadata: Metadata = {
  title: "سيري الذاتية",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", { dateStyle: "medium" });

export default async function MyCvsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/my-cvs");

  const items = (await listCvs(user.id).catch(() => [])).map((row) => toListItem(row, user));

  return (
    <PageShell>
      <div className="wrap wrap-narrow py-10 md:py-14">
        <div className="flex items-center justify-between gap-4">
          <h1 className="t-h2">سيري الذاتية</h1>
          <Link href="/create?new=1" className="btn btn-primary btn-sm">
            <PlusIcon size={16} />
            سيرة جديدة
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="card mt-8 p-8 text-center">
            <p className="t-h3">ما عندك سير محفوظة</p>
            <p className="t-body mt-1">ابدأ أول سيرة — تشوفها مكتوبة ومفحوصة قبل لا تدفع.</p>
            <Link href="/create" className="btn btn-primary mt-5">ابدأ سيرتك</Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {items.map((cv) => (
              <li key={cv.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-medium">{cv.jobTitle || cv.title}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-graphite">
                    <span
                      className={`rounded-full px-2.5 py-0.5 ${
                        cv.paid ? "bg-ok-soft text-ok" : cv.hasDoc ? "bg-marker-soft text-ink" : "bg-desk"
                      }`}
                    >
                      {cv.paid ? (cv.plan === "basic" ? "مدفوعة — الأساسية" : "مدفوعة — الكاملة") : cv.hasDoc ? "معاينة" : "مسودة"}
                    </span>
                    {cv.score !== null && <span>فحص ATS: <bdi dir="ltr">{cv.score}%</bdi></span>}
                    <span>آخر تعديل {dateFormat.format(new Date(cv.updatedAt))}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <DeleteButton id={cv.id} title={cv.jobTitle || cv.title} />
                  <Link href={cv.hasDoc ? `/preview?cv=${cv.id}` : `/create?edit=${cv.id}`} className="btn btn-ghost btn-sm">
                    {cv.hasDoc ? (cv.paid ? "افتح وحمّل" : "افتح المعاينة") : "كمّلها"}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}

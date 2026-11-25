import Link from "next/link";
import { getSessionUser, isMember } from "@/lib/server/session";
import Logo from "./logo";
import UserMenu from "./user-menu";

type SiteHeaderProps = {
  /** "focus" strips the navigation on the build and checkout pages. */
  variant?: "full" | "focus";
};

export default async function SiteHeader({ variant = "full" }: SiteHeaderProps) {
  const user = await getSessionUser();

  return (
    <header className="no-print sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur-md">
      <div className="wrap flex min-h-16 items-center justify-between gap-4">
        <Logo />

        {variant === "full" && (
          <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-1 md:flex">
            <Link href="/#how" className="btn btn-quiet">كيف يشتغل</Link>
            <Link href="/#pricing" className="btn btn-quiet">الأسعار</Link>
            <Link href="/about-ats" className="btn btn-quiet">وش هو ATS؟</Link>
          </nav>
        )}

        <div className="flex items-center gap-2">
          {isMember(user) ? (
            <UserMenu name={user.name} avatarUrl={user.avatarUrl} />
          ) : variant === "full" ? (
            <>
              <Link href="/login" className="btn btn-quiet hidden sm:inline-flex">دخول</Link>
              <Link href="/create" className="btn btn-primary btn-sm">ابدأ سيرتك</Link>
            </>
          ) : (
            <Link href="/login" className="btn btn-quiet">دخول</Link>
          )}
        </div>
      </div>
    </header>
  );
}

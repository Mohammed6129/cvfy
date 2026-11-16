import Link from "next/link";
import PageShell from "./components/page-shell";

export default function NotFound() {
  return (
    <PageShell>
      <div className="wrap wrap-narrow py-24 text-center">
        <h1 className="t-h2">الصفحة هذي مو موجودة</h1>
        <p className="t-body mt-2">يمكن الرابط قديم أو فيه خطأ في العنوان.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">الصفحة الرئيسية</Link>
          <Link href="/create" className="btn btn-ghost">ابدأ سيرتك</Link>
        </div>
      </div>
    </PageShell>
  );
}

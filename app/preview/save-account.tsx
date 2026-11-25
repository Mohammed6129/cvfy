import Link from "next/link";

/** Guests only: one tap to keep this CV in an account (Google, email or phone). */
export default function SaveAccount({ cvId, paid }: { cvId: string; paid: boolean }) {
  const href = `/login?next=${encodeURIComponent(`/preview?cv=${cvId}`)}&save=1`;
  return (
    <section className={`card p-5 ${paid ? "border-brand" : ""}`} aria-labelledby="save-title">
      <h2 id="save-title" className="t-h3">احفظ سيرتك في حسابك</h2>
      <p className="t-small mt-1">
        {paid
          ? "عشان ترجع لها من أي جهاز، وتعدّلها وتحمّلها بعدين."
          : "اختياري. عشان ترجع لها من أي جهاز."}
      </p>
      <Link href={href} className={`btn btn-block mt-3 ${paid ? "btn-primary" : "btn-ghost"}`}>
        احفظها بحسابي
      </Link>
    </section>
  );
}

import Link from "next/link";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  href?: string | null;
  /** White wordmark for dark backgrounds (footer). */
  inverse?: boolean;
};

const SIZES = { sm: "text-[1.2rem]", md: "text-[1.4rem]", lg: "text-[1.9rem]" };

/** A sheet with a tick on a blue tile: the CV that passed the check. */
function Badge() {
  return (
    <svg viewBox="0 0 32 32" className="h-[1.3em] w-[1.3em] shrink-0" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill="var(--color-brand)" />
      <path d="M10 7.5h8.5l4.5 4.5v12.5a1.5 1.5 0 0 1-1.5 1.5h-11.5a1.5 1.5 0 0 1-1.5-1.5v-15.5a1.5 1.5 0 0 1 1.5-1.5z" fill="#fff" />
      <path d="M18.5 7.5v3a1.5 1.5 0 0 0 1.5 1.5h3" fill="#cfe0ff" />
      <path d="M12.2 18.6l2.6 2.6 5-5.2" fill="none" stroke="var(--color-brand)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LogoMark({ size = "md", inverse = false }: { size?: LogoProps["size"]; inverse?: boolean }) {
  return (
    <span
      dir="ltr"
      className={`inline-flex items-center gap-[0.35em] font-bold leading-none tracking-tight ${inverse ? "text-white" : "text-ink"} ${SIZES[size ?? "md"]}`}
    >
      <Badge />
      <span>CVfy</span>
    </span>
  );
}

export default function Logo({ size = "md", href = "/", inverse = false }: LogoProps) {
  if (!href) return <LogoMark size={size} inverse={inverse} />;
  return (
    <Link href={href} aria-label="CVfy — الصفحة الرئيسية" className="inline-flex shrink-0 rounded-md">
      <LogoMark size={size} inverse={inverse} />
    </Link>
  );
}

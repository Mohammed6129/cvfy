import Link from "next/link";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  href?: string | null;
};

const SIZES = { sm: "text-[1.25rem]", md: "text-[1.5rem]", lg: "text-[2rem]" };

/** Wordmark: "CV" under a highlighter stroke — the CV that gets picked. */
export function LogoMark({ size = "md" }: { size?: LogoProps["size"] }) {
  return (
    <span dir="ltr" className={`inline-flex items-baseline font-bold leading-none tracking-tight text-ink ${SIZES[size ?? "md"]}`}>
      <span className="rounded-[0.28em] bg-marker px-[0.2em] py-[0.12em]">CV</span>
      <span className="ps-[0.04em]">fy</span>
    </span>
  );
}

export default function Logo({ size = "md", href = "/" }: LogoProps) {
  if (!href) return <LogoMark size={size} />;
  return (
    <Link href={href} aria-label="CVfy — الصفحة الرئيسية" className="inline-flex shrink-0 rounded-md">
      <LogoMark size={size} />
    </Link>
  );
}

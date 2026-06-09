import Link from "next/link";

type BrandLogoProps = {
  className?: string;
};

export default function BrandLogo({ className = "" }: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={`group flex shrink-0 flex-col gap-0.5 ${className}`}
    >
      <span className="text-2xl font-extrabold tracking-tight text-[#378ADD]">
        CVfy
      </span>
      <span className="text-xs font-medium text-slate-500 transition-colors group-hover:text-[#378ADD]">
        هويتك المهنية
      </span>
    </Link>
  );
}

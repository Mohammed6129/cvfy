import Link from "next/link";

type BrandLogoProps = {
  className?: string;
  asLink?: boolean;
  variant?: "default" | "glass";
};

export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width="32"
      height="38"
      viewBox="0 0 32 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="1" y="1" width="30" height="36" rx="4" fill="#378ADD" />
      <line x1="6" y1="10" x2="26" y2="10" stroke="white" strokeWidth="1.5" strokeOpacity="0.9" />
      <line x1="6" y1="15" x2="22" y2="15" stroke="white" strokeWidth="1.5" strokeOpacity="0.75" />
      <line x1="6" y1="20" x2="26" y2="20" stroke="white" strokeWidth="1.5" strokeOpacity="0.75" />
      <line x1="6" y1="25" x2="18" y2="25" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
    </svg>
  );
}

export default function BrandLogo({
  className = "",
  asLink = true,
  variant = "default",
}: BrandLogoProps) {
  const isGlass = variant === "glass";

  const content = (
    <>
      <LogoIcon />
      <div className="flex flex-col gap-0.5">
        <span className="text-xl font-bold leading-none tracking-tight">
          {isGlass ? (
            <span className="text-white">CVfy</span>
          ) : (
            <>
              <span className="text-[#0C447C]">CV</span>
              <span className="text-[#378ADD]">fy</span>
            </>
          )}
        </span>
        <span className={`text-[11px] font-medium ${isGlass ? "text-white/70" : "text-slate-500"}`}>
          هويتك المهنية
        </span>
      </div>
    </>
  );

  const wrapperClass = isGlass
    ? `glass-surface-sm inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 ${className}`
    : `inline-flex shrink-0 items-center gap-2 ${className}`;

  if (!asLink) {
    return <span className={wrapperClass}>{content}</span>;
  }

  return (
    <Link href="/" className={`group ${wrapperClass}`}>
      {content}
    </Link>
  );
}

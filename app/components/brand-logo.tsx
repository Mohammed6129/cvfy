import Link from "next/link";

type BrandLogoProps = {
  className?: string;
  asLink?: boolean;
};

export function PaperIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width="36"
      height="44"
      viewBox="0 0 36 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3 3H22L32 13V41H3V3Z"
        fill="white"
        stroke="#378ADD"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M22 3H32V13L22 13V3Z"
        fill="white"
        stroke="#378ADD"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M22 3V13H32" stroke="#378ADD" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="7" y1="18" x2="27" y2="18" stroke="#378ADD" strokeWidth="1.2" strokeOpacity="0.4" />
      <line x1="7" y1="23" x2="24" y2="23" stroke="#378ADD" strokeWidth="1.2" strokeOpacity="0.4" />
      <line x1="7" y1="28" x2="27" y2="28" stroke="#378ADD" strokeWidth="1.2" strokeOpacity="0.4" />
      <line x1="7" y1="33" x2="20" y2="33" stroke="#378ADD" strokeWidth="1.2" strokeOpacity="0.4" />
    </svg>
  );
}

export default function BrandLogo({ className = "", asLink = true }: BrandLogoProps) {
  const content = (
    <>
      <PaperIcon />
      <div className="flex flex-col gap-0.5">
        <span
          className="text-2xl font-bold leading-none tracking-tight text-[#378ADD]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          CVfy
        </span>
        <span className="text-xs font-medium text-slate-500 transition-colors group-hover:text-[#378ADD]">
          هويتك المهنية
        </span>
      </div>
    </>
  );

  if (!asLink) {
    return (
      <span className={`inline-flex shrink-0 items-center gap-2.5 ${className}`}>
        {content}
      </span>
    );
  }

  return (
    <Link
      href="/"
      className={`group inline-flex shrink-0 items-center gap-2.5 ${className}`}
    >
      {content}
    </Link>
  );
}

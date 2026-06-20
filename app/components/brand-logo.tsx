import Link from "next/link";

const LOGO_SRC = "/logo/cvfy-badge-logo.svg";
const DEFAULT_SIZE = 38;

type BrandLogoProps = {
  className?: string;
  asLink?: boolean;
  size?: number;
};

export function LogoIcon({
  className = "",
  size = DEFAULT_SIZE,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <img
      src={LOGO_SRC}
      alt="CVfy"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
    />
  );
}

export default function BrandLogo({
  className = "",
  asLink = true,
  size = DEFAULT_SIZE,
}: BrandLogoProps) {
  const logo = <LogoIcon className={className} size={size} />;

  if (!asLink) {
    return logo;
  }

  return (
    <Link href="/" className="inline-flex shrink-0">
      {logo}
    </Link>
  );
}

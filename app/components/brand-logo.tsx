import Link from "next/link";

export const LOGO_SRC = "/logo/cvfy-logo.png";

const LOGO_WIDTH = 123;
const LOGO_HEIGHT = 179;

export const NAVBAR_LOGO_HEIGHT = 88;
export const FOOTER_LOGO_HEIGHT = 128;
const DEFAULT_LOGO_HEIGHT = 38;

export function logoDimensions(targetHeight: number) {
  return {
    width: Math.round((LOGO_WIDTH / LOGO_HEIGHT) * targetHeight),
    height: targetHeight,
  };
}

type BrandLogoProps = {
  className?: string;
  asLink?: boolean;
  height?: number;
};

export function LogoIcon({
  className = "",
  height = DEFAULT_LOGO_HEIGHT,
}: {
  className?: string;
  height?: number;
}) {
  const { width, height: logoHeight } = logoDimensions(height);

  return (
    <img
      src={LOGO_SRC}
      alt="CVfy"
      width={width}
      height={logoHeight}
      className={`shrink-0 ${className}`}
      style={{ objectFit: "contain", display: "block" }}
    />
  );
}

export default function BrandLogo({
  className = "",
  asLink = true,
  height = DEFAULT_LOGO_HEIGHT,
}: BrandLogoProps) {
  const logo = <LogoIcon className={className} height={height} />;

  if (!asLink) {
    return logo;
  }

  return (
    <Link href="/" className="inline-flex shrink-0">
      {logo}
    </Link>
  );
}

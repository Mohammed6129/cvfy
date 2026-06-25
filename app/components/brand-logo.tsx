import Image from "next/image";
import Link from "next/link";

// Lockup = icon + "CVfy" text
// Icon   = icon only
// Dark variant = suitable for dark/glass backgrounds (white text)
// Light variant = suitable for light backgrounds (dark text)

export const LOGO_LOCKUP_DARK = "/logo/cvfy-lockup-dark.svg";
export const LOGO_LOCKUP_LIGHT = "/logo/cvfy-lockup-light.svg";
export const LOGO_ICON_DARK = "/logo/cvfy-icon-dark.svg";
export const LOGO_ICON_LIGHT = "/logo/cvfy-icon-light.svg";

// Legacy alias kept so any remaining import of LOGO_SRC doesn't break
export const LOGO_SRC = LOGO_LOCKUP_DARK;

// Lockup SVG natural dimensions: 1056 × 440
const LOCKUP_RATIO = 1056 / 440; // ~2.4

// Icon SVG natural dimensions: 800 × 800
const ICON_RATIO = 1;

export const NAVBAR_LOGO_HEIGHT = 52;
export const FOOTER_LOGO_HEIGHT = 58;
const DEFAULT_LOGO_HEIGHT = 52;

export function logoDimensions(targetHeight: number, icon = false) {
  const ratio = icon ? ICON_RATIO : LOCKUP_RATIO;
  return {
    width: Math.round(ratio * targetHeight),
    height: targetHeight,
  };
}

type Variant = "lockup-dark" | "lockup-light" | "icon-dark" | "icon-light";

function srcForVariant(variant: Variant) {
  switch (variant) {
    case "lockup-dark":  return LOGO_LOCKUP_DARK;
    case "lockup-light": return LOGO_LOCKUP_LIGHT;
    case "icon-dark":    return LOGO_ICON_DARK;
    case "icon-light":   return LOGO_ICON_LIGHT;
  }
}

type LogoIconProps = {
  className?: string;
  height?: number;
  variant?: Variant;
};

export function LogoIcon({
  className = "",
  height = DEFAULT_LOGO_HEIGHT,
  variant = "lockup-dark",
}: LogoIconProps) {
  const isIcon = variant.startsWith("icon");
  const { width, height: h } = logoDimensions(height, isIcon);

  return (
    <Image
      src={srcForVariant(variant)}
      alt="CVfy"
      width={width}
      height={h}
      className={`shrink-0 ${className}`}
      style={{ objectFit: "contain", display: "block" }}
      priority
    />
  );
}

type BrandLogoProps = {
  className?: string;
  asLink?: boolean;
  height?: number;
  variant?: Variant;
};

export default function BrandLogo({
  className = "",
  asLink = true,
  height = DEFAULT_LOGO_HEIGHT,
  variant = "lockup-dark",
}: BrandLogoProps) {
  const logo = <LogoIcon className={className} height={height} variant={variant} />;

  if (!asLink) {
    return logo;
  }

  return (
    <Link href="/" className="inline-flex shrink-0">
      {logo}
    </Link>
  );
}

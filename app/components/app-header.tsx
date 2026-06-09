import BrandLogo from "./brand-logo";
import NavbarAuth from "./navbar-auth";

type AppHeaderProps = {
  maxWidth?: "2xl" | "3xl" | "4xl" | "6xl";
  sticky?: boolean;
  className?: string;
};

const maxWidthClass = {
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "6xl": "max-w-6xl",
};

export default function AppHeader({
  maxWidth = "4xl",
  sticky = false,
  className = "",
}: AppHeaderProps) {
  return (
    <header
      className={`border-b border-[#378ADD]/15 bg-white px-4 py-4 sm:px-6 ${
        sticky ? "sticky top-0 z-50 bg-white/95 shadow-sm backdrop-blur-sm" : ""
      } ${className}`}
    >
      <div
        className={`mx-auto flex items-center justify-between ${maxWidthClass[maxWidth]}`}
      >
        <BrandLogo />
        <NavbarAuth />
      </div>
    </header>
  );
}

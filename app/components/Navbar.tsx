import Link from "next/link";
import NavbarAuth from "./navbar-auth";

const navLinks = [
  { href: "/about-ats", label: "ما هو ATS؟" },
  { href: "/features", label: "المميزات" },
];

type NavbarProps = {
  variant?: "default" | "glass";
};

export default function Navbar({ variant = "default" }: NavbarProps) {
  const isGlass = variant === "glass";

  return (
    <header
      className={
        isGlass
          ? "glass-surface-nav sticky top-0 z-50 w-full border-b-0"
          : "sticky top-0 z-50 w-full border-b border-[#F0F0F0] bg-white"
      }
    >
      <nav className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-6 py-4 md:px-12">
        <Link href="/" className="shrink-0">
          <img
            src="/logo/cvfy-badge-logo.svg"
            alt="CVfy"
            width={52}
            height={52}
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                isGlass
                  ? "text-sm font-semibold text-white/85 transition-colors hover:text-white"
                  : "text-sm font-semibold text-slate-700 transition-colors hover:text-[#378ADD]"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        <NavbarAuth variant={isGlass ? "glass" : "default"} />
      </nav>
    </header>
  );
}

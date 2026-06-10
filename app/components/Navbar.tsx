import Link from "next/link";
import BrandLogo from "./brand-logo";
import NavbarAuth from "./navbar-auth";

const navLinks = [
  { href: "/about-ats", label: "ما هو ATS؟" },
  { href: "/features", label: "المميزات" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#378ADD]/15 bg-white/95 shadow-sm backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-8">
        <BrandLogo />

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-slate-700 transition-colors hover:text-[#378ADD]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <NavbarAuth loginHref="/login?next=/create" loginLabel="ابدأ الآن" />
      </nav>
    </header>
  );
}

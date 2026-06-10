import Link from "next/link";
import BrandLogo from "./brand-logo";
import NavbarAuth from "./navbar-auth";

const navLinks = [
  { href: "/about-ats", label: "ما هو ATS؟" },
  { href: "/features", label: "المميزات" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#F0F0F0] bg-white">
      <nav className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-6 py-4 md:px-12">
        <BrandLogo />

        <div className="hidden items-center gap-8 md:flex">
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

        <NavbarAuth />
      </nav>
    </header>
  );
}

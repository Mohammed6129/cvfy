import Link from "next/link";
import NavbarAuth from "./navbar-auth";

const navLinks = [
  { href: "#features", label: "المميزات" },
  { href: "#pricing", label: "الأسعار" },
  { href: "#faq", label: "الأسئلة الشائعة" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#378ADD]/15 bg-white/95 shadow-sm backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex shrink-0 flex-col gap-0.5">
          <span className="text-2xl font-extrabold tracking-tight text-[#378ADD]">
            CVfy
          </span>
          <span className="text-xs font-medium text-slate-500 transition-colors group-hover:text-[#378ADD]">
            هويتك المهنية
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-6 lg:flex lg:gap-8">
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

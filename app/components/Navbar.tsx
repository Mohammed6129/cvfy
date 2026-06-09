import BrandLogo from "./brand-logo";
import NavbarAuth from "./navbar-auth";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#378ADD]/15 bg-white/95 shadow-sm backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <BrandLogo />
        <NavbarAuth />
      </nav>
    </header>
  );
}

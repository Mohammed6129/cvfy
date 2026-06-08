export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-center md:text-right">
          <p className="text-xl font-extrabold text-[#378ADD]">CVfy</p>
          <p className="text-sm text-slate-500">هويتك المهنية</p>
        </div>
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} CVfy. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}

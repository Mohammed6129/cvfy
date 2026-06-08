import type { Metadata } from "next";
import Link from "next/link";
import CreateForm from "./create-form";

export const metadata: Metadata = {
  title: "إنشاء السيرة الذاتية — CVfy",
  description: "أنشئ سيرتك الذاتية خطوة بخطوة مع CVfy.",
};

export default function CreatePage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <header className="border-b border-[#378ADD]/15 bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="group flex flex-col gap-0.5">
            <span className="text-2xl font-extrabold text-[#378ADD]">CVfy</span>
            <span className="text-xs font-medium text-slate-500 transition-colors group-hover:text-[#378ADD]">
              هويتك المهنية
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-slate-600 transition-colors hover:text-[#378ADD]"
          >
            العودة للرئيسية
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <CreateForm />
      </main>
    </div>
  );
}

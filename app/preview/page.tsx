import type { Metadata } from "next";
import Link from "next/link";
import NavbarAuth from "@/app/components/navbar-auth";
import CvPreview from "./cv-preview";

export const metadata: Metadata = {
  title: "معاينة السيرة الذاتية — CVfy",
  description: "معاينة سيرتك الذاتية المُنشأة بواسطة CVfy.",
};

export default function PreviewPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <header className="border-b border-[#378ADD]/15 bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="group flex flex-col gap-0.5">
            <span className="text-2xl font-extrabold text-[#378ADD]">CVfy</span>
            <span className="text-xs font-medium text-slate-500 transition-colors group-hover:text-[#378ADD]">
              هويتك المهنية
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/create"
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-[#378ADD]"
            >
              تعديل البيانات
            </Link>
            <NavbarAuth />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <CvPreview />
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import AppHeader from "@/app/components/app-header";
import LoadingSpinner from "@/app/components/loading-spinner";
import CvPreview from "./cv-preview";

export const metadata: Metadata = {
  title: "معاينة السيرة الذاتية — CVfy",
  description: "معاينة سيرتك الذاتية المُنشأة بواسطة CVfy.",
};

export default function PreviewPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <AppHeader maxWidth="4xl" />

      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-4 sm:max-w-md sm:py-6">
        <Suspense fallback={<LoadingSpinner label="جاري تحميل المعاينة..." />}>
          <CvPreview />
        </Suspense>
      </main>
    </div>
  );
}

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
    <div className="flex min-h-full flex-1 flex-col bg-[#F4F8FF]">
      <AppHeader maxWidth="6xl" />

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-6 pb-10 pt-8">
        <Suspense fallback={<LoadingSpinner label="جاري تحميل المعاينة..." />}>
          <CvPreview />
        </Suspense>
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import GlassPageLayout from "@/app/components/glass-page-layout";
import LoadingSpinner from "@/app/components/loading-spinner";
import ErrorBoundary from "@/app/components/error-boundary";
import CvPreview from "./cv-preview";

export const metadata: Metadata = {
  title: "معاينة السيرة الذاتية — CVfy",
  description: "معاينة سيرتك الذاتية المُنشأة بواسطة CVfy.",
};

export default function PreviewPage() {
  return (
    <GlassPageLayout mainClassName="px-6 pb-10 pt-8">
      <div className="mx-auto w-full max-w-[1100px]">
        <ErrorBoundary fallbackHref="/create" fallbackLabel="العودة لإنشاء السيرة">
          <Suspense fallback={<LoadingSpinner label="جاري تحميل المعاينة..." />}>
            <CvPreview />
          </Suspense>
        </ErrorBoundary>
      </div>
    </GlassPageLayout>
  );
}

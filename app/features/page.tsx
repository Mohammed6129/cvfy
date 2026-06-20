import type { Metadata } from "next";
import Features from "@/app/components/Features";
import GlassPageLayout from "@/app/components/glass-page-layout";

export const metadata: Metadata = {
  title: "لماذا CVfy؟",
  description:
    "كل ما تحتاجه لبناء سيرة ذاتية تبرز مهاراتك وتفتح لك أبواب الفرص الوظيفية.",
};

export default function FeaturesPage() {
  return (
    <GlassPageLayout>
      <Features />
    </GlassPageLayout>
  );
}

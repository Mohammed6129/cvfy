import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Features from "@/app/components/Features";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "لماذا CVfy؟",
  description:
    "كل ما تحتاجه لبناء سيرة ذاتية تبرز مهاراتك وتفتح لك أبواب الفرص الوظيفية.",
};

export default function FeaturesPage() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <Navbar />
      <main className="bg-white">
        <Features />
      </main>
      <Footer />
    </div>
  );
}

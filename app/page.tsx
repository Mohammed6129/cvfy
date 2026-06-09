import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CustomerJourney from "./components/CustomerJourney";
import Features from "./components/Features";
import AtsEducation from "./components/AtsEducation";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "CVfy — منصة السيرة الذاتية الاحترافية بالعربية",
  description:
    "أنشئ سيرتك الذاتية الاحترافية في دقائق. قالب ATS رسمي، تحسين بالذكاء الاصطناعي، وفحص توافق — لسوق العمل السعودي.",
  openGraph: {
    title: "CVfy — هويتك المهنية",
    description: "منصة السيرة الذاتية الأولى بالعربية لسوق العمل السعودي",
    locale: "ar_SA",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <Navbar />
      <main className="bg-white">
        <Hero />
        <div id="journey">
          <CustomerJourney />
        </div>
        <Features />
        <AtsEducation />
      </main>
      <Footer />
    </div>
  );
}

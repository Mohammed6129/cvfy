import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HeroLiveBar from "./components/hero-live-bar";
import CustomerJourney from "./components/CustomerJourney";
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
    <div className="flex flex-1 flex-col bg-white pb-16 md:pb-0">
      <Navbar />
      <main className="bg-white">
        <Hero />
        <HeroLiveBar />
        <div id="journey">
          <CustomerJourney />
        </div>
      </main>
      <Footer />
    </div>
  );
}

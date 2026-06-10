import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CompanyBar from "./components/company-bar";
import CustomerJourney from "./components/CustomerJourney";
import HomeFeatures from "./components/home-features";
import HomeReviews from "./components/home-reviews";
import HomeCta from "./components/home-cta";
import HeroLiveBar from "./components/hero-live-bar";

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
        <CompanyBar />
        <CustomerJourney />
        <HomeFeatures />
        <HomeReviews />
        <HomeCta />
        <HeroLiveBar />
      </main>
    </div>
  );
}

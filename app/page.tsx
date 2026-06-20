import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HomeTrustBadges from "./components/home-trust-badges";
import CustomerJourney from "./components/CustomerJourney";
import HomeFeaturesTrust from "./components/home-features-trust";
import HomeCta from "./components/home-cta";
import HeroLiveBar from "./components/hero-live-bar";
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
    <div className="home-glass-page flex flex-1 flex-col pb-16 md:pb-0">
      <Navbar variant="glass" />
      <main>
        <Hero />
        <HomeTrustBadges />
        <CustomerJourney />
        <HomeFeaturesTrust />
        <HomeCta />
        <Footer variant="glass" />
        <HeroLiveBar />
      </main>
    </div>
  );
}

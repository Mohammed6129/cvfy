import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HomeHeroBanner from "./components/home-hero-banner";
import HomeTrustBadges from "./components/home-trust-badges";
import HomeFeaturesTrust from "./components/home-features-trust";
import HomeProblemSolution from "./components/home-problem-solution";
import HowItWorks from "./components/how-it-works";
import HomeReviews from "./components/home-reviews";
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
        <HomeHeroBanner />
        <Hero />
        <HomeTrustBadges />
        <HowItWorks />
        <HomeFeaturesTrust />
        <HomeProblemSolution />
        <HomeReviews />
        <Footer variant="glass" />
        <HeroLiveBar />
      </main>
    </div>
  );
}

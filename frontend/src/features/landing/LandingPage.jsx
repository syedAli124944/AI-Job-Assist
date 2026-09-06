import Navbar from "../../components/shared/Navbar";
import Footer from "../../components/shared/Footer";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import StatsSection from "./StatsSection";
import FooterCTA from "./FooterCTA";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-sand">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <FooterCTA />
      <Footer />
    </div>
  );
}

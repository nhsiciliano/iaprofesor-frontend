import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { Footer } from "@/components/landing/Footer";
import { WobbleFeatures } from "@/components/landing/WobbleFeatures";

export default function HomePage() {
  return (
    <div className="bg-white text-gray-800">
      <Header />
      <HeroSection />
      <WobbleFeatures />
      <HowItWorksSection />
      <CtaSection />
      <Footer />
    </div>
  );
}

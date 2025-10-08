import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";
import { WobbleFeatures } from "@/components/landing/WobbleFeatures";
import { DashboardScrollDemo } from "@/components/landing/DashboardScrollDemo";
import { TutorScrollDemo } from "@/components/landing/TutorScrollDemo";

export default function HomePage() {
  return (
    <div className="bg-white text-gray-800">
      <Header />
      <HeroSection />
      <section id="features">
        <WobbleFeatures />
      </section>
      <DashboardScrollDemo />
      <TutorScrollDemo />
      <section id="reason">
        <HowItWorksSection />
      </section>
      <CtaSection />
      <section id="contact">
        <ContactSection />
      </section>
      <Footer />
    </div>
  );
}

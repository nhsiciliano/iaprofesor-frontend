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
      <section className="relative py-10">
        <div className="absolute inset-0 bg-gradient-to-r from-white via-indigo-50 to-white" />
        <div className="relative container mx-auto px-4">
          <div className="flex flex-col items-center gap-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
              Confianza en el aprendizaje
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-slate-600">
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                Docentes particulares
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                Academias y colegios
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                Equipos pedagógicos
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                Familias y estudiantes
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Experiencias guiadas que respetan el rol del docente y elevan la autonomia.
            </p>
          </div>
        </div>
      </section>
      <section id="features">
        <WobbleFeatures />
      </section>
      <section id="demo">
        <DashboardScrollDemo />
        <TutorScrollDemo />
      </section>
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

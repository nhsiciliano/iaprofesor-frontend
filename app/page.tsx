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
    <div className="bg-white text-slate-900 dark:bg-neutral-950 dark:text-slate-100">
      <Header />
      <HeroSection />
      <section className="relative py-10">
        <div className="absolute inset-0 bg-gradient-to-r from-white via-indigo-50 to-white dark:from-neutral-950 dark:via-slate-900 dark:to-neutral-950" />
        <div className="relative container mx-auto px-4">
          <div className="flex flex-col items-center gap-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
              Confianza en el aprendizaje
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-200">
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                Docentes particulares
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                Academias y colegios
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                Equipos pedagógicos
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                Familias y estudiantes
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
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

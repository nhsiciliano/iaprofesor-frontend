'use client';
import { WobbleCard } from "@/components/ui/wobble-card";

export function WobbleFeatures() {
  return (
    <section className="bg-slate-50 py-24 dark:bg-black">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
          Beneficios que se sienten desde la primera sesion
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <WobbleCard containerClassName="bg-white/90 min-h-[320px] border border-indigo-200/80 dark:border-indigo-500/30 dark:bg-slate-900/90">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Guia socratica
              </h3>
              <p className="text-slate-600 dark:text-neutral-200">
                Preguntas precisas y pistas progresivas para desarrollar pensamiento critico.
              </p>
            </div>
          </WobbleCard>
          <WobbleCard containerClassName="bg-white/90 min-h-[320px] border border-amber-200/80 dark:border-amber-500/30 dark:bg-slate-900/90">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Ritmo personalizado
              </h3>
              <p className="text-slate-600 dark:text-neutral-200">
                Ajusta dificultad y tono segun avances, dudas y objetivos del alumno.
              </p>
            </div>
          </WobbleCard>
          <WobbleCard containerClassName="bg-white/90 min-h-[320px] border border-emerald-200/80 dark:border-emerald-500/30 dark:bg-slate-900/90">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Feedback accionable
              </h3>
              <p className="text-slate-600 dark:text-neutral-200">
                Indicadores claros de progreso por materia para orientar el estudio.
              </p>
            </div>
          </WobbleCard>
          <WobbleCard containerClassName="bg-white/90 min-h-[320px] border border-sky-200/80 dark:border-sky-500/30 dark:bg-slate-900/90">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Evidencia de avance
              </h3>
              <p className="text-slate-600 dark:text-neutral-200">
                Historial y trazabilidad para docentes y estudiantes, sin perder contexto.
              </p>
            </div>
          </WobbleCard>
        </div>
      </div>
    </section>
  );
}

'use client';
import { WobbleCard } from "@/components/ui/wobble-card";

export function WobbleFeatures() {
  return (
    <section className="bg-black py-24">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Características Principales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <WobbleCard containerClassName="bg-pink-800 min-h-[350px]">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Tutoría Interactiva
              </h3>
              <p className="text-neutral-200">
                Recibe pistas y preguntas en lugar de respuestas directas.
              </p>
            </div>
          </WobbleCard>
          <WobbleCard containerClassName="bg-blue-800 min-h-[350px]">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Aprendizaje a tu Ritmo
              </h3>
              <p className="text-neutral-200">
                Avanza a la velocidad que necesites, sin presiones.
              </p>
            </div>
          </WobbleCard>
          <WobbleCard containerClassName="bg-green-800 min-h-[350px]">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Soporte 24/7
              </h3>
              <p className="text-neutral-200">
                Tu tutor IA está disponible en cualquier momento del día.
              </p>
            </div>
          </WobbleCard>
          <WobbleCard containerClassName="bg-red-800 min-h-[350px]">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Desarrollo del Pensamiento Crítico
              </h3>
              <p className="text-neutral-200">
                Fomentamos tu capacidad para analizar y resolver problemas de forma independiente.
              </p>
            </div>
          </WobbleCard>
          <WobbleCard containerClassName="bg-yellow-800 min-h-[350px]">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Amplia Gama de Temas
              </h3>
              <p className="text-neutral-200">
                Desde matemáticas hasta programación, te ayudamos en diversas áreas.
              </p>
            </div>
          </WobbleCard>
          <WobbleCard containerClassName="bg-orange-800 min-h-[350px]">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Construye Confianza
              </h3>
              <p className="text-neutral-200">
                Gana seguridad en tus habilidades al llegar a las soluciones por ti mismo.
              </p>
            </div>
          </WobbleCard>
        </div>
      </div>
    </section>
  );
}
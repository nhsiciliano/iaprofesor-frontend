import React from "react";
import { Meteors } from "../ui/meteors";
import Link from "next/link";

export function HowItWorksSection() {
  return (
    <section className="bg-black py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          ¿Cómo funciona?
        </h2>
        <div className="relative w-full max-w-4xl mx-auto">
          <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-red-500 bg-gradient-to-r from-blue-500 to-teal-500 blur-3xl" />
          <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 px-8 py-12 shadow-xl text-center">
            <div className="mb-4 flex h-5 w-5 items-center justify-center rounded-full border border-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-2 w-2 text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25"
                />
              </svg>
            </div>

            <div className="relative z-50 grid w-full gap-6 text-left md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm font-semibold text-white">
                  1
                </div>
                <h3 className="text-lg font-semibold text-white">Diagnostico inicial</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Identifica el punto de partida y el objetivo concreto de la sesion.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm font-semibold text-white">
                  2
                </div>
                <h3 className="text-lg font-semibold text-white">Guia socratica</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Preguntas, pistas y ejemplos para estimular el razonamiento propio.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm font-semibold text-white">
                  3
                </div>
                <h3 className="text-lg font-semibold text-white">Progreso visible</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Resumen por materia, historial de sesiones y objetivos cumplidos.
                </p>
              </div>
            </div>

            <Link
              href="/login"
              className="relative z-50 mt-8 inline-flex items-center justify-center rounded-full border border-gray-500 px-6 py-2 text-sm font-semibold text-gray-200 transition-colors hover:bg-gray-800"
            >
              Prueba guiada
            </Link>
            <p className="relative z-50 mt-3 text-xs text-slate-500">
              Sin reemplazar al docente. Alineado con objetivos educativos.
            </p>

            {/* Meaty part - Meteor effect */}
            <Meteors number={30} />
          </div>
        </div>
      </div>
    </section>
  );
}

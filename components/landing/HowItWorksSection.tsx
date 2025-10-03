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

            <p className="relative z-50 mb-8 text-lg font-normal text-slate-400 max-w-2xl">
              En lugar de darte la solución, IA Profesor te hace preguntas y te da pistas para que tú mismo encuentres el camino. Es un tutor que te acompaña, no un solucionador de problemas que te reemplaza. 
              Creemos en el poder de tu propia mente para aprender y crecer.
            </p>

            <Link href="/login">
              <button className="rounded-lg border border-gray-500 px-6 py-2 text-gray-300 hover:bg-gray-800 transition-colors">
                Prueba ahora
              </button>
            </Link>

            {/* Meaty part - Meteor effect */}
            <Meteors number={30} />
          </div>
        </div>
      </div>
    </section>
  );
}

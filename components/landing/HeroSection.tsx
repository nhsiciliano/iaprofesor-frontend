"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import Link from "next/link";

export function HeroSection() {
  return (
    <HeroHighlight>
      <main className="container px-4 py-16 mx-auto text-center">
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-4xl font-bold md:text-5xl text-neutral-700 dark:text-white"
        >
          Aprende a razonar con{" "}
          <Highlight>IA que guia
          cada paso.</Highlight>{" "}
        </motion.h1>
        <p className="mt-4 text-lg text-neutral-700 dark:text-white">
          IA Profesor acompaña con preguntas, pistas y seguimiento por materia para
          que el alumno llegue a la solucion por si mismo.
        </p>
        <ul className="mt-6 flex flex-col items-center gap-3 text-sm text-neutral-600 dark:text-neutral-200 sm:flex-row sm:justify-center">
          <li className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-indigo-500" />
            Practica guiada en tiempo real
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-amber-500" />
            Seguimiento por materia y objetivos
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            Enfoque socratico, no respuestas
          </li>
        </ul>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 font-bold text-white transition-colors hover:bg-indigo-700"
          >
            Probar gratis
          </Link>
          <Link
            href="#demo"
            className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-8 py-3 font-semibold text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-600 dark:border-neutral-600 dark:text-neutral-100 dark:hover:border-neutral-400"
          >
            Ver tutor en accion
          </Link>
        </div>
        <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-300">
          Disenado para escuelas, academias y clases particulares.
        </p>
      </main>
    </HeroHighlight>
  );
}

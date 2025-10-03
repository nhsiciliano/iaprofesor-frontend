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
          Potencia tu aprendizaje,{" "}
          <Highlight>no lo reemplaces</Highlight>
        </motion.h1>
        <p className="mt-4 text-lg text-neutral-700 dark:text-white">
          IA Profesor es tu guía personal para resolver problemas. No te damos las respuestas, te ayudamos a pensar y a construir tu propio camino hacia la solución.
        </p>
        <div className="mt-8">
          <Link 
            href="/register"
            className="inline-block px-8 py-3 font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors duration-200"
          >
            Comienza ahora
          </Link>
        </div>
      </main>
    </HeroHighlight>
  );
}

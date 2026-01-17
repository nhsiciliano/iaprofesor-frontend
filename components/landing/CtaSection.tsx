"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "../ui/lamp";

export function CtaSection() {
  return (
    <LampContainer>
      <div className="flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 bg-gradient-to-br from-slate-600 to-slate-900 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl dark:from-slate-300 dark:to-slate-500"
        >
          ¿Listo para aprender con un tutor que no resuelve por ti?
        </motion.h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600 md:text-lg dark:text-slate-300">
          Empieza en minutos, sin tarjeta. Activa una sesion guiada y mide el progreso por materia.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="/register"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Crear cuenta gratis
          </a>
          <a
            href="#demo"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-8 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-white/30 dark:text-white/90 dark:hover:border-white/60 dark:hover:text-white"
          >
            Ver demo
          </a>
        </div>
      </div>
    </LampContainer>
  );
}

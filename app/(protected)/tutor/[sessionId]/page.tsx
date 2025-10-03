"use client";

import React from "react";
import Link from "next/link";

export default function TutorSessionPage() {
  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Sesión no disponible</h1>
      <p className="text-slate-600 dark:text-slate-400 max-w-md text-center">
        Usa la vista principal del tutor para seleccionar una materia y continuar aprendiendo.
      </p>
      <Link
        href="/tutor"
        className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
      >
        Volver al Tutor IA
      </Link>
    </div>
  );
}

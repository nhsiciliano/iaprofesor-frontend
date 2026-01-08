"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ContainerScroll } from "../ui/container-scroll-animation";
import tutorMock from "@/public/tutorai.png";

export function TutorScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden bg-neutral-950">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-start gap-4">
            <span className="rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-purple-300">
              Tutor conversacional
            </span>
            <h2 className="text-4xl font-semibold text-white md:text-6xl">
              Conversaciones guiadas
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-orange-300 bg-clip-text text-transparent">
                que impulsan el aprendizaje
              </span>
            </h2>
            <p className="max-w-xl text-sm text-slate-300 md:text-base">
              Diseñado para acompañar paso a paso: sugerencias socráticas, análisis del contexto
              y seguimiento de cada sesión. El tutor IA adapta el tono y la dificultad según las
              respuestas del estudiante.
            </p>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-sm text-slate-200">
              <p className="font-semibold text-white">Ejemplo real</p>
              <p className="mt-2 text-slate-300">Tutor: ¿Que dato necesitas primero para resolverlo?</p>
              <p className="text-slate-400">Alumno: La velocidad inicial del movimiento.</p>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Probar una sesion
            </Link>
          </div>
        }
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/25 via-pink-500/15 to-amber-400/20 blur-3xl" />
          <Image
            src={tutorMock}
            alt="Interfaz del tutor IA con conversación guiada"
            height={900}
            width={1600}
            className="relative mx-auto h-full w-full rounded-3xl border border-white/10 shadow-[0_20px_60px_rgba(180,80,255,0.25)] object-cover"
            draggable={false}
            priority
          />
        </div>
      </ContainerScroll>
    </div>
  );
}

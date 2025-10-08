"use client";
import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import Image from "next/image";
import dashboardMock from "@/public/dashboardai.png";

export function DashboardScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden bg-neutral-950">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-start gap-4">
            <span className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-300">
              Dashboard IA
            </span>
            <h2 className="text-4xl font-semibold text-white md:text-6xl">
              Visualiza el progreso
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-sky-300 bg-clip-text text-transparent">
                con datos en tiempo real
              </span>
            </h2>
            <p className="max-w-xl text-sm text-slate-300 md:text-base">
              Analiza sesiones, conceptos aprendidos y objetivos cumplidos en un panel diseñado
              para equipos pedagógicos. IA Profesor traduce la actividad del tutor en información
              accionable para acompañar cada aprendizaje.
            </p>
          </div>
        }
      >
        <div className="relative">
          <div className="absolute inset-0 my-auto rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-sky-500/20 blur-3xl" />
          <Image
            src={dashboardMock}
            alt="Panel de análisis y progreso de IA Profesor"
            height={900}
            width={1600}
            className="relative mx-auto h-full w-full rounded-3xl border border-white/10 shadow-[0_20px_60px_rgba(45,105,255,0.25)] object-cover"
            draggable={false}
            priority
          />
        </div>
      </ContainerScroll>
    </div>
  );
}

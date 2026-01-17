"use client";
import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import Image from "next/image";
import Link from "next/link";
import dashboardMock from "@/public/dashboardai.png";

export function DashboardScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden bg-slate-100 text-slate-900 dark:bg-neutral-950 dark:text-white">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-start gap-4">
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-300">
              Dashboard IA
            </span>
            <h2 className="text-4xl font-semibold text-slate-900 md:text-6xl dark:text-white">
              Visualiza el progreso
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-sky-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-300 dark:to-sky-300">
                con datos en tiempo real
              </span>
            </h2>
            <p className="max-w-xl text-sm text-slate-600 md:text-base dark:text-slate-300">
              Analiza sesiones, conceptos aprendidos y objetivos cumplidos en un panel diseñado
              para equipos pedagógicos. IA Profesor traduce la actividad del tutor en información
              accionable para acompañar cada aprendizaje.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-200">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-white/10 dark:bg-white/5">
                +38% practica guiada
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-white/10 dark:bg-white/5">
                Alertas de brechas por materia
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-white/10 dark:bg-white/5">
                Seguimiento de objetivos
              </span>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-white/20 dark:text-white/90 dark:hover:border-white/50 dark:hover:text-white"
            >
              Explorar analytics
            </Link>
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
            className="relative mx-auto h-full w-full rounded-3xl border border-slate-200 shadow-[0_20px_60px_rgba(45,105,255,0.25)] object-cover dark:border-white/10"
            draggable={false}
            priority
          />
          <div className="absolute left-6 top-6 hidden rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-xs text-slate-700 backdrop-blur md:block dark:border-white/15 dark:bg-black/60 dark:text-white/90">
            Progreso por materia
          </div>
          <div className="absolute right-6 bottom-6 hidden rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-xs text-slate-700 backdrop-blur md:block dark:border-white/15 dark:bg-black/60 dark:text-white/90">
            Deteccion de brechas
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
}

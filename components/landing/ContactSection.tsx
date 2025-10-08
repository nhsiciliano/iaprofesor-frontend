"use client";

import { useState, type ReactNode } from "react";
import { IconSend, IconMail, IconPhone, IconMapPin } from "@tabler/icons-react";

export function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder submit handler. Replace with real logic (email service, backend, etc.).
    if (formState.name && formState.email && formState.message) {
      setStatus("success");
      setFormState({ name: "", email: "", message: "" });
    } else {
      setStatus("error");
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-indigo-950 py-24">
      <div className="absolute -top-48 -right-40 h-80 w-80 rounded-full bg-indigo-600/30 blur-3xl" />
      <div className="absolute -bottom-48 -left-40 h-72 w-72 rounded-full bg-purple-600/25 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-1 text-sm font-semibold text-indigo-300">
              ¿Listo para hablar?
            </span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Conversemos sobre cómo IA Profesor puede acompañarte paso a paso en tu ruta de aprendizaje.
            </h2>
            <p className="text-base text-slate-300 md:text-lg">
              Escríbenos y te responderemos en menos de 24 horas para pensar
              juntos la mejor estrategia de aprendizaje asistido por IA.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <ContactCard
                icon={<IconMail className="h-5 w-5" />}
                title="Correo"
                description="hola@iaprofesor.com"
              />
              <ContactCard
                icon={<IconPhone className="h-5 w-5" />}
                title="WhatsApp"
                description="+54 9 11 5555 1234"
              />
              <ContactCard
                icon={<IconMapPin className="h-5 w-5" />}
                title="Ubicación"
                description="Buenos Aires, Argentina"
              />
              <ContactCard
                icon={<IconSend className="h-5 w-5" />}
                title="Soporte"
                description="Lun a Vie · 09 a 18 h"
              />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-blue-500/30 blur-xl" />
            <div className="relative rounded-3xl border border-white/10 bg-neutral-900/80 p-8 shadow-2xl backdrop-blur">
              <h3 className="text-xl font-semibold text-white">Enviar mensaje</h3>
              <p className="mt-2 text-sm text-slate-300">
                Completa el formulario y te responderemos a la brevedad.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-200">
                    Nombre completo
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    className="w-full rounded-xl border border-white/10 bg-neutral-800/80 px-4 py-3 text-sm text-slate-100 shadow-inner outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/40"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-200">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="tu@mail.com"
                    className="w-full rounded-xl border border-white/10 bg-neutral-800/80 px-4 py-3 text-sm text-slate-100 shadow-inner outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/40"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-slate-200">
                    ¿Cómo podemos ayudarte?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Cuéntanos sobre tus objetivos educativos..."
                    className="w-full rounded-xl border border-white/10 bg-neutral-800/80 px-4 py-3 text-sm text-slate-100 shadow-inner outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/40"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-500 hover:to-purple-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
                >
                  <IconSend className="h-4 w-4" />
                  Enviar mensaje
                </button>

                {status === "success" && (
                  <p className="rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-2 text-sm text-green-300">
                    ¡Gracias por escribirnos! Te responderemos muy pronto.
                  </p>
                )}

                {status === "error" && (
                  <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                    Revisa los datos ingresados e inténtalo nuevamente.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-neutral-900/70 p-4 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600/30 text-indigo-200">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <p className="text-sm text-slate-300">{description}</p>
      </div>
    </div>
  );
}

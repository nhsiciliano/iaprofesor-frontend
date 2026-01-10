import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politica de Privacidad | IA Profesor",
  description:
    "Politica de privacidad de IA Profesor. Informacion sobre el uso y proteccion de datos personales.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 text-slate-800">
      <div className="mx-auto max-w-3xl space-y-10">
        <header className="space-y-3 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">Politica de Privacidad</h1>
          <p className="text-sm text-slate-500">Ultima actualizacion: 01/01/2026</p>
        </header>

        <section className="space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            En IA Profesor valoramos la privacidad de nuestros usuarios. Esta politica describe
            que datos recopilamos, como los usamos y las opciones disponibles para proteger tu
            informacion.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Datos que recopilamos</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>Datos de cuenta como nombre, email y configuracion basica de perfil.</li>
            <li>Historial de sesiones, progreso por materia y objetivos educativos.</li>
            <li>Informacion tecnica basica para mejorar la seguridad y el rendimiento.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Como usamos los datos</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>Personalizar la experiencia de aprendizaje y el feedback del tutor IA.</li>
            <li>Generar analiticas agregadas para mejorar la plataforma.</li>
            <li>Enviar comunicaciones relacionadas con el servicio.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Compartir informacion</h2>
          <p className="text-sm text-slate-700">
            No vendemos datos personales. Solo compartimos informacion con proveedores necesarios
            para operar el servicio (por ejemplo, infraestructura y analitica), bajo acuerdos de
            confidencialidad y seguridad.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Tus opciones</h2>
          <p className="text-sm text-slate-700">
            Puedes solicitar acceso, correccion o eliminacion de tus datos escribiendo a nuestro
            equipo de soporte. Tambien puedes cerrar tu cuenta cuando lo desees.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Contacto</h2>
          <p className="text-sm text-slate-700">
            Si tienes dudas, escribenos a{" "}
            <a className="font-semibold text-indigo-600" href="mailto:hola@iaprofesor.com">
              hola@iaprofesor.com
            </a>
            .
          </p>
        </section>

        <div className="text-center">
          <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}

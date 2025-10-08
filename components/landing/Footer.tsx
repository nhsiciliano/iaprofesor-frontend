import Link from 'next/link';
import Image from 'next/image';

const footerNav = [
  { name: 'Características', href: '#features' },
  { name: 'Razón', href: '#reason' },
  { name: 'Contacto', href: '#contact' },
];

export function Footer() {
  return (
    <footer className="bg-black py-12 text-gray-400">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center space-x-2">
            <Image src="/iaproflogo.png" alt="IA Profesor Logo" width={40} height={40} />
            <span className="font-orbitron text-xl font-bold text-white">IA Profesor</span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
            {footerNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="transition hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="text-sm text-slate-500 md:text-right">
            {new Date().getFullYear()} © IA Profesor
          </div>
        </div>
        <div className="mt-10 border-t border-gray-800 pt-8 text-center text-xs text-slate-500">
          <p>Impulsado por IA para potenciar la enseñanza personalizada.</p>
        </div>
      </div>
    </footer>
  );
}

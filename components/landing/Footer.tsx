import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-8 md:mb-0">
            <Image src="/iaproflogo.png" alt="IA Profesor Logo" width={40} height={40} />
            <span className="text-xl font-bold text-white font-orbitron">IA Profesor</span>
          </div>
          <div className="flex space-x-8">
            <Link href="/" className="hover:text-white">Inicio</Link>
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
            <Link href="/profile" className="hover:text-white">Perfil</Link>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} IA Profesor. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

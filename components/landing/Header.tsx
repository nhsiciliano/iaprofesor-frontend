"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <Link href="/">
            <div className="flex items-center">
              <Image src="/iaproflogo.png" alt="IA Profesor Logo" width={50} height={50} />
              <span className="ml-2 text-lg font-bold text-neutral-800 dark:text-white font-orbitron">IA Profesor</span>
            </div>
          </Link>
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <Link href="/login">
              <NavbarButton as="div" variant="secondary" className="text-neutral-800 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800">Iniciar Sesión</NavbarButton>
            </Link>
            <Link href="/register">
              <NavbarButton as="div" variant="primary" className="bg-indigo-600 hover:bg-indigo-700 text-white">Comenzar ahora</NavbarButton>
            </Link>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <Link href="/">
              <div className="flex items-center">
                <Image src="/iaproflogo.png" alt="IA Profesor Logo" width={32} height={32} />
                <span className="ml-2 font-bold text-neutral-800 dark:text-white font-orbitron">IA Profesor</span>
              </div>
            </Link>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4 pt-4">
              <Link href="/login" className="w-full">
                <NavbarButton
                  as="div"
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="secondary"
                  className="w-full text-neutral-800 dark:text-white border border-neutral-300 dark:border-neutral-700"
                >
                  Iniciar Sesión
                </NavbarButton>
              </Link>
              <Link href="/register" className="w-full">
                <NavbarButton
                  as="div"
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Comenzar ahora
                </NavbarButton>
              </Link>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}


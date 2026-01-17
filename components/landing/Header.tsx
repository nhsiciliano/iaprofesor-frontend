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
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { IconMoon, IconSun } from "@tabler/icons-react";

export function Header() {
  const navItems = [
    {
      name: "Características",
      link: "#features",
    },
    {
      name: "Demo",
      link: "#demo",
    },
    {
      name: "Razón",
      link: "#reason",
    },
    {
      name: "Contacto",
      link: "#contact",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <div className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <Link href="/">
            <div className="flex items-center">
              <Image src="/iaproflogo.png" alt="IA Profesor Logo" width={50} height={50} />
              <span className="ml-2 text-lg font-bold text-neutral-800 dark:text-white font-orbitron">IA Profesor</span>
            </div>
          </Link>
          <NavItems
            items={navItems}
            className="lg:static lg:inset-auto lg:mx-auto lg:flex-1 lg:justify-center"
          />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-500"
              aria-label="Cambiar tema"
            >
              {mounted ? (
                isDark ? <IconSun className="h-5 w-5" /> : <IconMoon className="h-5 w-5" />
              ) : (
                <span className="h-5 w-5" />
              )}
            </button>
            <Link href="/login">
              <NavbarButton as="div" variant="secondary" className="text-neutral-800 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800">Iniciar Sesión</NavbarButton>
            </Link>
            <Link href="/register">
              <NavbarButton as="div" variant="primary" className="bg-indigo-600 hover:bg-indigo-700 text-white">Probar app</NavbarButton>
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
            <button
              type="button"
              onClick={() => {
                setTheme(isDark ? "light" : "dark");
                setIsMobileMenuOpen(false);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-500"
            >
              {mounted ? (
                isDark ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />
              ) : (
                <span className="h-4 w-4" />
              )}
              {isDark ? "Tema claro" : "Tema oscuro"}
            </button>
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
                  Probar gratis
                </NavbarButton>
              </Link>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}

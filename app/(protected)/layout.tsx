"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import Image from "next/image";
import {
  IconRobot,
  IconSettings,
  IconUserBolt,
  IconChartBar,
  IconLogout
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconChartBar className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Tutor IA",
      href: "/tutor",
      icon: (
        <IconRobot className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Mi Perfil",
      href: "/profile",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Configuración",
      href: "/settings",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-full flex-1 flex-col overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 md:flex-row dark:from-neutral-900 dark:to-neutral-800",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {isClient ? (open ? <Logo /> : <LogoIcon />) : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-start gap-2 group/sidebar py-2 cursor-pointer"
                  onClick={() => router.push(link.href)}
                >
                  {link.icon}
                  {isClient && open && (
                    <span className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre">
                      {link.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div 
              className="flex items-center justify-start gap-2 group/sidebar py-2 cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              {isClient && open && (
                <span className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre">
                  {user?.email || "Usuario"}
                </span>
              )}
            </div>
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full p-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <IconLogout className="h-4 w-4" />
              {isClient && <span className={cn("transition-opacity", !open && "opacity-0")}>Cerrar Sesión</span>}
              {!isClient && <span className="transition-opacity opacity-0">Cerrar Sesión</span>}
            </button>
          </div>
        </SidebarBody>
      </Sidebar>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex h-full w-full flex-1 flex-col rounded-tl-2xl bg-white dark:bg-neutral-900 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

// Componentes del Logo
export const Logo = () => {
  return (
    <Link
      href="/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image
        src="/iaproflogo.png"
        alt="IA Profesor"
        width={28}
        height={28}
        className="h-7 w-7 shrink-0 rounded-lg"
        priority
      />
      <span className="font-bold whitespace-pre text-slate-800 dark:text-white font-orbitron">
        IA Profesor
      </span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image
        src="/iaproflogo.png"
        alt="IA Profesor"
        width={28}
        height={28}
        className="h-7 w-7 shrink-0 rounded-lg"
        priority
      />
    </Link>
  );
};

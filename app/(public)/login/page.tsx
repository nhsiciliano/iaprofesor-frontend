"use client";
import React, { Suspense, useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGoogle, IconEye, IconEyeOff } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, loginWithProvider, session } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Obtener URL de redirección si existe
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (session) {
      router.push(redirectTo);
    }
  }, [session, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Por favor, completa todos los campos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      // Redirigir a la URL de destino o dashboard por defecto
      router.push(redirectTo);
    } catch (error: unknown) {
      console.error("Error de login:", error);
      const message = error instanceof Error ? error.message : "Error al iniciar sesión. Verifica tus credenciales.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : undefined;
      const callbackUrl = origin
        ? `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
        : undefined;

      await loginWithProvider('google', {
        redirectTo: callbackUrl,
      });
      // Supabase manejará la redirección. En caso de que no lo haga, el listener de sesión lo hará.
    } catch (error: unknown) {
      console.error("Error al iniciar sesión con Google:", error);
      const message = error instanceof Error ? error.message : "No se pudo iniciar sesión con Google.";
      setError(message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-neutral-900 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-neutral-800">
        <div className="text-center">
          <Link href="/">
            <Image
              src="/iaproflogo.png"
              alt="IA Profesor Logo"
              width={80}
              height={80}
              className="mx-auto"
              priority
            />
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-neutral-800 dark:text-neutral-200 font-orbitron">
            IA Profesor
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            Inicia sesión para continuar
          </p>
        </div>

        {/* Mostrar errores */}
        {error && (
          <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <LabelInputContainer>
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              placeholder="micorreo@email.com"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(""); // Limpiar error al escribir
              }}
              disabled={isLoading}
              required
            />
          </LabelInputContainer>
          
          <LabelInputContainer>
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(""); // Limpiar error al escribir
                }}
                disabled={isLoading}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                disabled={isLoading}
              >
                {showPassword ? (
                  <IconEyeOff className="h-5 w-5" />
                ) : (
                  <IconEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </LabelInputContainer>

          <button
            className="w-full h-10 rounded-md bg-indigo-600 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            type="submit"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-neutral-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
              O continúa con
            </span>
          </div>
        </div>

        <div>
          <button
            className="w-full flex items-center justify-center h-10 space-x-2 rounded-md border border-gray-300 bg-white font-medium text-neutral-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600 dark:hover:bg-neutral-600 dark:focus:ring-offset-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
          >
            {isGoogleLoading ? (
              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <IconBrandGoogle className="h-5 w-5" />
            )}
            <span>{isGoogleLoading ? 'Conectando…' : 'Google'}</span>
          </button>
        </div>
        
        <div className="text-sm text-center text-neutral-600 dark:text-neutral-400">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Cargando…</div>}>
      <LoginContent />
    </Suspense>
  );
}

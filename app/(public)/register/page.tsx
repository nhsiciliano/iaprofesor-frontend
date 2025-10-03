"use client";
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconEye, IconEyeOff, IconCheck, IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { signUp, session } = useAuth();
  const router = useRouter();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  // Validaciones de contraseña
  const isPasswordValid = password.length >= 6;
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validaciones
    if (!fullName.trim()) {
      setError("El nombre completo es requerido");
      return;
    }
    
    if (!email) {
      setError("El correo electrónico es requerido");
      return;
    }

    if (!isPasswordValid) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!doPasswordsMatch) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await signUp(email, password, fullName.trim());
      setSuccess("¡Registro exitoso! Redirigiendo al dashboard...");
      
      // Pequeña pausa para mostrar el mensaje de éxito
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
      
    } catch (error: unknown) {
      console.error("Error de registro:", error);
      const message = error instanceof Error ? error.message : "Error al crear la cuenta. Por favor, inténtalo de nuevo.";
      setError(message);
    } finally {
      setIsLoading(false);
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
            />
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-neutral-800 dark:text-neutral-200 font-orbitron">
            Crea tu cuenta
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            Únete a IA Profesor
          </p>
        </div>

        {/* Mostrar mensajes */}
        {error && (
          <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
            {success}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <LabelInputContainer>
            <Label htmlFor="fullName">Nombre Completo</Label>
            <Input
              id="fullName"
              placeholder="Tu nombre completo"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (error) setError("");
              }}
              disabled={isLoading}
              required
            />
          </LabelInputContainer>
          
          <LabelInputContainer>
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              placeholder="micorreo@email.com"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              disabled={isLoading}
              required
            />
          </LabelInputContainer>
          
          <LabelInputContainer>
            <Label htmlFor="password">
              Contraseña
              <span className="text-xs text-gray-500 ml-2">
                (mínimo 6 caracteres)
              </span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
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
            {/* Indicador de validez de contraseña */}
            {password && (
              <div className="flex items-center mt-1 text-xs">
                {isPasswordValid ? (
                  <><IconCheck className="h-3 w-3 text-green-500 mr-1" /> Válida</>
                ) : (
                  <><IconX className="h-3 w-3 text-red-500 mr-1" /> Muy corta</>
                )}
              </div>
            )}
          </LabelInputContainer>
          
          <LabelInputContainer>
            <Label htmlFor="confirmPassword">Repetir Contraseña</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                placeholder="••••••••"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError("");
                }}
                disabled={isLoading}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <IconEyeOff className="h-5 w-5" />
                ) : (
                  <IconEye className="h-5 w-5" />
                )}
              </button>
            </div>
            {/* Indicador de coincidencia de contraseñas */}
            {confirmPassword && (
              <div className="flex items-center mt-1 text-xs">
                {doPasswordsMatch ? (
                  <><IconCheck className="h-3 w-3 text-green-500 mr-1" /> Coinciden</>
                ) : (
                  <><IconX className="h-3 w-3 text-red-500 mr-1" /> No coinciden</>
                )}
              </div>
            )}
          </LabelInputContainer>

          <button
            className="w-full h-10 rounded-md bg-indigo-600 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            type="submit"
            disabled={isLoading || !fullName || !email || !isPasswordValid || !doPasswordsMatch}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Crear cuenta"
            )}
          </button>
        </form>

        <div className="text-sm text-center text-neutral-600 dark:text-neutral-400">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
            Inicia sesión
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

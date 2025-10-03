import { createClient } from './supabase/client';
import type { Session, User, Provider } from '@supabase/supabase-js';

const supabase = createClient();

/**
 * ARQUITECTURA FRONTEND-FIRST:
 * - Frontend maneja auth directamente con Supabase
 * - Backend solo valida JWT tokens
 * - Menos complejidad, mejor UX
 */

export async function signUp(email: string, password: string, fullName: string) {
  // 1. Registrar usuario en Supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    throw new Error(error.message || 'Error al registrar usuario');
  }

  // 2. Si el registro es exitoso y hay sesión, crear perfil adicional en backend
  if (data.session && data.user) {
    try {
      // Intentar crear perfil en el backend (opcional)
      await createUserProfile(data.user.id, fullName, email);
    } catch (profileError) {
      // Si falla el perfil, no es crítico - Supabase ya tiene al usuario
      console.warn('No se pudo crear perfil adicional:', profileError);
    }
  }

  return { session: data.session, user: data.user };
}

export async function login(email: string, password: string) {
  // Autenticación directa con Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message || 'Error al iniciar sesión');
  }

  return { session: data.session, user: data.user };
}

export async function signInWithProvider(
  provider: Provider,
  options?: { redirectTo?: string }
) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options,
  });

  if (error) {
    throw new Error(error.message || `Error al iniciar sesión con ${provider}`);
  }

  return data;
}

export async function exchangeCodeForSession(url: string) {
  const { data, error } = await supabase.auth.exchangeCodeForSession(url);

  if (error) {
    throw new Error(error.message || 'Error al completar la autenticación');
  }

  return data;
}

// Función auxiliar para crear perfil en backend (opcional)
async function createUserProfile(userId: string, fullName: string, email: string) {
  const token = await getAccessToken();
  if (!token) return;
  
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002';
  
  const response = await fetch(`${BACKEND_URL}/users/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, fullName, email }),
  });

  if (!response.ok) {
    throw new Error('Error al crear perfil de usuario');
  }

  return response.json();
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getSession(): Promise<{ session: Session | null, user: User | null }> {
  const { data } = await supabase.auth.getSession();
  return { session: data.session, user: data.session?.user ?? null };
}

export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  const { data: authListener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(event, session);
    }
  );

  return () => {
    authListener.subscription.unsubscribe();
  };
}

// Función auxiliar para obtener el token de acceso actual
export async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

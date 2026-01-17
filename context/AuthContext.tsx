'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { getSession, onAuthStateChange, signOut as authSignOut, sendMagicLink as authSendMagicLink, signInWithProvider } from '@/lib/auth'
import type { Provider } from '@supabase/supabase-js'

type AuthContextType = {
  session: Session | null
  user: User | null
  signOut: () => Promise<void>
  sendMagicLink: (email: string, redirectTo?: string, fullName?: string) => Promise<void>
  loginWithProvider: (provider: Provider, options?: { redirectTo?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchSession = async () => {
      const { session, user } = await getSession()
      setSession(session)
      setUser(user)
    }

    fetchSession()

    const unsubscribe = onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (_event === 'SIGNED_OUT') {
        router.push('/login')
      }
    })

    return () => {
      unsubscribe()
    }
  }, [router])

  const signOut = async () => {
    await authSignOut()
  }

  const sendMagicLink = async (email: string, redirectTo?: string, fullName?: string) => {
    await authSendMagicLink(email, redirectTo, fullName)
  }

  const loginWithProvider = async (provider: Provider, options?: { redirectTo?: string }) => {
    await signInWithProvider(provider, options)
  }

  return (
    <AuthContext.Provider value={{ session, user, signOut, sendMagicLink, loginWithProvider }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

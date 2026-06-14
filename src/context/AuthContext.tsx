import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  isAdmin: boolean
  login: (email: string, pass: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

function isAdminUser(session: { user: { email?: string } } | null): boolean {
  if (!session || !ADMIN_EMAIL) return false
  return session.user.email === ADMIN_EMAIL
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(isAdminUser(session))
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(isAdminUser(session))
    })
    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, pass: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
    return !error
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

interface AuthContextType {
  user: any | null
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    let mounted = true

    // get initial session/user
    ;(async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (mounted) setUser(session?.user ?? null)
      } catch (e) {
        // ignore
      }
    })()

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (mounted) setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  async function signIn(email: string, password: string) {
    const res = await supabase.auth.signInWithPassword({ email, password })
    if (res.data?.user) setUser(res.data.user)
    return res
  }

  async function signUp(email: string, password: string) {
    const res = await supabase.auth.signUp({ email, password })
    if (res.data?.user) setUser(res.data.user)
    return res
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

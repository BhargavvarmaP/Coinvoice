"use client"

import { ReactNode, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, setAuthenticated, setUser, setLoading } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setUser(data)
          setAuthenticated(true)
        } else {
          setUser(null)
          setAuthenticated(false)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setUser(null)
        setAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [setAuthenticated, setUser, setLoading])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
} 
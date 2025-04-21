"use client"

import { ReactNode, lazy, Suspense } from "react"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { LazyLoadFallback } from "@/components/ui/lazy-load"

// Lazy load providers
const AuthProvider = lazy(() => import('@/contexts/auth-context').then(mod => ({ default: mod.AuthProvider })))

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Suspense fallback={<LazyLoadFallback />}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Suspense>
      </ThemeProvider>
    </SessionProvider>
  )
}
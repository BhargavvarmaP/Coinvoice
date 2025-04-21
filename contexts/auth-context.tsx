"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: any | null
  error: string | null
  login: (provider: string, credentials?: any) => Promise<void>
  loginWithWallet: (address: string, signature: string, message: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status: sessionStatus } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Determine authentication status from session
  const isAuthenticated = !!session?.user
  
  // User data from session
  const user = session?.user

  useEffect(() => {
    // Update loading state when session status changes
    if (sessionStatus !== "loading") {
      setIsLoading(false)
    }
  }, [sessionStatus])

  // Handle standard login (email/password or OAuth)
  const login = async (provider: string, credentials?: any) => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await signIn(provider, {
        ...credentials,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      toast.success("Successfully logged in")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Failed to login")
      toast.error(error.message || "Failed to login")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle wallet-based login
  const loginWithWallet = async (address: string, signature: string, message: string) => {
    if (!address || !signature || !message) {
      setError("Missing wallet information")
      toast.error("Missing wallet information")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Use the JWT-based wallet authentication
      const response = await fetch('/api/auth/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, signature, message }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Authentication failed')
      }

      // Refresh the session
      const result = await signIn('credentials', {
        redirect: false,
        callbackUrl: '/dashboard'
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      toast.success("Successfully connected wallet")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Wallet login error:", error)
      setError(error.message || "Failed to authenticate with wallet")
      toast.error(error.message || "Failed to authenticate with wallet")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle logout
  const logout = async () => {
    try {
      setIsLoading(true)
      
      // Logout from NextAuth
      await signOut({ redirect: false })
      
      // Clear any JWT tokens from cookies
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      
      toast.success("Successfully logged out")
      router.push("/")
    } catch (error: any) {
      console.error("Logout error:", error)
      toast.error(error.message || "Failed to logout")
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    isAuthenticated,
    isLoading,
    user,
    error,
    login,
    loginWithWallet,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

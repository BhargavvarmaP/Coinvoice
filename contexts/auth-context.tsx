"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import type {
  UserProfile,
  LoginCredentials,
  SignupData,
  WalletLoginData,
  OAuthLoginData,
  Permission,
} from "@/lib/types"
import { ethers } from "ethers"
import { jwtDecode } from "jwt-decode"
import { v4 as uuidv4 } from "uuid"

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "originator",
    walletAddress: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
    company: "Acme Inc.",
    coinPoints: 1250,
    kycStatus: "verified",
    twoFactorEnabled: false,
    permissions: [
      "view_dashboard",
      "manage_invoices",
      "tokenize_invoices",
      "view_marketplace",
      "create_listing",
      "view_analytics",
      "manage_wallet",
    ],
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    walletAddress: "0x9a8b7c6d5e4f3g2h1i0j9k8l7m6n5o4p3q2r1s0t",
    company: "Coinvoice",
    coinPoints: 5000,
    kycStatus: "verified",
    twoFactorEnabled: true,
    permissions: [
      "view_dashboard",
      "manage_invoices",
      "tokenize_invoices",
      "view_marketplace",
      "create_listing",
      "purchase_token",
      "manage_users",
      "view_reports",
      "approve_kyc",
      "view_audit_logs",
      "manage_compliance",
      "view_risk_alerts",
      "manage_entities",
      "view_analytics",
      "manage_payments",
      "manage_wallet",
    ],
  },
  {
    id: "3",
    name: "Investor User",
    email: "investor@example.com",
    password: "investor123",
    role: "investor",
    walletAddress: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v",
    company: "Investment Partners LLC",
    coinPoints: 3500,
    kycStatus: "verified",
    twoFactorEnabled: false,
    permissions: ["view_dashboard", "view_marketplace", "purchase_token", "view_analytics", "manage_wallet"],
  },
  {
    id: "4",
    name: "Regulatory Officer",
    email: "regulatory@example.com",
    password: "regulatory123",
    role: "regulatory",
    walletAddress: "0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x",
    company: "Financial Regulatory Authority",
    coinPoints: 2000,
    kycStatus: "verified",
    twoFactorEnabled: true,
    permissions: [
      "view_dashboard",
      "view_reports",
      "view_audit_logs",
      "manage_compliance",
      "view_risk_alerts",
      "manage_entities",
    ],
  },
]

interface AuthToken {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

interface DecodedToken {
  sub: string
  email: string
  role: string
  permissions: string[]
  exp: number
}

const TOKEN_KEY = "coinvoice_auth_token"
const REFRESH_TOKEN_KEY = "coinvoice_refresh_token"
const USER_KEY = "coinvoice_user"
const SESSION_KEY = "coinvoice_session"

type AuthContextType = {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  loginWithWallet: (walletData: WalletLoginData) => Promise<void>
  loginWithOAuth: (oauthData: OAuthLoginData) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => void
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  hasPermission: (permission: Permission) => boolean
  clearError: () => void
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const generateTokens = (user: UserProfile): AuthToken => {
  const accessToken = `mock_access_token_${uuidv4()}`
  const refreshToken = `mock_refresh_token_${uuidv4()}`
  return {
    accessToken,
    refreshToken,
    expiresIn: 3600,
  }
}

const decodeToken = (token: string): DecodedToken => {
  try {
    return JSON.parse(token)
  } catch (error) {
    throw new Error("Invalid token format")
  }
}

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token)
    return decoded.exp < Math.floor(Date.now() / 1000)
  } catch {
    return true
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Initialize session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY)
        const storedUser = localStorage.getItem(USER_KEY)

        if (token && storedUser) {
          if (isTokenExpired(token)) {
            // Token expired, try to refresh
            await refreshSession()
          } else {
            setUser(JSON.parse(storedUser))
          }
        }
      } catch (error) {
        console.error("Session initialization error:", error)
        setError("Failed to initialize session")
      } finally {
        setIsLoading(false)
      }
    }

    initializeSession()
  }, [])

  // Store session
  const storeSession = (userData: UserProfile, token: AuthToken, rememberMe: boolean = false) => {
    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem(TOKEN_KEY, token.accessToken)
    storage.setItem(USER_KEY, JSON.stringify(userData))
    setUser(userData)
  }

  // Clear session
  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
    setUser(null)
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  // Refresh session
  const refreshSession = async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
      if (!token) throw new Error("No token found")

      // In a real app, you would call your API to refresh the token
      // For now, we'll just generate a new one
      const storedUser = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY)
      if (!storedUser) throw new Error("No user found")

      const userData = JSON.parse(storedUser)
      const newToken = generateTokens(userData)
      storeSession(userData, newToken)
    } catch (error) {
      console.error("Session refresh error:", error)
      clearSession()
      throw error
    }
  }

  // Check if user has a specific permission
  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!user || !user.permissions) return false
      return user.permissions.includes(permission)
    },
    [user],
  )

  // Traditional email/password login
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const foundUser = MOCK_USERS.find((u) => u.email === credentials.email && u.password === credentials.password)

      if (!foundUser) {
        throw new Error("Invalid email or password")
      }

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = foundUser

      setUser(userWithoutPassword)

      // Store user in localStorage if rememberMe is true
      if (credentials.rememberMe) {
        localStorage.setItem("coinvoice_user", JSON.stringify(userWithoutPassword))
      } else {
        // Use sessionStorage instead for session-only storage
        sessionStorage.setItem("coinvoice_user", JSON.stringify(userWithoutPassword))
      }

      toast({
        title: "Login successful",
        description: `Welcome back, ${userWithoutPassword.name}!`,
      })

      // Check if there's a redirect URL stored
      const redirectUrl = sessionStorage.getItem("redirectAfterLogin")
      if (redirectUrl) {
        sessionStorage.removeItem("redirectAfterLogin")
        router.push(redirectUrl)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      setError(errorMessage)

      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      })

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Wallet-based login
  const loginWithWallet = async (walletData: WalletLoginData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Verify the signature
      const recoveredAddress = ethers.verifyMessage(walletData.message, walletData.signature)

      if (recoveredAddress.toLowerCase() !== walletData.address.toLowerCase()) {
        throw new Error("Invalid signature")
      }

      // Find user by wallet address or create a new one
      let foundUser = MOCK_USERS.find((u) => u.walletAddress.toLowerCase() === walletData.address.toLowerCase())

      if (!foundUser) {
        // In a real app, you might want to create a new user or require registration
        // For demo purposes, we'll create a basic user
        foundUser = {
          id: `wallet_${Date.now()}`,
          name: `Wallet User ${walletData.address.substring(0, 6)}`,
          email: `wallet_${walletData.address.substring(0, 6)}@example.com`,
          role: "investor",
          walletAddress: walletData.address,
          coinPoints: 100,
          kycStatus: "not_started",
          twoFactorEnabled: false,
          permissions: ["view_dashboard", "view_marketplace", "purchase_token", "view_analytics", "manage_wallet"],
        }
      }

      setUser(foundUser)
      localStorage.setItem("coinvoice_user", JSON.stringify(foundUser))

      toast({
        title: "Wallet login successful",
        description: `Welcome, ${foundUser.name}!`,
      })

      router.push("/dashboard")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      setError(errorMessage)

      toast({
        title: "Wallet login failed",
        description: errorMessage,
        variant: "destructive",
      })

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // OAuth-based login
  const loginWithOAuth = async (oauthData: OAuthLoginData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would verify the OAuth token with the provider
      // For demo purposes, we'll create a mock user based on the provider

      const mockOAuthUser = {
        id: `oauth_${Date.now()}`,
        name: `${oauthData.provider.charAt(0).toUpperCase() + oauthData.provider.slice(1)} User`,
        email: `oauth_${Date.now()}@${oauthData.provider}.com`,
        role: "investor",
        walletAddress: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        coinPoints: 100,
        kycStatus: "not_started",
        twoFactorEnabled: false,
        permissions: ["view_dashboard", "view_marketplace", "purchase_token", "view_analytics", "manage_wallet"],
      }

      setUser(mockOAuthUser)
      localStorage.setItem("coinvoice_user", JSON.stringify(mockOAuthUser))

      toast({
        title: "OAuth login successful",
        description: `Welcome, ${mockOAuthUser.name}!`,
      })

      router.push("/dashboard")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      setError(errorMessage)

      toast({
        title: "OAuth login failed",
        description: errorMessage,
        variant: "destructive",
      })

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // User registration
  const signup = async (data: SignupData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user already exists
      if (MOCK_USERS.some((u) => u.email === data.email)) {
        throw new Error("User with this email already exists")
      }

      // Create new user (in a real app, this would be an API call)
      const newUser: UserProfile = {
        id: `user_${Date.now()}`,
        name: data.name,
        email: data.email,
        role: "originator", // Default role for new users
        walletAddress: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        company: data.company,
        coinPoints: 100, // Starting points for new users
        kycStatus: "not_started",
        twoFactorEnabled: false,
        permissions: [
          "view_dashboard",
          "manage_invoices",
          "tokenize_invoices",
          "view_marketplace",
          "create_listing",
          "view_analytics",
          "manage_wallet",
        ],
      }

      setUser(newUser)
      localStorage.setItem("coinvoice_user", JSON.stringify(newUser))

      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
      })

      router.push("/dashboard")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      setError(errorMessage)

      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      })

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // User logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem("coinvoice_user")
    sessionStorage.removeItem("coinvoice_user")

    // If on a protected route, redirect to login
    if (
      pathname &&
      (pathname.startsWith("/dashboard") ||
        pathname.startsWith("/invoices") ||
        pathname.startsWith("/marketplace") ||
        pathname.startsWith("/wallet") ||
        pathname.startsWith("/analytics") ||
        pathname.startsWith("/profile") ||
        pathname.startsWith("/settings") ||
        pathname.startsWith("/admin") ||
        pathname.startsWith("/compliance") ||
        pathname.startsWith("/reports"))
    ) {
      router.push("/login")
    } else {
      router.push("/")
    }

    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
  }

  // Password reset
  const resetPassword = async (email: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const foundUser = MOCK_USERS.find((u) => u.email === email)

      if (!foundUser) {
        throw new Error("No account found with this email address")
      }

      toast({
        title: "Password reset email sent",
        description: "Check your email for instructions to reset your password.",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      setError(errorMessage)

      toast({
        title: "Password reset failed",
        description: errorMessage,
        variant: "destructive",
      })

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (!user) {
        throw new Error("No user is currently logged in")
      }

      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("coinvoice_user", JSON.stringify(updatedUser))

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      setError(errorMessage)

      toast({
        title: "Profile update failed",
        description: errorMessage,
        variant: "destructive",
      })

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    loginWithWallet,
    loginWithOAuth,
    signup,
    logout,
    resetPassword,
    updateProfile,
    hasPermission,
    clearError,
    refreshSession,
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

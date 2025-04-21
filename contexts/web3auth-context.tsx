"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { signIn } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"

// Define the shape of our authentication context
interface Web3AuthContextType {
  isConnecting: boolean
  error: string | null
  handleAuthentication: () => Promise<boolean> // Changed from void to boolean
  connectWallet: () => Promise<string>
  verifySignature: (address: string) => Promise<{ signature: string; message: string }>
}

// Create the context with a default undefined value
const Web3AuthContext = createContext<Web3AuthContextType | undefined>(undefined)

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(Web3AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within a Web3AuthProvider")
  }
  return context
}

// Provider component that wraps app and makes auth object available to any child component that calls useAuth()
export function Web3AuthProvider({ children }: { children: React.ReactNode }) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Connect to wallet (MetaMask or other web3 provider)
  const connectWallet = useCallback(async (): Promise<string> => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error("No Web3 wallet detected. Please install MetaMask or another wallet.")
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const address = accounts[0]
      return address
    } catch (error) {
      console.error("Error connecting to wallet:", error)
      throw new Error("Failed to connect to wallet")
    }
  }, [])

  // Sign a message to verify wallet ownership
  const verifySignature = useCallback(async (address: string): Promise<{ signature: string; message: string }> => {
    if (!address) throw new Error("No wallet address provided")
    
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error("No Web3 wallet detected. Please install MetaMask or another wallet.")
    }

    try {
      // Create a message for the user to sign
      const message = `Sign this message to authenticate with CoInvoice: ${Date.now()}`
      
      // Request signature from the user
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      }) as string // Added type assertion to ensure string

      return { signature, message }
    } catch (error) {
      console.error("Error signing message:", error)
      throw new Error("Failed to sign authentication message")
    }
  }, [])

  // Main authentication handler
  const handleAuthentication = useCallback(async () => {
    setIsConnecting(true)
    setError(null)

    try {
      // 1. Connect wallet
      const address = await connectWallet()
      
      // 2. Get signature
      const { signature, message } = await verifySignature(address)
      
      // 3. Authenticate with backend
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

      // 4. Sign in with NextAuth
      await signIn('credentials', {
        redirect: false,
        callbackUrl: '/dashboard'
      })

      toast({
        title: "Success",
        description: "Wallet connected successfully",
      })

      return true
    } catch (error: any) {
      console.error("Authentication error:", error)
      setError(error.message || "Authentication failed")
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsConnecting(false)
    }
  }, [connectWallet, verifySignature, toast])

  // Provide the auth context value
  const value = {
    isConnecting,
    error,
    handleAuthentication,
    connectWallet,
    verifySignature
  }

  return (
    <Web3AuthContext.Provider value={value}>
      {children}
    </Web3AuthContext.Provider>
  )
}

// Add TypeScript interface for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (event: string, callback: (...args: any[]) => void) => void
    }
  }
}
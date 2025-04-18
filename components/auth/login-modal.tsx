"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog"
import { Loader2, Mail, Wallet, Github, Linkedin, Lock, ChevronRight } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ethers } from "ethers"
import { EthereumProvider, EthereumProviderOptions } from "@walletconnect/ethereum-provider"
import Image from "next/image"

// Add type definitions for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      isTrust?: boolean
      isCoinbaseWallet?: boolean
      request: (args: { method: string; params?: any[] }) => Promise<any>
    }
  }
}

interface LoginModalProps {
  trigger?: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
}

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false),
})

const walletLoginSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Please enter a valid Ethereum address"),
  signature: z.string().min(1, "Signature is required"),
  message: z.string().min(1, "Message is required"),
})

type LoginFormData = z.infer<typeof loginSchema>
type WalletLoginFormData = z.infer<typeof walletLoginSchema>

// Add this type definition
type WalletProvider = "metamask" | "walletconnect" | "trustwallet" | "coinbase"

// WalletConnect configuration
const WALLET_CONNECT_OPTIONS: EthereumProviderOptions = {
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [50], // XDC mainnet
  optionalChains: [50, 51, 1, 5, 137, 80001], // XDC mainnet, XDC testnet, Ethereum mainnet, Goerli, Polygon, Mumbai
  showQrModal: true,
  methods: ["eth_sendTransaction", "eth_signTransaction", "eth_sign", "personal_sign", "eth_signTypedData"],
  events: ["chainChanged", "accountsChanged"],
}

// Utility function to get provider based on wallet type
const getProvider = async (provider: WalletProvider) => {
  switch (provider) {
    case "metamask":
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed. Please install MetaMask to continue.")
      }
      return new ethers.BrowserProvider(window.ethereum)

    case "walletconnect":
      const wcProvider = await EthereumProvider.init(WALLET_CONNECT_OPTIONS)
      await wcProvider.enable()
      return new ethers.BrowserProvider(wcProvider)

    case "trustwallet":
      if (!window.ethereum?.isTrust) {
        throw new Error("Trust Wallet is not installed. Please install Trust Wallet to continue.")
      }
      return new ethers.BrowserProvider(window.ethereum)

    case "coinbase":
      if (!window.ethereum?.isCoinbaseWallet) {
        throw new Error("Coinbase Wallet is not installed. Please install Coinbase Wallet to continue.")
      }
      return new ethers.BrowserProvider(window.ethereum)

    default:
      throw new Error("Unsupported wallet provider")
  }
}

// Add this interface for wallet login data
interface WalletLoginData {
  address: string
  signature: string
  message: string
  nonce?: string
  provider?: WalletProvider
}

// Add this function to handle wallet login
const loginWithWallet = async (data: WalletLoginData) => {
  try {
    const result = await signIn("wallet", {
      address: data.address,
      signature: data.signature,
      message: data.message,
      redirect: false,
    })

    if (result?.error) {
      throw new Error(result.error)
    }

    return result
  } catch (error) {
    console.error("Wallet login error:", error)
    throw error
  }
}

export function LoginModal({ 
  trigger, 
  defaultOpen = false, 
  open: controlledOpen, 
  onOpenChange, 
  onClose 
}: LoginModalProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
  const setOpen = onOpenChange || setUncontrolledOpen
  const [activeTab, setActiveTab] = useState<"email" | "wallet">("email")

  // Email login state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  // Wallet login state
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [walletError, setWalletError] = useState<string | null>(null)

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  // Email login form
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
    reset: resetEmailForm,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // Wallet login form
  const {
    register: registerWallet,
    handleSubmit: handleSubmitWallet,
    formState: { errors: walletErrors },
    reset: resetWalletForm,
  } = useForm<WalletLoginFormData>({
    resolver: zodResolver(walletLoginSchema),
  })

  // Add loading states for each provider
  const [loadingProvider, setLoadingProvider] = useState<WalletProvider | null>(null)

  // Update open state when defaultOpen changes
  useEffect(() => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(defaultOpen)
    }
  }, [defaultOpen, controlledOpen])

  const handleClose = () => {
    setOpen(false)
    if (onClose) onClose()
  }

  // Handle email login
  const onEmailLogin = async (data: LoginFormData) => {
    setIsSubmitting(true)
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      })

      resetEmailForm()
      handleClose()
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle wallet login
  const onWalletLogin = async (data: WalletLoginFormData) => {
    try {
      await loginWithWallet({
        address: data.address,
        signature: data.signature,
        message: data.message,
      })
      resetWalletForm()
      handleClose()
      router.push("/dashboard")
    } catch (error) {
      // Error is handled by the auth context
    }
  }

  // Update the handleWalletConnect function
  const handleWalletConnect = async (provider: WalletProvider) => {
    setIsSubmitting(true)
    setWalletError(null)

    try {
      // 1. Get the appropriate provider
      const ethProvider = await getProvider(provider)
      
      // 2. Get signer and address
      const signer = await ethProvider.getSigner()
      const address = await signer.getAddress()

      // 3. Generate a nonce and create the message
      const nonce = Date.now().toString()
      const message = `Welcome to Coinvoice!

By signing this message, you confirm that you are the owner of this wallet and wish to sign in to Coinvoice.

Nonce: ${nonce}
Wallet: ${address}
Time: ${new Date().toISOString()}`

      try {
        // 4. Request signature
        const signature = await signer.signMessage(message)

        // 5. Verify the signature on the client side first
        const recoveredAddress = ethers.verifyMessage(message, signature)
        
        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
          throw new Error("Signature verification failed")
        }

        // 6. Attempt to login with the wallet
        await loginWithWallet({
          address,
          signature,
          message,
          nonce,
          provider // Include provider information
        })

        // 7. Success - close modal and redirect
        toast({
          title: "Successfully connected wallet",
          description: "Redirecting to dashboard...",
          variant: "default",
        })
        
        handleClose()
        router.push("/dashboard")

      } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 4001) {
          // User rejected the signature request
          throw new Error("Please sign the message to continue")
        }
        throw error
      }

    } catch (error) {
      let errorMessage = "Failed to connect wallet"
      
      if (error instanceof Error) {
        errorMessage = error.message
      }

      // Handle specific error cases
      if (errorMessage.includes("user rejected") || errorMessage.includes("rejected")) {
        errorMessage = "Connection rejected. Please try again."
      }

      setWalletError(errorMessage)
      toast({
        title: "Wallet connection failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset forms when modal closes
  useEffect(() => {
    if (!open) {
      resetEmailForm()
      resetWalletForm()
      setWalletError(null)
    }
  }, [open, resetEmailForm, resetWalletForm])

  const handleOAuthLogin = async (provider: "google" | "github" | "linkedin") => {
    setIsSubmitting(true)
    try {
      await signIn(provider, { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("OAuth login error:", error)
      toast({
        title: "Login failed",
        description: `Failed to login with ${provider}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      setLoadingProvider(null)
      setWalletError(null)
      setIsSubmitting(false)
    }
  }, [])

  const [isLoading, setIsLoading] = useState(false)
  const [walletConnect, setWalletConnect] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initialize WalletConnect only on client side
      const initWalletConnect = async () => {
        try {
          const { EthereumProvider } = await import("@walletconnect/ethereum-provider")
          const provider = await EthereumProvider.init(WALLET_CONNECT_OPTIONS)
          setWalletConnect(provider)
        } catch (error) {
          console.error("Failed to initialize WalletConnect:", error)
        }
      }
      initWalletConnect()
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <AnimatePresence>
        {open && (
          <DialogOverlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]" />
        )}
      </AnimatePresence>

      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] sm:max-w-[425px] z-[101]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </DialogTitle>
            <DialogDescription>
              Sign in to your account to continue
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "email" | "wallet")} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="wallet" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Wallet
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="mt-4">
              <form onSubmit={handleSubmitEmail(onEmailLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...registerEmail("email")}
                      className="pl-10"
                    />
                  </div>
                  {emailErrors.email && (
                    <p className="text-sm text-red-500">{emailErrors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      {...registerEmail("password")}
                      className="pl-10"
                    />
                  </div>
                  {emailErrors.password && (
                    <p className="text-sm text-red-500">{emailErrors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      {...registerEmail("rememberMe")}
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <Button
                    variant="link"
                    className="text-sm px-0"
                    onClick={() => {
                      handleClose()
                      // Open forgot password modal here
                    }}
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleOAuthLogin("google")}
                  disabled={isSubmitting}
                >
                  <FcGoogle className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleOAuthLogin("github")}
                  disabled={isSubmitting}
                >
                  <Github className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleOAuthLogin("linkedin")}
                  disabled={isSubmitting}
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="wallet" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleWalletConnect("metamask")}
                    disabled={isSubmitting || loadingProvider === "metamask"}
                  >
                    {loadingProvider === "metamask" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Image
                        src="/wallets/metamask.svg"
                        alt="MetaMask"
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                    )}
                    MetaMask
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleWalletConnect("walletconnect")}
                    disabled={isSubmitting || loadingProvider === "walletconnect"}
                  >
                    {loadingProvider === "walletconnect" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Image
                        src="/wallets/walletconnect.svg"
                        alt="WalletConnect"
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                    )}
                    WalletConnect
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleWalletConnect("trustwallet")}
                    disabled={isSubmitting || loadingProvider === "trustwallet"}
                  >
                    {loadingProvider === "trustwallet" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Image
                        src="/wallets/trustwallet.svg"
                        alt="Trust Wallet"
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                    )}
                    Trust Wallet
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleWalletConnect("coinbase")}
                    disabled={isSubmitting || loadingProvider === "coinbase"}
                  >
                    {loadingProvider === "coinbase" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Image
                        src="/wallets/coinbase.svg"
                        alt="Coinbase Wallet"
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                    )}
                    Coinbase
                  </Button>
                </div>

                {walletError && (
                  <div className="text-sm text-red-500 text-center">
                    {walletError}
                  </div>
                )}

                <div className="text-sm text-muted-foreground text-center">
                  By connecting your wallet, you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6 border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="px-0"
                onClick={() => {
                  handleClose()
                  // Open signup modal here
                }}
              >
                Sign up
              </Button>
            </p>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}


"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Loader2, User, Mail, Building, Lock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Wallet } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub, FaLinkedin } from "react-icons/fa"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ethers } from "ethers"
import Image from "next/image"
import { useAuth } from "@/contexts/web3auth-context"

// Add type definitions for window.ethereum
interface Window {
  ethereum?: {
    request: (args: { method: string; params?: any[] | undefined; }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
    isTrust?: boolean;
    isCoinbaseWallet?: boolean;
  }
}

// WalletConnect configuration
const WALLET_CONNECT_OPTIONS = {
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [50], // XDC mainnet
  optionalChains: [50, 51, 1, 5, 137, 80001], // XDC mainnet, XDC testnet, Ethereum mainnet, Goerli, Polygon, Mumbai
  showQrModal: true,
  methods: ["eth_sendTransaction", "eth_signTransaction", "eth_sign", "personal_sign", "eth_signTypedData"],
  events: ["chainChanged", "accountsChanged"]
} as const

// Define wallet provider type
type WalletProvider = "metamask" | "walletconnect" | "trustwallet" | "coinbase"

// Utility function to get provider based on wallet type
const getProvider = async (provider: WalletProvider) => {
  switch (provider) {
    case "metamask":
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed. Please install MetaMask to continue.")
      }
      return new ethers.BrowserProvider(window.ethereum)

    case "walletconnect":
      const { EthereumProvider } = await import("@walletconnect/ethereum-provider")
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

interface SignupModalProps {
  trigger?: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
}

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  company: z.string().optional(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type SignupFormData = z.infer<typeof signupSchema>

export function SignupModal({ 
  trigger, 
  defaultOpen = false, 
  open: controlledOpen, 
  onOpenChange, 
  onClose 
}: SignupModalProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
  const setOpen = onOpenChange || setUncontrolledOpen
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("email")

  // Wallet connection state
  const [walletAddress, setWalletAddress] = useState("")
  const [walletError, setWalletError] = useState<string | null>(null)
  const [loadingProvider, setLoadingProvider] = useState<WalletProvider | null>(null)

  const router = useRouter()
  const { toast } = useToast()
  const { handleAuthentication, isConnecting: isLoading, error } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const handleClose = () => {
    setOpen(false)
    if (onClose) onClose()
  }

  // Update open state when defaultOpen changes
  useEffect(() => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(defaultOpen)
    }
  }, [defaultOpen, controlledOpen])

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true)
    try {
      // Here you would typically make an API call to register the user
      // For now, we'll simulate a successful registration and sign them in
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
        description: "Your account has been created successfully.",
      })

      reset()
      handleClose()
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Registration failed",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOAuthSignup = async (provider: "google" | "github" | "linkedin") => {
    setIsSubmitting(true)
    try {
      await signIn(provider, { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("OAuth signup error:", error)
      toast({
        title: "Signup failed",
        description: `Failed to sign up with ${provider}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle wallet connection for signup
  const handleWalletConnect = async (provider: WalletProvider) => {
    setIsSubmitting(true)
    setWalletError(null)
    setLoadingProvider(provider)

    try {
      // 1. Get the appropriate provider
      const ethProvider = await getProvider(provider)
      
      // 2. Get signer and address
      const signer = await ethProvider.getSigner()
      const address = await signer.getAddress()
      setWalletAddress(address)

      // 3. Generate a nonce and create the message
      const nonce = Date.now().toString()
      const message = `Welcome to Coinvoice!

By signing this message, you confirm that you are the owner of this wallet and wish to create an account with Coinvoice.

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

        // 6. Send registration request to the API
        const response = await fetch('/api/auth/wallet/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address,
            signature,
            message,
            nonce,
            provider // Include provider information
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Wallet registration failed')
        }

        const result = await response.json()

        // 7. Store tokens in localStorage
        localStorage.setItem('coinvoice_auth_token', result.accessToken)
        localStorage.setItem('coinvoice_refresh_token', result.refreshToken)
        localStorage.setItem('coinvoice_user', JSON.stringify(result.user))

        // 8. Success - close modal and redirect
        toast({
          title: "Successfully registered with wallet",
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
      setLoadingProvider(null)
    }
  }

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      reset()
      setWalletError(null)
      setWalletAddress("")
    }
  }, [open, reset])

  const handleSignup = async () => {
    try {
      await login()
      setOpen(false)
      toast({
        title: "Success",
        description: "Your account has been created successfully.",
      })
    } catch (error) {
      console.error("Signup failed:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Signup failed",
        variant: "destructive",
      })
    }
  }

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
              Create an Account
            </DialogTitle>
            <DialogDescription>
              Join us to get started with your journey
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      {...register("name")}
                      className="pl-10"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...register("email")}
                      className="pl-10"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company (Optional)</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company"
                      placeholder="Enter your company name"
                      {...register("company")}
                      className="pl-10"
                    />
                  </div>
                  {errors.company && (
                    <p className="text-sm text-red-500">{errors.company.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      {...register("password")}
                      className="pl-10"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      {...register("confirmPassword")}
                      className="pl-10"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    {...register("agreeTerms")}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {errors.agreeTerms && (
                  <p className="text-sm text-red-500">{errors.agreeTerms.message}</p>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
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
                  onClick={() => handleOAuthSignup("google")}
                  disabled={isSubmitting}
                >
                  <FcGoogle className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleOAuthSignup("github")}
                  disabled={isSubmitting}
                >
                  <FaGithub className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleOAuthSignup("linkedin")}
                  disabled={isSubmitting}
                >
                  <FaLinkedin className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="wallet" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 h-14"
                    onClick={() => handleWalletConnect("metamask")}
                    disabled={isSubmitting}
                  >
                    <Image
                      src="/wallets/metamask.svg"
                      alt="MetaMask"
                      width={24}
                      height={24}
                    />
                    MetaMask
                    {isSubmitting && loadingProvider === "metamask" && (
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 h-14"
                    onClick={() => handleWalletConnect("walletconnect")}
                    disabled={isSubmitting}
                  >
                    <Image
                      src="/wallets/walletconnect.svg"
                      alt="WalletConnect"
                      width={24}
                      height={24}
                    />
                    WalletConnect
                    {isSubmitting && loadingProvider === "walletconnect" && (
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    )}
                  </Button>
                </div>
                
                {walletError && (
                  <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                    {walletError}
                  </div>
                )}
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                    onClick={() => handleOAuthSignup("google")}
                    disabled={isSubmitting}
                  >
                    <FcGoogle className="h-5 w-5" />
                    Sign up with Google
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6 border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                variant="link"
                className="px-0"
                onClick={() => {
                  handleClose()
                  // Open login modal here
                }}
              >
                Sign in
              </Button>
            </p>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

// Use the correct properties from useAuth hook
const { connect, disconnect, isAuthenticated } = useAuth();

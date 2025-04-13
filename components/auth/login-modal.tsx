"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
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
import { Loader2, Mail, Wallet, Github, Linkedin, Lock } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { ethers } from "ethers"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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

  const { login, loginWithWallet, loginWithOAuth, error, clearError, isAuthenticated } = useAuth()
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

  // Update open state when defaultOpen changes
  useEffect(() => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(defaultOpen)
    }
  }, [defaultOpen, controlledOpen])

  const handleClose = () => {
    setOpen(false)
    clearError()
    if (onClose) onClose()
  }

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      handleClose()
      router.push("/dashboard")
    }
  }, [isAuthenticated, router, handleClose])

  // Handle email login
  const onEmailLogin = async (data: LoginFormData) => {
    try {
      await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      })
      resetEmailForm()
      handleClose()
      router.push("/dashboard")
    } catch (error) {
      // Error is handled by the auth context
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

  // Handle wallet connection
  const handleWalletConnect = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask or another Web3 wallet")
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found")
      }

      const address = accounts[0]
      const message = `Sign this message to authenticate with Coinvoice\n\nNonce: ${Date.now()}`
      
      // Request signature
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, address],
      })

      // Submit the form with the wallet data
      await handleSubmitWallet({
        address,
        signature,
        message,
      })()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to connect wallet"
      setWalletError(errorMessage)
      toast({
        title: "Wallet connection failed",
        description: errorMessage,
        variant: "destructive",
      })
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
      await loginWithOAuth({ provider })
      handleClose()
      router.push("/dashboard")
    } catch (error) {
      console.error("OAuth login error:", error)
      toast({
        title: "Login failed",
        description: "Failed to login with " + provider + ". Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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
              <form onSubmit={handleSubmitWallet(onWalletLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wallet-address">Wallet Address</Label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="wallet-address"
                      placeholder="Enter your wallet address"
                      {...registerWallet("address")}
                      className="pl-10"
                    />
                  </div>
                  {walletErrors.address && (
                    <p className="text-sm text-red-500">{walletErrors.address.message}</p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleWalletConnect}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Wallet
                    </>
                  )}
                </Button>

                {walletError && (
                  <p className="text-sm text-red-500">{walletError}</p>
                )}
              </form>
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


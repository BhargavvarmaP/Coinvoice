"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
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

interface SignupModalProps {
  trigger?: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
}

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
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [company, setCompany] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("email")
  const [walletAddress, setWalletAddress] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const { signup, error, clearError, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleClose = () => {
    setOpen(false)
    clearError()
    if (onClose) onClose()
  }

  // Update open state when defaultOpen changes
  useEffect(() => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(defaultOpen)
    }
  }, [defaultOpen, controlledOpen])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      handleClose()
      router.push("/dashboard")
    }
  }, [isAuthenticated, router, handleClose])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (!agreeTerms) {
      toast({
        title: "Error",
        description: "You must agree to the terms and conditions",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await signup({ name, email, password, company })
      handleClose()
      router.push("/dashboard")
    } catch (error) {
      // Error is handled in the auth context
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      })
      return
    }

    if (!agreeTerms) {
      toast({
        title: "Error",
        description: "You must agree to the terms and conditions",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await signup({ name, email, password, company })
      handleClose()
      router.push("/dashboard")
    } catch (error) {
      // Error is handled in the auth context
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWalletConnect = async () => {
    setIsConnecting(true)
    try {
      // Implement wallet connection logic here
      setWalletAddress("0x1234567890abcdef")
    } catch (error) {
      // Error is handled in the auth context
      console.error(error)
    } finally {
      setIsConnecting(false)
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

      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] sm:max-w-[425px] z-[101] relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Account
            </DialogTitle>
            <DialogDescription>
              Sign up to get started with Coinvoice
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
              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <Button
                      variant="link"
                      className="px-0"
                      onClick={() => {
                        handleClose()
                        // Open terms modal here
                      }}
                    >
                      Terms of Service
                    </Button>{" "}
                    and{" "}
                    <Button
                      variant="link"
                      className="px-0"
                      onClick={() => {
                        handleClose()
                        // Open privacy modal here
                      }}
                    >
                      Privacy Policy
                    </Button>
                  </Label>
                </div>

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
                {!walletAddress ? (
                  <Button
                    className="w-full"
                    onClick={handleWalletConnect}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
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
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
                  >
                    <p className="text-sm text-muted-foreground mb-2">
                      Connected Wallet
                    </p>
                    <p className="font-mono text-sm">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setWalletAddress("")}
                    >
                      Disconnect
                    </Button>
                  </motion.div>
                )}
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

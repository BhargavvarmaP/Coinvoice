"use client"

import type React from "react"

import { useState } from "react"
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
} from "@/components/ui/dialog"
import { Loader2, Mail, Wallet, Github, Linkedin } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { ethers } from "ethers"
import { useToast } from "@/components/ui/use-toast"

interface LoginModalProps {
  trigger?: React.ReactNode
  defaultOpen?: boolean
  onClose?: () => void
}

export function LoginModal({ trigger, defaultOpen = false, onClose }: LoginModalProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [activeTab, setActiveTab] = useState<string>("email")

  // Email login state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  // Wallet login state
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login, loginWithWallet, loginWithOAuth, error, clearError } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleClose = () => {
    setOpen(false)
    clearError()
    if (onClose) onClose()
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await login({ email, password, rememberMe })
      handleClose()
    } catch (error) {
      // Error is handled in the auth context
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWalletLogin = async () => {
    if (!window.ethereum) {
      toast({
        title: "Wallet not found",
        description: "Please install MetaMask or another Ethereum wallet to continue",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)

    try {
      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])
      const address = accounts[0]
      setWalletAddress(address)

      // Create a signature to verify ownership
      const signer = await provider.getSigner()
      const message = `Sign this message to login to Coinvoice at ${new Date().toISOString()}`
      const signature = await signer.signMessage(message)

      // Login with wallet
      await loginWithWallet({
        address,
        signature,
        message,
      })

      handleClose()
    } catch (error) {
      console.error(error)
      toast({
        title: "Wallet connection failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleOAuthLogin = async (provider: "google" | "github" | "linkedin") => {
    setIsSubmitting(true)

    try {
      // In a real app, you would redirect to the OAuth provider
      // For demo purposes, we'll simulate a successful OAuth login
      await loginWithOAuth({
        provider,
        token: `mock_token_${Date.now()}`,
      })

      handleClose()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Sign in to Coinvoice</DialogTitle>
          <DialogDescription>Choose your preferred method to sign in to your account</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="email" disabled={isSubmitting}>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="wallet" disabled={isSubmitting}>
              <Wallet className="h-4 w-4 mr-2" />
              Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4 mt-4">
            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-xs"
                    onClick={() => router.push("/forgot-password")}
                    type="button"
                  >
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me for 30 days
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in with Email"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" onClick={() => handleOAuthLogin("google")} disabled={isSubmitting}>
                <FcGoogle className="h-5 w-5" />
              </Button>
              <Button variant="outline" onClick={() => handleOAuthLogin("github")} disabled={isSubmitting}>
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="outline" onClick={() => handleOAuthLogin("linkedin")} disabled={isSubmitting}>
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-4 mt-4">
            <div className="bg-muted p-4 rounded-lg text-center space-y-4">
              {walletAddress ? (
                <>
                  <div className="flex items-center justify-center">
                    <Wallet className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Wallet Connected</p>
                    <p className="text-sm text-muted-foreground break-all mt-1">{walletAddress}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center">
                    <Wallet className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Connect your wallet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect your Ethereum wallet to sign in securely
                    </p>
                  </div>
                </>
              )}

              <Button onClick={handleWalletLogin} className="w-full" disabled={isConnecting}>
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : walletAddress ? (
                  "Sign in with Wallet"
                ) : (
                  "Connect Wallet"
                )}
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Don't have a wallet?{" "}
                <a
                  href="https://metamask.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Get MetaMask
                </a>
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col space-y-2 sm:space-y-0">
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account?</span>{" "}
            <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/signup")}>
              Sign up
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

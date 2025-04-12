"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Loader2, Mail, Wallet, Github, Linkedin } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { useToast } from "@/components/ui/use-toast"
import { ForgotPasswordModal } from "@/components/auth/forgot-password-modal"
import { ethers } from "ethers"

export default function LoginPage() {
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

  // Forgot password modal
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)

  const { login, loginWithWallet, loginWithOAuth, error, clearError } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

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
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Logo className="h-10 w-auto" />
          </Link>
        </div>

        <Card className="border-muted/40 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">Choose your preferred sign-in method</CardDescription>
          </CardHeader>

          <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mx-auto mb-4">
              <TabsTrigger value="email" disabled={isSubmitting}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="wallet" disabled={isSubmitting}>
                <Wallet className="h-4 w-4 mr-2" />
                Wallet
              </TabsTrigger>
            </TabsList>

            <CardContent>
              <TabsContent value="email" className="space-y-4 mt-0">
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
                        onClick={() => setForgotPasswordOpen(true)}
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
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthLogin("google")}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <FcGoogle className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthLogin("github")}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <Github className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthLogin("linkedin")}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="wallet" className="space-y-4 mt-0">
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
            </CardContent>
          </Tabs>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account?</span>{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>

      <ForgotPasswordModal defaultOpen={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)} />
    </div>
  )
}

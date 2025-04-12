"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { resetPassword, error } = useAuth()
  const { toast } = useToast()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await resetPassword(email)
      setIsSubmitted(true)
    } catch (error) {
      // Error is handled in the auth context
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
            <CardTitle className="text-2xl text-center">
              {isSubmitted ? "Check your email" : "Reset your password"}
            </CardTitle>
            <CardDescription className="text-center">
              {isSubmitted
                ? "We've sent you an email with instructions to reset your password."
                : "Enter your email address and we'll send you a link to reset your password."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="space-y-4 py-4">
                <div className="flex justify-center">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    We've sent an email to <span className="font-medium text-foreground">{email}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Click the link in the email to reset your password. If you don't see the email, check your spam
                    folder.
                  </p>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button asChild>
                    <Link href="/login">Return to login</Link>
                  </Button>
                  <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to reset form
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Remember your password?</span>{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

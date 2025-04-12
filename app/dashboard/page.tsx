"use client"

import { useState } from "react"
import { Dashboard } from "@/components/dashboard"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      setIsRedirecting(true)
      // Store the current URL to redirect back after login
      sessionStorage.setItem("redirectAfterLogin", "/dashboard")
      router.push("/login")
    }
  }, [isLoading, user, router])

  if (isLoading || isRedirecting) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            {isRedirecting ? "Redirecting to login..." : "Loading dashboard..."}
          </p>
        </div>
      </div>
    )
  }

  return <Dashboard />
}

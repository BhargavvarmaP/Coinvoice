"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"
import type { Permission } from "@/lib/types"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermissions?: Permission[]
  requireAllPermissions?: boolean
}

export function ProtectedRoute({
  children,
  requiredPermissions = [],
  requireAllPermissions = false,
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, hasPermission } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Store the intended destination to redirect after login
        sessionStorage.setItem("redirectAfterLogin", pathname)
        router.push("/login")
        return
      }

      // Check permissions if specified
      if (requiredPermissions.length > 0) {
        const hasRequiredPermissions = requireAllPermissions
          ? requiredPermissions.every((permission) => hasPermission(permission))
          : requiredPermissions.some((permission) => hasPermission(permission))

        if (!hasRequiredPermissions) {
          router.push("/dashboard")
          return
        }
      }
    }
  }, [isLoading, isAuthenticated, user, router, pathname, requiredPermissions, requireAllPermissions, hasPermission])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Loading</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAllPermissions
      ? requiredPermissions.every((permission) => hasPermission(permission))
      : requiredPermissions.some((permission) => hasPermission(permission))

    if (!hasRequiredPermissions) {
      return null
    }
  }

  return <>{children}</>
}

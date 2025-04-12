"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import type { UserRole } from "@/lib/types"

interface RoleGuardProps {
  children: React.ReactNode
  roles: UserRole | UserRole[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, roles, fallback = null }: RoleGuardProps) {
  const { user } = useAuth()

  if (!user) {
    return <>{fallback}</>
  }

  const allowedRoles = Array.isArray(roles) ? roles : [roles]

  if (!allowedRoles.includes(user.role as UserRole)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

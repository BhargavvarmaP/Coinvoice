"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import type { Permission } from "@/lib/types"

interface PermissionGuardProps {
  children: React.ReactNode
  permission: Permission
  fallback?: React.ReactNode
}

export function PermissionGuard({ children, permission, fallback = null }: PermissionGuardProps) {
  const { hasPermission } = useAuth()

  if (!hasPermission(permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

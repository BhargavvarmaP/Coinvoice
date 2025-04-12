"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { BarChart3, FileText, Home, Settings, Users, Shield } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "User Management",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Content Management",
      href: "/admin/content",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div className="hidden md:flex flex-col w-64 border-r border-border bg-card">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2">
          <Logo />
          <span className="font-bold text-xl">Admin</span>
        </Link>
      </div>

      <div className="flex-1 px-3 py-2 space-y-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === route.href
                ? "bg-primary/10 text-primary"
                : "text-foreground/70 hover:bg-muted hover:text-primary",
            )}
          >
            {route.icon}
            {route.name}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary/5">
          <div className="p-2 rounded-full bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-sm font-medium">Admin Mode</div>
            <div className="text-xs text-muted-foreground">Full access granted</div>
          </div>
        </div>
      </div>
    </div>
  )
}

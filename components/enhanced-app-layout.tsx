"use client"

import type { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/sidebar"
import { cn } from "@/lib/utils"

interface EnhancedAppLayoutProps {
  children: ReactNode
}

export function EnhancedAppLayout({ children }: EnhancedAppLayoutProps) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const { sidebarCollapsed } = useAppStore()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Sidebar */}
      <AppSidebar />
      
      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        sidebarCollapsed ? "ml-0 md:ml-16" : "ml-0 md:ml-64"
      )}>
        <main className={cn(
          "flex-1 p-4 md:p-6 overflow-auto transition-all duration-300",
          scrolled && "pt-4 md:pt-6"
        )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

"use client"

import { ReactNode } from "react"
import { motion, MotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps extends MotionProps {
  children: ReactNode
  className?: string
  intensity?: "light" | "medium" | "heavy"
  hoverEffect?: boolean
  borderGradient?: boolean
}

export function GlassCard({
  children,
  className,
  intensity = "medium",
  hoverEffect = true,
  borderGradient = false,
  ...motionProps
}: GlassCardProps) {
  // Define different backdrop blur intensities
  const blurIntensity = {
    light: "backdrop-blur-sm",
    medium: "backdrop-blur-md",
    heavy: "backdrop-blur-lg",
  }

  // Define background opacity based on intensity
  const bgOpacity = {
    light: "bg-white/10 dark:bg-gray-900/20",
    medium: "bg-white/20 dark:bg-gray-900/30",
    heavy: "bg-white/30 dark:bg-gray-900/40",
  }

  // Define border opacity based on intensity
  const borderStyle = borderGradient
    ? "border border-transparent bg-gradient-to-br from-white/30 to-white/5 dark:from-white/10 dark:to-white/5 bg-clip-border"
    : {
        light: "border border-white/10 dark:border-white/5",
        medium: "border border-white/20 dark:border-white/10",
        heavy: "border border-white/30 dark:border-white/20",
      }[intensity]

  // Define hover effects
  const hoverStyles = hoverEffect
    ? "transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/30 hover:-translate-y-1"
    : ""

  return (
    <motion.div
      className={cn(
        "rounded-xl shadow-lg shadow-black/5",
        blurIntensity[intensity],
        bgOpacity[intensity],
        typeof borderStyle === "string" ? borderStyle : "",
        hoverStyles,
        className
      )}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}

export function GlassCardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-6 py-4 border-b border-white/10 dark:border-white/5", className)}>{children}</div>
}

export function GlassCardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>
}

export function GlassCardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 py-4 border-t border-white/10 dark:border-white/5", className)}>{children}</div>
  )
}

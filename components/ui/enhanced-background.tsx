"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface EnhancedBackgroundProps {
  className?: string
  variant?: "gradient" | "dots" | "waves" | "grid"
  intensity?: "light" | "medium" | "heavy"
  scrollEffect?: boolean
}

export function EnhancedBackground({
  className,
  variant = "gradient",
  intensity = "medium",
  scrollEffect = true,
}: EnhancedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    scrollEffect ? [0, 100] : [0, 0]
  )
  
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    scrollEffect ? [1, 0.7, 0.4] : [1, 1, 1]
  )

  // Intensity levels for opacity
  const getOpacityByIntensity = () => {
    switch (intensity) {
      case "light": return "opacity-10"
      case "medium": return "opacity-20"
      case "heavy": return "opacity-30"
      default: return "opacity-20"
    }
  }

  // Gradient background
  if (variant === "gradient") {
    return (
      <motion.div
        ref={containerRef}
        className={cn(
          "absolute inset-0 bg-gradient-to-br pointer-events-none",
          intensity === "light" && "from-blue-500/10 to-purple-500/10",
          intensity === "medium" && "from-blue-500/20 to-purple-500/20",
          intensity === "heavy" && "from-blue-500/30 to-purple-500/30",
          className
        )}
        style={{ opacity, y }}
      />
    )
  }

  // Dots background
  if (variant === "dots") {
    return (
      <motion.div
        ref={containerRef}
        className={cn(
          "absolute inset-0 pointer-events-none",
          className
        )}
        style={{ opacity, y }}
      >
        <div className={cn(
          "absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]",
          intensity === "light" && "opacity-10",
          intensity === "medium" && "opacity-20",
          intensity === "heavy" && "opacity-30"
        )} />
      </motion.div>
    )
  }

  // Waves background
  if (variant === "waves") {
    return (
      <motion.div
        ref={containerRef}
        className={cn(
          "absolute inset-0 pointer-events-none overflow-hidden",
          className
        )}
        style={{ opacity, y }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-500/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-purple-500/10 to-transparent transform translate-y-8"></div>
      </motion.div>
    )
  }

  // Grid background
  if (variant === "grid") {
    return (
      <motion.div
        ref={containerRef}
        className={cn(
          "absolute inset-0 pointer-events-none",
          className
        )}
        style={{ opacity, y }}
      >
        <div className={cn(
          "absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#303030_1px,transparent_1px),linear-gradient(to_bottom,#303030_1px,transparent_1px)]",
          intensity === "light" && "opacity-10",
          intensity === "medium" && "opacity-20",
          intensity === "heavy" && "opacity-30"
        )} />
      </motion.div>
    )
  }

  return null
}

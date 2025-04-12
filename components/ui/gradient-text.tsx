"use client"

import { ReactNode } from "react"
import { motion, MotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

type GradientType = 
  | "blue-purple" 
  | "green-blue" 
  | "amber-red" 
  | "pink-purple"
  | "teal-green"
  | "blue-cyan"
  | "rainbow"

interface GradientTextProps extends MotionProps {
  children: ReactNode
  className?: string
  gradient?: GradientType
  animate?: boolean
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"
}

export function GradientText({
  children,
  className,
  gradient = "blue-purple",
  animate = false,
  as = "span",
  ...motionProps
}: GradientTextProps) {
  // Define gradient presets
  const gradients = {
    "blue-purple": "from-blue-600 via-blue-500 to-purple-600 dark:from-blue-400 dark:via-blue-300 dark:to-purple-400",
    "green-blue": "from-green-500 via-teal-500 to-blue-500 dark:from-green-400 dark:via-teal-400 dark:to-blue-400",
    "amber-red": "from-amber-500 via-orange-500 to-red-500 dark:from-amber-400 dark:via-orange-400 dark:to-red-400",
    "pink-purple": "from-pink-500 via-fuchsia-500 to-purple-500 dark:from-pink-400 dark:via-fuchsia-400 dark:to-purple-400",
    "teal-green": "from-teal-500 via-emerald-500 to-green-500 dark:from-teal-400 dark:via-emerald-400 dark:to-green-400",
    "blue-cyan": "from-blue-500 via-sky-500 to-cyan-500 dark:from-blue-400 dark:via-sky-400 dark:to-cyan-400",
    "rainbow": "from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 dark:from-red-400 dark:via-yellow-400 dark:via-green-400 dark:via-blue-400 dark:to-purple-400"
  }

  // Animation properties for the gradient
  const animationProps = animate
    ? {
        backgroundSize: ["100% 100%", "200% 100%", "100% 100%"],
        backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
        transition: {
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        },
      }
    : {}

  // Create the component based on the "as" prop
  const Component = motion[as] as any

  return (
    <Component
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent",
        gradients[gradient],
        className
      )}
      {...animationProps}
      {...motionProps}
    >
      {children}
    </Component>
  )
}

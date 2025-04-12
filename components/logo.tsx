"use client"

import { motion } from "framer-motion"

export function Logo({
  variant = "default",
  size = "md",
}: { variant?: "default" | "icon" | "animated" | "enterprise"; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
  }

  if (variant === "icon") {
    return (
      <div
        className={`${sizeClasses[size]} aspect-square flex items-center justify-center rounded-full bg-blue-600 text-white`}
      >
        <span className="font-bold">C</span>
      </div>
    )
  }

  if (variant === "animated") {
    return (
      <div className={`${sizeClasses[size]} flex items-center gap-2`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="aspect-square flex items-center justify-center rounded-full bg-blue-600 text-white"
        >
          <span className="font-bold">C</span>
        </motion.div>
        <span className="font-bold text-xl md:text-2xl lg:text-3xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Coinvoice
        </span>
      </div>
    )
  }

  if (variant === "enterprise") {
    return (
      <div className={`${sizeClasses[size]} flex items-center gap-2`}>
        <div className="aspect-square flex items-center justify-center rounded-full bg-blue-600 text-white">
          <span className="font-bold">C</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm md:text-base lg:text-lg leading-tight">Coinvoice</span>
          <span className="text-xs text-blue-600 dark:text-blue-400 leading-tight">GUTAE</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} flex items-center gap-2`}>
      <div className="aspect-square flex items-center justify-center rounded-full bg-blue-600 text-white">
        <span className="font-bold">C</span>
      </div>
      <span className="font-bold text-xl">Coinvoice</span>
    </div>
  )
}

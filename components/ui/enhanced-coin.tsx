"use client"

import { useRef, useState } from "react"
import { motion, Variants } from "framer-motion"
import { cn } from "@/lib/utils"

interface EnhancedCoinProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  interactive?: boolean
  symbol?: string
  gradient?: "gold" | "silver" | "bronze" | "blue" | "purple"
}

export function EnhancedCoin({ 
  className = "", 
  size = "md", 
  interactive = true,
  symbol = "CVT",
  gradient = "gold"
}: EnhancedCoinProps) {
  const [isHovered, setIsHovered] = useState(false)
  const coinRef = useRef<HTMLDivElement>(null)
  
  // Size mapping
  const sizeMap = {
    sm: "h-24 w-24",
    md: "h-40 w-40",
    lg: "h-56 w-56",
    xl: "h-72 w-72"
  }

  // Gradient mapping
  const gradientMap = {
    gold: "from-amber-300 via-yellow-500 to-amber-600",
    silver: "from-gray-300 via-gray-100 to-gray-400",
    bronze: "from-amber-700 via-orange-600 to-amber-800",
    blue: "from-blue-400 via-blue-500 to-blue-600",
    purple: "from-purple-400 via-purple-500 to-purple-600"
  }

  // Shadow mapping
  const shadowMap = {
    gold: "rgba(245, 158, 11, 0.6)",
    silver: "rgba(156, 163, 175, 0.6)",
    bronze: "rgba(180, 83, 9, 0.6)",
    blue: "rgba(59, 130, 246, 0.6)",
    purple: "rgba(168, 85, 247, 0.6)"
  }

  // Animation variants
  const coinVariants: Variants = {
    hover: {
      rotateY: 180,
      boxShadow: `0 0 30px ${shadowMap[gradient]}`,
      transition: {
        duration: 0.5
      }
    },
    initial: {
      rotateY: 0,
      boxShadow: `0 0 15px ${shadowMap[gradient]}`,
      transition: {
        duration: 0.5
      }
    },
    spin: {
      rotateY: 360,
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "linear"
      }
    },
    pulse: {
      scale: [1, 1.05, 1],
      boxShadow: [
        `0 0 15px ${shadowMap[gradient]}`,
        `0 0 30px ${shadowMap[gradient]}`,
        `0 0 15px ${shadowMap[gradient]}`
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  }

  return (
    <div 
      className={cn(sizeMap[size], className, "relative")}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
    >
      <motion.div 
        ref={coinRef}
        className={cn(
          "w-full h-full rounded-full flex items-center justify-center",
          "bg-gradient-to-br",
          gradientMap[gradient],
          "border-4 border-opacity-20",
          gradient === "gold" && "border-yellow-300",
          gradient === "silver" && "border-gray-200",
          gradient === "bronze" && "border-amber-700",
          gradient === "blue" && "border-blue-300",
          gradient === "purple" && "border-purple-300",
          "relative z-10"
        )}
        initial="initial"
        animate={isHovered ? "hover" : interactive ? "pulse" : "spin"}
        variants={coinVariants}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front face */}
        <div className="absolute inset-0 backface-hidden flex items-center justify-center">
          <div className={cn(
            "w-[85%] h-[85%] rounded-full flex items-center justify-center",
            "bg-gradient-to-br",
            gradientMap[gradient],
            "border-2 border-opacity-30",
            gradient === "gold" && "border-yellow-200",
            gradient === "silver" && "border-gray-100",
            gradient === "bronze" && "border-amber-600",
            gradient === "blue" && "border-blue-200",
            gradient === "purple" && "border-purple-200",
          )}>
            <span className={cn(
              "text-4xl font-bold",
              gradient === "silver" ? "text-gray-800" : "text-white",
              size === "sm" && "text-2xl",
              size === "lg" && "text-5xl",
              size === "xl" && "text-6xl",
            )}>
              {symbol}
            </span>
          </div>
        </div>

        {/* Back face */}
        <div 
          className="absolute inset-0 backface-hidden flex items-center justify-center"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className={cn(
            "w-[85%] h-[85%] rounded-full flex items-center justify-center",
            "bg-gradient-to-br",
            gradientMap[gradient],
            "border-2 border-opacity-30",
            gradient === "gold" && "border-yellow-200",
            gradient === "silver" && "border-gray-100",
            gradient === "bronze" && "border-amber-600",
            gradient === "blue" && "border-blue-200",
            gradient === "purple" && "border-purple-200",
          )}>
            <div className="flex flex-col items-center justify-center">
              <span className={cn(
                "text-xl font-bold",
                gradient === "silver" ? "text-gray-800" : "text-white",
                size === "sm" && "text-base",
                size === "lg" && "text-2xl",
                size === "xl" && "text-3xl",
              )}>
                COINVOICE
              </span>
              <span className={cn(
                "text-sm",
                gradient === "silver" ? "text-gray-700" : "text-white/80",
                size === "sm" && "text-xs",
                size === "lg" && "text-base",
                size === "xl" && "text-lg",
              )}>
                TOKEN
              </span>
            </div>
          </div>
        </div>

        {/* Edge effect */}
        <div className="absolute inset-0 rounded-full border-8 border-opacity-10 border-black z-20 pointer-events-none"></div>

        {/* Shine effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent opacity-50 z-20 pointer-events-none"></div>
      </motion.div>

      {/* Shadow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[80%] h-4 bg-black/20 rounded-full blur-md z-0"></div>
    </div>
  )
}

// Add CSS to make backface-hidden work
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    .backface-hidden {
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }
  `
  document.head.appendChild(style)
}

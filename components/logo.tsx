"use client"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function Logo({
  variant = "default",
  size = "md",
  className,
}: {
  variant?: "default" | "icon" | "animated" | "enterprise";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  }

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  }

  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    hover: { 
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2 }
    }
  }

  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: 0.2
      }
    },
    hover: { 
      y: -2,
      transition: { duration: 0.2 }
    }
  }

  const gradientText = "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"

  if (variant === "icon") {
    return (
      <motion.div
        className={cn("flex items-center justify-center", className)}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
      >
        <motion.div
          className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-primary shadow-lg shadow-primary/20"
          variants={iconVariants}
        >
          <span className="text-primary-foreground font-bold text-lg">C</span>
        </motion.div>
      </motion.div>
    )
  }

  if (variant === "animated") {
    return (
      <motion.div
        className={cn("flex items-center gap-2", sizeClasses[size], className)}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
      >
        <motion.div
          className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-primary shadow-lg shadow-primary/20"
          variants={iconVariants}
        >
          <span className="text-primary-foreground font-bold text-lg">C</span>
        </motion.div>
        <motion.span 
          className="font-bold text-foreground"
          variants={textVariants}
        >
          oinvoice
        </motion.span>
      </motion.div>
    )
  }

  if (variant === "enterprise") {
    return (
      <motion.div
        className={cn("flex items-center gap-2", sizeClasses[size], className)}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
      >
        <motion.div
          className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-primary shadow-lg shadow-primary/20"
          variants={iconVariants}
        >
          <span className="text-primary-foreground font-bold text-lg">C</span>
        </motion.div>
        <div className="flex flex-col">
          <motion.span 
            className="font-bold text-foreground"
            variants={textVariants}
          >
            Coinvoice
          </motion.span>
          <motion.span 
            className="text-xs text-muted-foreground"
            variants={textVariants}
          >
            Enterprise
          </motion.span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={cn("flex items-center gap-2", sizeClasses[size], className)}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <motion.div
        className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-primary shadow-lg shadow-primary/20"
        variants={iconVariants}
      >
        <span className="text-primary-foreground font-bold text-lg">C</span>
      </motion.div>
      <motion.span 
        className="font-bold text-foreground"
        variants={textVariants}
      >
        oinvoice
      </motion.span>
    </motion.div>
  )
}
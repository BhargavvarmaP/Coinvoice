"use client"
import { motion } from "framer-motion"

export function Logo({
  variant = "default",
  size = "md",
}: {
  variant?: "default" | "icon" | "animated" | "enterprise";
  size?: "sm" | "md" | "lg"
}) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  }

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    hover: { scale: 1.03 }
  }

  const firstTextVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    hover: { x: -3 }
  }

  const secondTextVariants = {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    hover: { x: 3 }
  }

  // Updated letter animation
  const generateLetterVariants = (index: number) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    hover: { 
      scale: 1 + Math.cos(index * 0.5) * 0.2,
      rotate: Math.sin(index * 0.7) * 10,
      transition: {
        duration: 0.4,
        repeat: Infinity,
        repeatType: "reverse" as const,
      }
    }
  })

  // Handle different variants
  if (variant === "icon") {
    return (
      <motion.span
        className={`${sizeClasses[size]} font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent font-serif`}
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={containerVariants}
      >
        C
      </motion.span>
    )
  }

  if (variant === "animated") {
    const invoiceText = "invoice".split("");
    
    return (
      <motion.div
        className={`${sizeClasses[size]} flex items-center font-serif`}
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={containerVariants}
      >
        <motion.span
          variants={firstTextVariants}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent font-bold"
        >
          Co
        </motion.span>
        <div className="flex">
          {invoiceText.map((letter, i) => (
            <motion.span
              key={i}
              variants={generateLetterVariants(i)}
              transition={{ 
                duration: 0.5, 
                delay: 0.1 + i * 0.03 
              }}
              className="bg-gradient-to-r from-amber-500 to-yellow-400 bg-clip-text text-transparent"
            >
              {letter}
            </motion.span>
          ))}
        </div>
      </motion.div>
    )
  }

  if (variant === "enterprise") {
    return (
      <motion.div
        className={`${sizeClasses[size]} flex flex-col font-serif`}
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={containerVariants}
      >
        <div className="flex">
          <motion.span
            variants={firstTextVariants}
            className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent font-bold"
          >
            Co
          </motion.span>
          <motion.span
            variants={secondTextVariants}
            className="bg-gradient-to-r from-amber-500 to-yellow-400 bg-clip-text text-transparent"
          >
            invoice
          </motion.span>
        </div>
        <span className="text-xs text-blue-600 dark:text-blue-400 leading-tight tracking-wider">ENTERPRISE</span>
      </motion.div>
    )
  }

  // Default variant
  return (
    <motion.div
      className={`${sizeClasses[size]} flex items-center font-serif`}
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={containerVariants}
    >
      <motion.span
        variants={firstTextVariants}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent font-bold"
      >
        Co
      </motion.span>
      <motion.span
        variants={secondTextVariants}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-r from-amber-500 to-yellow-400 bg-clip-text text-transparent"
      >
        Invoice
      </motion.span>
    </motion.div>
  )
}
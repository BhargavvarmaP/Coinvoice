"use client"

import { useRef, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedBackgroundProps {
  className?: string
  variant?: "particles" | "gradient" | "waves" | "grid"
  intensity?: "light" | "medium" | "heavy"
  interactive?: boolean
  scrollEffect?: boolean
}

export function AnimatedBackground({
  className,
  variant = "particles",
  intensity = "medium",
  interactive = true,
  scrollEffect = true,
}: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    scrollEffect ? [0, 200] : [0, 0]
  )
  
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    scrollEffect ? [1, 0.6, 0.2] : [1, 1, 1]
  )

  // Intensity levels
  const intensityLevels = {
    light: { opacity: 0.1, scale: 0.8, count: 15 },
    medium: { opacity: 0.15, scale: 1, count: 25 },
    heavy: { opacity: 0.2, scale: 1.2, count: 40 },
  }

  // Particles background
  if (variant === "particles") {
    const count = intensityLevels[intensity].count
    const particles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }))

    return (
      <motion.div
        ref={containerRef}
        className={cn(
          "absolute inset-0 overflow-hidden pointer-events-none",
          className
        )}
        style={{ opacity, y }}
      >
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white dark:bg-blue-400"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: intensityLevels[intensity].opacity,
            }}
            animate={
              interactive
                ? {
                    x: [
                      Math.random() * 20 - 10,
                      Math.random() * 20 - 10,
                      Math.random() * 20 - 10,
                    ],
                    y: [
                      Math.random() * 20 - 10,
                      Math.random() * 20 - 10,
                      Math.random() * 20 - 10,
                    ],
                    scale: [1, 1.2, 1],
                    opacity: [
                      intensityLevels[intensity].opacity,
                      intensityLevels[intensity].opacity * 1.5,
                      intensityLevels[intensity].opacity,
                    ],
                  }
                : {}
            }
            transition={
              interactive
                ? {
                    duration: particle.duration,
                    repeat: Infinity,
                    delay: particle.delay,
                  }
                : {}
            }
          />
        ))}
      </motion.div>
    )
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
        animate={
          interactive
            ? {
                background: [
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)",
                  "linear-gradient(225deg, rgba(59, 130, 246, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)",
                  "linear-gradient(315deg, rgba(59, 130, 246, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)",
                  "linear-gradient(45deg, rgba(59, 130, 246, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)",
                ],
              }
            : {}
        }
        transition={
          interactive
            ? {
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }
            : {}
        }
      />
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
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,154.7C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="url(#gradient1)"
            animate={
              interactive
                ? {
                    d: [
                      "M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,154.7C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                      "M0,128L48,149.3C96,171,192,213,288,213.3C384,213,480,171,576,154.7C672,139,768,149,864,176C960,203,1056,245,1152,234.7C1248,224,1344,160,1392,128L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                      "M0,96L48,112C96,128,192,160,288,176C384,192,480,192,576,176C672,160,768,128,864,117.3C960,107,1056,117,1152,144C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                    ],
                  }
                : {}
            }
            transition={
              interactive
                ? {
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }
                : {}
            }
          />
          <motion.path
            d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,170.7C960,149,1056,107,1152,101.3C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="url(#gradient2)"
            animate={
              interactive
                ? {
                    d: [
                      "M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,170.7C960,149,1056,107,1152,101.3C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                      "M0,224L48,213.3C96,203,192,181,288,154.7C384,128,480,96,576,106.7C672,117,768,171,864,197.3C960,224,1056,224,1152,208C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                      "M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,165.3C672,171,768,213,864,218.7C960,224,1056,192,1152,186.7C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                    ],
                  }
                : {}
            }
            transition={
              interactive
                ? {
                    duration: 25,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }
                : {}
            }
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="0%"
                style={{
                  stopColor: "rgba(59, 130, 246, 0.1)",
                  stopOpacity: intensityLevels[intensity].opacity,
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor: "rgba(168, 85, 247, 0.1)",
                  stopOpacity: intensityLevels[intensity].opacity,
                }}
              />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="0%"
                style={{
                  stopColor: "rgba(168, 85, 247, 0.1)",
                  stopOpacity: intensityLevels[intensity].opacity,
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor: "rgba(59, 130, 246, 0.1)",
                  stopOpacity: intensityLevels[intensity].opacity,
                }}
              />
            </linearGradient>
          </defs>
        </svg>
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
        <div
          className={cn(
            "absolute inset-0 bg-grid-pattern",
            intensity === "light" && "opacity-[0.02]",
            intensity === "medium" && "opacity-[0.05]",
            intensity === "heavy" && "opacity-[0.08]"
          )}
          style={{
            backgroundSize: "40px 40px",
            backgroundImage:
              "linear-gradient(to right, rgba(59, 130, 246, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.2) 1px, transparent 1px)",
          }}
        />
        {interactive && (
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-transparent to-white dark:to-gray-900"
            animate={{
              opacity: [0.7, 0.9, 0.7],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        )}
      </motion.div>
    )
  }

  return null
}

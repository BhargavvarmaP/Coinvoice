"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ScrollNavigationItem {
  id: string
  label: string
}

interface ScrollNavigationProps {
  items: ScrollNavigationItem[]
  activeSection: string
  onSectionChange: (sectionId: string) => void
}

export function ScrollNavigation({ items, activeSection, onSectionChange }: ScrollNavigationProps) {
  // Animation variants for the navigation container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }
  
  // Animation variants for individual navigation items
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <motion.div 
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col items-center space-y-6">
        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="relative group"
          >
            <button
              onClick={() => onSectionChange(item.id)}
              className="relative flex items-center"
              aria-label={`Navigate to ${item.label} section`}
            >
              <span 
                className={cn(
                  "absolute right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap px-3 py-1 rounded-md text-sm font-medium",
                  "bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg"
                )}
              >
                {item.label}
              </span>
              <div 
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300 group-hover:scale-125",
                  activeSection === item.id 
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/30" 
                    : "bg-white/30 backdrop-blur-sm"
                )}
              />
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/30"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

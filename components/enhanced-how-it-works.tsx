"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientText } from "@/components/ui/gradient-text"
import { EnhancedBackground } from "@/components/ui/enhanced-background"
import { EnhancedCoin } from "@/components/ui/enhanced-coin"
import { cn } from "@/lib/utils"

export function EnhancedHowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 })
  
  const steps = [
    {
      number: "01",
      title: "Upload Invoice",
      description: "Upload your invoice to the platform. Our AI-powered system verifies the authenticity and details.",
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v4a1 1 0 001 1h4" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Tokenize",
      description: "Convert your invoice into a tradable digital asset (CVT) on the blockchain with a unique identifier.",
      icon: (
        <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12M8 12h8" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Trade or Finance",
      description: "List your tokenized invoice on the marketplace for trading or access immediate financing options.",
      icon: (
        <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
    },
    {
      number: "04",
      title: "Manage & Track",
      description: "Monitor your invoice status, payment timelines, and trading activity through the dashboard.",
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      <EnhancedBackground variant="waves" intensity="medium" />
      
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <GradientText gradient="blue-purple">Coinvoice</GradientText> Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our streamlined process makes invoice management and financing simple, secure, and efficient.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative"
        >
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-amber-500 hidden md:block" />
          
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className={cn(
                "flex flex-col md:flex-row items-center gap-8 mb-16 last:mb-0 relative",
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              )}
            >
              {/* Step number with pulse effect */}
              <div className={cn(
                "absolute left-1/2 transform -translate-x-1/2 z-10 hidden md:flex items-center justify-center",
                "w-12 h-12 rounded-full bg-white dark:bg-gray-900 shadow-lg"
              )}
              style={{ top: "calc(50% - 24px)" }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="absolute w-full h-full rounded-full bg-blue-500/30 animate-pulse" />
              </div>
              
              {/* Content side */}
              <div className={cn(
                "md:w-1/2 flex justify-center",
                index % 2 === 0 ? "md:justify-end md:pr-16" : "md:justify-start md:pl-16"
              )}>
                <GlassCard 
                  className="p-8 max-w-md w-full"
                  intensity="medium"
                  hoverEffect
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      {step.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                        Step {step.number}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
              
              {/* Visual side */}
              <div className={cn(
                "md:w-1/2 flex justify-center",
                index % 2 === 0 ? "md:justify-start md:pl-16" : "md:justify-end md:pr-16"
              )}>
                <div className="relative w-full max-w-sm aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl" />
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-900/30 dark:to-gray-900/10 backdrop-blur-sm border border-white/20 dark:border-white/10 flex items-center justify-center">
                    {index === 0 && (
                      <motion.div
                        animate={{
                          y: [0, -5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                        className="w-3/4 h-3/4"
                      >
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-700/30 flex flex-col items-center justify-center p-4">
                          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                          <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                          <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
                          <div className="w-full h-24 bg-blue-200 dark:bg-blue-800/30 rounded-lg flex items-center justify-center">
                            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {index === 1 && (
                      <div className="w-40 h-40">
                        <EnhancedCoin size="md" gradient="purple" symbol="CVT" />
                      </div>
                    )}
                    {index === 2 && (
                      <motion.div
                        animate={{
                          y: [0, -5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                        className="w-3/4 h-3/4"
                      >
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="h-16 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-xs">
                                CVT
                              </div>
                            </div>
                            <div className="h-16 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                          <div className="w-full h-8 mt-4 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                            <div className="w-3/4 h-2 bg-amber-500/50 rounded-full">
                              <div className="w-1/2 h-full bg-amber-500 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {index === 3 && (
                      <motion.div
                        animate={{
                          y: [0, -5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                        className="w-3/4 h-3/4"
                      >
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-700/30 flex flex-col items-center justify-center p-4">
                          <div className="w-full h-4 bg-blue-200 dark:bg-blue-700 rounded mb-4" />
                          <div className="grid grid-cols-2 gap-2 w-full mb-4">
                            <div className="h-16 bg-blue-200 dark:bg-blue-800/50 rounded flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                            <div className="h-16 bg-blue-200 dark:bg-blue-800/50 rounded flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="w-full h-24 bg-blue-200 dark:bg-blue-800/30 rounded flex items-center justify-center">
                            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

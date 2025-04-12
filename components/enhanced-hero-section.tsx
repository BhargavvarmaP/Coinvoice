"use client"

import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GradientText } from "@/components/ui/gradient-text"
import { EnhancedBackground } from "@/components/ui/enhanced-background"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function EnhancedHeroSection() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9])
  const y = useTransform(scrollYProgress, [0, 0.8], [0, 100])

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/dashboard")
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const features = [
    "Secure blockchain integration",
    "Instant tokenization",
    "Enterprise-grade security",
    "Real-time settlement"
  ]

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen pt-20 md:pt-28 pb-16 md:pb-24 overflow-hidden flex items-center"
    >
      {/* Enhanced backgrounds */}
      <EnhancedBackground variant="dots" intensity="light" />
      <EnhancedBackground variant="gradient" intensity="light" />
      
      <motion.div 
        style={{ opacity, scale, y }} 
        className="container px-4 md:px-6 mx-auto relative z-10"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Left column - Text content */}
          <div className="flex flex-col lg:col-span-7 items-center lg:items-start text-center lg:text-left">
            <motion.div variants={itemVariants} className="w-full">
              <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary">
                <span className="text-xs font-semibold tracking-wider uppercase">Enterprise Blockchain Solution</span>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight tracking-tight">
                <GradientText gradient="blue-purple" animate>
                  Streamline Invoice Management
                </GradientText>{" "}
                <span className="block mt-2">with Blockchain Technology</span>
              </h1>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-xl leading-relaxed">
                Coinvoice transforms traditional invoices into digital assets on the blockchain, 
                enabling faster payments, improved liquidity, and enhanced security for enterprises.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="w-full max-w-md">
              <div className="grid grid-cols-2 gap-3 mb-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <form onSubmit={handleSignUp} className="flex-1 sm:flex-initial flex gap-2 max-w-md">
                <Input
                  type="email"
                  placeholder="Enter your business email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full sm:w-auto min-w-[240px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
                />
                <Button type="submit" size="lg" className="shrink-0 shadow-lg">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="mt-8 flex items-center gap-6"
            >
              <div className="flex -space-x-2">
                {[
                  "https://randomuser.me/api/portraits/women/1.jpg",
                  "https://randomuser.me/api/portraits/men/1.jpg",
                  "https://randomuser.me/api/portraits/women/2.jpg",
                  "https://randomuser.me/api/portraits/men/2.jpg",
                ].map((src, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 overflow-hidden",
                      "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700"
                    )}
                    style={{ zIndex: 4 - i }}
                  >
                    <img src={src} alt={`User ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-primary flex items-center justify-center text-xs text-white font-medium" style={{ zIndex: 0 }}>
                  +2k
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Trusted by <span className="font-semibold">2,000+</span> businesses worldwide
              </div>
            </motion.div>
          </div>
          
          {/* Right column - Trade Finance Tokenization Image */}
          <motion.div 
            variants={itemVariants}
            className="flex justify-center lg:col-span-5"
          >
            <div className="relative">
              {/* Glowing effect behind the image */}
              <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-primary/10 to-transparent rounded-lg blur-xl" />
              
              {/* Main image container with animation */}
              <motion.div 
                className="relative z-10 rounded-lg overflow-hidden shadow-2xl border border-white/20 dark:border-gray-800/50"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Placeholder for the trade finance tokenization image */}
                <div className="relative w-full h-full aspect-square sm:aspect-video md:aspect-square max-w-md">
                  {/* Trade finance tokenization illustration */}
                  <div className="relative w-full h-full bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-xl p-6 overflow-hidden">
                    {/* Sparkle effects */}
                    <div className="absolute -inset-[40%] bg-gradient-conic from-purple-500/40 via-transparent to-blue-500/40 animate-spin-slow blur-2xl opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm" />

                    {/* Dashboard content */}
                    <div className="relative z-10 space-y-6">
                      {/* Header with balance */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard Overview</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Real-time metrics</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Total Balance</p>
                          <p className="text-2xl font-bold text-primary">$124,500.00</p>
                        </div>
                      </div>

                      {/* Analytics chart */}
                      <div className="h-32 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg relative overflow-hidden">
                        <div className="absolute bottom-0 inset-x-0 h-24">
                          <svg viewBox="0 0 100 25" preserveAspectRatio="none" className="w-full h-full">
                            <path d="M0 25h100V0c-20 8-40 15-60 15S20 8 0 0v25z" fill="currentColor" className="text-primary/20" />
                            <path d="M0 25h100V0c-20 8-40 12-60 12S20 8 0 0v25z" fill="currentColor" className="text-primary/30" />
                          </svg>
                        </div>
                        <div className="absolute top-4 right-4 px-2 py-1 bg-primary/90 rounded text-xs text-white">+12.5%</div>
                      </div>

                      {/* Recent transactions */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Invoice #1234</p>
                              <p className="text-xs text-gray-500">Processed</p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-green-500">+$2,500.00</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Invoice #1235</p>
                              <p className="text-xs text-gray-500">Pending</p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-blue-500">$1,800.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Blockchain graphic elements */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs font-medium text-white">Blockchain Verified</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Animated floating badges */}
              <motion.div
                className="absolute -bottom-6 -right-6 z-20"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="bg-blue-500 text-white text-xs rounded-full px-3 py-1.5 font-medium shadow-lg">
                  Built on Ethereum
                </div>
              </motion.div>
              
              <motion.div
                className="absolute -top-4 -left-4 z-20"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="bg-purple-500 text-white text-xs rounded-full px-3 py-1.5 font-medium shadow-lg">
                  Smart Contracts
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
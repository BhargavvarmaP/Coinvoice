"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientText } from "@/components/ui/gradient-text"
import { EnhancedBackground } from "@/components/ui/enhanced-background"
import { 
  CreditCard, 
  RefreshCw, 
  Shield, 
  LineChart, 
  Lock, 
  DollarSign,
  Zap,
  Globe
} from "lucide-react"

export function EnhancedFeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 })
  
  const features = [
    {
      icon: <CreditCard className="h-10 w-10 text-blue-600 dark:text-blue-500" />,
      title: "Invoice Tokenization",
      description: "Convert invoices into tradable tokens (CVT) with AI-powered verification.",
      gradient: "from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300",
    },
    {
      icon: <RefreshCw className="h-10 w-10 text-amber-500 dark:text-amber-400" />,
      title: "Marketplace Trading",
      description: "Buy and sell invoice tokens with transparent pricing and real-time updates.",
      gradient: "from-amber-600 to-amber-400 dark:from-amber-500 dark:to-amber-300",
    },
    {
      icon: <Shield className="h-10 w-10 text-purple-600 dark:text-purple-500" />,
      title: "Zero-Knowledge Payments",
      description: "Make private, secure payments with optional zero-knowledge proof technology.",
      gradient: "from-purple-600 to-purple-400 dark:from-purple-500 dark:to-purple-300",
    },
    {
      icon: <LineChart className="h-10 w-10 text-blue-600 dark:text-blue-500" />,
      title: "Real-time Analytics",
      description: "Track performance with interactive visualizations and actionable insights.",
      gradient: "from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300",
    },
    {
      icon: <Lock className="h-10 w-10 text-amber-500 dark:text-amber-400" />,
      title: "Cross-chain Bridge",
      description: "Seamlessly move assets across multiple blockchain networks.",
      gradient: "from-amber-600 to-amber-400 dark:from-amber-500 dark:to-amber-300",
    },
    {
      icon: <DollarSign className="h-10 w-10 text-purple-600 dark:text-purple-500" />,
      title: "CoinPoints Rewards",
      description: "Earn rewards for platform activity, redeemable for fee discounts and perks.",
      gradient: "from-purple-600 to-purple-400 dark:from-purple-500 dark:to-purple-300",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section id="features" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      <EnhancedBackground variant="grid" intensity="medium" />
      
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful <GradientText gradient="blue-purple">Enterprise-Grade</GradientText> Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our platform combines cutting-edge blockchain technology with enterprise-ready tools to transform
            how businesses manage invoices and payments.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} className="h-full">
              <GlassCard 
                className="h-full p-6 flex flex-col"
                intensity="medium"
                hoverEffect
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                }}
              >
                <div className="mb-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{feature.description}</p>
                <div className="mt-auto">
                  <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                    Learn more
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <GlassCard 
            className="p-8 max-w-4xl"
            intensity="light"
            borderGradient
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-4">
                  <GradientText gradient="blue-cyan" animate>
                    Enterprise Integration
                  </GradientText>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Seamlessly connect Coinvoice with your existing financial systems through our 
                  enterprise-grade API. Compatible with major ERP and accounting software.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    <div className="flex items-center">
                      <Zap className="w-3 h-3 mr-1" />
                      Real-time Sync
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                    <div className="flex items-center">
                      <Globe className="w-3 h-3 mr-1" />
                      Global Support
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm">
                    <div className="flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      SOC 2 Compliant
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg blur-xl" />
                <div className="relative bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm rounded-lg border border-white/20 dark:border-white/10 p-4 overflow-hidden">
                  <div className="flex items-center space-x-1 mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <pre className="text-xs text-gray-800 dark:text-gray-200 font-mono">
                    <code>
                      {`// Example API integration
const coinvoice = new Coinvoice({
  apiKey: process.env.COINVOICE_API_KEY,
});

// Create tokenized invoice
const invoice = await coinvoice.invoices.create({
  amount: 1250.00,
  currency: "USD",
  customer: "cus_12345",
  dueDate: "2025-05-15",
});

// Get marketplace rates
const rates = await coinvoice.marketplace.getRates();`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}

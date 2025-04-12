"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Check } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientText } from "@/components/ui/gradient-text"
import { EnhancedBackground } from "@/components/ui/enhanced-background"
import { Button } from "@/components/ui/button"

export function EnhancedPricing() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 })

  const plans = [
    {
      name: "Basic",
      description: "Perfect for small businesses and startups",
      price: "$99",
      period: "per month",
      gradient: "from-blue-600 to-blue-400",
      features: [
        "Up to 100 invoices per month",
        "Basic invoice tokenization",
        "Standard marketplace access",
        "Email support",
        "Basic analytics",
      ],
    },
    {
      name: "Pro",
      description: "Ideal for growing companies",
      price: "$299",
      period: "per month",
      gradient: "from-purple-600 to-purple-400",
      popular: true,
      features: [
        "Up to 1,000 invoices per month",
        "Advanced invoice tokenization",
        "Priority marketplace access",
        "24/7 priority support",
        "Advanced analytics",
        "Custom integrations",
        "Multi-user access",
      ],
    },
    {
      name: "Enterprise",
      description: "For large organizations",
      price: "Custom",
      period: "contact us",
      gradient: "from-amber-600 to-amber-400",
      features: [
        "Unlimited invoices",
        "Custom tokenization solutions",
        "Dedicated marketplace",
        "Dedicated account manager",
        "Enterprise analytics",
        "Custom development",
        "SLA guarantees",
        "On-premise deployment",
      ],
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
    <section id="pricing" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      <EnhancedBackground variant="waves" intensity="medium" />
      
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, <GradientText gradient="blue-purple">Transparent</GradientText> Pricing
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choose the perfect plan for your business with our straightforward pricing options.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {plans.map((plan, index) => (
            <motion.div key={index} variants={itemVariants} className="h-full">
              <GlassCard 
                className="h-full p-8 relative flex flex-col"
                intensity={plan.popular ? "heavy" : "medium"}
                hoverEffect
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                }}
              >
                {plan.popular && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{plan.description}</p>
                </div>
                <div className="mb-8">
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-400 mb-1">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full bg-gradient-to-r ${plan.gradient} text-white hover:opacity-90 transition-opacity`}
                  size="lg"
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </Button>
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
            className="p-8 max-w-4xl text-center"
            intensity="light"
            borderGradient
          >
            <h3 className="text-2xl font-bold mb-4">
              <GradientText gradient="blue-purple" animate>
                Enterprise Solutions
              </GradientText>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Need a custom solution? Our enterprise plan is tailored to your specific needs.
              Get in touch with our sales team for a personalized demo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline">
                Schedule Demo
              </Button>
              <Button size="lg">
                Contact Sales
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}
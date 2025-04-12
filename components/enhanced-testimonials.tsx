"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Star } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientText } from "@/components/ui/gradient-text"
import { EnhancedBackground } from "@/components/ui/enhanced-background"

export function EnhancedTestimonials() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 })

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CFO, TechCorp Inc.",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      rating: 5,
      quote: "Coinvoice has revolutionized our invoice management process. The blockchain integration provides unmatched security and transparency.",
      gradient: "from-blue-600 to-blue-400",
    },
    {
      name: "Michael Chen",
      role: "Finance Director, InnovateCo",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      rating: 5,
      quote: "The tokenization feature has helped us unlock capital from outstanding invoices faster than ever before.",
      gradient: "from-purple-600 to-purple-400",
    },
    {
      name: "Emma Davis",
      role: "CEO, Global Trade Ltd",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      rating: 5,
      quote: "Real-time analytics and cross-chain capabilities give us unprecedented control over our financial operations.",
      gradient: "from-amber-600 to-amber-400",
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
    <section id="testimonials" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      <EnhancedBackground variant="dots" intensity="medium" />
      
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by <GradientText gradient="blue-purple">Industry Leaders</GradientText>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See what our enterprise customers say about their experience with Coinvoice.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <GlassCard 
                className="h-full p-6"
                intensity="medium"
                hoverEffect
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-20`} />
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="relative z-10 w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                
                <blockquote className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.quote}"
                </blockquote>
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
                Join 2,000+ Businesses
              </GradientText>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Transform your invoice management today with enterprise-grade blockchain technology.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
              Get Started Now
            </button>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}
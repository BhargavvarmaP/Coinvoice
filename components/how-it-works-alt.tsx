"use client"

import { motion } from "framer-motion"
import { CheckCircle, CreditCard, FileText, Send, ArrowRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const steps = [
  {
    icon: <FileText className="h-10 w-10 text-white" />,
    title: "Create Invoice",
    description:
      "Generate professional invoices in seconds with our intuitive interface. Add your branding, itemize services, and set payment terms.",
  },
  {
    icon: <Send className="h-10 w-10 text-white" />,
    title: "Send to Client",
    description:
      "Deliver invoices directly to clients via email or shareable link. They'll receive a professional, branded invoice with clear payment instructions.",
  },
  {
    icon: <CreditCard className="h-10 w-10 text-white" />,
    title: "Get Paid",
    description:
      "Accept payments in multiple currencies and cryptocurrencies. Funds are securely transferred to your preferred account.",
  },
  {
    icon: <CheckCircle className="h-10 w-10 text-white" />,
    title: "Track Everything",
    description:
      "Monitor payment status, send reminders, and generate reports. Keep your finances organized with our comprehensive dashboard.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

export function HowItWorksAlt() {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/80">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 text-white px-4 py-1 rounded-full text-sm font-medium">
              Simple & Secure
            </div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent"
          >
            How Coinvoice Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Our streamlined process makes invoicing and getting paid easier than ever before
          </motion.p>
        </div>

        <div className="relative">
          {/* Process flow line */}
          <div className="hidden lg:block absolute top-1/2 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-1 bg-gradient-to-r from-blue-600/20 via-blue-500 to-blue-600/20 -translate-y-1/2 rounded-full" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col items-center text-center relative z-10"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="mb-6 p-4 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 shadow-lg dark:shadow-blue-500/20 border border-blue-300/20">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 bg-card rounded-2xl p-8 shadow-xl border border-border flex flex-col md:flex-row items-center gap-8"
        >
          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent">
              Ready to streamline your invoicing?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of businesses that use Coinvoice to simplify their invoicing process and get paid faster.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all">
                Get Started Free
              </Button>
              <Button
                variant="outline"
                className="border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="aspect-video relative rounded-lg overflow-hidden shadow-lg border border-border group">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Coinvoice Dashboard Preview"
                width={600}
                height={400}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                <div className="p-4 text-white">
                  <p className="font-medium flex items-center gap-2">
                    See how easy it is to use Coinvoice
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-600/20 to-blue-400/20 dark:from-blue-500/20 dark:to-blue-300/20 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-yellow-400/20 dark:from-amber-400/20 dark:to-yellow-300/20 rounded-full blur-xl" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

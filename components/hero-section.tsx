"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const router = useRouter()

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background/90 z-0" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-20 -left-20 w-60 h-60 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-20 w-40 h-40 bg-amber-500/10 dark:bg-amber-500/20 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="gradient-text-blue">Revolutionize</span> Your Invoice Management
            </h1>
            <p className="text-xl text-foreground/70 mb-8 max-w-lg">
              Coinvoice transforms traditional invoicing with blockchain technology, enabling faster payments, secure
              trading, and real-time analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => router.push("/dashboard")} className="btn-gradient-primary">
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push("#how-it-works")}>
                Learn More
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600/80 to-blue-400/80 dark:from-blue-500/80 dark:to-blue-300/80 flex items-center justify-center border-2 border-background"
                  >
                    <span className="text-white text-xs font-bold">{i}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-foreground/70">
                <span className="font-bold text-foreground">500+</span> businesses already using Coinvoice
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto lg:max-w-none">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl" />
              <div className="relative glassmorphism rounded-3xl p-4 md:p-6 shadow-xl overflow-hidden">
                <div className="bg-background/80 dark:bg-background/40 rounded-2xl p-4 md:p-6 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-bold text-lg">Invoice Dashboard</h3>
                      <p className="text-sm text-foreground/70">Real-time overview</p>
                    </div>
                    <div className="bg-blue-500/10 dark:bg-blue-500/20 rounded-full px-3 py-1">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Live Demo</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Dashboard preview elements */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 dark:bg-muted/30 rounded-lg p-3">
                        <div className="text-sm text-foreground/70 mb-1">Total Invoices</div>
                        <div className="text-2xl font-bold">$24,500</div>
                        <div className="text-xs text-green-500 mt-1">+12.5% this month</div>
                      </div>
                      <div className="bg-muted/50 dark:bg-muted/30 rounded-lg p-3">
                        <div className="text-sm text-foreground/70 mb-1">Tokenized</div>
                        <div className="text-2xl font-bold">$18,200</div>
                        <div className="text-xs text-green-500 mt-1">+8.3% this month</div>
                      </div>
                    </div>

                    <div className="bg-muted/50 dark:bg-muted/30 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium">Recent Activity</div>
                        <div className="text-xs text-foreground/70">View All</div>
                      </div>
                      <div className="space-y-2">
                        {[
                          { title: "Invoice #1092 tokenized", time: "2 hours ago", amount: "+$3,200" },
                          { title: "Payment received", time: "5 hours ago", amount: "+$1,800" },
                          { title: "New invoice created", time: "Yesterday", amount: "+$4,500" },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center py-1 border-b border-border/50 last:border-0"
                          >
                            <div>
                              <div className="text-sm">{item.title}</div>
                              <div className="text-xs text-foreground/70">{item.time}</div>
                            </div>
                            <div className="text-sm font-medium text-green-500">{item.amount}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-muted/50 dark:bg-muted/30 rounded-lg p-3 h-24 flex items-center justify-center">
                      <div className="w-full h-16 flex items-end justify-around px-2">
                        {[40, 65, 45, 70, 85, 60, 75].map((height, i) => (
                          <div
                            key={i}
                            className="w-4 bg-gradient-to-t from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 rounded-sm"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -bottom-6 -left-10 md:-left-20 glassmorphism rounded-xl p-3 shadow-lg gradient-bg-blue"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium">Payment Verified</div>
                  <div className="text-xs text-foreground/70">Invoice #1092</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute -top-6 -right-10 md:-right-20 glassmorphism rounded-xl p-3 shadow-lg gradient-bg-purple"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-600 dark:text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium">Instant Payout</div>
                  <div className="text-xs text-foreground/70">$3,200 received</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Trusted by section */}
        <div className="mt-16 md:mt-24">
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-foreground/70">TRUSTED BY INNOVATIVE COMPANIES</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 opacity-50 hover:opacity-100 transition-opacity">
                <div className="w-24 h-8 bg-foreground/20 dark:bg-foreground/10 rounded-md"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

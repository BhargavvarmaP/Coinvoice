"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  DollarSign, 
  LineChart, 
  Shield, 
  Link, 
  TrendingUp, 
  BarChart3, 
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function EnhancedBusinessSolutions() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  const solutions = [
    {
      id: "liquidity",
      title: "Liquidity & Working Capital",
      icon: DollarSign,
      description: "Transform unpaid invoices into immediate funding",
      summary: "Access instant liquidity by converting your unpaid invoices into tradable tokens.",
      benefits: [
        "Convert unpaid invoices into tradable tokens for instant funding",
        "Access global capital through our marketplace",
        "Financial inclusion for SMEs in emerging markets"
      ],
      features: "Invoice Tokenization • Marketplace • Cross-Chain Bridge",
      color: "from-blue-500/20 to-blue-600/20",
      category: "finance"
    },
    {
      id: "cost-reduction",
      title: "Cost Reduction & Efficiency",
      icon: LineChart,
      description: "Lower costs and streamline operations",
      summary: "Reduce operational costs and improve efficiency with blockchain-powered solutions.",
      benefits: [
        "Lower financing costs by removing intermediaries",
        "Subsecond finality for real-time B2B payments",
        "Efficient cross-border payments without delays"
      ],
      features: "Real-time Settlement • Blockchain Ledger • Gas-efficient",
      color: "from-green-500/20 to-green-600/20",
      category: "finance"
    },
    {
      id: "trust",
      title: "Trust, Risk & Compliance",
      icon: Shield,
      description: "Secure and compliant transactions",
      summary: "Ensure security and compliance with advanced blockchain technology.",
      benefits: [
        "Private transactions with Zero-Knowledge Proofs",
        "AI-driven credit risk analysis",
        "Integrated KYC/AML compliance"
      ],
      features: "ZKPs • Compliance • Blockchain Transparency",
      color: "from-purple-500/20 to-purple-600/20",
      category: "security"
    },
    {
      id: "supply-chain",
      title: "Supply Chain Optimization",
      icon: Link,
      description: "Streamline your supply chain operations",
      summary: "Optimize your supply chain with automated payments and tracking.",
      benefits: [
        "Smart contract-powered automated payments",
        "Instant supplier settlements",
        "Streamlined supply chain workflows"
      ],
      features: "Smart Contracts • Automation • Instant Payments",
      color: "from-amber-500/20 to-amber-600/20",
      category: "operations"
    },
    {
      id: "investor",
      title: "Investor Growth & Transparency",
      icon: TrendingUp,
      description: "Transparent investment opportunities",
      summary: "Attract investors with transparent token pricing and risk assessment.",
      benefits: [
        "Transparent token pricing and risk metadata",
        "Cross-chain DeFi integration",
        "Closed-loop token ecosystem"
      ],
      features: "Marketplace • Cross-Chain • Analytics",
      color: "from-rose-500/20 to-rose-600/20",
      category: "finance"
    },
    {
      id: "insights",
      title: "Operational Insights & Data",
      icon: BarChart3,
      description: "Data-driven decision making",
      summary: "Make informed decisions with real-time analytics and insights.",
      benefits: [
        "Real-time financial dashboards",
        "Streamlined operational workflows",
        "Comprehensive analytics engine"
      ],
      features: "Analytics • Microservices • Dashboard",
      color: "from-cyan-500/20 to-cyan-600/20",
      category: "operations"
    }
  ]

  const filteredSolutions = activeTab === "all" 
    ? solutions 
    : solutions.filter(solution => solution.category === activeTab)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100
      }
    }
  }

  const cardVariants = {
    hover: {
      scale: 1.02,
      rotateY: 5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.98,
      rotateY: 0,
      transition: {
        duration: 0.2
      }
    }
  }

  const iconVariants = {
    hover: {
      scale: 1.15,
      rotate: 5,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.95,
      rotate: -5,
      transition: {
        duration: 0.1
      }
    }
  }

  const glowVariants = {
    hover: {
      opacity: 0.8,
      scale: 1.2,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    initial: {
      opacity: 0.5,
      scale: 1
    }
  }

  const expandVariants = {
    initial: { height: 0, opacity: 0 },
    animate: { 
      height: "auto", 
      opacity: 1,
      transition: {
        height: {
          duration: 0.4,
          ease: "easeOut"
        },
        opacity: {
          duration: 0.25,
          delay: 0.1
        }
      }
    },
    exit: { 
      height: 0, 
      opacity: 0,
      transition: {
        height: {
          duration: 0.3,
          ease: "easeIn"
        },
        opacity: {
          duration: 0.2
        }
      }
    }
  }

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id)
  }

  return (
    <section className="py-24 bg-gradient-to-b from-background via-background/80 to-muted/50 relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-primary/5 to-transparent opacity-30"></div>
      </div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div 
          className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Badge 
            variant="outline" 
            className="px-4 py-1 backdrop-blur-sm bg-background/50 border-primary/20"
          >
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            Business Solutions
          </Badge>
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
              Transform Your Business
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover how Coinvoice can revolutionize your operations with blockchain technology
            </p>
          </div>
        </motion.div>

        <div className="mb-10">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary/10">All Solutions</TabsTrigger>
              <TabsTrigger value="finance" className="data-[state=active]:bg-primary/10">Finance</TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-primary/10">Security</TabsTrigger>
              <TabsTrigger value="operations" className="data-[state=active]:bg-primary/10">Operations</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <motion.div 
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {filteredSolutions.map((solution) => (
            <motion.div 
              key={solution.id} 
              variants={itemVariants}
              onHoverStart={() => setHoveredCard(solution.id)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Card 
                  className={`group relative overflow-hidden transition-all duration-300 backdrop-blur-sm bg-background/80 border-primary/10 hover:border-primary/20 h-full flex flex-col cursor-pointer perspective-1000
                    ${expandedCard === solution.id ? 'ring-2 ring-primary/30 shadow-lg shadow-primary/5' : 'hover:shadow-xl hover:shadow-primary/10'}
                    ${hoveredCard === solution.id ? 'transform-gpu' : ''}`}
                  onClick={() => toggleCard(solution.id)}
                >
                  {/* Animated glow effect */}
                  <motion.div 
                    className={`absolute -inset-1 bg-gradient-to-r ${solution.color} rounded-2xl blur-xl`}
                    variants={glowVariants}
                    initial="initial"
                    animate={hoveredCard === solution.id ? "hover" : "initial"}
                  />
                  
                  {/* Background gradient */}
                  <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${solution.color} rounded-full -mr-20 -mt-20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12`}></div>
                  
                  <CardHeader className="relative z-10">
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center gap-3">
                        <motion.div 
                          className="p-3 rounded-xl bg-primary/10 backdrop-blur-sm border border-primary/20 shadow-inner"
                          variants={iconVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <solution.icon className="h-5 w-5 text-primary drop-shadow" />
                        </motion.div>
                        <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                          {solution.title}
                        </span>
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 transition-all duration-300 hover:bg-primary/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCard(solution.id);
                        }}
                      >
                        <motion.div
                          animate={{ 
                            rotate: expandedCard === solution.id ? 180 : 0,
                            scale: hoveredCard === solution.id ? 1.1 : 1
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.div>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{solution.description}</p>
                    <div className="mt-3 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg backdrop-blur-sm border border-primary/10 shadow-inner">
                      <p className="text-sm font-medium text-foreground/90 leading-relaxed">{solution.summary}</p>
                    </div>
                  </CardHeader>

                  <AnimatePresence>
                    {expandedCard === solution.id && (
                      <motion.div
                        variants={expandVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="overflow-hidden"
                      >
                        <CardContent className="pt-2 relative z-10">
                          <motion.ul 
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {solution.benefits.map((benefit, index) => (
                              <motion.li 
                                key={index} 
                                className="flex items-start gap-3 group/item"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                              >
                                <div className="rounded-full p-1 bg-primary/10 group-hover/item:bg-primary/20 transition-colors">
                                  <CheckCircle2 className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-sm text-foreground/80 group-hover/item:text-foreground transition-colors">
                                  {benefit}
                                </span>
                              </motion.li>
                            ))}
                          </motion.ul>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <CardFooter className="flex flex-col items-start gap-4 mt-auto pt-6 relative z-10">
                    <div className="w-full">
                      <p className="text-xs font-semibold text-primary/80 tracking-wider mb-2">FEATURES</p>
                      <div className="flex flex-wrap gap-2">
                        {solution.features.split(" • ").map((feature, index) => (
                          <Badge 
                            key={index}
                            variant="secondary" 
                            className="bg-gradient-to-r from-primary/10 to-primary/5 text-primary hover:from-primary/20 hover:to-primary/10 transition-all duration-300 border-primary/20 shadow-sm"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 hover:from-primary/20 hover:via-primary/10 hover:to-primary/20 transition-all duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="relative z-10 font-medium">Learn More</span>
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1 relative z-10" />
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 
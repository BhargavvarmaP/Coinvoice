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
  Sparkles,
  Wallet,
  TrendingDown,
  Network,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LucideIcon } from "lucide-react"

// Add type definition for solution IDs
type SolutionId = 'liquidity' | 'cost-reduction' | 'trust' | 'supply-chain' | 'investor' | 'insights';

interface Solution {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  summary?: string;
  benefits?: string[];
  category?: string;
  color?: string;
  gradient?: string;
  border?: string;
}

export function EnhancedBusinessSolutions() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  const solutions: Solution[] = [
    {
      id: 'liquidity',
      title: 'Liquidity Solutions',
      description: 'Access working capital and optimize cash flow with our flexible financing solutions.',
      icon: Wallet,
      features: [
        'Early payments on approved invoices',
        'Supply chain financing',
        'Dynamic discounting programs',
        'Working capital optimization'
      ],
      summary: 'Access flexible financing solutions to optimize your working capital.',
      benefits: [
        'Immediate access to working capital',
        'Flexible payment terms',
        'Competitive rates',
        'Automated approval process'
      ],
      category: 'finance',
      color: 'from-blue-500/20 to-blue-600/20',
      gradient: 'bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-blue-700/10',
      border: 'border-blue-500/20'
    },
    {
      id: 'cost-reduction',
      title: 'Cost Reduction',
      description: 'Optimize your operational costs with our advanced analytics and automation tools.',
      icon: TrendingDown,
      features: [
        'Process automation',
        'Cost analytics',
        'Spend optimization',
        'Vendor management'
      ],
      summary: 'Lower costs and improve efficiency with data-driven solutions.',
      benefits: [
        'Reduced operational costs',
        'Improved process efficiency',
        'Better vendor relationships',
        'Data-driven decisions'
      ],
      category: 'operations',
      color: 'from-green-500/20 to-green-600/20',
      gradient: 'bg-gradient-to-br from-green-500/10 via-green-600/5 to-green-700/10',
      border: 'border-green-500/20'
    },
    {
      id: 'trust',
      title: 'Trust & Security',
      description: 'Ensure secure and transparent transactions with our blockchain-based solutions.',
      icon: Shield,
      features: [
        'Blockchain verification',
        'Smart contracts',
        'Audit trails',
        'Secure payments'
      ],
      summary: 'Ensure security and compliance with advanced blockchain technology.',
      benefits: [
        'Enhanced security measures',
        'Regulatory compliance',
        'Transaction transparency',
        'Real-time verification'
      ],
      category: 'security',
      color: 'from-purple-500/20 to-purple-600/20',
      gradient: 'bg-gradient-to-br from-purple-500/10 via-purple-600/5 to-purple-700/10',
      border: 'border-purple-500/20'
    },
    {
      id: 'supply-chain',
      title: 'Supply Chain Solutions',
      description: 'Streamline your supply chain operations with end-to-end visibility and control.',
      icon: Network,
      features: [
        'Supply chain visibility',
        'Inventory management',
        'Supplier onboarding',
        'Order tracking'
      ],
      summary: 'Optimize your supply chain with automated tracking and management.',
      benefits: [
        'End-to-end visibility',
        'Automated workflows',
        'Real-time tracking',
        'Supplier collaboration'
      ],
      category: 'operations',
      color: 'from-teal-500/20 to-teal-600/20',
      gradient: 'bg-gradient-to-br from-teal-500/10 via-teal-600/5 to-teal-700/10',
      border: 'border-teal-500/20'
    },
    {
      id: 'investor',
      title: 'Investor Relations',
      description: 'Connect with global investors and access new funding opportunities.',
      icon: Users,
      features: [
        'Investor matching',
        'Portfolio management',
        'Performance analytics',
        'Reporting tools'
      ],
      summary: 'Build stronger relationships with investors through transparency and insights.',
      benefits: [
        'Global investor network',
        'Transparent reporting',
        'Performance tracking',
        'Investment opportunities'
      ],
      category: 'finance',
      color: 'from-rose-500/20 to-rose-600/20',
      gradient: 'bg-gradient-to-br from-rose-500/10 via-rose-600/5 to-rose-700/10',
      border: 'border-rose-500/20'
    },
    {
      id: 'insights',
      title: 'Business Insights',
      description: 'Make data-driven decisions with our advanced analytics and reporting tools.',
      icon: LineChart,
      features: [
        'Performance metrics',
        'Market analysis',
        'Predictive analytics',
        'Custom reporting'
      ],
      summary: 'Make informed decisions with real-time analytics and insights.',
      benefits: [
        'Data-driven insights',
        'Custom dashboards',
        'Market intelligence',
        'Trend analysis'
      ],
      category: 'operations',
      color: 'from-cyan-500/20 to-cyan-600/20',
      gradient: 'bg-gradient-to-br from-cyan-500/10 via-cyan-600/5 to-cyan-700/10',
      border: 'border-cyan-500/20'
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

  const getButtonStyles = (id: SolutionId) => {
    const styles: Record<SolutionId, string> = {
      liquidity: 'bg-blue-500/90 hover:bg-blue-500 border-blue-400/20',
      'cost-reduction': 'bg-green-500/90 hover:bg-green-500 border-green-400/20',
      trust: 'bg-purple-500/90 hover:bg-purple-500 border-purple-400/20',
      'supply-chain': 'bg-teal-500/90 hover:bg-teal-500 border-teal-400/20',
      investor: 'bg-rose-500/90 hover:bg-rose-500 border-rose-400/20',
      insights: 'bg-cyan-500/90 hover:bg-cyan-500 border-cyan-400/20'
    }
    return styles[id] || 'bg-primary/90 hover:bg-primary'
  }

  const getBadgeStyles = (id: SolutionId) => {
    const styles: Record<SolutionId, string> = {
      liquidity: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100/50 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-400/20',
      'cost-reduction': 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100/50 dark:bg-green-500/10 dark:text-green-300 dark:border-green-400/20',
      trust: 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100/50 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-400/20',
      'supply-chain': 'bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100/50 dark:bg-teal-500/10 dark:text-teal-300 dark:border-teal-400/20',
      investor: 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100/50 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-400/20',
      insights: 'bg-cyan-50 text-cyan-600 border-cyan-100 hover:bg-cyan-100/50 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-400/20'
    }
    return styles[id] || 'bg-primary-50 text-primary-600 border-primary-100 hover:bg-primary-100/50'
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
                  className={`group relative overflow-hidden transition-all duration-300 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 ${solution.border} hover:border-primary/30 h-full flex flex-col cursor-pointer rounded-3xl
                    ${expandedCard === solution.id ? 'ring-1 ring-primary/20 shadow-lg' : 'hover:shadow-lg hover:shadow-primary/5'}
                    ${hoveredCard === solution.id ? 'transform-gpu scale-[1.01]' : ''}`}
                  onClick={() => toggleCard(solution.id)}
                >
                  {/* Soft background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-primary/5 dark:from-gray-900/40 dark:to-primary/5 rounded-3xl"></div>
                  
                  {/* Top accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${solution.gradient} rounded-t-3xl opacity-50`}></div>
                  
                  <CardHeader className="relative z-10 p-6">
                    <div className="flex justify-between items-start space-x-4">
                      <CardTitle className="flex items-start gap-4">
                        <motion.div 
                          className={`p-3 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-800`}
                          variants={iconVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <solution.icon className="h-5 w-5 text-primary" />
                        </motion.div>
                        <div className="space-y-1.5">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {solution.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {solution.description}
                          </p>
                        </div>
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </motion.div>
                      </Button>
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {solution.summary}
                      </p>
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
                        <CardContent className="px-6 pb-4 relative z-10">
                          <motion.ul 
                            className="space-y-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {solution.benefits?.map((benefit, index) => (
                              <motion.li 
                                key={index} 
                                className="flex items-start gap-3 group/item"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                              >
                                <div className="rounded-full p-1.5 bg-primary/10 group-hover/item:bg-primary/20 transition-colors mt-0.5">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-300 group-hover/item:text-gray-900 dark:group-hover/item:text-gray-100 transition-colors">
                                  {benefit}
                                </span>
                              </motion.li>
                            ))}
                          </motion.ul>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <CardFooter className="flex flex-col items-start gap-4 mt-auto p-6 relative z-10 border-t border-gray-100 dark:border-gray-800">
                    <div className="w-full space-y-3">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase">Features</p>
                      <div className="flex flex-wrap gap-2">
                        {solution.features.map((feature, index) => (
                          <Badge 
                            key={index}
                            variant="secondary" 
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border backdrop-blur-sm
                              ${getBadgeStyles(solution.id as SolutionId)}`}
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      variant="secondary"
                      className={`w-full group/btn relative overflow-hidden transition-all duration-300 h-10 rounded-lg font-medium text-sm border backdrop-blur-sm text-white shadow-sm
                        ${getButtonStyles(solution.id as SolutionId)}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Learn More
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                      </span>
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
"use client"

import { Label } from "@/components/ui/label"
import type React from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle,
  CreditCard,
  DollarSign,
  FileText,
  LineChart,
  Lock,
  RefreshCw,
  Shield,
  ChevronDown,
  Menu,
  X,
  ArrowUpRight,
  Globe,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Canvas } from "@react-three/fiber"
import { useGLTF, PresentationControls, Float, Environment } from "@react-three/drei"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 3D Model Component
function CoinModel(props: any) {
  const [modelError, setModelError] = useState(false)
  const { scene } = useGLTF("/assets/3d/duck.glb") || { scene: null }

  // Use a try-catch block to handle loading errors
  try {
    // If scene is available, render it
    if (scene && !modelError) {
      return <primitive object={scene} {...props} />
    } else {
      // If no scene, return a simple mesh as fallback (THREE compatible)
      return (
        <mesh {...props}>
          <cylinderGeometry args={[1, 1, 0.2, 32]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
        </mesh>
      )
    }
  } catch (error) {
    // Log error and use fallback
    console.error("Error loading 3D model:", error)
    if (!modelError) setModelError(true)
    return (
      <mesh {...props}>
        <cylinderGeometry args={[1, 1, 0.2, 32]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
      </mesh>
    )
  }
}

// Fallback for when 3D isn't available - this is outside the Canvas
function CoinFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 animate-spin-slow flex items-center justify-center text-white font-bold text-xl">
        CVT
      </div>
    </div>
  )
}

export function LandingPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [canRender3D, setCanRender3D] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  const pricingRef = useRef<HTMLDivElement>(null)

  // Check if we can render 3D content
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      setCanRender3D(!!gl)
    } catch (e) {
      setCanRender3D(false)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)

      // Determine active section based on scroll position
      const scrollPosition = window.scrollY + 100

      if (heroRef.current && scrollPosition < heroRef.current.offsetTop + heroRef.current.offsetHeight) {
        setActiveSection("hero")
      } else if (
        featuresRef.current &&
        scrollPosition < featuresRef.current.offsetTop + featuresRef.current.offsetHeight
      ) {
        setActiveSection("features")
      } else if (
        howItWorksRef.current &&
        scrollPosition < howItWorksRef.current.offsetTop + howItWorksRef.current.offsetHeight
      ) {
        setActiveSection("how-it-works")
      } else if (
        testimonialsRef.current &&
        scrollPosition < testimonialsRef.current.offsetTop + testimonialsRef.current.offsetHeight
      ) {
        setActiveSection("testimonials")
      } else if (pricingRef.current) {
        setActiveSection("pricing")
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/dashboard")
  }

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      })
    }
    setMobileMenuOpen(false)
  }

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
      description: "Track performance with interactive 3D visualizations and actionable insights.",
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

  const pricingPlans = [
    {
      name: "Starter",
      price: "$0",
      description: "Perfect for small businesses just getting started with invoice tokenization.",
      features: ["Up to 10 invoices per month", "Basic analytics", "Standard marketplace access", "Email support"],
      cta: "Start Free",
      popular: false,
      gradient: "from-gray-500 to-gray-400 dark:from-gray-600 dark:to-gray-500",
    },
    {
      name: "Professional",
      price: "$49",
      period: "/month",
      description: "Ideal for growing businesses with regular invoice needs.",
      features: [
        "Up to 100 invoices per month",
        "Advanced analytics",
        "Priority marketplace listing",
        "Priority support",
        "Custom branding",
      ],
      cta: "Start 14-Day Trial",
      popular: true,
      gradient: "from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with high-volume invoice processing needs.",
      features: [
        "Unlimited invoices",
        "Enterprise analytics",
        "Premium marketplace features",
        "Dedicated account manager",
        "Custom integration",
        "SLA guarantees",
      ],
      cta: "Contact Sales",
      popular: false,
      gradient: "from-purple-600 to-purple-400 dark:from-purple-500 dark:to-purple-300",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Navigation */}
      <header
        className={cn(
          "fixed w-full z-50 px-4 lg:px-6 h-16 flex items-center transition-all duration-200",
          scrolled
            ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
            : "bg-transparent border-transparent",
        )}
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#features"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("features")
              }}
              className={cn(
                "text-sm font-medium transition-colors relative",
                activeSection === "features"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400",
              )}
            >
              Features
              {activeSection === "features" && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </Link>
            <Link
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("how-it-works")
              }}
              className={cn(
                "text-sm font-medium transition-colors relative",
                activeSection === "how-it-works"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400",
              )}
            >
              How It Works
              {activeSection === "how-it-works" && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </Link>
            <Link
              href="#pricing"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("pricing")
              }}
              className={cn(
                "text-sm font-medium transition-colors relative",
                activeSection === "pricing"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400",
              )}
            >
              Pricing
              {activeSection === "pricing" && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </Link>
            <Link
              href="#testimonials"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("testimonials")
              }}
              className={cn(
                "text-sm font-medium transition-colors relative",
                activeSection === "testimonials"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400",
              )}
            >
              Testimonials
              {activeSection === "testimonials" && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden md:block">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Log In
              </Button>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
              onClick={() => router.push("/dashboard")}
            >
              Get Started
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 z-40 bg-white dark:bg-gray-950 md:hidden"
          >
            <div className="flex flex-col h-full pt-16 p-4">
              <div className="absolute top-4 right-4">
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-col gap-2 mt-8">
                <Link
                  href="#features"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection("features")
                  }}
                  className="p-3 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center gap-3"
                >
                  <Zap className="h-5 w-5" />
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection("how-it-works")
                  }}
                  className="p-3 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center gap-3"
                >
                  <CheckCircle className="h-5 w-5" />
                  How It Works
                </Link>
                <Link
                  href="#pricing"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection("pricing")
                  }}
                  className="p-3 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center gap-3"
                >
                  <DollarSign className="h-5 w-5" />
                  Pricing
                </Link>
                <Link
                  href="#testimonials"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection("testimonials")
                  }}
                  className="p-3 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center gap-3"
                >
                  <Globe className="h-5 w-5" />
                  Testimonials
                </Link>
              </nav>
              <div className="mt-auto flex flex-col gap-2">
                <Button variant="outline" onClick={() => router.push("/dashboard")}>
                  Log In
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
                  onClick={() => router.push("/dashboard")}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="hero" ref={heroRef} className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        <motion.div style={{ opacity, scale, y }} className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Logo variant="animated" size="lg" />
            </motion.div>
            <motion.h1
              className="mt-6 text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-blue-600 dark:from-white dark:via-blue-300 dark:to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Revolutionize Your Invoice Management
            </motion.h1>
            <motion.p
              className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Transform your invoices into tradable digital assets with our blockchain-powered platform. Get paid
              faster, access liquidity, and streamline your financial operations with our intuitive sidebar-based
              dashboard.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-4 w-full justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 group"
                onClick={() => router.push("/dashboard")}
              >
                <span>Get Started Free</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="group">
                <span>Watch Demo</span>
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="mt-16 md:mt-24 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="aspect-[16/9] relative">
                <Image
                  src="/placeholder.svg?height=720&width=1280"
                  alt="Coinvoice Dashboard"
                  width={1280}
                  height={720}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <p className="font-medium">Coinvoice Dashboard with Sidebar Navigation</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}>
                <a
                  href="#features"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection("features")
                  }}
                  className="flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg"
                >
                  <ChevronDown className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Background Elements */}
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-400/10 dark:bg-blue-400/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-orange-400/10 dark:bg-orange-400/5 rounded-full filter blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent mb-4">
                Powerful Features
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-[800px] mx-auto">
                Coinvoice combines blockchain technology with financial innovation to deliver a seamless experience.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
              >
                <div
                  className="bg-gradient-to-br rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-inner"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, ${feature.gradient.split(" ")[1]}, ${feature.gradient.split(" ")[3]})`,
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* 3D Coin Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mt-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900/20 rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Coinvoice Tokens (CVT)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Our unique tokenization system converts your invoices into tradable digital assets. Each CVT is backed
                  by a real invoice, providing liquidity and security.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Instant liquidity for your invoices",
                    "Secure blockchain-based verification",
                    "Transparent marketplace trading",
                    "Earn CoinPoints with every transaction",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </motion.li>
                  ))}
                </ul>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  onClick={() => router.push("/dashboard")}
                >
                  Explore CVT Marketplace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="md:w-1/2 h-[300px] md:h-[400px]">
                {canRender3D ? (
                  <Canvas 
                    camera={{ position: [0, 0, 5], fov: 45 }}
                    onError={(error) => {
                      console.error("Canvas error:", error);
                      setCanRender3D(false);
                    }}
                  >
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    <PresentationControls
                      global
                      rotation={[0, 0, 0]}
                      polar={[-Math.PI / 4, Math.PI / 4]}
                      azimuth={[-Math.PI / 4, Math.PI / 4]}
                      config={{ mass: 2, tension: 500 }}
                      snap={{ mass: 4, tension: 1500 }}
                    >
                      <Float rotationIntensity={0.5} floatIntensity={0.5} speed={1.5}>
                        <CoinModel scale={2.5} rotation={[0, Math.PI / 2, 0]} />
                      </Float>
                    </PresentationControls>
                    <Environment preset="city" />
                  </Canvas>
                ) : (
                  <CoinFallback />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" ref={howItWorksRef} className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
            >
              How Coinvoice Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto"
            >
              Our streamlined process with intuitive sidebar navigation makes invoicing and getting paid easier than
              ever before
            </motion.p>
          </div>

          <div className="relative">
            {/* Process flow line */}
            <div className="hidden lg:block absolute top-1/2 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-1 bg-gradient-to-r from-blue-400/20 via-blue-500 to-blue-400/20 -translate-y-1/2 rounded-full" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {[
                {
                  icon: <FileText className="h-10 w-10 text-blue-600 dark:text-blue-400" />,
                  title: "Create Invoice",
                  description:
                    "Generate professional invoices in seconds with our intuitive interface. Add your branding, itemize services, and set payment terms.",
                },
                {
                  icon: <ArrowRight className="h-10 w-10 text-blue-600 dark:text-blue-400" />,
                  title: "Send to Client",
                  description:
                    "Deliver invoices directly to clients via email or shareable link. They'll receive a professional, branded invoice with clear payment instructions.",
                },
                {
                  icon: <CreditCard className="h-10 w-10 text-blue-600 dark:text-blue-400" />,
                  title: "Get Paid",
                  description:
                    "Accept payments in multiple currencies and cryptocurrencies. Funds are securely transferred to your preferred account.",
                },
                {
                  icon: <CheckCircle className="h-10 w-10 text-blue-600 dark:text-blue-400" />,
                  title: "Track Everything",
                  description:
                    "Monitor payment status, send reminders, and generate reports. Keep your finances organized with our comprehensive dashboard.",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="flex flex-col items-center text-center relative z-10"
                >
                  <motion.div
                    className="mb-6 p-4 rounded-full bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-900 shadow-lg"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {step.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-20 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center gap-8"
          >
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-4">Ready to streamline your invoicing?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Join thousands of businesses that use Coinvoice to simplify their invoicing process and get paid faster.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
                  onClick={() => router.push("/dashboard")}
                >
                  Get Started Free
                </Button>
                <Button className="bg-amber-500 hover:bg-amber-600 text-white dark:bg-amber-500 dark:hover:bg-amber-600">
                  Schedule a Demo
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="aspect-video relative rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Coinvoice Dashboard Preview"
                  width={600}
                  height={400}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <p className="font-medium">See how easy it is to use Coinvoice</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" ref={pricingRef} className="py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-[800px] mx-auto">
                Choose the plan that works best for your business needs
              </p>
            </motion.div>
          </div>

          <Tabs defaultValue="monthly" className="w-full max-w-md mx-auto mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly (Save 20%)</TabsTrigger>
            </TabsList>
            <TabsContent value="monthly">
              <div className="grid md:grid-cols-3 gap-8 mt-8">
                {pricingPlans.map((plan, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={cn(
                      "bg-white dark:bg-gray-800 rounded-xl overflow-hidden border transition-all",
                      plan.popular
                        ? "border-blue-200 dark:border-blue-800 shadow-xl scale-105 md:scale-110 z-10"
                        : "border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg hover:-translate-y-1",
                    )}
                  >
                    {plan.popular && (
                      <div className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 text-white text-center py-1 text-sm font-medium">
                        Most Popular
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                      <div className="flex items-baseline mb-4">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        {plan.period && <span className="text-gray-500 dark:text-gray-400 ml-1">{plan.period}</span>}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.description}</p>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={cn(
                          "w-full",
                          plan.popular
                            ? "bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white"
                            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700",
                        )}
                      >
                        {plan.cta}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="yearly">
              <div className="grid md:grid-cols-3 gap-8 mt-8">
                {pricingPlans.map((plan, index) => {
                  // Calculate yearly price (20% discount)
                  const yearlyPrice =
                    plan.price === "Custom"
                      ? "Custom"
                      : plan.price === "$0"
                        ? "$0"
                        : `$${Math.round(Number.parseInt(plan.price.replace("$", "")) * 12 * 0.8)}`

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={cn(
                        "bg-white dark:bg-gray-800 rounded-xl overflow-hidden border transition-all",
                        plan.popular
                          ? "border-blue-200 dark:border-blue-800 shadow-xl scale-105 md:scale-110 z-10"
                          : "border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg hover:-translate-y-1",
                      )}
                    >
                      {plan.popular && (
                        <div className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 text-white text-center py-1 text-sm font-medium">
                          Most Popular
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                        <div className="flex items-baseline mb-4">
                          <span className="text-3xl font-bold">{yearlyPrice}</span>
                          {plan.period && <span className="text-gray-500 dark:text-gray-400 ml-1">/year</span>}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.description}</p>
                        <ul className="space-y-3 mb-6">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          className={cn(
                            "w-full",
                            plan.popular
                              ? "bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white"
                              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700",
                          )}
                        >
                          {plan.cta}
                        </Button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">Need a custom solution for your enterprise?</p>
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" ref={testimonialsRef} className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-500 dark:to-purple-300 bg-clip-text text-transparent mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-[800px] mx-auto">
              Join hundreds of satisfied businesses already using Coinvoice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Coinvoice transformed our cash flow. We now get paid within days instead of months.",
                name: "Sarah Johnson",
                title: "CFO, TechStart Inc.",
                gradient: "gradient-bg-blue",
              },
              {
                quote:
                  "The marketplace is incredibly liquid. I've never had trouble finding invoice tokens to invest in.",
                name: "Michael Chen",
                title: "Investment Manager, Capital Partners",
                gradient: "gradient-bg-orange",
              },
              {
                quote: "The zero-knowledge payment feature gives us the privacy we need for sensitive transactions.",
                name: "Elena Rodriguez",
                title: "Operations Director, Global Supply Co.",
                gradient: "gradient-bg-purple",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
              >
                <div className="text-lg text-gray-600 dark:text-gray-400 mb-4">"{testimonial.quote}"</div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600/20 to-blue-400/20 dark:from-blue-500/30 dark:to-blue-300/30 flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-500 font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.title}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 to-blue-400 dark:from-blue-700 dark:to-blue-500 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Invoice Management?</h2>
              <p className="text-lg text-white/80 mb-6">
                Join Coinvoice today and experience the future of invoice financing and payments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => router.push("/dashboard")}
                  className="bg-white text-blue-600 hover:bg-white/90 dark:bg-white dark:text-blue-600 dark:hover:bg-white/90"
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection("how-it-works")}
                  className="border-white text-white hover:bg-white/10 dark:border-white dark:text-white dark:hover:bg-white/10"
                >
                  Schedule a Demo
                </Button>
              </div>
            </div>
            <div>
              <form
                onSubmit={handleSignUp}
                className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-bold mb-4">Sign Up for Early Access</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="block text-sm font-medium mb-1 text-white">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      className="bg-white/20 border-white/20 text-white placeholder:text-white/50 dark:bg-white/10 dark:border-white/10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="block text-sm font-medium mb-1 text-white">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/20 border-white/20 text-white placeholder:text-white/50 dark:bg-white/10 dark:border-white/10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company" className="block text-sm font-medium mb-1 text-white">
                      Company
                    </Label>
                    <Input
                      id="company"
                      placeholder="Enter your company name"
                      className="bg-white/20 border-white/20 text-white placeholder:text-white/50 dark:bg-white/10 dark:border-white/10"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-white text-blue-600 hover:bg-white/90 dark:bg-white dark:text-blue-600 dark:hover:bg-white/90"
                  >
                    Request Access
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Logo variant="icon" />
                <span className="text-xl font-bold">Coinvoice</span>
              </div>
              <p className="text-sm text-gray-400">Transforming invoice management with blockchain technology.</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Licenses
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400">© {new Date().getFullYear()} Coinvoice. All rights reserved.</div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.4\

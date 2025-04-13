"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { ScrollNavigation } from "@/components/ui/scroll-navigation"
import { EnhancedHeroSection } from "@/components/enhanced-hero-section"
import { EnhancedFeaturesSection } from "@/components/enhanced-features-section"
import { EnhancedHowItWorks } from "@/components/enhanced-how-it-works"
import { EnhancedTestimonials } from "@/components/enhanced-testimonials"
import { EnhancedPricing } from "@/components/enhanced-pricing"
import { EnhancedBusinessSolutions } from "@/components/enhanced-business-solutions"
import { LoginModal } from "@/components/auth/login-modal"
import { SignupModal } from "@/components/auth/signup-modal"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function EnhancedLandingPage() {
  const [activeSection, setActiveSection] = useState("hero")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [signupModalOpen, setSignupModalOpen] = useState(false)
  
  const heroRef = useRef<HTMLDivElement>(null)
  const businessSolutionsRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  const pricingRef = useRef<HTMLDivElement>(null)
  
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  
  // Navigation items for scroll navigation
  const navigationItems = [
    { id: "hero", label: "Home" },
    { id: "business-solutions", label: "Solutions" },
    { id: "features", label: "Features" },
    { id: "how-it-works", label: "How It Works" },
    { id: "testimonials", label: "Testimonials" },
    { id: "pricing", label: "Pricing" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)

      // Determine active section based on scroll position
      const scrollPosition = window.scrollY + 100

      if (heroRef.current && scrollPosition < heroRef.current.offsetTop + heroRef.current.offsetHeight) {
        setActiveSection("hero")
      } else if (
        businessSolutionsRef.current &&
        scrollPosition < businessSolutionsRef.current.offsetTop + businessSolutionsRef.current.offsetHeight
      ) {
        setActiveSection("business-solutions")
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

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

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

  const handleLoginSuccess = () => {
    setLoginModalOpen(false)
    router.push("/dashboard")
  }

  const handleSignupSuccess = () => {
    setSignupModalOpen(false)
    router.push("/dashboard")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Minimal header - only logo and theme toggle */}
      <header
        className={cn(
          "fixed w-full z-50 px-4 lg:px-6 h-16 flex items-center transition-all duration-200",
          scrolled
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <div className="flex lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
            
            <div className="hidden lg:flex items-center gap-4">
              <Button variant="ghost" onClick={() => setLoginModalOpen(true)}>
                Log in
              </Button>
              <Button onClick={() => setSignupModalOpen(true)}>
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-3/4 max-w-sm bg-white dark:bg-gray-900 shadow-xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <Logo />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="flex flex-col gap-1 px-4">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={cn(
                        "justify-start",
                        activeSection === item.id && "bg-gray-100 dark:bg-gray-800"
                      )}
                      onClick={() => scrollToSection(item.id)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </nav>
                <div className="border-t border-gray-200 dark:border-gray-800 mt-4 pt-4 px-4 flex flex-col gap-2">
                  <Button variant="outline" className="w-full" onClick={() => {
                    setMobileMenuOpen(false);
                    setLoginModalOpen(true);
                  }}>
                    Log in
                  </Button>
                  <Button className="w-full" onClick={() => {
                    setMobileMenuOpen(false);
                    setSignupModalOpen(true);
                  }}>
                    Sign up
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal 
        open={loginModalOpen} 
        onOpenChange={setLoginModalOpen}
        onClose={() => setLoginModalOpen(false)} 
      />

      {/* Signup Modal */}
      <SignupModal 
        open={signupModalOpen} 
        onOpenChange={setSignupModalOpen}
        onClose={() => setSignupModalOpen(false)} 
      />

      {/* Scroll-based navigation */}
      <ScrollNavigation
        items={navigationItems}
        activeSection={activeSection}
        onSectionChange={scrollToSection}
      />

      {/* Main content */}
      <main className="flex-1">
        {/* Hero Section */}
        <div ref={heroRef}>
          <EnhancedHeroSection />
        </div>

        {/* Business Solutions Section */}
        <div ref={businessSolutionsRef}>
          <EnhancedBusinessSolutions />
        </div>

        {/* Features Section */}
        <div ref={featuresRef}>
          <EnhancedFeaturesSection />
        </div>

        {/* How It Works Section */}
        <div ref={howItWorksRef}>
          <EnhancedHowItWorks />
        </div>

        {/* Testimonials Section */}
        <div ref={testimonialsRef}>
          <EnhancedTestimonials />
        </div>

        {/* Pricing Section */}
        <div ref={pricingRef}>
          <EnhancedPricing />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Logo variant="icon" />
                <span className="font-bold text-xl">Coinvoice</span>
              </div>
              <p className="text-gray-400 text-sm">
                Transforming invoice management with blockchain technology.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Coinvoice. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Logo } from "@/components/logo"
import {
  BarChart3,
  DollarSign,
  LayoutDashboard,
  LogOut,
  ShoppingCart,
  User,
  ChevronRight,
  Settings,
  Menu,
  X,
  FileText,
  Shield,
  Ship,
  Briefcase,
  Building,
  Wallet,
  CreditCard,
  Users,
  Landmark,
  Layers,
  Banknote,
  LineChart,
  HelpCircle,
  ClipboardCheck,
  Scale,
  FileSearch,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { useAppStore, type StakeholderType } from "@/lib/store"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

export function AppSidebar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Get state from Zustand store
  const {
    stakeholderType,
    setStakeholderType,
    sidebarCollapsed,
    setSidebarCollapsed,
    userProfile,
    refreshData,
    unreadNotificationsCount,
  } = useAppStore()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [setSidebarCollapsed])

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData()
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [refreshData])

  // Define navigation items for each stakeholder type
  const navItemsByType: Record<
    StakeholderType,
    Array<{
      name: string
      href: string
      icon: JSX.Element
      badge?: string | number
    }>
  > = {
    originator: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        name: "Invoices",
        href: "/invoices",
        icon: <FileText className="h-5 w-5" />,
      },
      {
        name: "Letters of Credit",
        href: "/letters-of-credit",
        icon: <Briefcase className="h-5 w-5" />,
      },
      {
        name: "Guarantees",
        href: "/guarantees",
        icon: <Shield className="h-5 w-5" />,
      },
      {
        name: "Electronic BoL",
        href: "/ebol",
        icon: <Ship className="h-5 w-5" />,
      },
      {
        name: "Marketplace",
        href: "/marketplace",
        icon: <ShoppingCart className="h-5 w-5" />,
      },
      {
        name: "Payments",
        href: "/payments",
        icon: <DollarSign className="h-5 w-5" />,
      },
      {
        name: "Wallet",
        href: "/wallet",
        icon: <Wallet className="h-5 w-5" />,
      },
    ],
    investor: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        name: "Marketplace",
        href: "/marketplace",
        icon: <ShoppingCart className="h-5 w-5" />,
      },
      {
        name: "Portfolio",
        href: "/portfolio",
        icon: <Layers className="h-5 w-5" />,
      },
      {
        name: "Analytics",
        href: "/analytics",
        icon: <BarChart3 className="h-5 w-5" />,
      },
      {
        name: "Payments",
        href: "/payments",
        icon: <DollarSign className="h-5 w-5" />,
      },
      {
        name: "Wallet",
        href: "/wallet",
        icon: <Wallet className="h-5 w-5" />,
      },
      {
        name: "Risk Assessment",
        href: "/risk-assessment",
        icon: <LineChart className="h-5 w-5" />,
      },
    ],
    funder: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        name: "Funding Requests",
        href: "/funding-requests",
        icon: <CreditCard className="h-5 w-5" />,
        badge: 3,
      },
      {
        name: "Clients",
        href: "/clients",
        icon: <Users className="h-5 w-5" />,
      },
      {
        name: "Marketplace",
        href: "/marketplace",
        icon: <ShoppingCart className="h-5 w-5" />,
      },
      {
        name: "Capital Management",
        href: "/capital-management",
        icon: <Landmark className="h-5 w-5" />,
      },
      {
        name: "Analytics",
        href: "/analytics",
        icon: <BarChart3 className="h-5 w-5" />,
      },
      {
        name: "Payments",
        href: "/payments",
        icon: <DollarSign className="h-5 w-5" />,
      },
      {
        name: "Wallet",
        href: "/wallet",
        icon: <Wallet className="h-5 w-5" />,
      },
    ],
    regulatory: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        name: "Compliance",
        href: "/compliance",
        icon: <ClipboardCheck className="h-5 w-5" />,
      },
      {
        name: "Audits",
        href: "/audits",
        icon: <FileSearch className="h-5 w-5" />,
      },
      {
        name: "Regulations",
        href: "/regulations",
        icon: <Scale className="h-5 w-5" />,
      },
      {
        name: "Risk Monitoring",
        href: "/risk-monitoring",
        icon: <AlertCircle className="h-5 w-5" />,
        badge: 2,
      },
      {
        name: "Reports",
        href: "/reports",
        icon: <BarChart3 className="h-5 w-5" />,
      },
      {
        name: "Entities",
        href: "/entities",
        icon: <Users className="h-5 w-5" />,
      },
    ],
  }

  // Get current navigation items based on stakeholder type
  const navItems = navItemsByType[stakeholderType]

  const sidebarVariants = {
    expanded: { width: "280px" },
    collapsed: { width: "80px" },
  }

  const mobileMenuVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  // Stakeholder button styles and icons
  const stakeholderButtons = [
    {
      type: "originator" as StakeholderType,
      icon: <Building className="h-5 w-5" />,
      label: "Originator",
      gradient: "from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300",
    },
    {
      type: "investor" as StakeholderType,
      icon: <Banknote className="h-5 w-5" />,
      label: "Investor",
      gradient: "from-emerald-600 to-emerald-400 dark:from-emerald-500 dark:to-emerald-300",
    },
    {
      type: "funder" as StakeholderType,
      icon: <Landmark className="h-5 w-5" />,
      label: "Funder",
      gradient: "from-amber-600 to-amber-400 dark:from-amber-500 dark:to-amber-300",
    },
    {
      type: "regulatory" as StakeholderType,
      icon: <Scale className="h-5 w-5" />,
      label: "Regulatory",
      gradient: "from-purple-600 to-purple-400 dark:from-purple-500 dark:to-purple-300",
    },
  ]

  return (
    <>
      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Sidebar */}
      <motion.aside
        className="fixed inset-y-0 left-0 z-40 flex flex-col w-[280px] bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-r border-gray-200/50 dark:border-gray-800/50 md:hidden"
        initial="closed"
        animate={mobileMenuOpen ? "open" : "closed"}
        variants={mobileMenuVariants}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200/50 dark:border-gray-800/50">
          <Logo variant="enterprise" />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-3 py-4 border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="flex flex-wrap gap-2">
            {stakeholderButtons.map((button) => (
              <Button
                key={button.type}
                variant={stakeholderType === button.type ? "default" : "outline"}
                size="sm"
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 min-w-[120px]",
                  stakeholderType === button.type && `bg-gradient-to-r ${button.gradient} text-white`,
                )}
                onClick={() => setStakeholderType(button.type)}
              >
                {button.icon}
                <span className="text-xs">{button.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative overflow-hidden",
                  pathname === item.href
                    ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 dark:from-blue-950 dark:to-blue-900 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-100/50 dark:text-gray-300 dark:hover:bg-gray-800/50",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
                {item.badge && <Badge className="ml-auto bg-red-500 hover:bg-red-600 text-white">{item.badge}</Badge>}
                {pathname === item.href && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute left-0 w-1 h-8 bg-blue-600 dark:bg-blue-500 rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                {pathname === item.href && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.1, scale: 1 }}
                    className="absolute inset-0 bg-blue-500 rounded-lg -z-10"
                  />
                )}
              </Link>
            ))}
          </nav>

          {userProfile && (
            <div className="mt-6 px-3">
              <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 backdrop-blur-sm p-4 border border-blue-200/50 dark:border-blue-800/50 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-600 dark:text-blue-400">CoinPoints</h4>
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                    className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-400 dark:from-orange-400 dark:to-amber-300 text-white px-2 py-1 rounded-full text-xs shadow-md"
                  >
                    <span className="font-medium">{userProfile.coinPoints}</span>
                    <span>CP</span>
                  </motion.div>
                </div>
                <div className="w-full h-2 bg-blue-100 dark:bg-blue-800/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-400 dark:from-orange-400 dark:to-amber-300 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((userProfile.coinPoints % 250) / 250) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">
                  {250 - (userProfile.coinPoints % 250)} points until next tier
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200/50 dark:border-gray-800/50 p-4">
          {userProfile && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border border-gray-200/50 dark:border-gray-700/50">
                  <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                  <AvatarFallback>
                    {userProfile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">{userProfile.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                    {userProfile.walletAddress.substring(0, 6)}...
                    {userProfile.walletAddress.substring(userProfile.walletAddress.length - 4)}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden md:flex flex-col h-screen sticky top-0 border-r border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md z-30"
        variants={sidebarVariants}
        animate={sidebarCollapsed ? "collapsed" : "expanded"}
        initial="expanded"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex h-16 items-center px-4 border-b border-gray-200/50 dark:border-gray-800/50 justify-between">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Logo variant="enterprise" />
              </motion.div>
            )}
            {sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Logo variant="icon" />
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`} />
          </Button>
        </div>

        <div className="px-3 py-4 border-b border-gray-200/50 dark:border-gray-800/50">
          <TooltipProvider>
            <div className={cn("flex", sidebarCollapsed ? "flex-col gap-3" : "flex-wrap gap-2")}>
              {stakeholderButtons.map((button) => (
                <Tooltip key={button.type} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={stakeholderType === button.type ? "default" : "outline"}
                      size={sidebarCollapsed ? "icon" : "sm"}
                      className={cn(
                        sidebarCollapsed ? "w-10 h-10" : "flex-1 flex items-center justify-center gap-2 min-w-[60px]",
                        stakeholderType === button.type && `bg-gradient-to-r ${button.gradient} text-white`,
                      )}
                      onClick={() => setStakeholderType(button.type)}
                    >
                      {button.icon}
                      {!sidebarCollapsed && <span className="text-xs">{button.label}</span>}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side={sidebarCollapsed ? "right" : "bottom"}>
                    <p>{button.label} View</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            <TooltipProvider>
              {navItems.map((item) => (
                <Tooltip key={item.href} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative overflow-hidden",
                        pathname === item.href
                          ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-600 dark:from-blue-950 dark:to-blue-900/50 dark:text-blue-400"
                          : "text-gray-700 hover:bg-gray-100/50 dark:text-gray-300 dark:hover:bg-gray-800/50",
                      )}
                    >
                      <div className={cn("flex items-center justify-center", sidebarCollapsed ? "w-full" : "")}>
                        {item.icon}
                      </div>
                      <AnimatePresence>
                        {!sidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {item.badge && !sidebarCollapsed && (
                        <Badge className="ml-auto bg-red-500 hover:bg-red-600 text-white">{item.badge}</Badge>
                      )}
                      {item.badge && sidebarCollapsed && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white text-xs">
                          {item.badge}
                        </Badge>
                      )}
                      {pathname === item.href && (
                        <motion.div
                          layoutId="sidebar-indicator"
                          className="absolute left-0 w-1 h-8 bg-blue-600 dark:bg-blue-500 rounded-r-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                      {pathname === item.href && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 0.1, scale: 1 }}
                          className="absolute inset-0 bg-blue-500 rounded-lg -z-10"
                        />
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className={cn(sidebarCollapsed ? "block" : "hidden")}>
                    <p>{item.name}</p>
                    {item.badge && <Badge className="ml-2 bg-red-500 text-white">{item.badge}</Badge>}
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </nav>

          {userProfile && (
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 px-3"
                >
                  <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 backdrop-blur-sm p-4 border border-blue-200/50 dark:border-blue-800/50 shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-blue-600 dark:text-blue-400">CoinPoints</h4>
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        }}
                        className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-400 dark:from-orange-400 dark:to-amber-300 text-white px-2 py-1 rounded-full text-xs shadow-md"
                      >
                        <span className="font-medium">{userProfile.coinPoints}</span>
                        <span>CP</span>
                      </motion.div>
                    </div>
                    <div className="w-full h-2 bg-blue-100 dark:bg-blue-800/50 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-400 dark:from-orange-400 dark:to-amber-300 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((userProfile.coinPoints % 250) / 250) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">
                      {250 - (userProfile.coinPoints % 250)} points until next tier
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {userProfile && sidebarCollapsed && (
            <div className="mt-6 flex justify-center">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 dark:from-orange-400 dark:to-amber-300 flex items-center justify-center text-white text-xs font-bold shadow-md"
              >
                CP
              </motion.div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200/50 dark:border-gray-800/50 p-4">
          {userProfile && (
            <AnimatePresence>
              {!sidebarCollapsed ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border border-gray-200/50 dark:border-gray-700/50">
                      <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                      <AvatarFallback>
                        {userProfile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <div className="font-medium">{userProfile.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                        {userProfile.walletAddress.substring(0, 6)}...
                        {userProfile.walletAddress.substring(userProfile.walletAddress.length - 4)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <ThemeToggle />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                          <Settings className="h-4 w-4" />
                          {unreadNotificationsCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                              {unreadNotificationsCount}
                            </span>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <HelpCircle className="mr-2 h-4 w-4" />
                          <span>Help & Support</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Disconnect</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-center"
                >
                  <Avatar className="h-10 w-10 border border-gray-200/50 dark:border-gray-700/50 shadow-md">
                    <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                    <AvatarFallback>
                      {userProfile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.aside>
    </>
  )
}

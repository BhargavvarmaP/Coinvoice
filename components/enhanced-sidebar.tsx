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
  Bell,
  ChevronDown,
  FileCheck,
  FileSpreadsheet,
  FilePlus,
  History,
  ListChecks,
  Package,
  PackageCheck,
  Truck,
  FileStack,
  ShieldCheck,
  ShieldAlert,
  FileWarning,
  Search,
  ChevronLeft,
  Plus,
  RefreshCw,
  Sun,
  Moon,
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
import { useAppStore } from "@/lib/store"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { GlassCard } from "@/components/ui/glass-card"
import { Input } from "@/components/ui/input"
import type { StakeholderType } from "@/lib/types"
import Image from "next/image"
import { useTheme } from "next-themes"

// Add new interface for nested navigation
interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  badge?: string | number
  children?: NavItem[]
}

interface SidebarProps {
  className?: string
}

interface UserProfileProps {
  userProfile: any
  stakeholderType: StakeholderType
  unreadNotificationsCount: number
}

function UserProfile({ userProfile, stakeholderType, unreadNotificationsCount }: UserProfileProps) {
  return (
    <div className="p-4 border-t">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center gap-2 px-2">
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="h-9 w-9 border-2 border-primary/20">
                <AvatarImage src={userProfile?.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {userProfile?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium truncate">{userProfile?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground capitalize">{stakeholderType}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadNotificationsCount > 0 && (
                <Badge variant="destructive" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                  {unreadNotificationsCount}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px]">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4" />
            Notifications
            {unreadNotificationsCount > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {unreadNotificationsCount}
              </Badge>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Shield className="mr-2 h-4 w-4" />
            Security
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Preferences
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            Help & Support
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function QuickActions({ sidebarCollapsed }: { sidebarCollapsed: boolean }) {
  return (
    <div className={cn(
      "grid gap-2",
      sidebarCollapsed ? "grid-cols-1" : "grid-cols-2"
    )}>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        {!sidebarCollapsed && "New Invoice"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        {!sidebarCollapsed && "Refresh"}
      </Button>
    </div>
  )
}

function MobileMenu({ mobileMenuOpen, setMobileMenuOpen, stakeholderType, userProfile, unreadNotificationsCount }: {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  stakeholderType: StakeholderType
  userProfile: any
  unreadNotificationsCount: number
}) {
  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-y-0 left-0 w-[280px] bg-card border-r z-[65] lg:hidden"
          >
            <div className="flex h-16 items-center px-4 border-b">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2"
              >
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  Coinvoice
                </span>
              </motion.div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Quick search..."
                  className="pl-8 bg-background"
                />
              </div>
            </div>

            <div className="px-4 py-2">
              <QuickActions sidebarCollapsed={false} />
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              <SidebarContent
                stakeholderType={stakeholderType}
                setStakeholderType={() => {}}
                sidebarCollapsed={false}
                userProfile={userProfile}
                unreadNotificationsCount={unreadNotificationsCount}
              />
            </nav>

            <UserProfile
              userProfile={userProfile}
              stakeholderType={stakeholderType}
              unreadNotificationsCount={unreadNotificationsCount}
            />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export function EnhancedSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState("")

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
      const isMobileView = window.innerWidth < 768
      setIsMobile(isMobileView)
      if (isMobileView !== sidebarCollapsed) {
        setSidebarCollapsed(isMobileView)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [setSidebarCollapsed, sidebarCollapsed])

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData()
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [refreshData])

  const toggleSubMenu = (menuName: string) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }))
  }

  // Update navigation items to include nested structure
  const navItemsByType: Record<StakeholderType, NavItem[]> = {
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
        children: [
          {
            name: "All Letters",
            href: "/letters-of-credit",
            icon: <FileStack className="h-5 w-5" />,
          },
          {
            name: "Create New",
            href: "/letters-of-credit/create",
            icon: <FilePlus className="h-5 w-5" />,
          },
          {
            name: "Applications",
            href: "/letters-of-credit/applications",
            icon: <FileSpreadsheet className="h-5 w-5" />,
          },
          {
            name: "Amendments",
            href: "/letters-of-credit/amendments",
            icon: <FileCheck className="h-5 w-5" />,
          },
          {
            name: "History",
            href: "/letters-of-credit/history",
            icon: <History className="h-5 w-5" />,
          },
        ],
      },
      {
        name: "Guarantees",
        href: "/guarantees",
        icon: <Shield className="h-5 w-5" />,
        children: [
          {
            name: "Active Guarantees",
            href: "/guarantees",
            icon: <ShieldCheck className="h-5 w-5" />,
          },
          {
            name: "Create Guarantee",
            href: "/guarantees/create",
            icon: <FilePlus className="h-5 w-5" />,
          },
          {
            name: "Risk Assessment",
            href: "/guarantees/risk",
            icon: <ShieldAlert className="h-5 w-5" />,
          },
          {
            name: "Claims",
            href: "/guarantees/claims",
            icon: <FileWarning className="h-5 w-5" />,
          },
          {
            name: "History",
            href: "/guarantees/history",
            icon: <History className="h-5 w-5" />,
          },
        ],
      },
      {
        name: "Electronic BoL",
        href: "/ebol",
        icon: <Ship className="h-5 w-5" />,
        children: [
          {
            name: "All Documents",
            href: "/ebol",
            icon: <Package className="h-5 w-5" />,
          },
          {
            name: "Create New",
            href: "/ebol/create",
            icon: <FilePlus className="h-5 w-5" />,
          },
          {
            name: "Tracking",
            href: "/ebol/tracking",
            icon: <Truck className="h-5 w-5" />,
          },
          {
            name: "Verification",
            href: "/ebol/verification",
            icon: <PackageCheck className="h-5 w-5" />,
          },
          {
            name: "Checklist",
            href: "/ebol/checklist",
            icon: <ListChecks className="h-5 w-5" />,
          },
        ],
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
      {
        name: "Analytics",
        href: "/analytics",
        icon: <BarChart3 className="h-5 w-5" />,
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
    expanded: {
      width: "240px",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    collapsed: {
      width: "80px",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  const menuItemVariants = {
    expanded: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    collapsed: {
      x: -20,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  }

  const iconVariants = {
    expanded: {
      scale: 1,
      rotate: 0
    },
    collapsed: {
      scale: 1.2,
      rotate: 0
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2
      }
    }
  }

  // Stakeholder button styles and icons
  const stakeholderButtons = [
    {
      type: "originator" as StakeholderType,
      icon: <Building className="h-5 w-5" />,
      label: "Originator",
      gradient: "from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300",
      description: "Manage invoices and trade finance",
    },
    {
      type: "investor" as StakeholderType,
      icon: <Banknote className="h-5 w-5" />,
      label: "Investor",
      gradient: "from-emerald-600 to-emerald-400 dark:from-emerald-500 dark:to-emerald-300",
      description: "Invest in tokenized assets",
    },
    {
      type: "funder" as StakeholderType,
      icon: <Landmark className="h-5 w-5" />,
      label: "Funder",
      gradient: "from-amber-600 to-amber-400 dark:from-amber-500 dark:to-amber-300",
      description: "Provide liquidity and funding",
    },
    {
      type: "regulatory" as StakeholderType,
      icon: <Scale className="h-5 w-5" />,
      label: "Regulatory",
      gradient: "from-purple-600 to-purple-400 dark:from-purple-500 dark:to-purple-300",
      description: "Monitor compliance and risk",
    },
  ]

  // Update the navigation rendering in both mobile and desktop sidebars
  const renderNavItems = (items: NavItem[], isMobileMenu: boolean = false) => {
    return items.map((item) => (
      <div key={item.href}>
        {item.children ? (
          <div className="space-y-1">
            <button
              onClick={() => toggleSubMenu(item.name)}
                className={cn(
                "flex w-full items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors relative group",
                pathname.startsWith(item.href)
                  ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary"
                  : "text-muted-foreground hover:bg-accent/50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                {item.icon}
                  {item.badge && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <AnimatePresence>
                  {(!sidebarCollapsed || isMobileMenu) && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  openSubMenus[item.name] ? "rotate-180" : ""
                )}
              />
            </button>
            <AnimatePresence>
              {openSubMenus[item.name] && (
              <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pl-4 space-y-1"
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative group",
                        pathname === child.href
                          ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary"
                          : "text-muted-foreground hover:bg-accent/50"
                      )}
                      onClick={() => isMobileMenu && setMobileMenuOpen(false)}
                    >
                      {child.icon}
                      <AnimatePresence>
                        {(!sidebarCollapsed || isMobileMenu) && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                          >
                            {child.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative group",
              pathname === item.href
                ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary"
                : "text-muted-foreground hover:bg-accent/50"
            )}
            onClick={() => isMobileMenu && setMobileMenuOpen(false)}
          >
            <div className="relative">
              {item.icon}
              {item.badge && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                  {item.badge}
                </Badge>
              )}
            </div>
            <AnimatePresence>
              {(!sidebarCollapsed || isMobileMenu) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                >
                  {item.name}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        )}
                      </div>
    ))
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-[70] lg:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile Menu */}
      <MobileMenu
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        stakeholderType={stakeholderType}
        userProfile={userProfile}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* Desktop Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="expanded"
        animate={sidebarCollapsed ? "collapsed" : "expanded"}
        className={cn(
          "hidden lg:flex flex-col fixed inset-y-0 left-0 bg-card border-r z-[55]",
          className
        )}
      >
        <div className="flex h-16 items-center px-4 border-b">
                <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2"
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
                >
                  Coinvoice
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {!sidebarCollapsed && (
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Quick search..."
                className="pl-8 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="px-4 py-2">
          <QuickActions sidebarCollapsed={sidebarCollapsed} />
        </div>

        <SidebarContent
          stakeholderType={stakeholderType}
          setStakeholderType={setStakeholderType}
          sidebarCollapsed={sidebarCollapsed}
          userProfile={userProfile}
          unreadNotificationsCount={unreadNotificationsCount}
        />

        <div className="p-4 border-t flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="ml-auto"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </motion.aside>
    </>
  )
}

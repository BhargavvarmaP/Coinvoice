"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Menu,
  X,
  FileText,
  Users,
  Landmark,
  Scale,
  LayoutDashboard,
  Receipt,
  Wallet,
  BarChart3,
  CreditCard,
  Briefcase,
  ShieldCheck,
  FileCheck,
  Building2,
  Store,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  FileSignature,
  ShoppingCart,
  DollarSign,
} from "lucide-react"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { buttonVariants } from "@/components/ui/button"

// Define navigation items by stakeholder type
const navItemsByType: Record<'buyer' | 'seller', NavItem[][]> = {
  buyer: [
    [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
    ],
    [
      {
        name: "Invoices",
        href: "/invoices",
        icon: <Receipt className="h-4 w-4" />,
        badge: "3",
      },
    ],
    [
      {
        name: "Financial Services",
        href: "/financial-services",
        icon: <Briefcase className="h-4 w-4" />,
        children: [
          {
            name: "Letters of Credit",
            href: "/financial-services/letters-of-credit",
            icon: <FileCheck className="h-4 w-4" />,
          },
          {
            name: "Guarantees",
            href: "/financial-services/guarantees",
            icon: <ShieldCheck className="h-4 w-4" />,
          },
          {
            name: "Electronic BoL",
            href: "/financial-services/electronic-bol",
            icon: <FileText className="h-4 w-4" />,
          },
          {
            name: "Marketplace Payments",
            href: "/financial-services/marketplace-payments",
            icon: <CreditCard className="h-4 w-4" />,
          },
        ],
      },
    ],
    [
      {
        name: "Wallet",
        href: "/wallet",
        icon: <Wallet className="h-4 w-4" />,
        children: [
          {
            name: "Overview",
            href: "/wallet/overview",
            icon: <LayoutDashboard className="h-4 w-4" />,
          },
          {
            name: "Send",
            href: "/wallet/send",
            icon: <ArrowUpRight className="h-4 w-4" />,
          },
          {
            name: "Receive",
            href: "/wallet/receive",
            icon: <ArrowDownLeft className="h-4 w-4" />,
          },
          {
            name: "Transactions",
            href: "/wallet/transactions",
            icon: <History className="h-4 w-4" />,
          },
          {
            name: "Settings",
            href: "/wallet/settings",
            icon: <Settings className="h-4 w-4" />,
          },
        ],
      },
    ],
    [
      {
        name: "Analytics",
        href: "/analytics",
        icon: <BarChart3 className="h-4 w-4" />,
      },
    ],
  ],
  seller: [
    [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
    ],
    [
      {
        name: "Financial Services",
        href: "/financial-services",
        icon: <Briefcase className="h-4 w-4" />,
        children: [
          {
            name: "Letters of Credit",
            href: "/financial-services/letters-of-credit",
            icon: <FileCheck className="h-4 w-4" />,
          },
          {
            name: "Guarantees",
            href: "/financial-services/guarantees",
            icon: <ShieldCheck className="h-4 w-4" />,
          },
          {
            name: "Electronic BoL",
            href: "/financial-services/electronic-bol",
            icon: <FileText className="h-4 w-4" />,
          },
          {
            name: "Marketplace Payments",
            href: "/financial-services/marketplace-payments",
            icon: <CreditCard className="h-4 w-4" />,
          },
        ],
      },
    ],
    [
      {
        name: "Invoices",
        href: "/invoices",
        icon: <Receipt className="h-4 w-4" />,
        badge: "3",
      },
    ],
    [
      {
        name: "Wallet",
        href: "/wallet",
        icon: <Wallet className="h-4 w-4" />,
        children: [
          {
            name: "Overview",
            href: "/wallet/overview",
            icon: <LayoutDashboard className="h-4 w-4" />,
          },
          {
            name: "Send",
            href: "/wallet/send",
            icon: <ArrowUpRight className="h-4 w-4" />,
          },
          {
            name: "Receive",
            href: "/wallet/receive",
            icon: <ArrowDownLeft className="h-4 w-4" />,
          },
          {
            name: "Transactions",
            href: "/wallet/transactions",
            icon: <History className="h-4 w-4" />,
          },
          {
            name: "Settings",
            href: "/wallet/settings",
            icon: <Settings className="h-4 w-4" />,
          },
        ],
      },
    ],
    [
      {
        name: "Analytics",
        href: "/analytics",
        icon: <BarChart3 className="h-4 w-4" />,
      },
    ],
  ],
} as const;

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  badge?: string
  children?: NavItem[]
}

interface StakeholderButton {
  type: 'buyer' | 'seller'
  icon: React.ReactNode
  label: string
}

interface SidebarContentProps {
  collapsed: boolean
  onCollapse: () => void
}

interface UserProfileProps {
  collapsed: boolean
}

const stakeholderButtons: StakeholderButton[] = [
  {
    type: 'buyer',
    icon: <User className="h-4 w-4" />,
    label: 'Buyer',
  },
  {
    type: 'seller',
    icon: <Store className="h-4 w-4" />,
    label: 'Seller',
  },
]

const UserProfile: React.FC<UserProfileProps> = ({ collapsed }) => {
  return (
    <div className={cn(
      "flex items-center gap-2 p-2",
      collapsed ? "justify-center" : "justify-between"
    )}>
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/avatars/01.png" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-xs text-muted-foreground">john@example.com</span>
          </div>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              collapsed && "absolute right-2"
            )}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            Help & Support
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

const SidebarContent: React.FC<SidebarContentProps> = ({ collapsed, onCollapse }) => {
  const pathname = usePathname()
  const { stakeholderType = 'buyer', setStakeholderType } = useAppStore()
  const [openSections, setOpenSections] = useState<string[]>([])

  // Add safety check for navigation items
  const navigationItems = navItemsByType[stakeholderType as keyof typeof navItemsByType] || navItemsByType.buyer

  const toggleSection = (name: string) => {
    setOpenSections(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  return (
    <div className={cn(
      "flex h-screen flex-col gap-2 border-r bg-background p-2 shadow-sm transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-2 border-b">
        {!collapsed && (
          <Image
            src="/logo.svg"
            alt="Logo"
            width={120}
            height={30}
            className="dark:invert transition-opacity duration-200"
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onCollapse}
          className={cn(
            "h-8 w-8 transition-transform duration-200",
            collapsed && "rotate-180"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2 p-2 border-b">
        {stakeholderButtons.map((button) => (
          <TooltipProvider key={button.type}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={stakeholderType === button.type ? "default" : "outline"}
                  className={cn(
                    "flex-1 transition-all duration-200",
                    collapsed && "h-8 w-8 p-0"
                  )}
                  onClick={() => setStakeholderType(button.type)}
                >
                  {button.icon}
                  {!collapsed && (
                    <span className="ml-2 transition-opacity duration-200">
                      {button.label}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" sideOffset={10}>
                  {button.label}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="flex flex-col gap-4">
          {navigationItems.map((section, index) => (
            <div key={index} className="flex flex-col gap-1">
              {section.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <Collapsible
                      open={openSections.includes(item.name)}
                      onOpenChange={() => toggleSection(item.name)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-between transition-all duration-200",
                            collapsed && "h-8 w-8 p-0",
                            openSections.includes(item.name) && "bg-muted"
                          )}
                        >
                          <div className="flex items-center">
                            {item.icon}
                            {!collapsed && (
                              <span className="ml-2 transition-opacity duration-200">
                                {item.name}
                              </span>
                            )}
                          </div>
                          {!collapsed && (
                            <ChevronRight
                              className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                openSections.includes(item.name) && "rotate-90"
                              )}
                            />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="ml-4 flex flex-col gap-1 pt-1">
                          {item.children.map((child) => (
                            <TooltipProvider key={child.name}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link
                                    href={child.href}
                                    className={cn(
                                      buttonVariants({ variant: "ghost", size: "sm" }),
                                      "w-full justify-start transition-all duration-200",
                                      pathname === child.href && "bg-muted",
                                      collapsed && "h-8 w-8 p-0"
                                    )}
                                  >
                                    {child.icon}
                                    {!collapsed && (
                                      <span className="ml-2 transition-opacity duration-200">
                                        {child.name}
                                      </span>
                                    )}
                                  </Link>
                                </TooltipTrigger>
                                {collapsed && (
                                  <TooltipContent side="right" sideOffset={10}>
                                    {child.name}
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              buttonVariants({ variant: "ghost" }),
                              "w-full justify-start transition-all duration-200",
                              pathname === item.href && "bg-muted",
                              collapsed && "h-8 w-8 p-0"
                            )}
                          >
                            {item.icon}
                            {!collapsed && (
                              <>
                                <span className="ml-2 transition-opacity duration-200">
                                  {item.name}
                                </span>
                                {item.badge && (
                                  <Badge
                                    variant="secondary"
                                    className="ml-auto transition-opacity duration-200"
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                              </>
                            )}
                          </Link>
                        </TooltipTrigger>
                        {collapsed && (
                          <TooltipContent side="right" sideOffset={10}>
                            <div className="flex items-center gap-2">
                              {item.name}
                              {item.badge && (
                                <Badge variant="secondary">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t">
        <UserProfile collapsed={collapsed} />
      </div>
    </div>
  )
}

export default function EnhancedSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Mobile Menu Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex transform transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent
          collapsed={false}
          onCollapse={() => {}}
        />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarContent
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
        />
      </div>
    </>
  )
}
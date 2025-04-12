"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Wallet,
  Shield,
  Ship,
  Briefcase,
  Building,
  Landmark,
  Layers,
  LineChart,
  ClipboardCheck,
  FileSearch,
  Scale,
  AlertCircle,
  Users,
} from "lucide-react"

export function AppLayoutAlt({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New invoice tokenized",
      description: "Your invoice INV-001 has been successfully tokenized.",
      time: "Just now",
      read: false,
    },
    {
      id: 2,
      title: "Payment received",
      description: "You received a payment of $5,000 for CVT-1001.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 3,
      title: "New marketplace listing",
      description: "A new invoice token matching your criteria is available.",
      time: "Yesterday",
      read: false,
    },
  ])

  const [stakeholderType, setStakeholderType] = useState<"originator" | "investor" | "funder" | "regulatory">(
    "originator",
  )

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  // Define navigation items for each stakeholder type
  const navItemsByType: Record<
    "originator" | "investor" | "funder" | "regulatory",
    Array<{
      name: string
      href: string
      icon: JSX.Element
      badge?: string | number
      isNew?: boolean
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
        isNew: true,
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
        name: "Analytics",
        href: "/analytics",
        icon: <BarChart3 className="h-5 w-5" />,
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
        isNew: true,
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
        icon: <FileText className="h-5 w-5" />,
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

  // Stakeholder button styles and icons
  const stakeholderButtons = [
    {
      type: "originator" as const,
      icon: <Building className="h-5 w-5" />,
      label: "Originator",
      gradient: "from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300",
    },
    {
      type: "investor" as const,
      icon: <DollarSign className="h-5 w-5" />,
      label: "Investor",
      gradient: "from-emerald-600 to-emerald-400 dark:from-emerald-500 dark:to-emerald-300",
    },
    {
      type: "funder" as const,
      icon: <Landmark className="h-5 w-5" />,
      label: "Funder",
      gradient: "from-amber-600 to-amber-400 dark:from-amber-500 dark:to-amber-300",
    },
    {
      type: "regulatory" as const,
      icon: <Scale className="h-5 w-5" />,
      label: "Regulatory",\
      gradient: "from-purple-600 to-purple-400 dark:from-purple

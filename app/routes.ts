import { StakeholderType } from "@/lib/store"

export type Route = {
  path: string
  name: string
  icon?: React.ReactNode
  description?: string
  requiresAuth?: boolean
  allowedStakeholders?: StakeholderType[]
  children?: Route[]
}

export const routes: Route[] = [
  // Public routes
  {
    path: "/",
    name: "Home",
    description: "Welcome to Coinvoice",
  },
  {
    path: "/signup",
    name: "Sign Up",
    description: "Create a new account",
  },
  {
    path: "/login",
    name: "Login",
    description: "Sign in to your account",
  },
  {
    path: "/forgot-password",
    name: "Forgot Password",
    description: "Reset your password",
  },
  {
    path: "/reset-password",
    name: "Reset Password",
    description: "Set a new password",
  },
  {
    path: "/verify-email",
    name: "Verify Email",
    description: "Verify your email address",
  },

  // Protected routes
  {
    path: "/dashboard",
    name: "Dashboard",
    requiresAuth: true,
    allowedStakeholders: ["buyer", "seller", "originator", "investor", "funder", "regulatory"],
  },
  {
    path: "/wallet",
    name: "Wallet",
    requiresAuth: true,
    allowedStakeholders: ["buyer", "seller", "originator", "investor", "funder", "regulatory"],
    children: [
      {
        path: "/wallet/overview",
        name: "Overview",
      },
      {
        path: "/wallet/send",
        name: "Send",
      },
      {
        path: "/wallet/receive",
        name: "Receive",
      },
      {
        path: "/wallet/transactions",
        name: "Transactions",
      },
      {
        path: "/wallet/settings",
        name: "Settings",
      },
    ],
  },
  {
    path: "/invoices",
    name: "Invoices",
    requiresAuth: true,
    allowedStakeholders: ["buyer", "seller", "originator"],
    children: [
      {
        path: "/invoices/draft",
        name: "Draft",
      },
      {
        path: "/invoices/sent",
        name: "Sent",
      },
      {
        path: "/invoices/paid",
        name: "Paid",
      },
      {
        path: "/invoices/overdue",
        name: "Overdue",
      },
    ],
  },
  {
    path: "/orders",
    name: "Orders",
    requiresAuth: true,
    allowedStakeholders: ["seller"],
    children: [
      {
        path: "/orders/pending",
        name: "Pending",
      },
      {
        path: "/orders/processing",
        name: "Processing",
      },
      {
        path: "/orders/completed",
        name: "Completed",
      },
    ],
  },
  {
    path: "/financial-services",
    name: "Financial Services",
    requiresAuth: true,
    allowedStakeholders: ["buyer", "seller", "originator", "investor", "funder"],
    children: [
      {
        path: "/financial-services/factoring",
        name: "Factoring",
      },
      {
        path: "/financial-services/trade-finance",
        name: "Trade Finance",
      },
      {
        path: "/financial-services/supply-chain-finance",
        name: "Supply Chain Finance",
      },
      {
        path: "/financial-services/letters-of-credit",
        name: "Letters of Credit",
      },
      {
        path: "/financial-services/guarantees",
        name: "Guarantees",
      },
      {
        path: "/financial-services/electronic-bol",
        name: "Electronic BoL",
      },
    ],
  },
  {
    path: "/analytics",
    name: "Analytics",
    requiresAuth: true,
    allowedStakeholders: ["buyer", "seller", "originator", "investor", "funder", "regulatory"],
    children: [
      {
        path: "/analytics/overview",
        name: "Overview",
      },
      {
        path: "/analytics/sales",
        name: "Sales",
      },
      {
        path: "/analytics/customers",
        name: "Customers",
      },
      {
        path: "/analytics/reports",
        name: "Reports",
      },
    ],
  },
  {
    path: "/settings",
    name: "Settings",
    requiresAuth: true,
    allowedStakeholders: ["buyer", "seller", "originator", "investor", "funder", "regulatory"],
    children: [
      {
        path: "/settings/profile",
        name: "Profile",
      },
      {
        path: "/settings/security",
        name: "Security",
      },
      {
        path: "/settings/notifications",
        name: "Notifications",
      },
      {
        path: "/settings/preferences",
        name: "Preferences",
      },
    ],
  },
]

// Helper function to check if a route is accessible
export const isRouteAccessible = (
  route: Route,
  isAuthenticated: boolean,
  stakeholderType?: StakeholderType
): boolean => {
  if (!route.requiresAuth) return true
  if (!isAuthenticated) return false
  if (!route.allowedStakeholders) return true
  return route.allowedStakeholders.includes(stakeholderType as StakeholderType)
}

// Helper function to get all accessible routes
export const getAccessibleRoutes = (
  isAuthenticated: boolean,
  stakeholderType?: StakeholderType
): Route[] => {
  return routes.filter((route) => isRouteAccessible(route, isAuthenticated, stakeholderType))
} 
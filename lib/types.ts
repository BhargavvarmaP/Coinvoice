// User types
export type UserRole =
  | "admin"
  | "originator"
  | "investor"
  | "funder"
  | "regulatory"
  | "auditor"
  | "compliance_officer"
  | "risk_manager"

export type Permission =
  | "view_dashboard"
  | "manage_invoices"
  | "tokenize_invoices"
  | "view_marketplace"
  | "create_listing"
  | "purchase_token"
  | "manage_users"
  | "view_reports"
  | "approve_kyc"
  | "view_audit_logs"
  | "manage_compliance"
  | "view_risk_alerts"
  | "manage_entities"
  | "view_analytics"
  | "manage_payments"
  | "manage_wallet"

export type StakeholderType = "originator" | "investor" | "funder" | "regulatory"

export interface UserProfile {
  id: string
  name: string
  email: string
  role: UserRole | string
  walletAddress: string
  company?: string
  avatar?: string
  coinPoints: number
  kycStatus: "verified" | "pending" | "not_started"
  twoFactorEnabled: boolean
  notifications?: {
    email: boolean
    push: boolean
    sms: boolean
  }
  permissions?: Permission[]
  createdAt?: Date
  lastLogin?: Date
}

// Authentication types
export interface AuthState {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignupData {
  name: string
  email: string
  password: string
  company?: string
}

export interface WalletLoginData {
  address: string
  signature: string
  message: string
}

export interface OAuthLoginData {
  provider: "google" | "github" | "linkedin"
  token: string
}

// Token and marketplace types
export interface Token {
  id: string
  amount: number
  dueDate: string
  price: number
  yield: string
  issuer: string
  risk: string
  industry: string
  category: string
  description: string
  status?: string
  purchaseDate?: string
}

export interface MarketplaceListing {
  id: string
  tokenId: string
  tokenType: "invoice" | "loc" | "guarantee" | "ebol"
  title: string
  description: string
  issuer: string
  issuerRating: number
  faceValue: number
  discountRate: number
  currentValue: number
  maturityDate: string
  category: string
  riskRating: "AAA" | "AA" | "A" | "BBB" | "BB" | "B" | "CCC" | "CC" | "C" | "D"
  status: "active" | "sold" | "expired"
  createdAt: Date
  expiresAt: Date
  imageUrl?: string
}

// Invoice types
export interface Invoice {
  id: string
  invoiceNumber: string
  amount: number
  dueDate: string
  issueDate: string
  company: string
  description?: string
  status: "draft" | "pending" | "tokenized" | "paid" | "overdue"
  tokenId?: string
  attachmentUrl?: string
  createdAt: Date
  updatedAt: Date
}

// Wallet and transaction types
export interface WalletBalance {
  token: string
  balance: number
  value: number
  change: number
}

export interface Transaction {
  id: string
  type: "send" | "receive" | "swap" | "stake" | "unstake" | "claim"
  amount: number
  token: string
  date: string
  status: "completed" | "pending" | "failed"
  from?: string
  to?: string
}

export interface Asset {
  id: string
  name: string
  symbol: string
  balance: number
  value: number
  change24h: number
  icon: string
}

// Notification types
export interface NotificationType {
  id: string
  title: string
  description: string
  message: string
  time: string
  createdAt: string
  read: boolean
  type: "info" | "success" | "warning" | "error"
}

// Regulatory and compliance types
export interface AuditLog {
  id: string
  timestamp: Date
  action: string
  userId: string
  userName: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
}

export interface ComplianceReport {
  id: string
  title: string
  type: string
  createdAt: Date
  createdBy: string
  status: string
  findings: Array<{
    id: string
    severity: string
    description: string
    recommendation: string
  }>
  summary: string
  riskScore: number
}

export interface RiskAlert {
  id: string
  title: string
  type: string
  severity: "low" | "medium" | "high" | "critical"
  createdAt: Date
  description: string
  affectedEntities: Array<{
    id: string
    name: string
    type: string
  }>
  status: string
  assignedTo: string | null
}

export interface EntityData {
  id: string
  name: string
  type: string
  identifier: string
  country: string
  createdAt: Date
  updatedAt: Date
  status: string
  riskScore: number
  kycStatus: string
  relatedEntities: Array<{
    id: string
    name: string
    type: string
    relationship: string
  }>
}

// Testing types
export interface TestCase {
  id: string
  name: string
  description: string
  component: string
  steps: string[]
  expectedResult: string
  status: "passed" | "failed" | "pending"
  lastRun?: Date
}

export interface TestResult {
  testId: string
  passed: boolean
  timestamp: Date
  duration: number
  error?: string
  screenshot?: string
}

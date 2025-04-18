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
  walletAddress: string
  avatar?: string
  coinPoints: number
  role: string
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
  symbol: string
  name: string
  value: number
  dueDate: string
  issuer: string
  status: 'active' | 'expired' | 'redeemed'
  discount?: number  // Discount rate for tokenized invoices (1-2% as per whitepaper)
  tokenType?: 'invoice' | 'loc' | 'guarantee' | 'ebol'  // Type of tokenized asset
  riskRating?: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'CC' | 'C' | 'D'  // Risk assessment rating
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
  client: string
  amount: number
  status: 'Paid' | 'Pending' | 'Failed' | 'Overdue'
  date: string
  dueDate?: string
  description?: string
  currency?: string
  items?: InvoiceItem[]
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

// Wallet and transaction types
export interface WalletBalance {
  total: number
  available: number
  locked: number
  walletAddress: string
}

export interface Transaction {
  id: string
  type: 'send' | 'receive' | 'swap' | 'tokenize' | 'redeem'
  amount: number
  token: string
  asset?: string // For backward compatibility
  timestamp?: Date
  status: 'completed' | 'pending' | 'failed'
  counterparty?: string
  description?: string
  from?: string
  to?: string
  txHash?: string
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
export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string | Date
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

export interface AppState {
  userProfile: UserProfile | null
  stakeholderType: StakeholderType
  sidebarCollapsed: boolean
  assets: Asset[]
  walletBalance: WalletBalance
  tokens: Token[]
  notifications: Notification[]
  transactions: Transaction[]
  unreadNotificationsCount: number
  isLoading: boolean
  error: string | null
  setStakeholderType: (type: StakeholderType) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  refreshData: (showToast?: boolean) => Promise<void>
}

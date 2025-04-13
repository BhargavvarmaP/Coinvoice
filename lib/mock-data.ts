import type {
  NotificationType,
  Token,
  Transaction,
  WalletBalance,
  UserProfile,
  Invoice,
  MarketplaceListing,
  Asset,
  AuditLog,
  ComplianceReport,
  RiskAlert,
  EntityData,
  UserRole,
  Permission,
} from "@/lib/types"
import { faker } from "@faker-js/faker"

// Set seed for consistent data
faker.seed(123)

// Company names for issuers
const COMPANIES = [
  "Acme Global Logistics",
  "TechNova Solutions",
  "MediCore Healthcare",
  "EcoSustain Energy",
  "QuantumTrade Finance",
  "Atlas Manufacturing",
  "OceanRoute Shipping",
  "AgriTech Innovations",
  "BuildPro Construction",
  "RetailEdge Dynamics",
  "GlobalPay Systems",
  "SecureChain Supply",
  "IndustrialForge",
  "FinEdge Capital",
  "PharmaLink International",
]

// Industries
const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Manufacturing",
  "Energy",
  "Logistics",
  "Agriculture",
  "Construction",
  "Retail",
  "Finance",
  "Pharmaceuticals",
]

// Token categories
const CATEGORIES = ["receivables", "letters-of-credit", "guarantees", "ebol", "bonds", "trade-finance", "supply-chain"]

// Risk ratings
const RISK_RATINGS = ["AAA", "AA", "A", "BBB", "BB", "B", "CCC", "CC", "C", "D"]

// User roles
const USER_ROLES: UserRole[] = [
  "admin",
  "originator",
  "investor",
  "funder",
  "regulatory",
  "auditor",
  "compliance_officer",
  "risk_manager",
]

// Permissions
const PERMISSIONS: Permission[] = [
  "view_dashboard",
  "manage_invoices",
  "tokenize_invoices",
  "view_marketplace",
  "create_listing",
  "purchase_token",
  "manage_users",
  "view_reports",
  "approve_kyc",
  "view_audit_logs",
  "manage_compliance",
  "view_risk_alerts",
  "manage_entities",
  "view_analytics",
  "manage_payments",
  "manage_wallet",
]

// Generate a random date in the future
const futureDateString = (minDays = 30, maxDays = 180) => {
  const date = new Date()
  date.setDate(date.getDate() + faker.number.int({ min: minDays, max: maxDays }))
  return date.toISOString().split("T")[0]
}

// Generate a past date string
const pastDateString = (minDays = 1, maxDays = 30) => {
  const date = new Date()
  date.setDate(date.getDate() - faker.number.int({ min: minDays, max: maxDays }))
  return date.toISOString().split("T")[0]
}

// Generate a token ID
const generateTokenId = (prefix = "CVT") => {
  return `${prefix}-${faker.number.int({ min: 1000, max: 9999 })}`
}

// Generate a wallet address
const generateWalletAddress = () => {
  return `0x${faker.string.hexadecimal({ length: 40 }).toLowerCase()}`
}

// Generate a transaction hash
const generateTxHash = () => {
  return `0x${faker.string.hexadecimal({ length: 64 }).toLowerCase()}`
}

// Generate a token
const generateToken = (overrides = {}): Token => {
  const amount = faker.number.int({ min: 1000, max: 50000 })
  const yieldPercentage = faker.number.float({ min: 2, max: 8, precision: 0.1 })
  const price = Math.round(amount * (1 - yieldPercentage / 100))
  const industry = faker.helpers.arrayElement(INDUSTRIES)
  const category = faker.helpers.arrayElement(CATEGORIES)

  return {
    id: generateTokenId(),
    amount,
    dueDate: futureDateString(),
    price,
    yield: `${yieldPercentage.toFixed(1)}%`,
    issuer: faker.helpers.arrayElement(COMPANIES),
    risk: faker.helpers.arrayElement(["Low", "Medium", "High"]),
    industry,
    category,
    description: `${industry} sector invoice for goods and services provided to a tier-1 client.`,
    ...overrides,
  }
}

// Generate a notification
const generateNotification = (overrides = {}): NotificationType => {
  const types = ["info", "success", "warning", "error"] as const
  const type = faker.helpers.arrayElement(types)

  let title, description

  switch (type) {
    case "info":
      title = "New marketplace listing"
      description = `A new ${faker.helpers.arrayElement(CATEGORIES)} token matching your criteria is available.`
      break
    case "success":
      title = "Payment received"
      description = `You received a payment of ${faker.number.int({ min: 1000, max: 10000 })} for ${generateTokenId()}.`
      break
    case "warning":
      title = "Token expiring soon"
      description = `Your token ${generateTokenId()} is due in 7 days.`
      break
    case "error":
      title = "Transaction failed"
      description = "Your recent transaction could not be completed. Please try again."
      break
  }

  return {
    id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    description,
    time: faker.helpers.arrayElement(["Just now", "5 minutes ago", "1 hour ago", "Yesterday"]),
    read: faker.datatype.boolean(),
    type,
    ...overrides,
  }
}

// Generate a wallet balance
const generateWalletBalance = (overrides = {}): WalletBalance => {
  const total = faker.number.float({ min: 1000, max: 10000, precision: 0.01 })
  const available = faker.number.float({ min: 500, max: total, precision: 0.01 })
  const locked = total - available

  return {
    total,
    available,
    locked,
    walletAddress: faker.finance.ethereumAddress(),
    ...overrides,
  }
}

// Generate a transaction
const generateTransaction = (overrides = {}): Transaction => {
  const types = ["send", "receive", "swap", "stake", "unstake", "claim"] as const
  const type = faker.helpers.arrayElement(types)
  const tokens = ["CVT", "USDC", "USDT", "ETH", "BTC", "DAI"]
  const token = faker.helpers.arrayElement(tokens)

  return {
    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    amount: faker.number.float({ min: 0.1, max: token === "BTC" ? 1 : token === "ETH" ? 5 : 5000, precision: 0.001 }),
    token,
    date: pastDateString(),
    status: faker.helpers.arrayElement(["completed", "pending", "failed"]),
    from: type === "receive" ? generateWalletAddress() : undefined,
    to: type === "send" ? generateWalletAddress() : undefined,
    ...overrides,
  }
}

// Generate an invoice
const generateInvoice = (overrides = {}): Invoice => {
  const amount = faker.number.int({ min: 1000, max: 50000 })
  const issueDate = pastDateString(1, 30)
  const dueDate = futureDateString(30, 90)
  const company = faker.helpers.arrayElement(COMPANIES)
  const invoiceNumber = `INV-${faker.string.numeric(6)}`
  const isTokenized = faker.datatype.boolean(0.4)

  return {
    id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    invoiceNumber,
    amount,
    issueDate,
    dueDate,
    company,
    description: `Services provided to ${company}`,
    status: isTokenized ? "tokenized" : faker.helpers.arrayElement(["draft", "pending", "paid", "overdue"]),
    tokenId: isTokenized ? generateTokenId() : undefined,
    attachmentUrl: faker.datatype.boolean(0.7) ? `/invoices/${invoiceNumber.toLowerCase()}.pdf` : undefined,
    createdAt: new Date(Date.now() - faker.number.int({ min: 1, max: 30 }) * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    ...overrides,
  }
}

// Generate a marketplace listing
const generateMarketplaceListing = (overrides = {}): MarketplaceListing => {
  const tokenTypes = ["invoice", "loc", "guarantee", "ebol"] as const
  const tokenType = faker.helpers.arrayElement(tokenTypes)
  const faceValue = faker.number.int({ min: 5000, max: 100000 })
  const discountRate = faker.number.float({ min: 2, max: 8, precision: 0.1 })
  const currentValue = Math.round(faceValue * (1 - discountRate / 100))
  const issuer = faker.helpers.arrayElement(COMPANIES)
  const category = faker.helpers.arrayElement(CATEGORIES)
  const maturityDate = futureDateString(30, 180)
  const riskRating = faker.helpers.arrayElement(RISK_RATINGS)

  let title, description

  switch (tokenType) {
    case "invoice":
      title = `${issuer} Invoice`
      description = `Invoice for services provided to ${issuer}`
      break
    case "loc":
      title = `${issuer} Letter of Credit`
      description = `Letter of credit for international trade with ${issuer}`
      break
    case "guarantee":
      title = `${issuer} Performance Guarantee`
      description = `Performance guarantee for project with ${issuer}`
      break
    case "ebol":
      title = `${issuer} Electronic Bill of Lading`
      description = `Electronic bill of lading for shipment to ${issuer}`
      break
  }

  return {
    id: `listing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    tokenId: generateTokenId(tokenType.toUpperCase()),
    tokenType,
    title,
    description,
    issuer,
    issuerRating: faker.number.float({ min: 3.0, max: 5.0, precision: 0.1 }),
    faceValue,
    discountRate,
    currentValue,
    maturityDate,
    category,
    riskRating,
    status: faker.helpers.arrayElement(["active", "sold", "expired"]),
    createdAt: new Date(Date.now() - faker.number.int({ min: 1, max: 30 }) * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + faker.number.int({ min: 1, max: 30 }) * 24 * 60 * 60 * 1000),
    imageUrl: `/marketplace/${tokenType}-${faker.number.int({ min: 1, max: 5 })}.jpg`,
    ...overrides,
  }
}

// Generate an asset
const generateAsset = (overrides = {}): Asset => {
  const tokens = [
    { name: "Coinvoice Token", symbol: "CVT", icon: "/icons/cvt-token.svg" },
    { name: "USD Coin", symbol: "USDC", icon: "/icons/usdc.svg" },
    { name: "Tether", symbol: "USDT", icon: "/icons/usdt.svg" },
    { name: "Ethereum", symbol: "ETH", icon: "/icons/ethereum.svg" },
    { name: "Bitcoin", symbol: "BTC", icon: "/icons/bitcoin.svg" },
    { name: "Dai", symbol: "DAI", icon: "/icons/dai.svg" },
  ]

  const token = faker.helpers.arrayElement(tokens)

  let balance, value
  switch (token.symbol) {
    case "BTC":
      balance = faker.number.float({ min: 0.01, max: 2, precision: 0.0001 })
      value = balance * 60000
      break
    case "ETH":
      balance = faker.number.float({ min: 0.1, max: 10, precision: 0.001 })
      value = balance * 3000
      break
    case "CVT":
      balance = faker.number.float({ min: 100, max: 10000, precision: 0.01 })
      value = balance * 1.2
      break
    default:
      balance = faker.number.float({ min: 100, max: 10000, precision: 0.01 })
      value = balance
  }

  return {
    id: `asset-${token.symbol.toLowerCase()}`,
    name: token.name,
    symbol: token.symbol,
    balance,
    value,
    change24h: faker.number.float({ min: -10, max: 10, precision: 0.01 }),
    icon: token.icon,
    ...overrides,
  }
}

// Generate an audit log
const generateAuditLog = (overrides = {}): AuditLog => {
  const actionTypes = [
    "user_login",
    "user_logout",
    "invoice_created",
    "invoice_updated",
    "invoice_deleted",
    "token_created",
    "token_transferred",
    "listing_created",
    "listing_updated",
    "listing_deleted",
    "token_purchased",
    "kyc_submitted",
    "kyc_approved",
    "kyc_rejected",
  ]

  const action = faker.helpers.arrayElement(actionTypes)
  const userId = `user-${faker.string.alphanumeric(8)}`
  const userName = `${faker.person.firstName()} ${faker.person.lastName()}`

  let details
  switch (action) {
    case "user_login":
      details = { method: faker.helpers.arrayElement(["password", "wallet", "oauth"]), ip: faker.internet.ip() }
      break
    case "invoice_created":
    case "invoice_updated":
    case "invoice_deleted":
      details = { invoiceId: `INV-${faker.string.numeric(6)}`, amount: faker.number.int({ min: 1000, max: 50000 }) }
      break
    case "token_created":
    case "token_transferred":
      details = { tokenId: generateTokenId(), amount: faker.number.int({ min: 1000, max: 50000 }) }
      break
    case "listing_created":
    case "listing_updated":
    case "listing_deleted":
    case "token_purchased":
      details = {
        listingId: `listing-${faker.string.alphanumeric(8)}`,
        tokenId: generateTokenId(),
        amount: faker.number.int({ min: 1000, max: 50000 }),
      }
      break
    case "kyc_submitted":
    case "kyc_approved":
    case "kyc_rejected":
      details = {
        documentType: faker.helpers.arrayElement(["passport", "drivers_license", "id_card"]),
        verificationLevel: faker.helpers.arrayElement(["basic", "advanced", "full"]),
      }
      break
    default:
      details = {}
  }

  return {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(Date.now() - faker.number.int({ min: 1, max: 30 }) * 24 * 60 * 60 * 1000),
    action,
    userId,
    userName,
    details,
    ipAddress: faker.internet.ip(),
    userAgent: faker.internet.userAgent(),
    ...overrides,
  }
}

// Generate a compliance report
const generateComplianceReport = (overrides = {}): ComplianceReport => {
  const reportTypes = ["kyc_verification", "aml_screening", "transaction_monitoring", "regulatory_reporting"]
  const reportType = faker.helpers.arrayElement(reportTypes)

  const findings = []
  const findingCount = faker.number.int({ min: 0, max: 5 })

  for (let i = 0; i < findingCount; i++) {
    findings.push({
      id: `finding-${i}`,
      severity: faker.helpers.arrayElement(["low", "medium", "high", "critical"]),
      description: `Finding ${i + 1}: ${faker.lorem.sentence()}`,
      recommendation: faker.lorem.sentence(),
    })
  }

  return {
    id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: `${reportType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} Report`,
    type: reportType,
    createdAt: new Date(Date.now() - faker.number.int({ min: 1, max: 30 }) * 24 * 60 * 60 * 1000),
    createdBy: `${faker.person.firstName()} ${faker.person.lastName()}`,
    status: faker.helpers.arrayElement(["draft", "submitted", "reviewed", "approved", "rejected"]),
    findings,
    summary: faker.lorem.paragraph(),
    riskScore: faker.number.int({ min: 0, max: 100 }),
    ...overrides,
  }
}

// Generate a risk alert
const generateRiskAlert = (overrides = {}): RiskAlert => {
  const alertTypes = [
    "suspicious_transaction",
    "market_volatility",
    "counterparty_risk",
    "regulatory_change",
    "security_threat",
  ]
  const alertType = faker.helpers.arrayElement(alertTypes)

  return {
    id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: `${alertType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} Alert`,
    type: alertType,
    severity: faker.helpers.arrayElement(["low", "medium", "high", "critical"]),
    createdAt: new Date(Date.now() - faker.number.int({ min: 0, max: 7 }) * 24 * 60 * 60 * 1000),
    description: faker.lorem.paragraph(),
    affectedEntities: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      id: `entity-${faker.string.alphanumeric(8)}`,
      name: faker.helpers.arrayElement(COMPANIES),
      type: faker.helpers.arrayElement(["user", "company", "token", "transaction"]),
    })),
    status: faker.helpers.arrayElement(["new", "investigating", "mitigated", "resolved", "false_positive"]),
    assignedTo: faker.datatype.boolean(0.7) ? `${faker.person.firstName()} ${faker.person.lastName()}` : null,
    ...overrides,
  }
}

// Generate entity data
const generateEntityData = (overrides = {}): EntityData => {
  const entityTypes = ["individual", "company", "financial_institution", "government_entity"]
  const entityType = faker.helpers.arrayElement(entityTypes)

  let name, identifier, country, riskScore, kycStatus

  switch (entityType) {
    case "individual":
      name = `${faker.person.firstName()} ${faker.person.lastName()}`
      identifier = faker.string.alphanumeric(10).toUpperCase()
      country = faker.location.country()
      riskScore = faker.number.int({ min: 0, max: 100 })
      kycStatus = faker.helpers.arrayElement(["not_started", "in_progress", "verified", "rejected"])
      break
    case "company":
      name = faker.helpers.arrayElement(COMPANIES)
      identifier = `REG-${faker.string.alphanumeric(8).toUpperCase()}`
      country = faker.location.country()
      riskScore = faker.number.int({ min: 0, max: 100 })
      kycStatus = faker.helpers.arrayElement(["not_started", "in_progress", "verified", "rejected"])
      break
    case "financial_institution":
      name = `${faker.company.name()} Bank`
      identifier = `FI-${faker.string.alphanumeric(8).toUpperCase()}`
      country = faker.location.country()
      riskScore = faker.number.int({ min: 0, max: 100 })
      kycStatus = faker.helpers.arrayElement(["not_started", "in_progress", "verified", "rejected"])
      break
    case "government_entity":
      name = `${faker.location.country()} ${faker.helpers.arrayElement(["Treasury", "Finance Ministry", "Central Bank"])}`
      identifier = `GOV-${faker.string.alphanumeric(8).toUpperCase()}`
      country = faker.location.country()
      riskScore = faker.number.int({ min: 0, max: 100 })
      kycStatus = faker.helpers.arrayElement(["not_started", "in_progress", "verified", "rejected"])
      break
  }

  return {
    id: `entity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    type: entityType,
    identifier,
    country,
    createdAt: new Date(Date.now() - faker.number.int({ min: 1, max: 365 }) * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - faker.number.int({ min: 0, max: 30 }) * 24 * 60 * 60 * 1000),
    status: faker.helpers.arrayElement(["active", "inactive", "suspended", "under_review"]),
    riskScore,
    kycStatus,
    relatedEntities: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
      id: `entity-${faker.string.alphanumeric(8)}`,
      name: faker.helpers.arrayElement(COMPANIES),
      type: faker.helpers.arrayElement(["individual", "company", "financial_institution", "government_entity"]),
      relationship: faker.helpers.arrayElement(["parent", "subsidiary", "partner", "customer", "supplier"]),
    })),
    ...overrides,
  }
}

// Generate user profile with roles and permissions
const generateUserProfile = (overrides = {}): UserProfile => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const role = faker.helpers.arrayElement(USER_ROLES)

  // Assign permissions based on role
  let userPermissions: Permission[] = []

  switch (role) {
    case "admin":
      userPermissions = [...PERMISSIONS] // All permissions
      break
    case "originator":
      userPermissions = [
        "view_dashboard",
        "manage_invoices",
        "tokenize_invoices",
        "view_marketplace",
        "create_listing",
        "view_analytics",
        "manage_wallet",
      ]
      break
    case "investor":
      userPermissions = ["view_dashboard", "view_marketplace", "purchase_token", "view_analytics", "manage_wallet"]
      break
    case "funder":
      userPermissions = ["view_dashboard", "view_marketplace", "purchase_token", "view_analytics", "manage_wallet"]
      break
    case "regulatory":
      userPermissions = [
        "view_dashboard",
        "view_reports",
        "view_audit_logs",
        "manage_compliance",
        "view_risk_alerts",
        "manage_entities",
      ]
      break
    case "auditor":
      userPermissions = ["view_dashboard", "view_reports", "view_audit_logs", "view_risk_alerts"]
      break
    case "compliance_officer":
      userPermissions = [
        "view_dashboard",
        "view_reports",
        "approve_kyc",
        "view_audit_logs",
        "manage_compliance",
        "view_risk_alerts",
        "manage_entities",
      ]
      break
    case "risk_manager":
      userPermissions = [
        "view_dashboard",
        "view_reports",
        "view_audit_logs",
        "view_risk_alerts",
        "manage_entities",
        "view_analytics",
      ]
      break
  }

  return {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    role,
    walletAddress: generateWalletAddress(),
    company: faker.helpers.arrayElement([...COMPANIES, undefined]),
    avatar: `/placeholder.svg?height=200&width=200`,
    coinPoints: faker.number.int({ min: 800, max: 2000 }),
    kycStatus: faker.helpers.arrayElement(["verified", "pending", "not_started"]),
    twoFactorEnabled: faker.datatype.boolean(),
    notifications: {
      email: faker.datatype.boolean(),
      push: faker.datatype.boolean(),
      sms: faker.datatype.boolean(),
    },
    permissions: userPermissions,
    createdAt: new Date(Date.now() - faker.number.int({ min: 1, max: 365 }) * 24 * 60 * 60 * 1000),
    lastLogin: new Date(Date.now() - faker.number.int({ min: 0, max: 30 }) * 24 * 60 * 60 * 1000),
    ...overrides,
  }
}

// Main function to generate all mock data
export const generateMockData = (refresh = false) => {
  // If refreshing, we want to generate new data but keep some consistency
  const tokenCount = refresh ? faker.number.int({ min: 20, max: 30 }) : 25
  const myListingsCount = refresh ? faker.number.int({ min: 2, max: 5 }) : 3
  const myPurchasesCount = refresh ? faker.number.int({ min: 2, max: 5 }) : 3
  const notificationsCount = refresh ? faker.number.int({ min: 3, max: 8 }) : 5
  const walletBalancesCount = refresh ? faker.number.int({ min: 3, max: 6 }) : 4
  const transactionsCount = refresh ? faker.number.int({ min: 5, max: 15 }) : 10
  const invoicesCount = refresh ? faker.number.int({ min: 10, max: 20 }) : 15
  const marketplaceListingsCount = refresh ? faker.number.int({ min: 15, max: 25 }) : 20
  const assetsCount = refresh ? faker.number.int({ min: 3, max: 6 }) : 5
  const auditLogsCount = refresh ? faker.number.int({ min: 20, max: 50 }) : 30
  const complianceReportsCount = refresh ? faker.number.int({ min: 5, max: 15 }) : 10
  const riskAlertsCount = refresh ? faker.number.int({ min: 3, max: 10 }) : 5
  const entitiesCount = refresh ? faker.number.int({ min: 10, max: 20 }) : 15
  const usersCount = refresh ? faker.number.int({ min: 5, max: 15 }) : 10

  const walletBalance = {
    total: faker.number.float({ min: 1000, max: 10000, precision: 0.01 }),
    available: faker.number.float({ min: 500, max: 8000, precision: 0.01 }),
    locked: faker.number.float({ min: 100, max: 2000, precision: 0.01 }),
    walletAddress: faker.finance.ethereumAddress()
  }

  return {
    tokens: Array.from({ length: tokenCount }, () => generateToken()),
    myListings: Array.from({ length: myListingsCount }, () =>
      generateToken({
        issuer: "Your Company",
        status: faker.helpers.arrayElement(["Listed", "Pending", "Sold"]),
      }),
    ),
    myPurchases: Array.from({ length: myPurchasesCount }, () =>
      generateToken({
        purchaseDate: pastDateString(),
      }),
    ),
    notifications: Array.from({ length: notificationsCount }, () => generateNotification()),
    walletBalance,
    transactions: Array.from({ length: transactionsCount }, () => generateTransaction()),
    invoices: Array.from({ length: invoicesCount }, () => generateInvoice()),
    marketplaceListings: Array.from({ length: marketplaceListingsCount }, () => generateMarketplaceListing()),
    assets: Array.from({ length: assetsCount }, () => generateAsset()),
    auditLogs: Array.from({ length: auditLogsCount }, () => generateAuditLog()),
    complianceReports: Array.from({ length: complianceReportsCount }, () => generateComplianceReport()),
    riskAlerts: Array.from({ length: riskAlertsCount }, () => generateRiskAlert()),
    entities: Array.from({ length: entitiesCount }, () => generateEntityData()),
    users: Array.from({ length: usersCount }, () => generateUserProfile()),
    userProfile: generateUserProfile({
      role: "admin",
      permissions: [...PERMISSIONS],
      name: "John Doe",
      email: "admin@coinvoice.com",
      walletAddress: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
      company: "Coinvoice",
      coinPoints: 5000,
      kycStatus: "verified",
      twoFactorEnabled: true,
    }),
  }
}

// Generate role-based permissions mapping
export const generateRolePermissions = () => {
  return {
    admin: [...PERMISSIONS],
    originator: [
      "view_dashboard",
      "manage_invoices",
      "tokenize_invoices",
      "view_marketplace",
      "create_listing",
      "view_analytics",
      "manage_wallet",
    ],
    investor: ["view_dashboard", "view_marketplace", "purchase_token", "view_analytics", "manage_wallet"],
    funder: ["view_dashboard", "view_marketplace", "purchase_token", "view_analytics", "manage_wallet"],
    regulatory: [
      "view_dashboard",
      "view_reports",
      "view_audit_logs",
      "manage_compliance",
      "view_risk_alerts",
      "manage_entities",
    ],
    auditor: ["view_dashboard", "view_reports", "view_audit_logs", "view_risk_alerts"],
    compliance_officer: [
      "view_dashboard",
      "view_reports",
      "approve_kyc",
      "view_audit_logs",
      "manage_compliance",
      "view_risk_alerts",
      "manage_entities",
    ],
    risk_manager: [
      "view_dashboard",
      "view_reports",
      "view_audit_logs",
      "view_risk_alerts",
      "manage_entities",
      "view_analytics",
    ],
  }
}

// Export test data generation functions
export const testData = {
  generateToken,
  generateNotification,
  generateWalletBalance,
  generateTransaction,
  generateInvoice,
  generateMarketplaceListing,
  generateAsset,
  generateAuditLog,
  generateComplianceReport,
  generateRiskAlert,
  generateEntityData,
  generateUserProfile,
  generateWalletAddress,
  generateTxHash,
  generateTokenId,
  pastDateString,
  futureDateString,
}

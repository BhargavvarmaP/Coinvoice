import { create } from "zustand"
import { persist } from "zustand/middleware"
import { ethers } from "ethers"
import { EthereumProvider } from "@walletconnect/ethereum-provider"
import { Transaction, Token, WalletBalance } from "./types"
import { Notification, NotificationType, MarketplaceListing } from "./types"

// Define stakeholder types including regulatory
export type StakeholderType = 'buyer' | 'seller' | 'originator' | 'investor' | 'funder' | 'regulatory' | "individual" | "business" | "merchant" | "admin"

// Define user profile type
export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  company: string
  walletAddress: string
  avatar?: string
  coinPoints: number
  tier: string
  kycVerified: boolean
  twoFactorEnabled: boolean
  lastLogin: string
}

// Define asset type
export interface Asset {
  id: string
  name: string
  symbol: string
  balance: number
  value: number
  change24h: number
  icon: string
}

// Define invoice type
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

// Define marketplace listing type
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

// Define notification type
export interface Notification {
  id: string
  title: string
  description?: string
  message: string
  time?: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: Date
}

// Define app state
export interface AppState {
  // User and authentication
  isAuthenticated: boolean
  userProfile: UserProfile | null
  notifications: Notification[]
  unreadNotificationsCount: number

  // UI state
  stakeholderType: StakeholderType
  sidebarCollapsed: boolean
  isDarkMode: boolean

  // Web3 connection state
  isWeb3Connected: boolean
  web3Loading: boolean
  web3Error: string | null
  connectWeb3: () => Promise<void>
  disconnectWeb3: () => void

  // Wallet state
  assets: Asset[]
  transactions: Transaction[]
  walletBalances: WalletBalance[]
  tokens: Token[]
  refreshWalletBalances: () => void
  refreshTokens: () => void

  // Business data
  invoices: Invoice[]
  marketplaceListings: MarketplaceListing[]

  // Actions
  setStakeholderType: (type: StakeholderType) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setDarkMode: (isDark: boolean) => void
  login: (profile: UserProfile) => void
  logout: () => void
  refreshData: (force?: boolean) => void
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void
  addInvoice: (invoice: Invoice) => void
  updateInvoice: (id: string, updates: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void
}

// Generate mock data
const generateMockData = () => {
  // Mock assets
  const assets: Asset[] = [
    {
      id: "cvt-token",
      name: "Coinvoice Token",
      symbol: "CVT",
      balance: 1250.75,
      value: 1250.75,
      change24h: 2.5,
      icon: "/icons/cvt-token.svg",
    },
    {
      id: "usdc",
      name: "USD Coin",
      symbol: "USDC",
      balance: 5000,
      value: 5000,
      change24h: 0.1,
      icon: "/icons/usdc.svg",
    },
    {
      id: "eth",
      name: "Ethereum",
      symbol: "ETH",
      balance: 1.25,
      value: 3750,
      change24h: -1.2,
      icon: "/icons/ethereum.svg",
    },
  ]

  // Mock transactions
  const transactions: Transaction[] = [
    {
      id: "1",
      type: "tokenize",
      asset: "Invoice #123",
      amount: 1000,
      token: "INV-123",
      timestamp: new Date(),
      status: "completed",
      counterparty: "Acme Corp",
      txHash: "0x123...",
    },
    {
      id: "2",
      type: "receive",
      asset: "USDC",
      amount: 500,
      token: "USDC",
      timestamp: new Date(),
      status: "completed",
      counterparty: "0x456...",
      txHash: "0x456...",
    },
    {
      id: "3",
      type: "send",
      asset: "USDC",
      amount: 200,
      token: "USDC",
      timestamp: new Date(),
      status: "completed",
      counterparty: "0x789...",
      txHash: "0x789...",
    },
  ]

  // Mock invoices
  const invoices: Invoice[] = [
    {
      id: "inv1",
      invoiceNumber: "INV-001",
      amount: 5000,
      dueDate: "2025-05-15",
      issueDate: "2025-04-01",
      company: "TechCorp Inc.",
      description: "Software development services",
      status: "tokenized",
      tokenId: "CVT-1001",
      attachmentUrl: "/invoices/inv-001.pdf",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    },
    {
      id: "inv2",
      invoiceNumber: "INV-002",
      amount: 7500,
      dueDate: "2025-05-20",
      issueDate: "2025-04-05",
      company: "Global Supplies Ltd.",
      description: "Office equipment and supplies",
      status: "pending",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    },
    {
      id: "inv3",
      invoiceNumber: "INV-003",
      amount: 3200,
      dueDate: "2025-06-01",
      issueDate: "2025-04-10",
      company: "Acme Solutions",
      description: "Consulting services",
      status: "tokenized",
      tokenId: "CVT-1002",
      attachmentUrl: "/invoices/inv-003.pdf",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
      id: "inv4",
      invoiceNumber: "INV-004",
      amount: 9800,
      dueDate: "2025-06-15",
      issueDate: "2025-04-12",
      company: "Quantum Industries",
      description: "Manufacturing equipment",
      status: "pending",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
    {
      id: "inv5",
      invoiceNumber: "INV-005",
      amount: 4500,
      dueDate: "2025-06-30",
      issueDate: "2025-04-15",
      company: "MegaSoft LLC",
      description: "Software licenses",
      status: "tokenized",
      tokenId: "CVT-1003",
      attachmentUrl: "/invoices/inv-005.pdf",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    },
  ]

  // Mock marketplace listings
  const marketplaceListings: MarketplaceListing[] = [
    {
      id: "listing1",
      tokenId: "CVT-1001",
      tokenType: "invoice",
      title: "TechCorp Inc. Invoice",
      description: "Invoice for software development services",
      issuer: "TechCorp Inc.",
      issuerRating: 4.8,
      faceValue: 5000,
      discountRate: 3.5,
      currentValue: 4825,
      maturityDate: "2025-05-15",
      category: "Technology",
      riskRating: "AA",
      status: "active",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      imageUrl: "/marketplace/tech-invoice.jpg",
    },
    {
      id: "listing2",
      tokenId: "LOC-2001",
      tokenType: "loc",
      title: "International Trade Letter of Credit",
      description: "Letter of credit for international trade with Asia",
      issuer: "Global Trade Bank",
      issuerRating: 4.9,
      faceValue: 25000,
      discountRate: 2.8,
      currentValue: 24300,
      maturityDate: "2025-07-15",
      category: "Banking",
      riskRating: "AAA",
      status: "active",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      imageUrl: "/marketplace/loc-international.jpg",
    },
    {
      id: "listing3",
      tokenId: "GRT-3001",
      tokenType: "guarantee",
      title: "Construction Performance Guarantee",
      description: "Performance guarantee for commercial building project",
      issuer: "BuildSure Guarantors",
      issuerRating: 4.6,
      faceValue: 15000,
      discountRate: 4.2,
      currentValue: 14370,
      maturityDate: "2025-09-30",
      category: "Construction",
      riskRating: "A",
      status: "active",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
      imageUrl: "/marketplace/construction-guarantee.jpg",
    },
    {
      id: "listing4",
      tokenId: "EBOL-4001",
      tokenType: "ebol",
      title: "Shipping Container eBOL",
      description: "Electronic bill of lading for container shipment from Rotterdam to Singapore",
      issuer: "OceanFreight Logistics",
      issuerRating: 4.7,
      faceValue: 12000,
      discountRate: 3.8,
      currentValue: 11544,
      maturityDate: "2025-06-10",
      category: "Logistics",
      riskRating: "A",
      status: "active",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
      imageUrl: "/marketplace/shipping-ebol.jpg",
    },
    {
      id: "listing5",
      tokenId: "CVT-1003",
      tokenType: "invoice",
      title: "MegaSoft LLC Invoice",
      description: "Invoice for software licenses",
      issuer: "MegaSoft LLC",
      issuerRating: 4.5,
      faceValue: 4500,
      discountRate: 3.2,
      currentValue: 4356,
      maturityDate: "2025-06-30",
      category: "Technology",
      riskRating: "A",
      status: "active",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
      imageUrl: "/marketplace/software-invoice.jpg",
    },
  ]

  // Mock notifications
  const notifications: Notification[] = [
    {
      id: "notif1",
      title: "Invoice Tokenized",
      message: "Your invoice INV-001 has been successfully tokenized.",
      type: "success",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    },
    {
      id: "notif2",
      title: "New Marketplace Listing",
      message: "A new invoice matching your criteria is available on the marketplace.",
      type: "info",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    },
    {
      id: "notif3",
      title: "Payment Received",
      message: "You have received a payment of 2,500 USDC.",
      type: "success",
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: "notif4",
      title: "KYC Verification",
      message: "Your KYC verification has been approved.",
      type: "success",
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
      id: "notif5",
      title: "System Maintenance",
      message: "Scheduled maintenance will occur on April 15th at 02:00 UTC.",
      type: "warning",
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
  ]

  return {
    assets,
    transactions,
    invoices,
    marketplaceListings,
    notifications,
  }
}

// Create the store
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      const mockData = generateMockData()

      return {
        // Initial state
        isAuthenticated: true, // For demo purposes
        userProfile: {
          id: "user1",
          name: "John Doe",
          email: "john.doe@example.com",
          role: "Finance Manager",
          company: "Acme Corporation",
          walletAddress: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
          avatar: "/avatars/john-doe.jpg",
          coinPoints: 1251,
          tier: "Gold",
          kycVerified: true,
          twoFactorEnabled: true,
          lastLogin: new Date().toISOString(),
        },
        stakeholderType: "originator",
        sidebarCollapsed: false,
        isDarkMode: false,
        assets: mockData.assets,
        transactions: mockData.transactions,
        walletBalances: [],
        tokens: [],
        invoices: mockData.invoices,
        marketplaceListings: mockData.marketplaceListings,
        notifications: mockData.notifications,
        unreadNotificationsCount: mockData.notifications.filter((n) => !n.read).length,
        refreshWalletBalances: () => {
          // Simulate fetching wallet balances
          set((state) => ({
            walletBalances: [
              { 
                token: "CVT", 
                balance: 1250.75, 
                value: 1250.75, 
                change: 2.5,
                total: 1250.75,
                available: 1000.75,
                locked: 250,
                walletAddress: state.userProfile?.walletAddress || ""
              },
              { 
                token: "USDC", 
                balance: 5000, 
                value: 5000, 
                change: 0.1,
                total: 5000,
                available: 4500,
                locked: 500,
                walletAddress: state.userProfile?.walletAddress || ""
              },
              { 
                token: "ETH", 
                balance: 1.25, 
                value: 3750, 
                change: -1.2,
                total: 1.25,
                available: 1,
                locked: 0.25,
                walletAddress: state.userProfile?.walletAddress || ""
              }
            ]
          }))
        },
        refreshTokens: () => {
          // Simulate fetching tokens
          set((state) => ({
            tokens: [
              {
                id: "token1",
                symbol: "INV-001",
                name: "Invoice Token #001",
                amount: 5000,
                value: 4825,
                dueDate: "2025-05-15",
                price: 4825,
                yield: "3.5%",
                issuer: "TechCorp Inc.",
                risk: "AA",
                industry: "Technology",
                category: "Invoice",
                description: "Software development services invoice token",
                status: "active",
                purchaseDate: "2024-04-01"
              }
            ]
          }))
        },

        // Actions
        setStakeholderType: (type) => set({ stakeholderType: type }),
        setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
        setDarkMode: (isDark) => set({ isDarkMode: isDark }),

        login: (profile) => set({ isAuthenticated: true, userProfile: profile }),

        logout: () => set({ isAuthenticated: false, userProfile: null }),

        refreshData: () => {
          const { coinPoints } = get().userProfile || { coinPoints: 0 }

          // Simulate data updates
          set((state) => ({
            userProfile: state.userProfile
              ? {
                  ...state.userProfile,
                  coinPoints: coinPoints + Math.floor(Math.random() * 2),
                }
              : null,
          }))
        },

        markNotificationAsRead: (id) =>
          set((state) => {
            const updatedNotifications = state.notifications.map((notif) =>
              notif.id === id ? { ...notif, read: true } : notif,
            )

            return {
              notifications: updatedNotifications,
              unreadNotificationsCount: updatedNotifications.filter((n) => !n.read).length,
            }
          }),

        markAllNotificationsAsRead: () =>
          set((state) => {
            const updatedNotifications = state.notifications.map((notif) => ({ ...notif, read: true }))

            return {
              notifications: updatedNotifications,
              unreadNotificationsCount: 0,
            }
          }),

        addInvoice: (invoice) =>
          set((state) => ({
            invoices: [invoice, ...state.invoices],
          })),

        updateInvoice: (id, updates) =>
          set((state) => ({
            invoices: state.invoices.map((invoice) =>
              invoice.id === id ? { ...invoice, ...updates, updatedAt: new Date() } : invoice,
            ),
          })),

        deleteInvoice: (id) =>
          set((state) => ({
            invoices: state.invoices.filter((invoice) => invoice.id !== id),
          })),

        // Web3 connection state and methods
        isWeb3Connected: false,
        web3Loading: false,
        web3Error: null,

        connectWeb3: async () => {
          set({ web3Loading: true, web3Error: null });
          try {
            // Check if window.ethereum is available
            if (typeof window !== 'undefined' && window.ethereum) {
              const provider = window.ethereum as ethers.providers.ExternalProvider & {
                on: (event: string, callback: (accounts: string[]) => void) => void;
                removeAllListeners: (event: string) => void;
              };
              
              // Request account access
              const accounts = await provider.request({ method: 'eth_requestAccounts' });
              
              if (accounts && accounts.length > 0) {
                const address = accounts[0];
                
                // Update user profile with wallet address if needed
                set((state) => ({
                  isWeb3Connected: true,
                  web3Loading: false,
                  userProfile: state.userProfile ? {
                    ...state.userProfile,
                    walletAddress: address
                  } : state.userProfile
                }));
                
                // Setup event listeners for account changes
                provider.on('accountsChanged', (newAccounts: string[]) => {
                  if (newAccounts.length === 0) {
                    // User disconnected their wallet
                    get().disconnectWeb3();
                  } else {
                    // User switched accounts
                    const newAddress = newAccounts[0];
                    set((state) => ({
                      userProfile: state.userProfile ? {
                        ...state.userProfile,
                        walletAddress: newAddress
                      } : state.userProfile
                    }));
                  }
                });
                
                // Setup event listeners for chain changes
                provider.on('chainChanged', () => {
                  // Reload the page when the chain changes
                  window.location.reload();
                });
                
                return;
              }
            }
            throw new Error('No Ethereum provider detected. Please install MetaMask or another wallet.');
          } catch (error) {
            console.error('Web3 connection error:', error);
            set({ 
              isWeb3Connected: false, 
              web3Loading: false, 
              web3Error: error instanceof Error ? error.message : 'Failed to connect wallet'
            });
          }
        },

        disconnectWeb3: () => {
          // Remove event listeners if needed
          if (typeof window !== 'undefined' && window.ethereum) {
            const provider = window.ethereum as ethers.providers.ExternalProvider & {
              removeAllListeners: (event: string) => void;
            };
            provider.removeAllListeners('accountsChanged');
            provider.removeAllListeners('chainChanged');
          }
          
          set({ 
            isWeb3Connected: false,
            web3Loading: false,
            web3Error: null
          });
        },
      }
    },
    {
      name: "coinvoice-storage",
    },
  ),
)

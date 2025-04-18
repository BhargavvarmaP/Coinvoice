"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAppStore } from "@/lib/store"
import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"
import {
  AlertOctagon,
  AlertTriangle,
  ArrowUpRight,
  BadgeDollarSign,
  BarChart2,
  Bell,
  CheckCircle,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  HelpCircle,
  LayoutDashboard,
  PieChartIcon,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Users,
  ArrowDownLeft,
  Percent,
  Globe,
  Shield,
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
  ChevronLeft,
  Network,
  Layers,
  Landmark,
  Banknote,
  Scale,
  ClipboardCheck,
  FileSearch,
  AlertCircle,
  ChevronDown,
  Briefcase,
  Ship,
  Building,
  Wallet,
  TrendingUp,
  FileSpreadsheet as FileSpreadsheetIcon,
  FileText as FileTextIcon,
  ShoppingCart,
  Calendar,
  Check,
  Activity,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CreateInvoiceModal } from "@/components/create-invoice-modal"
import { useAuth } from "@/contexts/auth-context"
import { type WalletBalance, type Transaction, type Token } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"

interface Invoice {
  id: string
  client: string
  amount: number
  status: "Paid" | "Pending" | "Overdue"
  date: string
}

interface BaseChartData {
  name: string
}

interface PieChartData extends BaseChartData {
  value: number
}

interface BarChartData extends BaseChartData {
  tokenized: number
  funded: number
}

interface LineChartData extends BaseChartData {
  apy: number
}

interface Notification {
  id: string
  title: string
  message: string
  type: "success" | "warning" | "error"
  timestamp: Date
  read: boolean
}

interface DashboardMetrics {
  totalLiquidity: number
  totalTokenized: number
  averageDiscount: number
  defaultRate: number
  marketVolume: number
  activeInvestors: number
  crossBorderTransactions: number
  riskScore: number
  apy: number
}

interface LiquidityPoolMetrics {
  totalValue: number
  utilization: number
  apy: number
  activeInvestors: number
  pendingInvoices: number
}

interface RiskMetrics {
  score: number
  trend: number
  defaultRate: number
  fraudRate: number
  disputeRate: number
}

interface TokenizationMetrics {
  totalValue: number
  averageDiscount: number
  successRate: number
  crossBorder: number
  partialSales: number
}

interface ComplianceMetrics {
  kycVerified: number
  amlChecked: number
  auditScore: number
  regulatoryScore: number
  smartContractScore: number
}

interface MarketMetrics {
  totalVolume: number
  dailyTransactions: number
  averageTicketSize: number
  marketShare: number
  growthRate: number
}

export function Dashboard() {
  const { toast } = useToast()
  const { userProfile, walletBalances, tokens, notifications, transactions, refreshData } = useAppStore()
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    refreshData()
  }, [refreshData])

  const handleRefreshData = () => {
    refreshData(true)
    toast({
      title: "Dashboard refreshed",
      description: "The latest data has been loaded.",
    })
  }

  // Calculate total balance and metrics
  const totalBalance = walletBalances.reduce((sum, balance) => sum + balance.total, 0)
  const totalTokenizedValue = tokens.reduce((sum, token) => sum + token.value, 0)
  const averageDiscount = tokens.length > 0 
    ? tokens.reduce((sum, token) => sum + ((token as Token & { discount?: number }).discount || 0), 0) / tokens.length 
    : 0

  // Prepare data for charts
  const pieData: PieChartData[] = walletBalances.map((balance) => ({
    name: balance.walletAddress.slice(0, 6) + '...' + balance.walletAddress.slice(-4),
    value: balance.total,
  }))

  const COLORS = [
    "hsl(var(--primary))", 
    "hsl(var(--primary) / 0.8)",
    "hsl(var(--primary) / 0.6)",
    "hsl(var(--primary) / 0.4)",
    "hsl(var(--secondary))",
    "hsl(var(--secondary) / 0.8)"
  ]

  const barData: BarChartData[] = [
    { name: "Jan", tokenized: 40000, funded: 38000 },
    { name: "Feb", tokenized: 60000, funded: 57000 },
    { name: "Mar", tokenized: 80000, funded: 76000 },
    { name: "Apr", tokenized: 100000, funded: 95000 },
    { name: "May", tokenized: 70000, funded: 66500 },
    { name: "Jun", tokenized: 90000, funded: 85500 },
  ]

  const lineData: LineChartData[] = [
    { name: "Week 1", apy: 8.5 },
    { name: "Week 2", apy: 9.2 },
    { name: "Week 3", apy: 8.8 },
    { name: "Week 4", apy: 10.1 },
    { name: "Week 5", apy: 9.5 },
    { name: "Week 6", apy: 11.2 },
  ]

  const recentInvoices: Invoice[] = [
    {
      id: "INV-001",
      client: "Acme Inc.",
      amount: 1200,
      status: "Paid",
      date: "2023-06-10",
    },
    {
      id: "INV-002",
      client: "Globex Corp.",
      amount: 3500,
      status: "Pending",
      date: "2023-06-08",
    },
    {
      id: "INV-003",
      client: "Stark Industries",
      amount: 8750,
      status: "Overdue",
      date: "2023-05-25",
    },
    {
      id: "INV-004",
      client: "Wayne Enterprises",
      amount: 4200,
      status: "Paid",
      date: "2023-06-02",
    },
  ]

  // Add new metrics from white paper
  const metrics: DashboardMetrics = {
    totalLiquidity: 2500000,
    totalTokenized: 1500000,
    averageDiscount: 2.5,
    defaultRate: 0.8,
    marketVolume: 5000000,
    activeInvestors: 1200,
    crossBorderTransactions: 450,
    riskScore: 85,
    apy: 9.5
  }

  // Add new chart data for risk scoring
  const riskData: LineChartData[] = [
    { name: "Week 1", apy: 85 },
    { name: "Week 2", apy: 87 },
    { name: "Week 3", apy: 84 },
    { name: "Week 4", apy: 86 },
    { name: "Week 5", apy: 88 },
    { name: "Week 6", apy: 85 },
  ]

  // Add new metrics from white paper
  const liquidityPoolMetrics: LiquidityPoolMetrics = {
    totalValue: 5000000,
    utilization: 75,
    apy: 9.5,
    activeInvestors: 1200,
    pendingInvoices: 45
  }

  const riskMetrics: RiskMetrics = {
    score: 85,
    trend: 2.5,
    defaultRate: 0.8,
    fraudRate: 0.2,
    disputeRate: 0.5
  }

  const tokenizationMetrics: TokenizationMetrics = {
    totalValue: 2500000,
    averageDiscount: 2.5,
    successRate: 95,
    crossBorder: 450,
    partialSales: 120
  }

  // Add new metrics from white paper
  const complianceMetrics: ComplianceMetrics = {
    kycVerified: 1500,
    amlChecked: 1450,
    auditScore: 95,
    regulatoryScore: 90,
    smartContractScore: 98
  }

  const marketMetrics: MarketMetrics = {
    totalVolume: 20000000,
    dailyTransactions: 250,
    averageTicketSize: 80000,
    marketShare: 2.5,
    growthRate: 15
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6 bg-background/95 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Welcome back{user?.name ? `, ${user.name}` : ''}
          </h2>
          <p className="text-muted-foreground">
            Manage your tokenized invoices and track your investments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleRefreshData} className="h-9">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setIsCreateInvoiceModalOpen(true)} className="h-9">
            <Plus className="mr-2 h-4 w-4" />
            Tokenize Invoice
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
            <BarChart2 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
            <ShoppingCart className="h-4 w-4" />
            Marketplace
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
            <Layers className="h-4 w-4" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
            <Shield className="h-4 w-4" />
            Risk
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
            <ClipboardCheck className="h-4 w-4" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
            <FileTextIcon className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
            Notifications
            <Badge variant="secondary" className="ml-auto rounded-full px-2 py-0.5 text-xs">
              {notifications.filter((n) => !n.read).length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats Section */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <div className="rounded-full p-2 bg-primary/10">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+{(Math.random() * 10).toFixed(2)}%</span>
                  <span>from last month</span>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 to-primary/5" />
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/5 to-blue-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tokenized Value</CardTitle>
                <div className="rounded-full p-2 bg-blue-500/10">
                  <BadgeDollarSign className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalTokenizedValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {tokens.length} active tokens
                </p>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/20 to-blue-500/5" />
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/5 to-purple-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Discount</CardTitle>
                <div className="rounded-full p-2 bg-purple-500/10">
                  <Percent className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageDiscount.toFixed(2)}%</div>
                <p className="text-xs text-muted-foreground">
                  Market average: 2.1%
                </p>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/20 to-purple-500/5" />
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/5 to-green-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CoinPoints</CardTitle>
                <div className="rounded-full p-2 bg-green-500/10">
                  <CreditCard className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userProfile?.coinPoints || 0}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span>+120 this week</span>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500/20 to-green-500/5" />
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-muted-foreground" />
                  Invoice Tokenization & Funding
                </CardTitle>
                <CardDescription>Monthly tokenization and funding trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="tokenized" fill="hsl(var(--primary))" name="Tokenized" />
                    <Bar dataKey="funded" fill="hsl(var(--primary) / 0.5)" name="Funded" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-muted-foreground" />
                  Token Distribution
                </CardTitle>
                <CardDescription>Distribution of tokenized assets</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          className="stroke-background"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {pieData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm">{entry.name}</span>
                      <span className="text-sm font-medium ml-auto">
                        ${entry.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Section */}
          <Card>
              <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-muted-foreground" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest transactions and activities</CardDescription>
              </CardHeader>
              <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'tokenize' || transaction.type === 'receive'
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {transaction.type === 'tokenize' || transaction.type === 'receive' ? 
                          <ArrowUpRight className="h-4 w-4" /> : 
                          <ArrowDownLeft className="h-4 w-4" />
                        }
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium capitalize">{transaction.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.timestamp ? new Date(transaction.timestamp).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className={`font-medium ${
                      transaction.type === 'tokenize' || transaction.type === 'receive' 
                        ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {transaction.type === 'tokenize' || transaction.type === 'receive' ? '+' : '-'}
                      ${transaction.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Overview Section */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  Market Volume
                </CardTitle>
                <CardDescription>Total transaction volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45.2M</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+12.5%</span>
                  <span>from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  Active Investors
                </CardTitle>
                <CardDescription>Platform participation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,200</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+8.3%</span>
                  <span>new investors</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  Cross-Border
                </CardTitle>
                <CardDescription>International transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">450</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+15.2%</span>
                  <span>from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <div className="rounded-full p-2 bg-primary/10">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$5.2M</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+15%</span>
                  <span>vs last quarter</span>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 to-primary/5" />
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/5 to-blue-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Investors</CardTitle>
                <div className="rounded-full p-2 bg-blue-500/10">
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">248</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+32</span>
                  <span>this month</span>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/20 to-blue-500/5" />
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/5 to-purple-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cross-Border Trades</CardTitle>
                <div className="rounded-full p-2 bg-purple-500/10">
                  <Globe className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">84</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+12%</span>
                  <span>vs last month</span>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/20 to-purple-500/5" />
            </Card>
          </div>

          {/* Analytics Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-muted-foreground" />
                  Token Distribution
                </CardTitle>
                <CardDescription>Breakdown of tokenized assets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="hsl(var(--primary))"
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-muted-foreground" />
                  Market Growth
                </CardTitle>
                <CardDescription>Platform growth metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Line type="monotone" dataKey="apy" stroke="hsl(var(--primary))" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-muted-foreground" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest transactions and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: "act1",
                    type: "investment",
                    amount: 50000,
                    client: "TechCorp Inc.",
                    timestamp: "2024-04-15T10:30:00Z"
                  },
                  {
                    id: "act2",
                    type: "tokenization",
                    amount: 75000,
                    client: "Global Logistics",
                    timestamp: "2024-04-14T15:45:00Z"
                  },
                  {
                    id: "act3",
                    type: "settlement",
                    amount: 100000,
                    client: "Manufacturing Co.",
                    timestamp: "2024-04-14T09:15:00Z"
                  }
                ].map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-2 rounded-full",
                        activity.type === "investment" ? "bg-green-500/10" :
                        activity.type === "tokenization" ? "bg-blue-500/10" :
                        "bg-purple-500/10"
                      )}>
                        {activity.type === "investment" && <ArrowUpRight className="h-4 w-4 text-green-500" />}
                        {activity.type === "tokenization" && <FileText className="h-4 w-4 text-blue-500" />}
                        {activity.type === "settlement" && <CheckCircle className="h-4 w-4 text-purple-500" />}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{activity.client}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>${activity.amount.toLocaleString()}</span>
                          <span>•</span>
                          <span>{new Date(activity.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {activity.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          {/* Marketplace Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Invoices</CardTitle>
                <div className="rounded-full p-2 bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+12</span>
                  <span>this week</span>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 to-primary/5" />
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/5 to-blue-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Market Volume</CardTitle>
                <div className="rounded-full p-2 bg-blue-500/10">
                  <BarChart2 className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2.4M</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+8.2%</span>
                  <span>vs last month</span>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/20 to-blue-500/5" />
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/5 to-purple-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average APY</CardTitle>
                <div className="rounded-full p-2 bg-purple-500/10">
                  <Percent className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.5%</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+1.2%</span>
                  <span>vs last month</span>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/20 to-purple-500/5" />
            </Card>
          </div>

          {/* Market Performance */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-muted-foreground" />
                  Market Volume Trend
                </CardTitle>
                <CardDescription>Monthly trading volume over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Bar dataKey="tokenized" fill="hsl(var(--primary))" />
                      <Bar dataKey="funded" fill="hsl(var(--primary))" opacity={0.5} />
                    </BarChart>
                  </ResponsiveContainer>
                      </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-muted-foreground" />
                  APY Trends
                </CardTitle>
                <CardDescription>Historical yield performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Line type="monotone" dataKey="apy" stroke="hsl(var(--primary))" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Listings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                Recent Listings
              </CardTitle>
              <CardDescription>Latest available invoices for investment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: "inv1",
                    client: "TechCorp Inc.",
                    amount: 50000,
                    apy: 12.5,
                    term: "90 days",
                    status: "Available"
                  },
                  {
                    id: "inv2",
                    client: "Global Logistics",
                    amount: 75000,
                    apy: 11.8,
                    term: "60 days",
                    status: "Available"
                  },
                  {
                    id: "inv3",
                    client: "Manufacturing Co.",
                    amount: 100000,
                    apy: 13.2,
                    term: "120 days",
                    status: "Available"
                  }
                ].map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{invoice.client}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>${invoice.amount.toLocaleString()}</span>
                          <span>•</span>
                          <span>{invoice.apy}% APY</span>
                          <span>•</span>
                          <span>{invoice.term}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">{invoice.status}</Badge>
                      <Button variant="outline" size="sm">
                        Invest
                      </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          {/* Portfolio Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
                <div className="rounded-full p-2 bg-primary/10">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1.2M</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+8.5%</span>
                  <span>this month</span>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 to-primary/5" />
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/5 to-blue-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
                <div className="rounded-full p-2 bg-blue-500/10">
                  <Layers className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+3</span>
                  <span>this month</span>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/20 to-blue-500/5" />
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/5 to-purple-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Return</CardTitle>
                <div className="rounded-full p-2 bg-purple-500/10">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.8%</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+1.2%</span>
                  <span>vs target</span>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/20 to-purple-500/5" />
            </Card>
          </div>

          {/* Portfolio Performance */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-muted-foreground" />
                  Asset Allocation
                </CardTitle>
                <CardDescription>Breakdown of your investments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="hsl(var(--primary))"
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-muted-foreground" />
                  Performance Trend
                </CardTitle>
                <CardDescription>Historical portfolio performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Line type="monotone" dataKey="apy" stroke="hsl(var(--primary))" />
                  </LineChart>
                </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Investments */}
            <Card>
              <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-muted-foreground" />
                Active Investments
              </CardTitle>
              <CardDescription>Your current investment positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                {[
                  {
                    id: "inv1",
                    client: "TechCorp Inc.",
                    amount: 50000,
                    apy: 12.5,
                    term: "90 days",
                    status: "Active"
                  },
                  {
                    id: "inv2",
                    client: "Global Logistics",
                    amount: 75000,
                    apy: 11.8,
                    term: "60 days",
                    status: "Active"
                  },
                  {
                    id: "inv3",
                    client: "Manufacturing Co.",
                    amount: 100000,
                    apy: 13.2,
                    term: "120 days",
                    status: "Active"
                  }
                ].map((investment) => (
                  <div key={investment.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <FileText className="h-4 w-4 text-primary" />
                    </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{investment.client}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>${investment.amount.toLocaleString()}</span>
                          <span>•</span>
                          <span>{investment.apy}% APY</span>
                          <span>•</span>
                          <span>{investment.term}</span>
                    </div>
                    </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">{investment.status}</Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                  </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          {/* Risk Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden bg-gradient-to-br from-red-500/5 to-red-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
                <div className="rounded-full p-2 bg-red-500/10">
                  <Shield className="h-4 w-4 text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85/100</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+2.5%</span>
                  <span>from last month</span>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500/20 to-red-500/5" />
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-500/5 to-yellow-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Default Rate</CardTitle>
                <div className="rounded-full p-2 bg-yellow-500/10">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.8%</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowDownLeft className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">-0.2%</span>
                  <span>from last month</span>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500/20 to-yellow-500/5" />
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/5 to-purple-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fraud Rate</CardTitle>
                <div className="rounded-full p-2 bg-purple-500/10">
                  <AlertOctagon className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.2%</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowDownLeft className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">-0.1%</span>
                  <span>from last month</span>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/20 to-purple-500/5" />
            </Card>
          </div>

          {/* Risk Analysis Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-muted-foreground" />
                  Risk Score Trend
                </CardTitle>
                <CardDescription>Historical risk score performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={riskData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis domain={[0, 100]} className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="apy" 
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--background))', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-muted-foreground" />
                  Risk Distribution
                </CardTitle>
                <CardDescription>Breakdown of risk factors</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="tokenized" fill="hsl(var(--primary))" name="Risk Level" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Risk Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                Risk Alerts
              </CardTitle>
              <CardDescription>Active risk alerts and warnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-red-500/5">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-red-500/10">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">High Risk Transaction Detected</p>
                      <p className="text-xs text-muted-foreground">
                        Unusual activity in account #12345
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Review</Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border bg-yellow-500/5">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-yellow-500/10">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Medium Risk Investment</p>
                      <p className="text-xs text-muted-foreground">
                        Investment in high-volatility sector
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Review</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Metrics Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  Risk Metrics
                </CardTitle>
                <CardDescription>Detailed risk assessment metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Diversification Score</span>
                    <span className="font-medium">85/100</span>
                    </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Liquidity Score</span>
                    <span className="font-medium">90/100</span>
                    </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Market Risk</span>
                    <span className="font-medium">75/100</span>
                  </div>
                    <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Credit Risk</span>
                    <span className="font-medium">80/100</span>
                    </div>
                    </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  Risk Trends
                </CardTitle>
                <CardDescription>Historical risk trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">30-Day Trend</span>
                    <span className="font-medium text-green-500">+2.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">90-Day Trend</span>
                    <span className="font-medium text-green-500">+5.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Annual Trend</span>
                    <span className="font-medium text-green-500">+12.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Volatility</span>
                    <span className="font-medium">5.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Mitigation Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                Risk Mitigation Actions
              </CardTitle>
              <CardDescription>Recommended actions to reduce risk</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <DollarSign className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Diversify Portfolio</p>
                      <p className="text-xs text-muted-foreground">
                        Add investments in different sectors
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Implement</Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Scale className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Increase Liquidity</p>
                      <p className="text-xs text-muted-foreground">
                        Maintain higher cash reserves
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Implement</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          {/* Compliance Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/5 to-green-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                <div className="rounded-full p-2 bg-green-500/10">
                  <ClipboardCheck className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">95/100</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+2.5%</span>
                  <span>from last month</span>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500/20 to-green-500/5" />
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/5 to-blue-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">KYC Status</CardTitle>
                <div className="rounded-full p-2 bg-blue-500/10">
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,500</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+150</span>
                  <span>verified users</span>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/20 to-blue-500/5" />
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/5 to-purple-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AML Status</CardTitle>
                <div className="rounded-full p-2 bg-purple-500/10">
                  <Shield className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,450</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+120</span>
                  <span>checked accounts</span>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/20 to-purple-500/5" />
            </Card>
          </div>

          {/* Compliance Analysis Charts */}
          <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-muted-foreground" />
                  Compliance Score Trend
                </CardTitle>
                <CardDescription>Historical compliance performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis domain={[0, 100]} className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="apy" 
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--background))', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-muted-foreground" />
                  Compliance Distribution
                </CardTitle>
                <CardDescription>Breakdown of compliance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="tokenized" fill="hsl(var(--primary))" name="Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                Compliance Alerts
              </CardTitle>
              <CardDescription>Active compliance issues and warnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-yellow-500/5">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-yellow-500/10">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">KYC Update Required</p>
                      <p className="text-xs text-muted-foreground">
                        5 accounts need KYC verification
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Review</Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border bg-red-500/5">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-red-500/10">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">AML Flag Detected</p>
                      <p className="text-xs text-muted-foreground">
                        Unusual transaction pattern detected
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Investigate</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Metrics Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-muted-foreground" />
                  Regulatory Metrics
                </CardTitle>
                <CardDescription>Detailed regulatory compliance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Regulatory Score</span>
                    <span className="font-medium">90/100</span>
                      </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Smart Contract Score</span>
                    <span className="font-medium">98/100</span>
                    </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Audit Score</span>
                    <span className="font-medium">95/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Update</span>
                    <span className="font-medium">Jun 20, 2023</span>
                </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  Compliance Trends
                </CardTitle>
                <CardDescription>Historical compliance trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">30-Day Trend</span>
                    <span className="font-medium text-green-500">+2.5%</span>
                      </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">90-Day Trend</span>
                    <span className="font-medium text-green-500">+5.2%</span>
                    </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Annual Trend</span>
                    <span className="font-medium text-green-500">+12.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Next Audit</span>
                    <span className="font-medium">Sep 15, 2023</span>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Compliance Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
                Compliance Actions
              </CardTitle>
              <CardDescription>Required compliance tasks and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <FileCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Update KYC Documents</p>
                      <p className="text-xs text-muted-foreground">
                        Review and update KYC documentation
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">AML Review</p>
                      <p className="text-xs text-muted-foreground">
                        Conduct quarterly AML review
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Review</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Reports Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Generated Reports</CardTitle>
                <div className="rounded-full p-2 bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
              </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+12</span>
                  <span>this quarter</span>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 to-primary/5" />
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/5 to-blue-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
                <div className="rounded-full p-2 bg-blue-500/10">
                  <Calendar className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Next 7 days</p>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/20 to-blue-500/5" />
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/5 to-purple-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Report Templates</CardTitle>
                <div className="rounded-full p-2 bg-purple-500/10">
                  <FileSpreadsheet className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">Available templates</p>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/20 to-purple-500/5" />
            </Card>
          </div>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                Recent Reports
              </CardTitle>
              <CardDescription>Your most recent generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: "rep1",
                    name: "Q1 2024 Performance Report",
                    type: "Performance",
                    date: "2024-04-15",
                    status: "Completed",
                    size: "2.4 MB"
                  },
                  {
                    id: "rep2",
                    name: "Monthly Compliance Review",
                    type: "Compliance",
                    date: "2024-04-10",
                    status: "Completed",
                    size: "1.8 MB"
                  },
                  {
                    id: "rep3",
                    name: "Risk Assessment Report",
                    type: "Risk",
                    date: "2024-04-05",
                    status: "In Progress",
                    size: "3.2 MB"
                  }
                ].map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{report.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{report.type}</span>
                          <span>•</span>
                          <span>{report.date}</span>
                          <span>•</span>
                          <span>{report.size}</span>
                      </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={report.status === "Completed" ? "default" : "secondary"}>
                        {report.status}
                        </Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    </div>
                ))}
                  </div>
            </CardContent>
          </Card>

          {/* Report Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                Report Templates
              </CardTitle>
              <CardDescription>Available report templates and configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    name: "Performance Report",
                    description: "Quarterly performance metrics and analysis",
                    icon: <BarChart2 className="h-5 w-5 text-blue-500" />
                  },
                  {
                    name: "Compliance Report",
                    description: "Regulatory compliance documentation",
                    icon: <ClipboardCheck className="h-5 w-5 text-green-500" />
                  },
                  {
                    name: "Risk Assessment",
                    description: "Risk analysis and mitigation strategies",
                    icon: <Shield className="h-5 w-5 text-red-500" />
                  }
                ].map((template) => (
                  <div key={template.name} className="flex flex-col gap-2 p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-2">
                      {template.icon}
                      <span className="font-medium">{template.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Configure
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          {/* Notifications Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread Notifications</CardTitle>
                <div className="rounded-full p-2 bg-primary/10">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notifications.filter(n => !n.read).length}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span>New notifications</span>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 to-primary/5" />
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <CreateInvoiceModal 
        open={isCreateInvoiceModalOpen} 
        onOpenChange={setIsCreateInvoiceModalOpen} 
      />
    </div>
  )
}

export default Dashboard
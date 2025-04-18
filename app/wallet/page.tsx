"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Wallet,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Banknote,
  Coins,
  Bitcoin,
  Ethereum,
  TrendingUp,
  TrendingDown,
  History,
  Settings,
  Send,
  Receive,
  ChevronRight,
  ChevronLeft,
  Menu,
  Search,
  Filter,
  Download,
  Upload,
  Bell,
  User,
  LogOut,
  HelpCircle,
  RefreshCw,
  Plus,
  X,
  Check,
  AlertCircle,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  FileText,
  Briefcase,
  Shield,
  Ship,
  Package,
  Truck,
  FileStack,
  FileWarning,
  FileSearch,
  FileBarChart,
  FileSpreadsheet as FileSpreadsheetIcon,
  FileText as FileTextIcon,
  Calendar as CalendarIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { motion } from "framer-motion"

export default function WalletPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")

  // Sample data for wallet balance
  const balances = {
    total: 25000,
    available: 20000,
    locked: 5000,
    change24h: 5.2,
    change7d: 12.5,
  }

  // Sample data for assets
  const assets = [
    {
      id: "BTC",
      name: "Bitcoin",
      balance: 0.5,
      value: 15000,
      change24h: 3.2,
      change7d: 8.5,
    },
    {
      id: "ETH",
      name: "Ethereum",
      balance: 2.5,
      value: 5000,
      change24h: 2.1,
      change7d: 5.5,
    },
    {
      id: "USDT",
      name: "Tether",
      balance: 5000,
      value: 5000,
      change24h: 0.1,
      change7d: 0.2,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Wallet</h1>
          <p className="text-muted-foreground">Manage your digital assets and transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/wallet/send")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Send</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Transfer Assets</div>
              <p className="text-xs text-muted-foreground">Send to other wallets</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/wallet/receive")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receive</CardTitle>
              <Receive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Receive Assets</div>
              <p className="text-xs text-muted-foreground">Generate deposit address</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/wallet/transactions")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">View History</div>
              <p className="text-xs text-muted-foreground">Check transaction records</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Balance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Balance Overview</CardTitle>
          <CardDescription>Your current wallet balance and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Total Balance</div>
              <div className="text-3xl font-bold">${balances.total.toLocaleString()}</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                {balances.change24h}% (24h)
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Available</div>
              <div className="text-3xl font-bold">${balances.available.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Ready to use</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Locked</div>
              <div className="text-3xl font-bold">${balances.locked.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">In use</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">7d Change</div>
              <div className="text-3xl font-bold">{balances.change7d}%</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                Weekly performance
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets */}
      <Card>
        <CardHeader>
          <CardTitle>Assets</CardTitle>
          <CardDescription>Your current asset holdings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    {asset.id === "BTC" ? (
                      <Bitcoin className="h-6 w-6 text-primary" />
                    ) : asset.id === "ETH" ? (
                      <Ethereum className="h-6 w-6 text-primary" />
                    ) : (
                      <Coins className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{asset.name}</div>
                    <div className="text-sm text-muted-foreground">{asset.balance} {asset.id}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${asset.value.toLocaleString()}</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    {asset.change24h > 0 ? (
                      <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                    )}
                    {asset.change24h}% (24h)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

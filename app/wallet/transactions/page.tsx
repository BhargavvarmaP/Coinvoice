"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
  History,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Banknote,
  Coins,
  Bitcoin,
  Ethereum,
  TrendingUp,
  TrendingDown,
  Settings,
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

export default function TransactionsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")

  // Sample data for transactions
  const transactions = [
    {
      id: "TX-001",
      type: "send",
      asset: "BTC",
      amount: 0.1,
      value: 3000,
      status: "completed",
      date: "2024-04-15T10:30:00",
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      fee: 0.0001,
    },
    {
      id: "TX-002",
      type: "receive",
      asset: "ETH",
      amount: 1.5,
      value: 3000,
      status: "completed",
      date: "2024-04-14T15:45:00",
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      fee: 0.001,
    },
    {
      id: "TX-003",
      type: "send",
      asset: "USDT",
      amount: 1000,
      value: 1000,
      status: "pending",
      date: "2024-04-13T09:20:00",
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      fee: 1,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <p className="text-muted-foreground">View and track your wallet transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>View and manage your transaction history</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-8 w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {transaction.type === "send" ? (
                        <ArrowUpRight className="h-4 w-4 text-red-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-green-500" />
                      )}
                      <span className="capitalize">{transaction.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {transaction.asset === "BTC" ? (
                        <Bitcoin className="h-4 w-4" />
                      ) : transaction.asset === "ETH" ? (
                        <Ethereum className="h-4 w-4" />
                      ) : (
                        <Coins className="h-4 w-4" />
                      )}
                      <span>{transaction.asset}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {transaction.amount} {transaction.asset}
                  </TableCell>
                  <TableCell>${transaction.value.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.status === "completed"
                          ? "default"
                          : transaction.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(transaction.date), "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/wallet/transactions/${transaction.id}`)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 
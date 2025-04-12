"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, addDays } from "date-fns"
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  RefreshCcw,
  Search,
  XCircle,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import type { DateRange } from "react-day-picker"


export function WalletTransactions() {
  const { transactions } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [transactionType, setTransactionType] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  // Filter transactions
  const filteredTransactions = transactions
    .filter((tx) => {
      // Search filter
      if (searchTerm && !tx.id.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Type filter
      if (transactionType !== "all" && tx.type !== transactionType) {
        return false
      }

      // Date range filter (simplified for mock data)
      if (dateRange?.from && dateRange?.to && tx.date) {
        const txDate = new Date(tx.date)
        if (txDate < dateRange.from || txDate > dateRange.to) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : a.timestamp ? new Date(a.timestamp).getTime() : 0
      const dateB = b.date ? new Date(b.date).getTime() : b.timestamp ? new Date(b.timestamp).getTime() : 0
      return dateB - dateA
    })

  // Get transaction icon based on type
  const getTransactionIcon = (type: string, status: string) => {
    if (status === "failed") return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />

    switch (type) {
      case "send":
        return <ArrowUpRight className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      case "receive":
        return <ArrowDownLeft className="h-5 w-5 text-green-600 dark:text-green-400" />
      case "swap":
        return <RefreshCcw className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      case "stake":
      case "unstake":
      case "claim":
        return <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
      default:
        return <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
    }
  }

  // Get transaction status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Completed</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Failed</Badge>
      default:
        return null
    }
  }

  // Get transaction title
  const getTransactionTitle = (tx: any) => {
    switch (tx.type) {
      case "send":
        return `Sent ${tx.amount} ${tx.token}`
      case "receive":
        return `Received ${tx.amount} ${tx.token}`
      case "swap":
        return `Swapped ${tx.amount} ${tx.token}`
      case "stake":
        return `Staked ${tx.amount} ${tx.token}`
      case "unstake":
        return `Unstaked ${tx.amount} ${tx.token}`
      case "claim":
        return `Claimed ${tx.amount} ${tx.token}`
      default:
        return `${tx.amount} ${tx.token}`
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Transaction History</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">View and filter your recent transactions</p>
        </div>

        <Button variant="outline" className="flex items-center gap-2 self-start">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search transactions..."
            className="pl-10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-800/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={transactionType} onValueChange={setTransactionType}>
          <SelectTrigger className="w-[180px] bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-800/50">
            <SelectValue placeholder="Transaction type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="send">Sent</SelectItem>
            <SelectItem value="receive">Received</SelectItem>
            <SelectItem value="swap">Swaps</SelectItem>
            <SelectItem value="stake">Stakes</SelectItem>
            <SelectItem value="unstake">Unstakes</SelectItem>
            <SelectItem value="claim">Claims</SelectItem>
          </SelectContent>
        </Select>

        <DatePickerWithRange className="w-[300px]" value={dateRange} onChange={setDateRange} />
      </div>

      <Card className="glassmorphism">
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {getTransactionIcon(tx.type, tx.status)}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <div className="font-medium">{getTransactionTitle(tx)}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {typeof tx.date === 'string' ? tx.date : tx.date instanceof Date ? format(tx.date, 'MMM dd, yyyy') : 
                             tx.timestamp instanceof Date ? format(tx.timestamp, 'MMM dd, yyyy') : 'Unknown date'}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {getStatusBadge(tx.status)}
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            View Details
                          </Button>
                        </div>
                      </div>

                      {(tx.from || tx.to) && (
                        <div className="mt-2 text-sm">
                          {tx.from && (
                            <div className="text-gray-500 dark:text-gray-400">
                              From:{" "}
                              <span className="font-mono">
                                {tx.from.substring(0, 8)}...{tx.from.substring(tx.from.length - 6)}
                              </span>
                            </div>
                          )}
                          {tx.to && (
                            <div className="text-gray-500 dark:text-gray-400">
                              To:{" "}
                              <span className="font-mono">
                                {tx.to.substring(0, 8)}...{tx.to.substring(tx.to.length - 6)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Clock className="h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium">No transactions found</h3>
                  <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search term</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

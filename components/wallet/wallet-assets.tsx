"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, ChevronDown, ChevronUp, DollarSign, Eye, EyeOff, LineChart, Plus, Wallet } from "lucide-react"
import { useAppStore } from "@/lib/store"

export function WalletAssets() {
  const { walletBalance } = useAppStore()
  const [hideSmallBalances, setHideSmallBalances] = useState(false)
  const [sortBy, setSortBy] = useState("value-desc")

  // Calculate total balance
  const totalBalance = walletBalance.total

  // Since we no longer have an array of balances, we'll need to create a single asset from the walletBalance
  const filteredAssets = [
    {
      id: "main-balance",
      name: "Main Balance",
      symbol: "USD",
      balance: walletBalance.total,
      value: walletBalance.total,
      change24h: 0,
      icon: "/icons/usd.svg"
    }
  ]

  // Get change color based on value
  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600 dark:text-green-400"
    if (change < 0) return "text-red-600 dark:text-red-400"
    return "text-gray-600 dark:text-gray-400"
  }

  // Get token icon based on name
  const getTokenIcon = (token: string) => {
    switch (token) {
      case "CVT":
        return <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      case "USDC":
      case "USDT":
      case "DAI":
        return <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
      case "ETH":
      case "BTC":
        return <LineChart className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      default:
        return <Wallet className="h-5 w-5 text-gray-600 dark:text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Your Assets</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total value: ${totalBalance.toLocaleString()}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHideSmallBalances(!hideSmallBalances)}
            className="flex items-center gap-2"
          >
            {hideSmallBalances ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {hideSmallBalances ? "Show Small Balances" : "Hide Small Balances"}
          </Button>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] h-9 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-800/50">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="value-desc">Value: High to Low</SelectItem>
              <SelectItem value="value-asc">Value: Low to High</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
              <SelectItem value="change-desc">Change: High to Low</SelectItem>
              <SelectItem value="change-asc">Change: Low to High</SelectItem>
            </SelectContent>
          </Select>

          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </div>

      <Card className="glassmorphism">
        <CardContent className="p-0">
          <div className="grid grid-cols-5 bg-gray-50 dark:bg-gray-800 p-4 text-sm font-medium">
            <div className="col-span-2">Asset</div>
            <div className="text-right">Balance</div>
            <div className="text-right">Value (USD)</div>
            <div className="text-right">Change (24h)</div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredAssets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="grid grid-cols-5 p-4 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    {getTokenIcon(asset.symbol)}
                  </div>
                  <div>
                    <div className="font-medium">{asset.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {asset.symbol === "USD"
                        ? "USD"
                        : asset.symbol === "CVT"
                          ? "Coinvoice Token"
                          : asset.symbol === "USDC"
                            ? "USD Coin"
                            : asset.symbol === "USDT"
                              ? "Tether"
                              : asset.symbol === "ETH"
                                ? "Ethereum"
                                : asset.symbol === "BTC"
                                  ? "Bitcoin"
                                  : asset.symbol === "DAI"
                                    ? "Dai"
                                    : "Token"}
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  {asset.balance.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 6,
                  })}
                </div>

                <div className="text-right font-medium">${asset.value.toLocaleString()}</div>

                <div className={`text-right flex items-center justify-end gap-1 ${getChangeColor(asset.change24h)}`}>
                  {asset.change24h > 0 ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : asset.change24h < 0 ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                  {Math.abs(asset.change24h).toFixed(2)}%
                </div>
              </motion.div>
            ))}

            {filteredAssets.length === 0 && (
              <div className="p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Wallet className="h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium">No assets found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {hideSmallBalances
                      ? "Try showing small balances to see all your assets"
                      : "You don't have any assets yet"}
                  </p>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Asset
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

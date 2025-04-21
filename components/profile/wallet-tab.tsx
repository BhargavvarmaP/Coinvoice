"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Wallet, ArrowUpRight, ArrowDownLeft, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

export function WalletTabContent() {
  const { toast } = useToast()
  
  // Mock wallet data
  const walletAddress = "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t"
  const assets = [
    { id: "cvt", name: "Coinvoice Token", symbol: "CVT", balance: 1250, value: 1250, icon: "/placeholder.svg" },
    { id: "btc", name: "Bitcoin", symbol: "BTC", balance: 0.05, value: 2000, icon: "/placeholder.svg" },
    { id: "eth", name: "Ethereum", symbol: "ETH", balance: 0.75, value: 1500, icon: "/placeholder.svg" },
  ]
  
  const transactions = [
    { id: "tx1", type: "receive", amount: 500, token: "CVT", from: "0x1234...5678", date: "2025-04-10", status: "completed" },
    { id: "tx2", type: "send", amount: 250, token: "CVT", to: "0x8765...4321", date: "2025-04-08", status: "completed" },
    { id: "tx3", type: "receive", amount: 0.02, token: "BTC", from: "0x9876...5432", date: "2025-04-05", status: "completed" },
  ]
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: "The wallet address has been copied to your clipboard.",
    })
  }
  
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case "receive":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }
  
  const getTransactionAmountColor = (type: string) => {
    return type === "send" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
  }
  
  const formatTransactionAmount = (type: string, amount: number, token: string) => {
    return `${type === "send" ? "-" : "+"}${amount} ${token}`
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wallet Overview</CardTitle>
          <CardDescription>Manage your digital assets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-blue-600/80 dark:text-blue-400/80">Your Wallet Address</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs sm:text-sm font-mono bg-white/50 dark:bg-gray-800/50 p-2 rounded">
                      {walletAddress}
                    </code>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(walletAddress)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Send
                  </Button>
                  <Button variant="outline" size="sm">
                    <ArrowDownLeft className="mr-2 h-4 w-4" />
                    Receive
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Your Assets</h3>
              <div className="space-y-4">
                {assets.map((asset) => (
                  <div 
                    key={asset.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={asset.icon}
                          alt={asset.name}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-sm text-muted-foreground">{asset.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{asset.balance} {asset.symbol}</div>
                      <div className="text-sm text-muted-foreground">${asset.value.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div 
                    key={tx.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                        {getTransactionTypeIcon(tx.type)}
                      </div>
                      <div>
                        <div className="font-medium capitalize">{tx.type}</div>
                        <div className="text-sm text-muted-foreground">
                          {tx.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${getTransactionAmountColor(tx.type)}`}>
                        {formatTransactionAmount(tx.type, tx.amount, tx.token)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {tx.type === "send" ? `To: ${tx.to}` : `From: ${tx.from}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline">
                  View All Transactions
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
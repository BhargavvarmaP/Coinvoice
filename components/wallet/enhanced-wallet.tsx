"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientText } from "@/components/ui/gradient-text"
import {
  ArrowDownUp,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  History,
  LineChart,
  Plus,
  QrCode,
  RefreshCw,
  Send,
  Shield,
  Wallet,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"

// Mock data for wallet
const mockWalletData = {
  address: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  balance: {
    eth: 1.245,
    usd: 3245.67,
  },
  tokens: [
    {
      id: "eth",
      name: "Ethereum",
      symbol: "ETH",
      balance: 1.245,
      value: 3245.67,
      change24h: 2.5,
      icon: "/placeholder.svg",
    },
    {
      id: "usdc",
      name: "USD Coin",
      symbol: "USDC",
      balance: 2500.00,
      value: 2500.00,
      change24h: 0.1,
      icon: "/placeholder.svg",
    },
    {
      id: "cvt",
      name: "Coinvoice Token",
      symbol: "CVT",
      balance: 150.00,
      value: 750.00,
      change24h: 5.2,
      icon: "/placeholder.svg",
    },
  ],
  invoiceTokens: [
    {
      id: "CVT-2025-0042",
      invoiceId: "INV-2025-0042",
      issuer: "Acme Corporation",
      faceValue: 5250.00,
      maturityDate: "2025-05-01",
      daysToMaturity: 30,
      status: "Active",
    },
    {
      id: "CVT-2025-0043",
      invoiceId: "INV-2025-0043",
      issuer: "Global Logistics Inc",
      faceValue: 12750.00,
      maturityDate: "2025-06-15",
      daysToMaturity: 75,
      status: "Active",
    },
  ],
  transactions: [
    {
      id: "tx1",
      type: "Received",
      amount: 0.5,
      token: "ETH",
      value: 1305.25,
      from: "0xabcd...1234",
      to: "0x1a2b...9a0b",
      timestamp: "2025-04-11T08:30:45Z",
      status: "Confirmed",
      hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    },
    {
      id: "tx2",
      type: "Sent",
      amount: 1000,
      token: "USDC",
      value: 1000,
      from: "0x1a2b...9a0b",
      to: "0xefgh...5678",
      timestamp: "2025-04-10T14:22:15Z",
      status: "Confirmed",
      hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    },
    {
      id: "tx3",
      type: "Purchase",
      amount: 1,
      token: "CVT-2025-0042",
      value: 5066.25,
      from: "Marketplace",
      to: "0x1a2b...9a0b",
      timestamp: "2025-04-09T11:15:30Z",
      status: "Confirmed",
      hash: "0x2345678901abcdef2345678901abcdef2345678901abcdef2345678901abcdef",
    },
    {
      id: "tx4",
      type: "Received",
      amount: 150,
      token: "CVT",
      value: 750,
      from: "Staking Rewards",
      to: "0x1a2b...9a0b",
      timestamp: "2025-04-08T09:45:12Z",
      status: "Confirmed",
      hash: "0x3456789012abcdef3456789012abcdef3456789012abcdef3456789012abcdef",
    },
    {
      id: "tx5",
      type: "Sent",
      amount: 0.25,
      token: "ETH",
      value: 652.63,
      from: "0x1a2b...9a0b",
      to: "0xijkl...9012",
      timestamp: "2025-04-07T16:33:22Z",
      status: "Confirmed",
      hash: "0x456789012abcdef3456789012abcdef3456789012abcdef3456789012abcdef34",
    },
  ],
}

export function EnhancedWallet() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [hideBalances, setHideBalances] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleCopyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: message,
    })
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Refreshed",
        description: "Your wallet data has been updated.",
      })
    }, 1500)
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "Received":
        return <ArrowDownUp className="h-4 w-4 text-green-500 rotate-135" />
      case "Sent":
        return <ArrowDownUp className="h-4 w-4 text-red-500 -rotate-45" />
      case "Purchase":
        return <CreditCard className="h-4 w-4 text-blue-500" />
      default:
        return <History className="h-4 w-4" />
    }
  }

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500"
      case "Pending":
        return "bg-yellow-500"
      case "Failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            <GradientText gradient="blue-purple">Blockchain Wallet</GradientText>
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your crypto assets and invoice tokens
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Funds
          </Button>
        </div>
      </div>

      <GlassCard className="p-6" intensity="light" borderGradient>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Wallet Address</p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleCopyToClipboard(
                  mockWalletData.address,
                  "Wallet address copied to clipboard"
                )}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="font-mono text-sm">{formatAddress(mockWalletData.address)}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <QrCode className="mr-2 h-4 w-4" />
              Show QR
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => setHideBalances(!hideBalances)}>
              {hideBalances ? (
                <Eye className="mr-2 h-4 w-4" />
              ) : (
                <EyeOff className="mr-2 h-4 w-4" />
              )}
              {hideBalances ? 'Show' : 'Hide'} Balances
            </Button>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-1">
            {hideBalances ? '••••••' : `$${mockWalletData.balance.usd.toLocaleString()}`}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {hideBalances ? '••••••' : `${mockWalletData.balance.eth.toFixed(4)} ETH`}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
          <Button variant="outline">
            <ArrowDownUp className="mr-2 h-4 w-4" />
            Receive
          </Button>
          <Button variant="outline">
            <ArrowRight className="mr-2 h-4 w-4" />
            Swap
          </Button>
          <Button variant="outline">
            <LineChart className="mr-2 h-4 w-4" />
            Stake
          </Button>
        </div>
      </GlassCard>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center">
            <Wallet className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tokens" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Tokens
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Invoice Tokens
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center">
            <History className="mr-2 h-4 w-4" />
            Transactions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Assets Overview</CardTitle>
                <CardDescription>Your crypto and token holdings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockWalletData.tokens.map((token) => (
                    <div key={token.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={token.icon} alt={token.name} />
                          <AvatarFallback>{token.symbol.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{token.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{token.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {hideBalances ? '••••••' : `${token.balance.toLocaleString()} ${token.symbol}`}
                        </p>
                        <p className={`text-sm ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {hideBalances ? '••••••' : `$${token.value.toLocaleString()}`}
                          {' '}
                          <span>
                            {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Token
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockWalletData.transactions.slice(0, 3).map((tx) => (
                    <div key={tx.id} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="font-medium truncate">{tx.type}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {formatTimestamp(tx.timestamp)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${tx.type === 'Received' ? 'text-green-500' : tx.type === 'Sent' ? 'text-red-500' : ''}`}>
                          {tx.type === 'Sent' ? '-' : tx.type === 'Received' ? '+' : ''}
                          {hideBalances ? '••••••' : `${tx.amount} ${tx.token}`}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {hideBalances ? '••••••' : `$${tx.value.toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" onClick={() => setActiveTab("transactions")}>
                  View All Transactions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Tokens</CardTitle>
              <CardDescription>Your tokenized invoice holdings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
                      <th className="pb-3 font-medium">Token ID</th>
                      <th className="pb-3 font-medium">Issuer</th>
                      <th className="pb-3 font-medium">Face Value</th>
                      <th className="pb-3 font-medium">Maturity Date</th>
                      <th className="pb-3 font-medium">Days Left</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockWalletData.invoiceTokens.map((token) => (
                      <tr key={token.id} className="border-t">
                        <td className="py-3 font-medium">{token.id}</td>
                        <td className="py-3">{token.issuer}</td>
                        <td className="py-3">
                          {hideBalances ? '••••••' : `$${token.faceValue.toLocaleString()}`}
                        </td>
                        <td className="py-3">{token.maturityDate}</td>
                        <td className="py-3">{token.daysToMaturity}</td>
                        <td className="py-3">
                          <Badge className="bg-green-500">{token.status}</Badge>
                        </td>
                        <td className="py-3">
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setActiveTab("invoices")}>
                View All Invoice Tokens
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Token Holdings</CardTitle>
              <CardDescription>Your cryptocurrency and token assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockWalletData.tokens.map((token) => (
                  <div key={token.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={token.icon} alt={token.name} />
                        <AvatarFallback>{token.symbol.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-lg">{token.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{token.symbol}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-lg">
                        {hideBalances ? '••••••' : `${token.balance.toLocaleString()} ${token.symbol}`}
                      </p>
                      <p className={`text-sm ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {hideBalances ? '••••••' : `$${token.value.toLocaleString()}`}
                        {' '}
                        <span>
                          {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">
                        <Send className="mr-2 h-4 w-4" />
                        Send
                      </Button>
                      <Button variant="outline" size="sm">
                        <ArrowDownUp className="mr-2 h-4 w-4" />
                        Receive
                      </Button>
                      <Button variant="outline" size="sm">
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                        Swap
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Custom Token
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Tokens</CardTitle>
              <CardDescription>Your tokenized invoice holdings</CardDescription>
            </CardHeader>
            <CardContent>
              {mockWalletData.invoiceTokens.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Shield className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-lg font-medium">No invoice tokens</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    You don't have any invoice tokens yet
                  </p>
                  <Button className="mt-4">
                    Browse Marketplace
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {mockWalletData.invoiceTokens.map((token) => (
                    <Card key={token.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{token.id}</CardTitle>
                            <CardDescription>
                              Invoice {token.invoiceId}
                            </CardDescription>
                          </div>
                          <Badge className="bg-green-500">{token.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Issuer</div>
                            <div className="font-medium">{token.issuer}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Face Value</div>
                            <div className="font-medium">
                              {hideBalances ? '••••••' : `$${token.faceValue.toLocaleString()}`}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Maturity</div>
                            <div className="font-medium">{token.maturityDate} ({token.daysToMaturity} days)</div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Time to Maturity</div>
                          <Progress value={(1 - token.daysToMaturity / 100) * 100} className="h-2" />
                          <div className="flex justify-between text-xs mt-1">
                            <span>Today</span>
                            <span>Due Date</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">View Details</Button>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Send className="mr-2 h-4 w-4" />
                            Transfer
                          </Button>
                          <Button size="sm">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Sell Token
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All your wallet transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockWalletData.transactions.map((tx) => (
                  <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <p className="font-medium">{tx.type}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTimestamp(tx.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end">
                      <p className={`font-medium ${tx.type === 'Received' ? 'text-green-500' : tx.type === 'Sent' ? 'text-red-500' : ''}`}>
                        {tx.type === 'Sent' ? '-' : tx.type === 'Received' ? '+' : ''}
                        {hideBalances ? '••••••' : `${tx.amount} ${tx.token}`}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {hideBalances ? '••••••' : `$${tx.value.toLocaleString()}`}
                      </p>
                    </div>
                    <div className="flex flex-col sm:items-end">
                      <div className="flex items-center gap-2">
                        <Badge className={getTransactionStatusColor(tx.status)}>
                          {tx.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleCopyToClipboard(
                            tx.hash,
                            "Transaction hash copied to clipboard"
                          )}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate max-w-[200px]">
                        {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 10)}
                      </p>
                    </div>
                    <div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export Transaction History
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

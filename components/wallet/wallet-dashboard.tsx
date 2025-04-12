"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Copy,
  ExternalLink,
  CreditCard,
  Clock,
  Shield,
  CheckCircle,
  Search,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAppStore, type Asset, type Transaction } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function WalletDashboard() {
  const { toast } = useToast()
  const { assets, transactions, userProfile } = useAppStore()
  
  const [activeTab, setActiveTab] = useState("overview")
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false)
  const [isReceiveDialogOpen, setIsReceiveDialogOpen] = useState(false)
  const [isOnrampDialogOpen, setIsOnrampDialogOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [sendAmount, setSendAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  
  // Calculate total portfolio value
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0)
  
  // Get transaction status badge styling
  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Completed</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Failed</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }
  
  // Get transaction type icon
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case "receive":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case "swap":
        return <RefreshCw className="h-4 w-4 text-blue-500" />
      case "tokenize":
        return <Shield className="h-4 w-4 text-purple-500" />
      case "redeem":
        return <CheckCircle className="h-4 w-4 text-amber-500" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }
  
  // Format transaction amount with sign
  const formatTransactionAmount = (transaction: Transaction) => {
    if (transaction.type === "send") {
      return `-${transaction.amount} ${transaction.asset}`
    } else if (transaction.type === "receive") {
      return `+${transaction.amount} ${transaction.asset}`
    } else {
      return `${transaction.amount} ${transaction.asset}`
    }
  }
  
  // Format transaction amount color
  const getTransactionAmountColor = (transaction: Transaction) => {
    if (transaction.type === "send") {
      return "text-red-600 dark:text-red-400"
    } else if (transaction.type === "receive") {
      return "text-green-600 dark:text-green-400"
    } else {
      return ""
    }
  }
  
  // Handle send transaction
  const handleSendTransaction = () => {
    if (!selectedAsset || !sendAmount || !recipientAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }
    
    // Validate amount
    const amount = Number.parseFloat(sendAmount)
    if (isNaN(amount) || amount <= 0 || amount > selectedAsset.balance) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount that doesn't exceed your balance.",
        variant: "destructive",
      })
      return
    }
    
    // Simulate transaction
    toast({
      title: "Transaction Initiated",
      description: `Sending ${amount} ${selectedAsset.symbol} to ${recipientAddress.substring(0, 6)}...${recipientAddress.substring(recipientAddress.length - 4)}`,
    })
    
    // Reset form and close dialog
    setSelectedAsset(null)
    setSendAmount("")
    setRecipientAddress("")
    setIsSendDialogOpen(false)
  }
  
  // Handle copy address
  const handleCopyAddress = () => {
    if (userProfile?.walletAddress) {
      navigator.clipboard.writeText(userProfile.walletAddress)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard.",
      })
    }
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent">
          Wallet Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your digital assets and transactions</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
            <CardDescription>Your digital asset holdings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-lg border border-blue-200/50 dark:border-blue-800/50 mb-6">
              <div>
                <p className="text-sm text-blue-600/80 dark:text-blue-400/80">Total Portfolio Value</p>
                <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">${totalValue.toLocaleString()}</h2>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-gray-900/80"
                  onClick={() => setIsReceiveDialogOpen(true)}
                >
                  <ArrowDownLeft className="mr-2 h-4 w-4" />
                  Receive
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                  onClick={() => setIsSendDialogOpen(true)}
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {assets.map((asset) => (
                <div 
                  key={asset.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={asset.icon || "/placeholder.svg"} alt={asset.name} />
                      <AvatarFallback>{asset.symbol.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{asset.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{asset.symbol}</p>
                    </div>
                  </div>
                  <div className="flex-grow text-right sm:text-left">
                    <p className="font-medium">{asset.balance} {asset.symbol}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">${asset.value.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={cn(
                      "font-medium",
                      asset.change24h >= 0 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                      {asset.change24h >= 0 ? "+" : ""}{asset.change24h}%
                    </Badge>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">24h</p>
                  </div>
                  <div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedAsset(asset)
                        setIsSendDialogOpen(true)
                      }}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="gap-2 ml-auto"
              onClick={() => setIsOnrampDialogOpen(true)}
            >
              <CreditCard className="h-4 w-4" />
              Buy Crypto
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Wallet Information</CardTitle>
            <CardDescription>Your wallet details and security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Wallet Address</p>
                <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800">
                  <p className="text-sm font-mono truncate">
                    {userProfile?.walletAddress.substring(0, 12)}...{userProfile?.walletAddress.substring(userProfile.walletAddress.length - 8)}
                  </p>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyAddress}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Security Level</p>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">High</Badge>
                </div>
                <Progress value={90} className="h-2" />
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>2FA Enabled</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>KYC Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>MPC Wallet Protection</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white">
                  <Shield className="mr-2 h-4 w-4" />
                  Security Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            Recent Transactions
          </TabsTrigger>
          <TabsTrigger value="assets" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            All Assets
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            Activity
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your recent wallet activity</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-[200px]">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input placeholder="Search transactions..." className="pl-8" />
                  </div>
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        {getTransactionTypeIcon(transaction.type)}
                      </div>
                      <div>
                        <h3 className="font-medium capitalize">{transaction.type}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {transaction.type === "send" ? "To: " : transaction.type === "receive" ? "From: " : ""}
                        {transaction.counterparty}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={cn("font-medium", getTransactionAmountColor(transaction))}>
                        {formatTransactionAmount(transaction)}
                      </p>
                      <div className="mt-1">
                        {getTransactionStatusBadge(transaction.status)}
                      </div>
                    </div>
                    <div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto">View All Transactions</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="assets" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Assets</CardTitle>
              <CardDescription>Complete list of your digital assets</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">Assets tab content</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Detailed history of all wallet activities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">Activity tab content</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Send Dialog */}
      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Assets</DialogTitle>
            <DialogDescription>
              Send digital assets to another wallet address.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="asset">Select Asset</Label>
              <Select 
                value={selectedAsset?.id || ""} 
                onValueChange={(value) => setSelectedAsset(assets.find(a => a.id === value) || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an asset" />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={asset.icon || "/placeholder.svg"} alt={asset.name} />
                          <AvatarFallback>{asset.symbol.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span>{asset.name} ({asset.symbol})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedAsset && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Available: {selectedAsset.balance} {selectedAsset.symbol}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                />
                \

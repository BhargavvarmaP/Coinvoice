"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  CheckCircle2, 
  FileText, 
  Shield, 
  Ship, 
  CreditCard, 
  ArrowRight, 
  Clock, 
  AlertCircle, 
  Copy, 
  Wallet, 
  Send, 
  ArrowDownLeft, 
  History, 
  Settings,
  LayoutDashboard
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { WalletBalance } from "@/lib/types"

const walletVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
}

export function WalletDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isSending, setIsSending] = useState(false)
  const [isReceiving, setIsReceiving] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { walletBalance, setWalletBalance } = useAppStore()

  const handleCopyAddress = () => {
    if (walletBalance?.walletAddress) {
      navigator.clipboard.writeText(walletBalance.walletAddress)
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={walletVariants}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Wallet</h2>
          <p className="text-muted-foreground">
            Manage your digital assets and transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsSending(true)}>
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
          <Button variant="outline" onClick={() => setIsReceiving(true)}>
            <ArrowDownLeft className="mr-2 h-4 w-4" />
            Receive
          </Button>
          <Button variant="outline" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="send">
            <Send className="mr-2 h-4 w-4" />
            Send
          </TabsTrigger>
          <TabsTrigger value="receive">
            <ArrowDownLeft className="mr-2 h-4 w-4" />
            Receive
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <History className="mr-2 h-4 w-4" />
            Transactions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Total Balance</CardTitle>
                  <CardDescription>Your current wallet balance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-4xl font-bold">
                      ${walletBalance?.total?.toLocaleString() || "0.00"}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Available: ${walletBalance?.available?.toLocaleString() || "0.00"}</span>
                      <span>Locked: ${walletBalance?.locked?.toLocaleString() || "0.00"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Address</CardTitle>
                  <CardDescription>Your unique wallet identifier</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <code className="text-sm">{walletBalance?.walletAddress || "No address available"}</code>
                      <Button variant="ghost" size="icon" onClick={handleCopyAddress}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={cardVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest wallet activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {[1, 2, 3].map((item) => (
                      <motion.div
                        key={item}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Send className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Transaction #{item}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant="secondary">
                            <Clock className="mr-1 h-3 w-3" />
                            Pending
                          </Badge>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Funds</CardTitle>
              <CardDescription>Transfer funds to another wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Recipient Address</Label>
                  <Input placeholder="Enter wallet address" />
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input type="number" placeholder="Enter amount" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Enter transaction description" />
                </div>
                <Button className="w-full">
                  Send Funds
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Receive Funds</CardTitle>
              <CardDescription>Share your wallet address to receive funds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <code className="text-sm">{walletBalance?.walletAddress || "No address available"}</code>
                    <Button variant="ghost" size="icon" onClick={handleCopyAddress}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Amount (Optional)</Label>
                  <Input type="number" placeholder="Enter expected amount" />
                </div>
                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Textarea placeholder="Enter transaction description" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View all your wallet transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <motion.div
                      key={item}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Send className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Transaction #{item}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="secondary">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isSending} onOpenChange={setIsSending}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Funds</DialogTitle>
            <DialogDescription>
              Transfer funds to another wallet address
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Recipient Address</Label>
              <Input placeholder="Enter wallet address" />
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input type="number" placeholder="Enter amount" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Enter transaction description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSending(false)}>
              Cancel
            </Button>
            <Button>
              Send Funds
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReceiving} onOpenChange={setIsReceiving}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Receive Funds</DialogTitle>
            <DialogDescription>
              Share your wallet address to receive funds
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <code className="text-sm">{walletBalance?.walletAddress || "No address available"}</code>
                <Button variant="ghost" size="icon" onClick={handleCopyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Amount (Optional)</Label>
              <Input type="number" placeholder="Enter expected amount" />
            </div>
            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea placeholder="Enter transaction description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReceiving(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wallet Settings</DialogTitle>
            <DialogDescription>
              Configure your wallet preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Default Currency</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="gbp">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Transaction Notifications</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select notification preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="large">Large Transactions Only</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              Cancel
            </Button>
            <Button>
              Save Changes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

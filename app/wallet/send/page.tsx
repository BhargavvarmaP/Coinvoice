"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { 
  Send,
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

export default function SendPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    asset: "BTC",
    amount: "",
    address: "",
    memo: "",
  })

  // Sample data for available assets
  const assets = [
    {
      id: "BTC",
      name: "Bitcoin",
      balance: 0.5,
      value: 15000,
    },
    {
      id: "ETH",
      name: "Ethereum",
      balance: 2.5,
      value: 5000,
    },
    {
      id: "USDT",
      name: "Tether",
      balance: 5000,
      value: 5000,
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add your send logic here
    toast({
      title: "Transaction Sent",
      description: "Your transaction has been successfully sent.",
    })
    router.push("/wallet/transactions")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Send Assets</h1>
          <p className="text-muted-foreground">Transfer your assets to another wallet</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transfer Details</CardTitle>
            <CardDescription>Enter the recipient's address and amount</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="asset">Asset</Label>
                <Select
                  value={formData.asset}
                  onValueChange={(value) => setFormData({ ...formData, asset: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        <div className="flex items-center gap-2">
                          {asset.id === "BTC" ? (
                            <Bitcoin className="h-4 w-4" />
                          ) : asset.id === "ETH" ? (
                            <Ethereum className="h-4 w-4" />
                          ) : (
                            <Coins className="h-4 w-4" />
                          )}
                          <span>{asset.name}</span>
                          <span className="text-muted-foreground">({asset.balance} {asset.id})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">
                  Available: {assets.find(a => a.id === formData.asset)?.balance} {formData.asset}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Recipient Address</Label>
                <Input
                  id="address"
                  placeholder="Enter wallet address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="memo">Memo (Optional)</Label>
                <Textarea
                  id="memo"
                  placeholder="Add a note to this transaction"
                  value={formData.memo}
                  onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Preview</CardTitle>
            <CardDescription>Review your transaction details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Asset</span>
                <span className="text-sm">
                  {assets.find(a => a.id === formData.asset)?.name} ({formData.asset})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Amount</span>
                <span className="text-sm">
                  {formData.amount || "0.00"} {formData.asset}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Network Fee</span>
                <span className="text-sm">0.0001 {formData.asset}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">
                    {(Number(formData.amount) + 0.0001).toFixed(4)} {formData.asset}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
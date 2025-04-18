"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { 
  Receive,
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
  Copy,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { motion } from "framer-motion"

export default function ReceivePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedAsset, setSelectedAsset] = useState("BTC")

  // Sample data for available assets
  const assets = [
    {
      id: "BTC",
      name: "Bitcoin",
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    },
    {
      id: "ETH",
      name: "Ethereum",
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    },
    {
      id: "USDT",
      name: "Tether",
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    },
  ]

  const handleCopyAddress = () => {
    const address = assets.find(a => a.id === selectedAsset)?.address
    if (address) {
      navigator.clipboard.writeText(address)
      toast({
        title: "Address Copied",
        description: "Wallet address has been copied to clipboard.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Receive Assets</h1>
          <p className="text-muted-foreground">Generate a deposit address to receive assets</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Receive Address</CardTitle>
            <CardDescription>Select the asset you want to receive</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="asset">Asset</Label>
                <Select
                  value={selectedAsset}
                  onValueChange={setSelectedAsset}
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
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Your {assets.find(a => a.id === selectedAsset)?.name} Address</Label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={assets.find(a => a.id === selectedAsset)?.address}
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyAddress}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center p-6 border rounded-lg bg-muted">
                {/* Replace this with your QR code component */}
                <div className="text-center">
                  <div className="text-sm font-medium mb-2">QR Code</div>
                  <div className="text-xs text-muted-foreground">
                    Scan this QR code to receive {assets.find(a => a.id === selectedAsset)?.name}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
            <CardDescription>Please read before sending assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500 mt-1" />
                <div>
                  <div className="font-medium">Network Selection</div>
                  <p className="text-sm text-muted-foreground">
                    Make sure to send {assets.find(a => a.id === selectedAsset)?.name} on the correct network.
                    Sending on the wrong network may result in permanent loss of funds.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500 mt-1" />
                <div>
                  <div className="font-medium">Minimum Deposit</div>
                  <p className="text-sm text-muted-foreground">
                    The minimum deposit amount is 0.001 {selectedAsset}. Smaller amounts will not be credited.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500 mt-1" />
                <div>
                  <div className="font-medium">Processing Time</div>
                  <p className="text-sm text-muted-foreground">
                    Deposits typically take 1-3 network confirmations to be credited to your account.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500 mt-1" />
                <div>
                  <div className="font-medium">Security Notice</div>
                  <p className="text-sm text-muted-foreground">
                    Never share your private keys or recovery phrases with anyone. We will never ask for this information.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
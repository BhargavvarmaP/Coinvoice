"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CreditCard,
  DollarSign,
  Globe,
  HelpCircle,
  Landmark,
  Wallet,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function WalletOnramp() {
  const { toast } = useToast()
  const [buyAmount, setBuyAmount] = useState("")
  const [buyCurrency, setBuyCurrency] = useState("USD")
  const [buyToken, setBuyToken] = useState("CVT")
  const [buyPaymentMethod, setBuyPaymentMethod] = useState("card")
  
  const [sellAmount, setSellAmount] = useState("")
  const [sellToken, setSellToken] = useState("CVT")
  const [sellCurrency, setSellCurrency] = useState("USD")
  const [sellPaymentMethod, setSellPaymentMethod] = useState("bank")
  
  // Handle buy crypto
  const handleBuyCrypto = () => {
    if (!buyAmount) return
    
    toast({
      title: "Purchase Initiated",
      description: `You are buying ${buyAmount} ${buyToken} with ${buyCurrency}`,
      variant: "success",
    })
    
    setBuyAmount("")
  }
  
  // Handle sell crypto
  const handleSellCrypto = () => {
    if (!sellAmount) return
    
    toast({
      title: "Sale Initiated",
      description: `You are selling ${sellAmount} ${sellToken} for ${sellCurrency}`,
      variant: "success",
    })
    
    setSellAmount("")
  }
  
  // Payment method options
  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: <CreditCard className="h-5 w-5" /> },
    { id: "bank", name: "Bank Transfer", icon: <Landmark className="h-5 w-5" /> },
    { id: "wallet", name: "External Wallet", icon: <Wallet className="h-5 w-5" /> },
  ]
  
  // Currency options
  const currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD"]
  
  // Token options
  const tokens = ["CVT", "BTC", "ETH", "USDC", "USDT", "DAI"]
  
  // Provider options
  const providers = [
    { id: "stripe", name: "Stripe", logo: "/placeholder.svg?height=40&width=120" },
    { id: "circle", name: "Circle", logo: "/placeholder.svg?height=40&width=120" },
    { id: "moonpay", name: "MoonPay", logo: "/placeholder.svg?height=40&width=120" },
    { id: "ramp", name: "Ramp", logo: "/placeholder.svg?height=40&width=120" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">On/Off Ramp</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Buy or sell crypto with fiat currencies</p>
      </div>
      
      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1">
          <TabsTrigger value="buy" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            <ArrowDownToLine className="h-4 w-4 mr-2" />
            Buy Crypto
          </TabsTrigger>
          <TabsTrigger value="sell" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            <ArrowUpFromLine className="h-4 w-4 mr-2" />
            Sell Crypto
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="buy" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glassmorphism md:col-span-2">
              <CardHeader>
                <CardTitle>Buy Crypto</CardTitle>
                <CardDescription>Purchase crypto with fiat currency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="buy-amount">Amount</Label>
                    <div className="flex">
                      <Input
                        id="buy-amount"
                        type="number"
                        placeholder="Enter amount"
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(e.target.value)}
                        className="rounded-r-none bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-800/50"
                      />
                      <Select value={buyCurrency} onValueChange={setBuyCurrency}>
                        <SelectTrigger className="w-[100px] rounded-l-none border-l-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-800/50">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map(currency => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="buy-token">Receive</Label>
                    <Select value={buyToken} onValueChange={setBuyToken}>
                      <SelectTrigger className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-800/50">
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                      <SelectContent>
                        {tokens.map(token => (
                          <SelectItem key={token} value={token}>
                            {token}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {paymentMethods.map(method => (
                      <Button
                        key={method.id}
                        type="button"
                        variant={buyPaymentMethod === method.id ? "default" : "outline"}
                        className={`justify-start h-auto py-3 ${
                          buyPaymentMethod === method.id 
                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white" 
                            : ""
                        }`}
                        onClick={() => setBuyPaymentMethod(method.id)}
                      >
                        <div className="flex items-center gap-3">
                          {method.icon}
                          <span>{method.name}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-600 dark:text-blue-400">Estimated</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        You will receive approximately {buyAmount ? (Number.parseFloat(buyAmount) * 0.98).toFixed(2) : "0"} {buyToken}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Fee: 2.0% • Rate: 1 {buyCurrency} = 0.98 {buyToken}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                  disabled={!buyAmount}
                  onClick={handleBuyCrypto}
                >
                  Continue to Payment
                </Button>
              </CardContent>
            </Card>
            
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Providers</CardTitle>
                <CardDescription>Our trusted on-ramp providers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {providers.map(provider => (
                    <div 
                      key={provider.id}
                      className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 flex items-center justify-center h-16"
                    >
                      <img 
                        src={provider.logo || "/placeholder.svg"} 
                        alt={provider.name} 
                        className="max-h-8 max-w-full" 
                      />
                    </div>
                  ))}
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Need Help?</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Our support team is available 24/7 to assist you with any questions.
                      </p>
                      <Button variant="link" className="p-0 h-auto text-blue-600 dark:text-blue-400 mt-1">
                        Contact Support
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Globe className="h-4 w-4" />
                  <span>Available in 150+ countries</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sell" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glassmorphism md:col-span-2">
              <CardHeader>
                <CardTitle>Sell Crypto</CardTitle>
                <CardDescription>Convert your crypto to fiat currency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sell-amount">Amount</Label>
                    <div className="flex">
                      <Input
                        id="sell-amount"
                        type="number"\

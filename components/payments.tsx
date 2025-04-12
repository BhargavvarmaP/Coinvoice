"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ArrowRight, CheckCircle, DollarSign, Lock, Send, ShieldCheck, Download, Search } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Mock data
const mockPaymentHistory = [
  {
    id: "PAY-001",
    recipient: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    amount: 5000,
    date: "2025-04-05",
    status: "Completed",
    token: "CVT-1001",
  },
  {
    id: "PAY-002",
    recipient: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    amount: 7500,
    date: "2025-04-02",
    status: "Completed",
    token: "CVT-1002",
  },
  {
    id: "PAY-003",
    recipient: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    amount: 3200,
    date: "2025-03-28",
    status: "Completed",
    token: "CVT-1003",
  },
]

export function Payments() {
  const { toast } = useToast()
  const [paymentStep, setPaymentStep] = useState(1)
  const [paymentProgress, setPaymentProgress] = useState(0)
  const [useZkp, setUseZkp] = useState(false)
  const [useAutomation, setUseAutomation] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "complete">("idle")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Form state
  const [paymentData, setPaymentData] = useState({
    recipient: "",
    amount: "",
    token: "",
    milestone: "",
    memo: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaymentData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setPaymentData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!paymentData.recipient || !paymentData.amount || !paymentData.token) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setPaymentStatus("processing")
    setPaymentProgress(0)

    const interval = setInterval(() => {
      setPaymentProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setPaymentStatus("complete")
          toast({
            title: "Payment Successful",
            description: `You have sent ${paymentData.amount} CVT to ${paymentData.recipient.substring(0, 6)}...${paymentData.recipient.substring(paymentData.recipient.length - 4)}`,
          })
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  const resetPayment = () => {
    setPaymentStatus("idle")
    setPaymentProgress(0)
    setPaymentStep(1)
    setPaymentData({
      recipient: "",
      amount: "",
      token: "",
      milestone: "",
      memo: "",
    })
  }

  // Filter payments based on search and status
  const filteredPayments = mockPaymentHistory.filter((payment) => {
    // Filter by search term
    if (
      searchTerm &&
      !payment.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !payment.recipient.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !payment.token.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    return true
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent">
          Payments
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Send payments with privacy and automation options.</p>
      </div>

      <Tabs defaultValue="send" className="w-full">
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1">
          <TabsTrigger value="send" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            Send Payment
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            Payment History
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={paymentStatus}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="send" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle>Send Payment</CardTitle>
                    <CardDescription>Send CVT payments with enhanced privacy and automation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {paymentStatus === "idle" ? (
                      <form onSubmit={handlePaymentSubmit}>
                        <div className="space-y-6">
                          <AnimatePresence mode="wait">
                            {paymentStep === 1 && (
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                              >
                                <div className="space-y-2">
                                  <Label htmlFor="recipient">Recipient Wallet Address</Label>
                                  <Input
                                    id="recipient"
                                    name="recipient"
                                    value={paymentData.recipient}
                                    onChange={handleInputChange}
                                    placeholder="0x..."
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="token">Select Token</Label>
                                  <Select
                                    value={paymentData.token}
                                    onValueChange={(value) => handleSelectChange("token", value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a token" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="CVT-1001">CVT-1001 (Balance: 5,000)</SelectItem>
                                      <SelectItem value="CVT-1002">CVT-1002 (Balance: 12,000)</SelectItem>
                                      <SelectItem value="CVT-1003">CVT-1003 (Balance: 8,500)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="amount">Amount</Label>
                                  <Input
                                    id="amount"
                                    name="amount"
                                    value={paymentData.amount}
                                    onChange={handleInputChange}
                                    placeholder="1000"
                                    type="number"
                                  />
                                </div>

                                <div className="flex justify-end">
                                  <Button
                                    type="button"
                                    onClick={() => setPaymentStep(2)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
                                  >
                                    Next
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </Button>
                                </div>
                              </motion.div>
                            )}

                            {paymentStep === 2 && (
                              <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label htmlFor="zkp" className="flex items-center gap-2">
                                      <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                      Use Zero-Knowledge Proof
                                    </Label>
                                    <Switch id="zkp" checked={useZkp} onCheckedChange={setUseZkp} />
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Enhance privacy by hiding transaction details from third parties.
                                  </p>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label htmlFor="automation" className="flex items-center gap-2">
                                      <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                      Enable Supply Chain Automation
                                    </Label>
                                    <Switch
                                      id="automation"
                                      checked={useAutomation}
                                      onCheckedChange={setUseAutomation}
                                    />
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Trigger automated actions based on payment milestones.
                                  </p>
                                </div>

                                {useAutomation && (
                                  <div className="space-y-2">
                                    <Label htmlFor="milestone">Select Milestone</Label>
                                    <Select
                                      value={paymentData.milestone}
                                      onValueChange={(value) => handleSelectChange("milestone", value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a milestone" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="delivery">Delivery Confirmed</SelectItem>
                                        <SelectItem value="inspection">Inspection Passed</SelectItem>
                                        <SelectItem value="installation">Installation Complete</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}

                                <div className="space-y-2">
                                  <Label htmlFor="memo">Memo (Optional)</Label>
                                  <Input
                                    id="memo"
                                    name="memo"
                                    value={paymentData.memo}
                                    onChange={handleInputChange}
                                    placeholder="Payment for invoice #123"
                                  />
                                </div>

                                <div className="flex justify-between">
                                  <Button type="button" variant="outline" onClick={() => setPaymentStep(1)}>
                                    Back
                                  </Button>
                                  <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
                                  >
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Payment
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </form>
                    ) : paymentStatus === "processing" ? (
                      <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <div className="w-16 h-16 rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
                        <h3 className="text-lg font-medium">Processing Payment</h3>
                        <Progress value={paymentProgress} className="w-full" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {useZkp ? "Generating zero-knowledge proof..." : "Confirming transaction..."}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5, type: "spring" }}
                          className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
                        >
                          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </motion.div>
                        <h3 className="text-lg font-medium">Payment Successful!</h3>
                        <div className="text-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            You have sent {paymentData.amount} {paymentData.token} to{" "}
                            {paymentData.recipient.substring(0, 6)}...
                            {paymentData.recipient.substring(paymentData.recipient.length - 4)}
                          </p>
                          {useZkp && (
                            <p className="text-sm text-green-600 dark:text-green-400 flex items-center justify-center mt-2">
                              <Lock className="h-4 w-4 mr-1" />
                              Protected with zero-knowledge proof
                            </p>
                          )}
                          {useAutomation && (
                            <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center justify-center mt-2">
                              <ShieldCheck className="h-4 w-4 mr-1" />
                              Supply chain automation triggered: {paymentData.milestone}
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={resetPayment}
                          className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                          Send Another Payment
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle>Payment Visualization</CardTitle>
                    <CardDescription>See how your payment flows through the system</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                    {paymentStatus === "idle" ? (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="relative w-[300px] h-[300px]">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <span className="font-medium">You</span>
                          </div>
                          <div className="absolute bottom-0 right-0 w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <span className="font-medium">Recipient</span>
                          </div>
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300">
                            <path
                              d="M100 220 L150 50 L200 220"
                              fill="none"
                              stroke="#e2e8f0"
                              strokeWidth="2"
                              strokeDasharray="5,5"
                              className="dark:stroke-gray-700"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                          Fill in the payment details to visualize the transaction
                        </p>
                      </div>
                    ) : paymentStatus === "processing" ? (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="relative w-[300px] h-[300px]">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-pulse" />
                          </div>
                          <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <span className="font-medium">You</span>
                          </div>
                          <div className="absolute bottom-0 right-0 w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <span className="font-medium">Recipient</span>
                          </div>
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300">
                            <path
                              d="M100 220 L150 50 L200 220"
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="3"
                              strokeDasharray="300"
                              strokeDashoffset={300 - paymentProgress * 3}
                              className="transition-all duration-300 dark:stroke-blue-400"
                            />
                            <motion.circle
                              cx={100 + paymentProgress * 1}
                              cy={220 - paymentProgress * 1.7}
                              r="5"
                              fill="#3b82f6"
                              className="dark:fill-blue-400"
                            />
                          </svg>
                        </div>
                        {useZkp && (
                          <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium flex items-center mt-4">
                            <Lock className="h-3 w-3 mr-1" />
                            Zero-Knowledge Proof Active
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="relative w-[300px] h-[300px]">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <span className="font-medium">You</span>
                          </div>
                          <div className="absolute bottom-0 right-0 w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                          </div>
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300">
                            <path
                              d="M100 220 L150 50 L200 220"
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="3"
                              className="dark:stroke-blue-400"
                            />
                          </svg>
                        </div>
                        <div className="text-center mt-4">
                          <p className="font-medium">Transaction Complete</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {paymentData.amount} {paymentData.token} sent successfully
                          </p>
                          {useAutomation && (
                            <div className="mt-4">
                              <p className="text-sm font-medium">Supply Chain Automation</p>
                              <div className="flex items-center justify-center gap-4 mt-2">
                                <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400"></div>
                                <div className="h-px w-8 bg-gray-300 dark:bg-gray-700"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400"></div>
                                <div className="h-px w-8 bg-gray-300 dark:bg-gray-700"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400"></div>
                              </div>
                              <div className="flex items-center justify-center gap-4 mt-1">
                                <div className="text-xs">Payment</div>
                                <div className="w-8"></div>
                                <div className="text-xs">{paymentData.milestone}</div>
                                <div className="w-8"></div>
                                <div className="text-xs">Confirmed</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card className="border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <CardTitle>Payment History</CardTitle>
                      <CardDescription>View your past payments</CardDescription>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-[200px]">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <Input
                            placeholder="Search payments..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Filter" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Payments</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export History
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="grid grid-cols-6 bg-gray-50 dark:bg-gray-800 p-3">
                      <div className="font-medium">Payment ID</div>
                      <div className="font-medium">Recipient</div>
                      <div className="font-medium">Amount</div>
                      <div className="font-medium">Token</div>
                      <div className="font-medium">Date</div>
                      <div className="font-medium">Status</div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                      <AnimatePresence>
                        {filteredPayments.length > 0 ? (
                          filteredPayments.map((payment, index) => (
                            <motion.div
                              key={payment.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="grid grid-cols-6 p-3 items-center hover:bg-gray-50 dark:hover:bg-gray-900"
                            >
                              <div className="font-medium text-blue-600 dark:text-blue-400">{payment.id}</div>
                              <div className="truncate max-w-[150px]">{payment.recipient}</div>
                              <div>${payment.amount.toLocaleString()}</div>
                              <div>{payment.token}</div>
                              <div>{payment.date}</div>
                              <div>
                                <Badge
                                  className={
                                    payment.status === "Completed"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                  }
                                >
                                  {payment.status}
                                </Badge>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="p-8 text-center col-span-6">
                            <div className="flex flex-col items-center justify-center">
                              <Search className="h-8 w-8 text-gray-400 mb-2" />
                              <h3 className="text-lg font-medium">No payments found</h3>
                              <p className="text-gray-500 dark:text-gray-400">
                                Try adjusting your filters or search term
                              </p>
                            </div>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {filteredPayments.length} of {mockPaymentHistory.length} payments
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}

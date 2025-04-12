"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientText } from "@/components/ui/gradient-text"
import {
  ArrowDownToLine,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  FileText,
  History,
  Link2,
  MoreHorizontal,
  QrCode,
  Send,
  Share2,
  Shield,
  Timer,
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
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

interface InvoiceDetailsProps {
  invoiceId: string
}

export function InvoiceDetails({ invoiceId }: InvoiceDetailsProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("details")
  
  // Mock invoice data - in a real app, this would be fetched from an API
  const invoice = {
    id: invoiceId || "INV-2025-0042",
    status: "Tokenized", // Pending, Approved, Tokenized, Paid, Overdue
    tokenId: "CVT-2025-0042",
    issueDate: "2025-04-01",
    dueDate: "2025-05-01",
    amount: 5250.00,
    currency: "USD",
    client: {
      name: "Acme Corporation",
      address: "123 Business Ave, Tech City, TC 10101",
      email: "accounts@acmecorp.com",
      avatar: "/placeholder.svg",
    },
    items: [
      { description: "Web Development Services", quantity: 1, unitPrice: 4000.00, total: 4000.00 },
      { description: "Hosting (Premium Plan)", quantity: 1, unitPrice: 750.00, total: 750.00 },
      { description: "Domain Registration", quantity: 2, unitPrice: 250.00, total: 500.00 },
    ],
    subtotal: 5250.00,
    tax: 0,
    total: 5250.00,
    notes: "Payment due within 30 days. Please include the invoice number with your payment.",
    blockchainInfo: {
      network: "Ethereum",
      contractAddress: "0x1234...5678",
      tokenId: "42",
      transactionHash: "0xabcd...ef01",
      timestamp: "2025-04-02T14:30:45Z",
      verificationUrl: "https://etherscan.io/tx/0xabcd...ef01",
    },
    history: [
      { action: "Invoice Created", date: "2025-04-01T10:15:30Z", user: "John Doe" },
      { action: "Invoice Sent to Client", date: "2025-04-01T10:20:15Z", user: "John Doe" },
      { action: "Invoice Approved", date: "2025-04-01T14:45:22Z", user: "Jane Smith" },
      { action: "Invoice Tokenized", date: "2025-04-02T14:30:45Z", user: "Blockchain System" },
    ],
  }

  // Calculate days remaining until due date
  const today = new Date()
  const dueDate = new Date(invoice.dueDate)
  const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  // Calculate progress for due date visualization
  const totalDays = Math.ceil((dueDate.getTime() - new Date(invoice.issueDate).getTime()) / (1000 * 60 * 60 * 24))
  const progress = Math.max(0, Math.min(100, ((totalDays - daysRemaining) / totalDays) * 100))

  const handleCopyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: message,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "Approved":
        return "bg-blue-500 hover:bg-blue-600"
      case "Tokenized":
        return "bg-purple-500 hover:bg-purple-600"
      case "Paid":
        return "bg-green-500 hover:bg-green-600"
      case "Overdue":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Invoice <GradientText gradient="blue-purple">{invoice.id}</GradientText>
            {invoice.tokenId && (
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                (Token: {invoice.tokenId})
              </span>
            )}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Issued on {new Date(invoice.issueDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleCopyToClipboard(invoice.id, "Invoice ID copied to clipboard")}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Invoice ID
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Send className="mr-2 h-4 w-4" />
                Send to Client
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <QrCode className="mr-2 h-4 w-4" />
                Show QR Code
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="blockchain" className="flex items-center">
            <Link2 className="mr-2 h-4 w-4" />
            Blockchain
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center">
            <History className="mr-2 h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Invoice Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-gray-500 dark:text-gray-400">From</h3>
                    <p className="font-medium">Your Company Name</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">123 Your Street</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Your City, YC 12345</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">your@email.com</p>
                  </div>
                  <div className="text-right">
                    <h3 className="font-medium text-gray-500 dark:text-gray-400">To</h3>
                    <p className="font-medium">{invoice.client.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.client.address}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.client.email}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Invoice Number:</span>
                    <span>{invoice.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Issue Date:</span>
                    <span>{new Date(invoice.issueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Due Date:</span>
                    <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                  </div>
                  {invoice.tokenId && (
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Token ID:</span>
                      <span>{invoice.tokenId}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left font-medium">Description</th>
                      <th className="py-2 text-right font-medium">Quantity</th>
                      <th className="py-2 text-right font-medium">Unit Price</th>
                      <th className="py-2 text-right font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{item.description}</td>
                        <td className="py-2 text-right">{item.quantity}</td>
                        <td className="py-2 text-right">${item.unitPrice.toFixed(2)}</td>
                        <td className="py-2 text-right">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="py-2 text-right font-medium">Subtotal:</td>
                      <td className="py-2 text-right">${invoice.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="py-2 text-right font-medium">Tax:</td>
                      <td className="py-2 text-right">${invoice.tax.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="py-2 text-right font-medium">Total:</td>
                      <td className="py-2 text-right font-bold">${invoice.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>

                {invoice.notes && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-sm">
                    <p className="font-medium">Notes:</p>
                    <p className="text-gray-600 dark:text-gray-300">{invoice.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <GlassCard className="p-4" intensity="light" borderGradient>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Payment Status</h3>
                  <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Due in:</span>
                    <span className={daysRemaining < 5 ? "text-red-500 font-medium" : ""}>
                      {daysRemaining} days
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Issued</span>
                    <span>Due Date</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="w-full">
                    <Wallet className="mr-2 h-4 w-4" />
                    Process Payment
                  </Button>
                </div>
              </GlassCard>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={invoice.client.avatar} alt={invoice.client.name} />
                      <AvatarFallback>{invoice.client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{invoice.client.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.client.email}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      View All Invoices
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ArrowDownToLine className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Send className="mr-2 h-4 w-4" />
                    Send to Client
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Shield className="mr-2 h-4 w-4" />
                    Verify Authenticity
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-4">
          <GlassCard className="p-6" intensity="medium" borderGradient>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">
                  <GradientText gradient="blue-purple">Blockchain Verification</GradientText>
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  This invoice has been tokenized and recorded on the blockchain
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span className="font-medium">Verified</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Network</p>
                  <p className="font-medium">{invoice.blockchainInfo.network}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Token ID</p>
                  <p className="font-medium">{invoice.blockchainInfo.tokenId}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contract Address</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium font-mono text-sm">{invoice.blockchainInfo.contractAddress}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopyToClipboard(
                        invoice.blockchainInfo.contractAddress,
                        "Contract address copied to clipboard"
                      )}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction Hash</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium font-mono text-sm">{invoice.blockchainInfo.transactionHash}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopyToClipboard(
                        invoice.blockchainInfo.transactionHash,
                        "Transaction hash copied to clipboard"
                      )}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Timestamp</p>
                <p className="font-medium">
                  {new Date(invoice.blockchainInfo.timestamp).toLocaleString()}
                </p>
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => window.open(invoice.blockchainInfo.verificationUrl, '_blank')}>
                  <Link2 className="mr-2 h-4 w-4" />
                  View on Blockchain Explorer
                </Button>
              </div>
            </div>
          </GlassCard>

          <Card>
            <CardHeader>
              <CardTitle>Token Information</CardTitle>
              <CardDescription>Details about the tokenized invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Token Benefits</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Immutable record of invoice on the blockchain</li>
                  <li>Tradable asset on the Coinvoice marketplace</li>
                  <li>Eligible for early payment discounts</li>
                  <li>Verifiable authenticity</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Token Lifecycle</h3>
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="space-y-4 relative">
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center z-10">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Tokenization</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Invoice converted to a digital asset on the blockchain
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center z-10">
                        <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium">Trading Period</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Token can be traded on the marketplace
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center z-10">
                        <Timer className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium">Settlement</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Payment of the invoice amount to the token holder
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Wallet className="mr-2 h-4 w-4" />
                List on Marketplace
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Complete history of this invoice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                <div className="space-y-6 relative">
                  {invoice.history.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center z-10">
                        <History className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{event.action}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(event.date).toLocaleString()} by {event.user}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

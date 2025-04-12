"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientText } from "@/components/ui/gradient-text"
import {
  BarChart3,
  Calendar,
  ChevronDown,
  Download,
  FileText,
  LineChart,
  PieChart,
  RefreshCw,
  Share2,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

// Mock data for charts
const mockData = {
  invoiceStats: {
    total: 42,
    pending: 8,
    paid: 28,
    overdue: 6,
    totalValue: 248750.00,
    pendingValue: 52500.00,
    paidValue: 176250.00,
    overdueValue: 20000.00,
  },
  monthlyInvoices: [
    { month: "Jan", count: 12, value: 45000 },
    { month: "Feb", count: 15, value: 52500 },
    { month: "Mar", count: 18, value: 63750 },
    { month: "Apr", count: 14, value: 48750 },
    { month: "May", count: 0, value: 0 },
    { month: "Jun", count: 0, value: 0 },
    { month: "Jul", count: 0, value: 0 },
    { month: "Aug", count: 0, value: 0 },
    { month: "Sep", count: 0, value: 0 },
    { month: "Oct", count: 0, value: 0 },
    { month: "Nov", count: 0, value: 0 },
    { month: "Dec", count: 0, value: 0 },
  ],
  topClients: [
    { name: "Acme Corporation", invoices: 8, value: 42500 },
    { name: "Global Logistics Inc", count: 6, value: 38750 },
    { name: "Quantum Healthcare", count: 5, value: 32500 },
    { name: "EcoSmart Solutions", count: 4, value: 18750 },
    { name: "BuildRight Construction", count: 3, value: 27500 },
  ],
  paymentMethods: [
    { method: "Bank Transfer", count: 15, percentage: 35.7 },
    { method: "Credit Card", count: 12, percentage: 28.6 },
    { method: "Crypto", count: 8, percentage: 19.0 },
    { method: "PayPal", count: 5, percentage: 11.9 },
    { method: "Other", count: 2, percentage: 4.8 },
  ],
  tokenizationStats: {
    totalTokenized: 18,
    totalValue: 112500.00,
    averageDiscount: 4.2,
    totalReturns: 4725.00,
  }
}

export function EnhancedAnalytics() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState("thisYear")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Refreshed",
        description: "Analytics data has been updated.",
      })
    }, 1500)
  }

  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting analytics data as ${format.toUpperCase()}...`,
    })
  }

  // Helper function to render stat cards
  const renderStatCard = (title: string, value: string | number, subtitle: string, icon: React.ReactNode, trend?: { value: number, label: string }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
            {trend && (
              <div className={`flex items-center mt-2 text-sm ${trend.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend.value >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span>{trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}</span>
              </div>
            )}
          </div>
          <div className="p-3 bg-primary/10 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            <GradientText gradient="blue-purple">Analytics Dashboard</GradientText>
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Comprehensive insights into your invoice and tokenization data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange === "thisYear" ? "This Year" : 
                 dateRange === "lastYear" ? "Last Year" : 
                 dateRange === "thisQuarter" ? "This Quarter" : "All Time"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setDateRange("thisYear")}>This Year</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("lastYear")}>Last Year</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("thisQuarter")}>This Quarter</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("allTime")}>All Time</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("pdf")}>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv")}>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>Export as Excel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="tokenization" className="flex items-center">
            <LineChart className="mr-2 h-4 w-4" />
            Tokenization
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center">
            <PieChart className="mr-2 h-4 w-4" />
            Clients
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderStatCard(
              "Total Invoices",
              mockData.invoiceStats.total,
              "All invoices",
              <FileText className="h-6 w-6 text-primary" />,
              { value: 12.5, label: "vs. last period" }
            )}
            {renderStatCard(
              "Total Value",
              `$${mockData.invoiceStats.totalValue.toLocaleString()}`,
              "Cumulative invoice value",
              <BarChart3 className="h-6 w-6 text-primary" />,
              { value: 8.3, label: "vs. last period" }
            )}
            {renderStatCard(
              "Tokenized Invoices",
              mockData.tokenizationStats.totalTokenized,
              `$${mockData.tokenizationStats.totalValue.toLocaleString()} total value`,
              <LineChart className="h-6 w-6 text-primary" />,
              { value: 22.7, label: "vs. last period" }
            )}
            {renderStatCard(
              "Pending Payment",
              `$${mockData.invoiceStats.pendingValue.toLocaleString()}`,
              `${mockData.invoiceStats.pending} invoices pending`,
              <Calendar className="h-6 w-6 text-primary" />,
              { value: -5.2, label: "vs. last period" }
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-6" intensity="light">
              <div className="mb-4">
                <h3 className="text-lg font-bold">Monthly Invoice Volume</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Number and value of invoices by month</p>
              </div>
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">Chart visualization would appear here</p>
              </div>
            </GlassCard>

            <Card>
              <CardHeader>
                <CardTitle>Invoice Status Distribution</CardTitle>
                <CardDescription>Breakdown of invoices by current status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-500">Pie chart visualization would appear here</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Paid</span>
                      </div>
                      <span className="text-sm font-medium">{mockData.invoiceStats.paid}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-sm">Pending</span>
                      </div>
                      <span className="text-sm font-medium">{mockData.invoiceStats.pending}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-sm">Overdue</span>
                      </div>
                      <span className="text-sm font-medium">{mockData.invoiceStats.overdue}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                        <span className="text-sm">Tokenized</span>
                      </div>
                      <span className="text-sm font-medium">{mockData.tokenizationStats.totalTokenized}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Top Clients</CardTitle>
                <CardDescription>Clients with the highest invoice volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.topClients.map((client, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {client.invoices || client.count} invoices
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">${client.value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution by payment type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 flex items-center justify-center mb-4">
                  <p className="text-gray-500">Donut chart visualization would appear here</p>
                </div>
                <div className="space-y-2">
                  {mockData.paymentMethods.map((method, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{method.method}</span>
                      </div>
                      <span className="text-sm font-medium">{method.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          {/* Invoice-specific analytics would go here */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderStatCard(
              "Total Invoices",
              mockData.invoiceStats.total,
              "All invoices",
              <FileText className="h-6 w-6 text-primary" />
            )}
            {renderStatCard(
              "Paid Invoices",
              mockData.invoiceStats.paid,
              `$${mockData.invoiceStats.paidValue.toLocaleString()} received`,
              <FileText className="h-6 w-6 text-green-500" />
            )}
            {renderStatCard(
              "Pending Invoices",
              mockData.invoiceStats.pending,
              `$${mockData.invoiceStats.pendingValue.toLocaleString()} pending`,
              <FileText className="h-6 w-6 text-yellow-500" />
            )}
            {renderStatCard(
              "Overdue Invoices",
              mockData.invoiceStats.overdue,
              `$${mockData.invoiceStats.overdueValue.toLocaleString()} overdue`,
              <FileText className="h-6 w-6 text-red-500" />
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Timeline</CardTitle>
              <CardDescription>Monthly invoice creation and payment trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <p className="text-gray-500">Line chart visualization would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokenization" className="space-y-6">
          {/* Tokenization-specific analytics would go here */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderStatCard(
              "Tokenized Invoices",
              mockData.tokenizationStats.totalTokenized,
              `${((mockData.tokenizationStats.totalTokenized / mockData.invoiceStats.total) * 100).toFixed(1)}% of all invoices`,
              <LineChart className="h-6 w-6 text-primary" />
            )}
            {renderStatCard(
              "Tokenized Value",
              `$${mockData.tokenizationStats.totalValue.toLocaleString()}`,
              `${((mockData.tokenizationStats.totalValue / mockData.invoiceStats.totalValue) * 100).toFixed(1)}% of total value`,
              <BarChart3 className="h-6 w-6 text-primary" />
            )}
            {renderStatCard(
              "Avg. Discount Rate",
              `${mockData.tokenizationStats.averageDiscount}%`,
              "Average discount on tokenized invoices",
              <PieChart className="h-6 w-6 text-primary" />
            )}
            {renderStatCard(
              "Total Returns",
              `$${mockData.tokenizationStats.totalReturns.toLocaleString()}`,
              "Returns from tokenization",
              <TrendingUp className="h-6 w-6 text-green-500" />
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tokenization Performance</CardTitle>
              <CardDescription>Metrics and returns from invoice tokenization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <p className="text-gray-500">Combined chart visualization would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          {/* Client-specific analytics would go here */}
          <Card>
            <CardHeader>
              <CardTitle>Client Distribution</CardTitle>
              <CardDescription>Invoice volume and value by client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <p className="text-gray-500">Bubble chart visualization would appear here</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Clients by Volume</CardTitle>
                <CardDescription>Clients with the most invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 flex items-center justify-center">
                  <p className="text-gray-500">Bar chart visualization would appear here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Clients by Value</CardTitle>
                <CardDescription>Clients with the highest invoice value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 flex items-center justify-center">
                  <p className="text-gray-500">Bar chart visualization would appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

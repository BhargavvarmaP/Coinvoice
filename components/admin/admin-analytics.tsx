\"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import {
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Users,
  CreditCard,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingCart,
  FileText,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Bar, BarChart, Line, LineChart as RechartsLineChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell } from "recharts"

// Mock data for analytics
const userGrowthData = [
  { name: "Jan", users: 120, newUsers: 40 },
  { name: "Feb", users: 160, newUsers: 45 },
  { name: "Mar", users: 205, newUsers: 55 },
  { name: "Apr", users: 260, newUsers: 65 },
  { name: "May", users: 325, newUsers: 75 },
  { name: "Jun", users: 400, newUsers: 85 },
  { name: "Jul", users: 485, newUsers: 95 },
  { name: "Aug", users: 580, newUsers: 105 },
  { name: "Sep", users: 685, newUsers: 115 },
  { name: "Oct", users: 800, newUsers: 125 },
  { name: "Nov", users: 925, newUsers: 135 },
  { name: "Dec", users: 1060, newUsers: 145 },
]

const transactionVolumeData = [
  { name: "Jan", volume: 125000, count: 150 },
  { name: "Feb", volume: 165000, count: 180 },
  { name: "Mar", volume: 190000, count: 210 },
  { name: "Apr", volume: 240000, count: 250 },
  { name: "May", volume: 280000, count: 290 },
  { name: "Jun", volume: 350000, count: 320 },
  { name: "Jul", volume: 410000, count: 380 },
  { name: "Aug", volume: 490000, count: 420 },
  { name: "Sep", volume: 550000, count: 480 },
  { name: "Oct", volume: 620000, count: 520 },
  { name: "Nov", volume: 700000, count: 580 },
  { name: "Dec", volume: 780000, count: 650 },
]

const invoiceStatusData = [
  { name: "Paid", value: 540, color: "#4ade80" },
  { name: "Pending", value: 320, color: "#facc15" },
  { name: "Overdue", value: 210, color: "#f87171" },
  { name: "Cancelled", value: 75, color: "#94a3b8" },
]

const marketplaceActivityData = [
  { name: "Jan", listings: 45, sales: 32 },
  { name: "Feb", listings: 52, sales: 38 },
  { name: "Mar", listings: 61, sales: 45 },
  { name: "Apr", listings: 67, sales: 51 },
  { name: "May", listings: 75, sales: 58 },
  { name: "Jun", listings: 84, sales: 65 },
  { name: "Jul", listings: 91, sales: 72 },
  { name: "Aug", listings: 98, sales: 79 },
  { name: "Sep", listings: 105, sales: 85 },
  { name: "Oct", listings: 112, sales: 92 },
  { name: "Nov", listings: 118, sales: 98 },
  { name: "Dec", listings: 125, sales: 105 },
]

const userRoleDistribution = [
  { name: "Regular Users", value: 850, color: "#60a5fa" },
  { name: "Business Users", value: 320, color: "#a78bfa" },
  { name: "Admins", value: 50, color: "#f472b6" },
  { name: "Auditors", value: 28, color: "#34d399" },
]

const revenueSourcesData = [
  { name: "Transaction Fees", value: 450000, color: "#60a5fa" },
  { name: "Subscription Plans", value: 320000, color: "#a78bfa" },
  { name: "Premium Features", value: 180000, color: "#f472b6" },
  { name: "API Access", value: 120000, color: "#34d399" },
  { name: "Other", value: 50000, color: "#94a3b8" },
]

const systemPerformanceData = [
  { name: "Jan", responseTime: 120, errorRate: 1.2 },
  { name: "Feb", responseTime: 115, errorRate: 1.1 },
  { name: "Mar", responseTime: 125, errorRate: 1.3 },
  { name: "Apr", responseTime: 110, errorRate: 1.0 },
  { name: "May", responseTime: 105, errorRate: 0.9 },
  { name: "Jun", responseTime: 100, errorRate: 0.8 },
  { name: "Jul", responseTime: 95, errorRate: 0.7 },
  { name: "Aug", responseTime: 90, errorRate: 0.6 },
  { name: "Sep", responseTime: 85, errorRate: 0.5 },
  { name: "Oct", responseTime: 80, errorRate: 0.4 },
  { name: "Nov", responseTime: 75, errorRate: 0.3 },
  { name: "Dec", responseTime: 70, errorRate: 0.2 },
]

export function AdminAnalytics() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("users")
  const [timeRange, setTimeRange] = useState("year")
  const [comparisonEnabled, setComparisonEnabled] = useState(false)
  
  // Handle export data
  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your analytics data is being prepared for download.",
    })
  }
  
  // Handle refresh data
  const handleRefreshData = () => {
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated with the latest information.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights for your platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 90 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefreshData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleExportData}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,248</div>
              <div className="flex items-center pt-1">
                <span className="text-emerald-500 text-xs font-medium flex items-center mr-2">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  12.5%
                </span>
                <span className="text-xs text-muted-foreground">vs. previous period</span>
              </div>
              <Progress className="h-1 mt-3" value={75} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transaction Volume</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$780,000</div>
              <div className="flex items-center pt-1">
                <span className="text-emerald-500 text-xs font-medium flex items-center mr-2">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  8.3%
                </span>
                <span className="text-xs text-muted-foreground">vs. previous period</span>
              </div>
              <Progress className="h-1 mt-3" value={65} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,145</div>
              <div className="flex items-center pt-1">
                <span className="text-emerald-500 text-xs font-medium flex items-center mr-2">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  5.2%
                </span>
                <span className="text-xs text-muted-foreground">vs. previous period</span>
              </div>
              <Progress className="h-1 mt-3" value={82} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Marketplace Activity</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">230</div>
              <div className="flex items-center pt-1">
                <span className="text-emerald-500 text-xs font-medium flex items-center mr-2">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  15.7%
                </span>
                <span className="text-xs text-muted-foreground">vs. previous period</span>
              </div>
              <Progress className="h-1 mt-3" value={70} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Analytics Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-auto md:grid-cols-6">
          <TabsTrigger value="users" className="text-xs md:text-sm">
            <Users className="h-4 w-4 mr-2 hidden md:block" />
            Users
          </TabsTrigger>
          <TabsTrigger value="transactions" className="text-xs md:text-sm">
            <Activity className="h-4 w-4 mr-2 hidden md:block" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="invoices" className="text-xs md:text-sm">
            <FileText className="h-4 w-4 mr-2 hidden md:block" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="text-xs md:text-sm">
            <ShoppingCart className="h-4 w-4 mr-2 hidden md:block" />
            Marketplace
          </TabsTrigger>
          <TabsTrigger value="revenue" className="text-xs md:text-sm">
            <DollarSign className="h-4 w-4 mr-2 hidden md:block" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="system" className="text-xs md:text-sm">
            <Activity className="h-4 w-4 mr-2 hidden md:block" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Users Analytics */}
        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Total users and new registrations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={userGrowthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.2} />
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 8 }} name="Total Users" />
                      <Line type="monotone" dataKey="newUsers" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 8 }} name="New Users" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown by user roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={userRoleDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {userRoleDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Engagement Metrics</CardTitle>
              <CardDescription>Key performance indicators for user activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Daily Active Users</div>
                  <div className="text-2xl font-bold">485</div>
                  <div className="flex items-center text-xs">
                    <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
                    <span className="text-emerald-500 font-medium">+12.3%</span>
                    <span className="text-muted-foreground ml-1">vs. last week</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Monthly Active Users</div>
                  <div className="text-2xl font-bold">925</div>
                  <div className="flex items-center text-xs">
                    <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
                    <span className="text-emerald-500 font-medium">+8.7%</span>
                    <span className="text-muted-foreground ml-1">vs. last month</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Avg. Session Duration</div>
                  <div className="text-2xl font-bold">12:45</div>
                  <div className="flex items-center text-xs">
                    <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
                    <span className="text-emerald-500 font-medium">+5.2%</span>
                    <span className="text-muted-foreground ml-1">vs. last week</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Retention Rate</div>
                  <div className="text-2xl font-bold">78.5%</div>
                  <div className="flex items-center text-xs">
                    <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                    <span className="text-red-500 font-medium">-2.1%</span>
                    <span className="text-muted-foreground ml-1">vs. last month</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Analytics */}
        <TabsContent value="transactions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Transaction Volume</CardTitle>
                <CardDescription>Total transaction volume and count over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={transactionVolumeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.2} />
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis yAxisId="left" orientation="left" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                      <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Volume ($)" />
                      <Bar yAxisId="right" dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Success Rate</CardTitle>
                <CardDescription>Percentage of successful transactions</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center h-[300px]">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-gray-200 dark:text-gray-800"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className="text-primary"
                      strokeWidth="10"
                      strokeDasharray={`${98.2 * 2.51} ${100 * 2.51}`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold">98.2%</span>
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                      <span className="text-sm">Successful</span>
                    </div>
                    <span className="font-medium">98.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-sm">Failed</span>
                    </div>
                    <span className="font-medium">1.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Invoices Analytics */}
        <TabsContent value="invoices" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Invoice Processing</CardTitle>
                <CardDescription>Number of invoices processed over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={transactionVolumeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.2} />
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 8 }} name="Invoices Processed" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invoice Status</CardTitle>
                <CardDescription>Distribution by current status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={invoiceStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {invoiceStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Marketplace Analytics */}
        <TabsContent value="marketplace" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Marketplace Activity</CardTitle>
                <CardDescription>Listings and sales over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marketplaceActivityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.2} />
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false
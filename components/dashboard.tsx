"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAppStore } from "@/lib/store"
import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"
import {
  AlertOctagon,
  AlertTriangle,
  ArrowUpRight,
  BadgeDollarSign,
  BarChart3,
  BellOff,
  CheckCircle,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  HelpCircle,
  LayoutDashboard,
  PieChartIcon,
  Plus,
  RefreshCcw,
  Search,
  Settings,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CreateInvoiceModal } from "@/components/create-invoice-modal"
import { useAuth } from "@/contexts/auth-context"

export function Dashboard() {
  const { toast } = useToast()
  const { userProfile, walletBalances, tokens, notifications, transactions, refreshData } = useAppStore()
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    refreshData()
  }, [refreshData])

  const handleRefreshData = () => {
    refreshData(true)
    toast({
      title: "Dashboard refreshed",
      description: "The latest data has been loaded.",
    })
  }

  // Calculate total balance
  const totalBalance = walletBalances.reduce((sum: number, balance: { value: number }) => sum + balance.value, 0)

  // Prepare data for charts
  const pieData = walletBalances.map((balance: { token: string; value: number }) => ({
    name: balance.token,
    value: balance.value,
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#FF6B6B"]

  const barData = [
    { name: "Jan", invoices: 4, payments: 3 },
    { name: "Feb", invoices: 6, payments: 5 },
    { name: "Mar", invoices: 8, payments: 7 },
    { name: "Apr", invoices: 10, payments: 9 },
    { name: "May", invoices: 7, payments: 6 },
    { name: "Jun", invoices: 9, payments: 8 },
  ]

  const lineData = [
    { name: "Week 1", value: 5000 },
    { name: "Week 2", value: 8000 },
    { name: "Week 3", value: 7000 },
    { name: "Week 4", value: 12000 },
    { name: "Week 5", value: 10000 },
    { name: "Week 6", value: 15000 },
  ]

  const recentInvoices = [
    {
      id: "INV-001",
      client: "Acme Inc.",
      amount: 1200,
      status: "Paid",
      date: "2023-06-10",
    },
    {
      id: "INV-002",
      client: "Globex Corp.",
      amount: 3500,
      status: "Pending",
      date: "2023-06-08",
    },
    {
      id: "INV-003",
      client: "Stark Industries",
      amount: 8750,
      status: "Overdue",
      date: "2023-05-25",
    },
    {
      id: "INV-004",
      client: "Wayne Enterprises",
      amount: 4200,
      status: "Paid",
      date: "2023-06-02",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefreshData}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setIsCreateInvoiceModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Badge variant="outline" className="ml-auto rounded-full px-2 py-0.5">
              {notifications.filter((n) => !n.read).length}
            </Badge>
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+{(Math.random() * 10).toFixed(2)}% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Invoices</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  {recentInvoices.filter((i) => i.status === "Pending").length} pending
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Tokens</CardTitle>
                <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tokens.length}</div>
                <p className="text-xs text-muted-foreground">
                  {tokens.filter((t) => t.dueDate > new Date().toISOString().split("T")[0]).length} not due yet
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CoinPoints</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userProfile?.coinPoints || 0}</div>
                <p className="text-xs text-muted-foreground">+120 this week</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="invoices" fill="#8884d8" name="Invoices" />
                    <Bar dataKey="payments" fill="#82ca9d" name="Payments" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
                <CardDescription>Your asset allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((_entry: { name: string; value: number }, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, "Value"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>You have {recentInvoices.length} invoices total</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={invoice.client} />
                        <AvatarFallback>{invoice.client.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{invoice.client}</p>
                        <p className="text-sm text-muted-foreground">{invoice.id}</p>
                      </div>
                      <div className="ml-auto font-medium">${invoice.amount}</div>
                      <Badge
                        className="ml-2"
                        variant={
onials                          invoice.status === "Paid"
                            ? "default"
                            : invoice.status === "Pending"
                              ? "outline"
                              : "destructive"
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>You had {transactions.length} transactions recently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center">
                      <Avatar className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <ArrowUpRight
                          className={`h-4 w-4 ${
                            transaction.type === "receive" ? "rotate-180 text-green-500" : "text-red-500"
                          }`}
                        />
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </p>
                        <p className="text-sm text-muted-foreground">{transaction.timestamp.toLocaleDateString()}</p>
                      </div>
                      <div className="ml-auto font-medium">
                        {transaction.type === "receive" ? "+" : "-"}
                        {transaction.amount} {transaction.token}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>Weekly revenue for the past 6 weeks</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} name="Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Paid Invoices</p>
                      <p className="text-2xl font-bold">18</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Pending Invoices</p>
                      <p className="text-2xl font-bold">4</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Overdue Invoices</p>
                      <p className="text-2xl font-bold">2</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">Collection Rate</p>
                      <p className="text-sm font-medium">75%</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-full w-3/4 rounded-full bg-primary"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">Tokenization Rate</p>
                      <p className="text-sm font-medium">60%</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-full w-3/5 rounded-full bg-primary"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
              <CardDescription>Download or view detailed reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-medium">Monthly Invoice Summary</p>
                        <p className="text-sm text-muted-foreground">June 2023</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <PieChartIcon className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-medium">Token Performance Report</p>
                        <p className="text-sm text-muted-foreground">Q2 2023</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Users className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-medium">Client Payment Analysis</p>
                        <p className="text-sm text-muted-foreground">Last 12 months</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Settings className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-medium">Custom Report</p>
                        <p className="text-sm text-muted-foreground">Create a custom report</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Create
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <CardTitle>Notifications</CardTitle>
              <div className="relative ml-auto w-[250px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search notifications..." className="pl-8" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start space-x-4 rounded-lg border p-4 ${
                        !notification.read ? "bg-muted/50" : ""
                      }`}
                    >
                      <div
                        className={`rounded-full p-2 ${
                          notification.type === "info"
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                            : notification.type === "success"
                              ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                              : notification.type === "warning"
                                ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
                                : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {notification.type === "info" ? (
                          <HelpCircle className="h-4 w-4" />
                        ) : notification.type === "success" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : notification.type === "warning" ? (
                          <AlertTriangle className="h-4 w-4" />
                        ) : (
                          <AlertOctagon className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.createdAt.toLocaleDateString()}</p>
                      </div>
                      {!notification.read && (
                        <Badge variant="secondary" className="ml-auto">
                          New
                        </Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex h-[200px] items-center justify-center">
                    <div className="text-center">
                      <BellOff className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-lg font-medium">No notifications</p>
                      <p className="text-sm text-muted-foreground">You're all caught up!</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateInvoiceModal isOpen={isCreateInvoiceModalOpen} onClose={() => setIsCreateInvoiceModalOpen(false)} />
    </div>
  )
}

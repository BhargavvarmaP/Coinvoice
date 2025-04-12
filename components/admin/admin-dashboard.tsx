"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, AlertTriangle, ArrowUpRight, CreditCard, ShoppingCart, Activity } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function AdminDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Here's what's happening with your platform today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Download Report
          </Button>
          <Button size="sm">View All Activity</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                12%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Invoices</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">324</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                8%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketplace Volume</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1.2M</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                18%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-red-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />2
              </span>
              new alerts
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="alerts">System Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
                <CardDescription>Summary of key platform metrics for the last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-16 w-16 mx-auto mb-2 opacity-50" />
                  <p>Analytics chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Signups</CardTitle>
                <CardDescription>New users who joined in the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Alex Johnson", email: "alex@example.com", date: "Today, 10:30 AM" },
                    { name: "Sarah Williams", email: "sarah@example.com", date: "Yesterday, 3:45 PM" },
                    { name: "Michael Brown", email: "michael@example.com", date: "Apr 9, 2025, 9:15 AM" },
                    { name: "Emily Davis", email: "emily@example.com", date: "Apr 8, 2025, 2:30 PM" },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{user.date}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Statistics</CardTitle>
                <CardDescription>Overview of invoice activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Total Invoices</div>
                    <div className="font-medium">1,248</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Pending Verification</div>
                    <div className="font-medium">42</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Tokenized</div>
                    <div className="font-medium">986</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Rejected</div>
                    <div className="font-medium">24</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Average Value</div>
                    <div className="font-medium">$12,450</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Marketplace Activity</CardTitle>
                <CardDescription>Recent marketplace transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "Purchase", token: "CVT-1042", amount: "$5,200", time: "2h ago" },
                    { type: "Sale", token: "CVT-985", amount: "$3,750", time: "5h ago" },
                    { type: "Purchase", token: "CVT-1104", amount: "$8,900", time: "Yesterday" },
                    { type: "Sale", token: "CVT-872", amount: "$4,300", time: "Yesterday" },
                  ].map((transaction, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${transaction.type === "Purchase" ? "bg-green-500" : "bg-amber-500"}`}
                        ></div>
                        <div className="text-sm">{transaction.token}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{transaction.amount}</div>
                        <div className="text-xs text-muted-foreground">{transaction.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current system status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">API Uptime</div>
                    <div className="font-medium text-green-500">99.98%</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Database Status</div>
                    <div className="font-medium text-green-500">Healthy</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Blockchain Connection</div>
                    <div className="font-medium text-green-500">Connected</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Average Response Time</div>
                    <div className="font-medium">124ms</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Failed Transactions</div>
                    <div className="font-medium text-amber-500">2</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>Detailed analytics and metrics for your platform</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Activity className="h-16 w-16 mx-auto mb-2 opacity-50" />
                <p>Detailed analytics will be displayed here</p>
                <p className="text-sm">This feature is coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>All platform activity in the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "User Signup", details: "New user registered: alex@example.com", time: "Today, 10:30 AM" },
                  {
                    action: "Invoice Created",
                    details: "Invoice #1042 created by user: john@example.com",
                    time: "Today, 9:15 AM",
                  },
                  { action: "Token Purchased", details: "CVT-985 purchased for $3,750", time: "Yesterday, 3:45 PM" },
                  {
                    action: "Invoice Tokenized",
                    details: "Invoice #1038 tokenized as CVT-1104",
                    time: "Yesterday, 2:30 PM",
                  },
                  {
                    action: "User Login",
                    details: "Admin user logged in: admin@example.com",
                    time: "Yesterday, 10:15 AM",
                  },
                  {
                    action: "System Update",
                    details: "Platform updated to version 2.4.0",
                    time: "Apr 9, 2025, 11:00 PM",
                  },
                  { action: "Token Sold", details: "CVT-872 sold for $4,300", time: "Apr 9, 2025, 3:20 PM" },
                  {
                    action: "Invoice Rejected",
                    details: "Invoice #1036 rejected due to verification failure",
                    time: "Apr 8, 2025, 5:45 PM",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="w-2 h-2 mt-2 rounded-full bg-primary"></div>
                    <div className="flex-1">
                      <div className="font-medium">{activity.action}</div>
                      <div className="text-sm text-muted-foreground">{activity.details}</div>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Active alerts that require attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/50">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-amber-800 dark:text-amber-400">High Transaction Volume</div>
                      <div className="text-sm text-amber-700 dark:text-amber-500">
                        The system is experiencing unusually high transaction volume. Performance may be affected.
                      </div>
                      <div className="mt-2 text-xs text-amber-600 dark:text-amber-500">Detected: Today, 8:45 AM</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/50">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-red-800 dark:text-red-400">Failed Database Backup</div>
                      <div className="text-sm text-red-700 dark:text-red-500">
                        The scheduled database backup at 2:00 AM failed. Manual intervention required.
                      </div>
                      <div className="mt-2 text-xs text-red-600 dark:text-red-500">Detected: Today, 2:05 AM</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-start gap-3">
                    <div className="text-center text-muted-foreground">
                      <p>No additional alerts at this time</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

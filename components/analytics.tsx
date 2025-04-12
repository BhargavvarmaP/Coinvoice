"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUp, TrendingUp, Download, BarChart, PieChart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Mock data
const mockTradeVolume = [
  { date: "Apr 1", volume: 12500 },
  { date: "Apr 2", volume: 18700 },
  { date: "Apr 3", volume: 15200 },
  { date: "Apr 4", volume: 21000 },
  { date: "Apr 5", volume: 19500 },
  { date: "Apr 6", volume: 23800 },
  { date: "Apr 7", volume: 27500 },
  { date: "Apr 8", volume: 25200 },
  { date: "Apr 9", volume: 29800 },
  { date: "Apr 10", volume: 32500 },
]

const mockTokenDistribution = [
  { category: "Technology", value: 35 },
  { category: "Healthcare", value: 20 },
  { category: "Manufacturing", value: 15 },
  { category: "Retail", value: 12 },
  { category: "Energy", value: 10 },
  { category: "Other", value: 8 },
]

const mockYieldTrends = [
  { date: "Apr 1", yield: 4.2 },
  { date: "Apr 2", yield: 4.3 },
  { date: "Apr 3", yield: 4.5 },
  { date: "Apr 4", yield: 4.7 },
  { date: "Apr 5", yield: 4.9 },
  { date: "Apr 6", yield: 5.1 },
  { date: "Apr 7", yield: 5.3 },
  { date: "Apr 8", yield: 5.5 },
  { date: "Apr 9", yield: 5.6 },
  { date: "Apr 10", yield: 5.8 },
]

export function Analytics() {
  const [timeframe, setTimeframe] = useState("10d")
  const [coinPoints, setCoinPoints] = useState(1250)
  const [coinPointsProgress, setCoinPointsProgress] = useState(42)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCoinPoints((prev) => prev + Math.floor(Math.random() * 5))
      setCoinPointsProgress((prev) => {
        const newValue = prev + Math.floor(Math.random() * 2)
        return newValue > 100 ? 100 : newValue
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleExportData = () => {
    setIsLoading(true)

    // Simulate export process
    setTimeout(() => {
      setIsLoading(false)
      // In a real app, this would trigger a file download
      alert("Analytics data exported successfully!")
    }, 1500)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent">
            Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Track your Coinvoice performance and insights.</p>
        </div>
        <div className="flex gap-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="10d">Last 10 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportData} disabled={isLoading} className="gap-2">
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export Data
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="overflow-hidden border border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Trade Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">$235,800</div>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  12.5%
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">vs. previous period</div>
            </CardContent>
            <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300"></div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="overflow-hidden border border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">42</div>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  8.3%
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">vs. previous period</div>
            </CardContent>
            <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-500 dark:to-purple-300"></div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="overflow-hidden border border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Yield</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">5.8%</div>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  0.7%
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">vs. previous period</div>
            </CardContent>
            <div className="h-1 w-full bg-gradient-to-r from-green-600 to-green-400 dark:from-green-500 dark:to-green-300"></div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="overflow-hidden border border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">CoinPoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-amber-500 dark:text-amber-400">
                  {coinPoints.toLocaleString()}
                </div>
                <div className="relative w-10 h-10">
                  <svg viewBox="0 0 36 36" className="w-10 h-10 rotate-90">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="3"
                      className="dark:stroke-gray-700"
                    />
                    <motion.path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="3"
                      strokeDasharray="100"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 100 - coinPointsProgress }}
                      transition={{ duration: 1 }}
                      className="dark:stroke-amber-400"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-amber-500 dark:text-amber-400">
                    {coinPointsProgress}%
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">to next reward level</div>
            </CardContent>
            <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-amber-300 dark:from-amber-400 dark:to-amber-300"></div>
          </Card>
        </motion.div>
      </div>

      {/* Main Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            Overview
          </TabsTrigger>
          <TabsTrigger value="trades" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            Trade Analytics
          </TabsTrigger>
          <TabsTrigger value="tokens" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            Token Analytics
          </TabsTrigger>
          <TabsTrigger value="rewards" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            Rewards
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border border-gray-200 dark:border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <div>
                      <CardTitle>Trade Volume</CardTitle>
                      <CardDescription>Daily trading volume in USD</CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      12.5%
                    </Badge>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="h-[300px] w-full flex items-center justify-center">
                      <div className="w-full h-full flex flex-col justify-end">
                        <div className="flex items-end h-[250px] w-full gap-1">
                          {mockTradeVolume.map((item, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <motion.div
                                className="w-full bg-blue-500 dark:bg-blue-400 rounded-t-sm"
                                initial={{ height: 0 }}
                                animate={{ height: `${(item.volume / 35000) * 100}%` }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                              ></motion.div>
                              <div className="text-xs mt-2 text-gray-500 dark:text-gray-400">{item.date}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <div>
                      <CardTitle>Token Distribution</CardTitle>
                      <CardDescription>By industry sector</CardDescription>
                    </div>
                    <PieChart className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] relative mb-6">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full border-8 border-gray-100 dark:border-gray-800"></div>
                        <div className="absolute">
                          <div className="text-center">
                            <div className="text-2xl font-bold">42</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Total Tokens</div>
                          </div>
                        </div>
                      </div>
                      {mockTokenDistribution.map((item, index) => {
                        const colors = [
                          "bg-blue-500 dark:bg-blue-400",
                          "bg-purple-500 dark:bg-purple-400",
                          "bg-green-500 dark:bg-green-400",
                          "bg-amber-500 dark:bg-amber-400",
                          "bg-red-500 dark:bg-red-400",
                          "bg-gray-500 dark:bg-gray-400",
                        ]
                        const startAngle =
                          index > 0
                            ? mockTokenDistribution.slice(0, index).reduce((acc, curr) => acc + curr.value, 0)
                            : 0
                        const endAngle = startAngle + item.value

                        return (
                          <motion.div
                            key={index}
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <div
                              className={`absolute inset-0 ${colors[index % colors.length]}`}
                              style={{
                                clipPath: `path('M 50 50 L 50 0 A 50 50 0 ${startAngle > 50 ? 1 : 0} 1 ${
                                  50 + 50 * Math.cos((Math.PI * 2 * endAngle) / 100)
                                } ${50 + 50 * Math.sin((Math.PI * 2 * endAngle) / 100)} Z')`,
                                transformOrigin: "center",
                                transform: "scale(0.8)",
                              }}
                            ></div>
                          </motion.div>
                        )
                      })}
                    </div>
                    <div className="space-y-2">
                      {mockTokenDistribution.map((item, index) => {
                        const colors = [
                          "bg-blue-500 dark:bg-blue-400",
                          "bg-purple-500 dark:bg-purple-400",
                          "bg-green-500 dark:bg-green-400",
                          "bg-amber-500 dark:bg-amber-400",
                          "bg-red-500 dark:bg-red-400",
                          "bg-gray-500 dark:bg-gray-400",
                        ]
                        return (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                              <span className="text-sm">{item.category}</span>
                            </div>
                            <span className="text-sm font-medium">{item.value}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <Card className="border border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle>Invoice Statistics</CardTitle>
                    <CardDescription>Overview of invoice activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { label: "Total Invoices", value: "1,248" },
                        { label: "Pending Verification", value: "42" },
                        { label: "Tokenized", value: "986" },
                        { label: "Rejected", value: "24" },
                        { label: "Average Value", value: "$12,450" },
                      ].map((stat, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                          <div className="font-medium">{stat.value}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-800">
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
                              className={`w-2 h-2 rounded-full ${transaction.type === "Purchase" ? "bg-green-500 dark:bg-green-400" : "bg-amber-500 dark:bg-amber-400"}`}
                            ></div>
                            <div className="text-sm">{transaction.token}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{transaction.amount}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{transaction.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                    <CardDescription>Current system status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { label: "API Uptime", value: "99.98%", status: "good" },
                        { label: "Database Status", value: "Healthy", status: "good" },
                        { label: "Blockchain Connection", value: "Connected", status: "good" },
                        { label: "Average Response Time", value: "124ms", status: "neutral" },
                        { label: "Failed Transactions", value: "2", status: "warning" },
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="text-sm text-gray-600 dark:text-gray-400">{item.label}</div>
                          <div
                            className={cn(
                              "font-medium",
                              item.status === "good"
                                ? "text-green-600 dark:text-green-400"
                                : item.status === "warning"
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "",
                            )}
                          >
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trades" className="mt-6">
              <Card className="border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle>Trade Analytics</CardTitle>
                  <CardDescription>Detailed analytics of your trading activity</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <BarChart className="h-16 w-16 mx-auto mb-2 opacity-50" />
                    <p>Detailed trade analytics will be displayed here</p>
                    <p className="text-sm">This feature is coming soon</p>
                  </div>
                </CardContent>
                ntent>
              </Card>
            </TabsContent>

            <TabsContent value="tokens" className="mt-6">
              <Card className="border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle>Token Analytics</CardTitle>
                  <CardDescription>Performance metrics for your tokens</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Yield Trends</h3>
                      <div className="h-[200px] relative">
                        <div className="absolute inset-x-0 bottom-0 h-[180px] flex items-end">
                          {mockYieldTrends.map((item, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div className="relative w-full h-full flex items-end justify-center">
                                <motion.div
                                  className="w-[2px] bg-green-500 dark:bg-green-400 rounded-t-sm"
                                  initial={{ height: 0 }}
                                  animate={{ height: `${(item.yield / 10) * 100}%` }}
                                  transition={{ duration: 0.5, delay: index * 0.05 }}
                                ></motion.div>
                                {index > 0 && (
                                  <div
                                    className="absolute bottom-0 w-full h-[1px] bg-green-500 dark:bg-green-400"
                                    style={{
                                      transform: `rotate(${Math.atan2(
                                        (mockYieldTrends[index].yield - mockYieldTrends[index - 1].yield) * 20,
                                        10,
                                      )}rad)`,
                                      transformOrigin: "left bottom",
                                      width: "100%",
                                      left: "-50%",
                                    }}
                                  ></div>
                                )}
                              </div>
                              <div className="text-xs mt-2 text-gray-500 dark:text-gray-400">{item.date}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Starting: 4.2%</span>
                        <span>Current: 5.8%</span>
                        <span>Change: +1.6%</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Token Performance</h3>
                      <div className="space-y-3">
                        {[
                          { id: "CVT-1001", performance: 85, value: "$4,850" },
                          { id: "CVT-1002", performance: 92, value: "$11,520" },
                          { id: "CVT-1003", performance: 78, value: "$8,075" },
                          { id: "CVT-1004", performance: 65, value: "$3,040" },
                          { id: "CVT-1005", performance: 88, value: "$14,100" },
                        ].map((token, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">{token.id}</span>
                              <span className="text-sm font-medium">{token.value}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <motion.div
                                className={cn(
                                  "h-full rounded-full",
                                  token.performance > 85
                                    ? "bg-green-500 dark:bg-green-400"
                                    : token.performance > 75
                                      ? "bg-blue-500 dark:bg-blue-400"
                                      : "bg-amber-500 dark:bg-amber-400",
                                )}
                                initial={{ width: 0 }}
                                animate={{ width: `${token.performance}%` }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                              ></motion.div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards" className="mt-6">
              <Card className="border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle>CoinPoints Rewards</CardTitle>
                  <CardDescription>Track your rewards and benefits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Your CoinPoints</h3>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-amber-300 dark:from-amber-400 dark:to-amber-300 flex items-center justify-center text-white text-2xl font-bold">
                          CP
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-amber-500 dark:text-amber-400">
                            {coinPoints.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Current balance</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress to next tier</span>
                          <span>{coinPointsProgress}%</span>
                        </div>
                        <Progress value={coinPointsProgress} className="h-2" />
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Earn 250 more points to reach Gold tier
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Available Benefits</h3>
                      <div className="space-y-3">
                        {[
                          { benefit: "Trading Fee Discount", value: "10%", available: true },
                          { benefit: "Priority Support", value: "Yes", available: true },
                          { benefit: "Extended Token Listings", value: "Up to 10", available: true },
                          { benefit: "Premium Analytics", value: "Basic", available: false },
                          { benefit: "API Access", value: "Limited", available: false },
                        ].map((benefit, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-900"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "w-2 h-2 rounded-full",
                                  benefit.available ? "bg-green-500 dark:bg-green-400" : "bg-gray-300 dark:bg-gray-700",
                                )}
                              ></div>
                              <span className="text-sm">{benefit.benefit}</span>
                            </div>
                            <div className="text-sm font-medium">{benefit.value}</div>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-white dark:bg-amber-500 dark:hover:bg-amber-600">
                        Redeem Points
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
                    <h3 className="text-lg font-medium text-amber-800 dark:text-amber-400 mb-2">
                      How to Earn More Points
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { action: "Tokenize an invoice", points: "+50 points" },
                        { action: "Complete a marketplace transaction", points: "+25 points" },
                        { action: "Refer a new user", points: "+100 points" },
                        { action: "Monthly platform usage", points: "+10 points/day" },
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-amber-700 dark:text-amber-300">{item.action}</span>
                          <span className="text-sm font-medium text-amber-700 dark:text-amber-300">{item.points}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientText } from "@/components/ui/gradient-text"
import {
  ArrowUpDown,
  Calendar,
  ChevronDown,
  Clock,
  CreditCard,
  DollarSign,
  Filter,
  LineChart,
  Percent,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Tag,
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
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Shield } from 'lucide-react';

// Mock data for marketplace tokens
const mockTokens = [
  {
    id: "CVT-2025-0042",
    invoiceId: "INV-2025-0042",
    issuer: {
      name: "Acme Corporation",
      avatar: "/placeholder.svg",
      rating: 4.8,
      verified: true,
    },
    faceValue: 5250.00,
    discountRate: 3.5,
    discountedValue: 5066.25,
    maturityDate: "2025-05-01",
    daysToMaturity: 30,
    riskRating: "A+",
    industry: "Technology",
    tokenType: "Invoice",
    listed: "2025-04-02",
    blockchain: "Ethereum",
  },
  {
    id: "CVT-2025-0043",
    invoiceId: "INV-2025-0043",
    issuer: {
      name: "Global Logistics Inc",
      avatar: "/placeholder.svg",
      rating: 4.5,
      verified: true,
    },
    faceValue: 12750.00,
    discountRate: 4.2,
    discountedValue: 12214.50,
    maturityDate: "2025-06-15",
    daysToMaturity: 75,
    riskRating: "A",
    industry: "Logistics",
    tokenType: "Invoice",
    listed: "2025-04-01",
    blockchain: "Ethereum",
  },
  {
    id: "CVT-2025-0044",
    invoiceId: "INV-2025-0044",
    issuer: {
      name: "Quantum Healthcare",
      avatar: "/placeholder.svg",
      rating: 4.7,
      verified: true,
    },
    faceValue: 8500.00,
    discountRate: 2.8,
    discountedValue: 8262.00,
    maturityDate: "2025-05-20",
    daysToMaturity: 49,
    riskRating: "A+",
    industry: "Healthcare",
    tokenType: "Invoice",
    listed: "2025-04-03",
    blockchain: "Polygon",
  },
  {
    id: "CVT-2025-0045",
    invoiceId: "INV-2025-0045",
    issuer: {
      name: "EcoSmart Solutions",
      avatar: "/placeholder.svg",
      rating: 4.3,
      verified: true,
    },
    faceValue: 3750.00,
    discountRate: 5.0,
    discountedValue: 3562.50,
    maturityDate: "2025-04-25",
    daysToMaturity: 24,
    riskRating: "B+",
    industry: "Renewable Energy",
    tokenType: "Invoice",
    listed: "2025-04-01",
    blockchain: "Ethereum",
  },
  {
    id: "CVT-2025-0046",
    invoiceId: "INV-2025-0046",
    issuer: {
      name: "BuildRight Construction",
      avatar: "/placeholder.svg",
      rating: 4.1,
      verified: false,
    },
    faceValue: 18500.00,
    discountRate: 6.2,
    discountedValue: 17353.00,
    maturityDate: "2025-07-10",
    daysToMaturity: 100,
    riskRating: "B",
    industry: "Construction",
    tokenType: "Invoice",
    listed: "2025-04-02",
    blockchain: "Polygon",
  },
  {
    id: "CVT-2025-0047",
    invoiceId: "INV-2025-0047",
    issuer: {
      name: "FoodTech Innovations",
      avatar: "/placeholder.svg",
      rating: 4.6,
      verified: true,
    },
    faceValue: 6250.00,
    discountRate: 3.8,
    discountedValue: 6012.50,
    maturityDate: "2025-05-15",
    daysToMaturity: 44,
    riskRating: "A",
    industry: "Food & Beverage",
    tokenType: "Invoice",
    listed: "2025-04-03",
    blockchain: "Ethereum",
  },
]

export function EnhancedMarketplace() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("discountRate")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedToken, setSelectedToken] = useState<string | null>(null)

  // Filter tokens based on search query and active tab
  const filteredTokens = mockTokens.filter(token => {
    const matchesSearch = 
      token.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.issuer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.industry.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "highYield") return matchesSearch && token.discountRate > 4.0
    if (activeTab === "shortTerm") return matchesSearch && token.daysToMaturity < 30
    if (activeTab === "verified") return matchesSearch && token.issuer.verified
    
    return matchesSearch
  })

  // Sort tokens
  const sortedTokens = [...filteredTokens].sort((a, b) => {
    let comparison = 0
    
    if (sortBy === "discountRate") {
      comparison = a.discountRate - b.discountRate
    } else if (sortBy === "faceValue") {
      comparison = a.faceValue - b.faceValue
    } else if (sortBy === "daysToMaturity") {
      comparison = a.daysToMaturity - b.daysToMaturity
    } else if (sortBy === "issuerRating") {
      comparison = a.issuer.rating - b.issuer.rating
    }
    
    return sortOrder === "desc" ? -comparison : comparison
  })

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const handleTokenSelect = (tokenId: string) => {
    setSelectedToken(tokenId === selectedToken ? null : tokenId)
  }

  // Calculate yield and return metrics
  const calculateYield = (token: typeof mockTokens[0]) => {
    const annualizedYield = (token.discountRate / (token.daysToMaturity / 365)) * 100
    return annualizedYield.toFixed(2)
  }

  const calculateReturn = (token: typeof mockTokens[0]) => {
    return (token.faceValue - token.discountedValue).toFixed(2)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            <GradientText gradient="blue-purple">Invoice Token Marketplace</GradientText>
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Buy and sell tokenized invoices with transparent pricing and secure transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
          <Button>
            <ShoppingCart className="mr-2 h-4 w-4" />
            My Portfolio
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <GlassCard className="p-4 sticky top-4" intensity="light">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Market Overview</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Available Tokens</span>
                    <span className="font-medium">{mockTokens.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Total Value</span>
                    <span className="font-medium">${mockTokens.reduce((sum, token) => sum + token.faceValue, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Avg. Discount Rate</span>
                    <span className="font-medium">
                      {(mockTokens.reduce((sum, token) => sum + token.discountRate, 0) / mockTokens.length).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Avg. Days to Maturity</span>
                    <span className="font-medium">
                      {Math.round(mockTokens.reduce((sum, token) => sum + token.daysToMaturity, 0) / mockTokens.length)}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Filters</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Industry</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between" size="sm">
                          <span>All Industries</span>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>All Industries</DropdownMenuItem>
                        <DropdownMenuItem>Technology</DropdownMenuItem>
                        <DropdownMenuItem>Healthcare</DropdownMenuItem>
                        <DropdownMenuItem>Logistics</DropdownMenuItem>
                        <DropdownMenuItem>Construction</DropdownMenuItem>
                        <DropdownMenuItem>Renewable Energy</DropdownMenuItem>
                        <DropdownMenuItem>Food & Beverage</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Risk Rating</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between" size="sm">
                          <span>All Ratings</span>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>All Ratings</DropdownMenuItem>
                        <DropdownMenuItem>A+</DropdownMenuItem>
                        <DropdownMenuItem>A</DropdownMenuItem>
                        <DropdownMenuItem>B+</DropdownMenuItem>
                        <DropdownMenuItem>B</DropdownMenuItem>
                        <DropdownMenuItem>C</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Blockchain</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between" size="sm">
                          <span>All Networks</span>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>All Networks</DropdownMenuItem>
                        <DropdownMenuItem>Ethereum</DropdownMenuItem>
                        <DropdownMenuItem>Polygon</DropdownMenuItem>
                        <DropdownMenuItem>Solana</DropdownMenuItem>
                        <DropdownMenuItem>Avalanche</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Maturity Period</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <Button variant="outline" size="sm">
                        <Clock className="mr-1 h-3 w-3" />
                        <span className="text-xs">0-30 days</span>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Clock className="mr-1 h-3 w-3" />
                        <span className="text-xs">31-60 days</span>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Clock className="mr-1 h-3 w-3" />
                        <span className="text-xs">61-90 days</span>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Clock className="mr-1 h-3 w-3" />
                        <span className="text-xs">90+ days</span>
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Discount Rate</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <Button variant="outline" size="sm">
                        <Percent className="mr-1 h-3 w-3" />
                        <span className="text-xs">1-3%</span>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Percent className="mr-1 h-3 w-3" />
                        <span className="text-xs">3-5%</span>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Percent className="mr-1 h-3 w-3" />
                        <span className="text-xs">5-7%</span>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Percent className="mr-1 h-3 w-3" />
                        <span className="text-xs">7%+</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Min ($)</label>
                    <Input type="number" placeholder="0" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Max ($)</label>
                    <Input type="number" placeholder="50,000" className="mt-1" />
                  </div>
                </div>
              </div>

              <Button className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="text"
                placeholder="Search tokens..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Sort by
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSort("discountRate")}>
                    <Percent className="mr-2 h-4 w-4" />
                    Discount Rate
                    {sortBy === "discountRate" && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("faceValue")}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Face Value
                    {sortBy === "faceValue" && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("daysToMaturity")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Days to Maturity
                    {sortBy === "daysToMaturity" && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("issuerRating")}>
                    <LineChart className="mr-2 h-4 w-4" />
                    Issuer Rating
                    {sortBy === "issuerRating" && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="icon">
                <ArrowUpDown className="h-4 w-4" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all">All Tokens</TabsTrigger>
              <TabsTrigger value="highYield">High Yield</TabsTrigger>
              <TabsTrigger value="shortTerm">Short Term</TabsTrigger>
              <TabsTrigger value="verified">Verified Only</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {sortedTokens.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Tag className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-lg font-medium">No tokens found</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Try adjusting your search or filters
                    </p>
                  </CardContent>
                </Card>
              ) : (
                sortedTokens.map((token) => (
                  <motion.div
                    key={token.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <Card 
                      className={`overflow-hidden transition-all ${selectedToken === token.id ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => handleTokenSelect(token.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div>
                              <CardTitle className="text-lg flex items-center gap-2">
                                {token.id}
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {token.blockchain}
                                </Badge>
                              </CardTitle>
                              <CardDescription>
                                Invoice {token.invoiceId} • {token.industry}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={token.riskRating.startsWith('A') ? 'bg-green-500' : 'bg-yellow-500'}>
                            {token.riskRating}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={token.issuer.avatar} alt={token.issuer.name} />
                                <AvatarFallback>{token.issuer.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="text-sm font-medium flex items-center">
                                {token.issuer.name}
                                {token.issuer.verified && (
                                  <Badge variant="outline" className="ml-2 h-5 text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Calendar className="mr-2 h-4 w-4" />
                              <span>Listed: {token.listed}</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Face Value</div>
                            <div className="text-lg font-bold">${token.faceValue.toLocaleString()}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Discounted: ${token.discountedValue.toLocaleString()} ({token.discountRate}% off)
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Maturity</div>
                            <div className="text-lg font-bold">{token.daysToMaturity} days</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Due: {token.maturityDate}
                            </div>
                          </div>
                        </div>

                        {selectedToken === token.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Return</div>
                                <div className="text-lg font-bold text-green-600">${calculateReturn(token)}</div>
                                <div className="text-sm text-gray-500">Profit at maturity</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Annual Yield</div>
                                <div className="text-lg font-bold text-green-600">{calculateYield(token)}%</div>
                                <div className="text-sm text-gray-500">Annualized return</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Time to Maturity</div>
                                <Progress value={(1 - token.daysToMaturity / 100) * 100} className="h-2 mt-2" />
                                <div className="flex justify-between text-xs mt-1">
                                  <span>Today</span>
                                  <span>Due Date</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button size="sm">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Purchase Token
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              )}
            </TabsContent>

            <TabsContent value="highYield" className="space-y-4">
              {/* Same structure as "all" tab, filtered for high yield tokens */}
              {sortedTokens.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Percent className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-lg font-medium">No high yield tokens found</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Try adjusting your filters
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <p className="text-sm text-gray-500">Showing {sortedTokens.length} high yield tokens</p>
                // Token cards would go here
              )}
            </TabsContent>

            <TabsContent value="shortTerm" className="space-y-4">
              {/* Same structure as "all" tab, filtered for short term tokens */}
              {sortedTokens.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Clock className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-lg font-medium">No short term tokens found</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Try adjusting your filters
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <p className="text-sm text-gray-500">Showing {sortedTokens.length} short term tokens</p>
                // Token cards would go here
              )}
            </TabsContent>

            <TabsContent value="verified" className="space-y-4">
              {/* Same structure as "all" tab, filtered for verified tokens */}
              {sortedTokens.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Shield className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-lg font-medium">No verified tokens found</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Try adjusting your filters
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <p className="text-sm text-gray-500">Showing {sortedTokens.length} verified tokens</p>
                // Token cards would go here
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

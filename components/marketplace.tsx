"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  ChevronDown,
  DollarSign,
  Filter,
  Search,
  ShoppingCart,
  Clock,
  Shield,
  Building,
  Calendar,
  Plus,
  Download,
  ChevronLeft,
  ChevronRight,
  FileText,
  Briefcase,
  Ship,
  Landmark,
  Banknote,
  BarChart,
  TrendingUp,
  Grid,
  List,
  Check,
  Info,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Canvas } from "@react-three/fiber"
import { useGLTF, PresentationControls, Float, Environment, Text3D, Center } from "@react-three/drei"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Progress } from "@/components/ui/progress"

// 3D Token Model Component
function TokenModel(props: any) {
  const { scene } = useGLTF("/token.glb") || { scene: null }
  return scene ? <primitive object={scene} {...props} /> : null
}

// Fallback for when 3D isn't available
function TokenFallback({ text = "CVT" }: { text?: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 animate-spin-slow flex items-center justify-center text-white font-bold text-xl">
        {text}
      </div>
    </div>
  )
}

// Define token category type
type TokenCategory =
  | "all"
  | "receivables"
  | "letters-of-credit"
  | "guarantees"
  | "ebol"
  | "bonds"
  | "trade-finance"
  | "supply-chain"

// Define token type
type Token = {
  id: string
  amount: number
  dueDate: string
  price: number
  yield: string
  issuer: string
  risk: "Low" | "Medium" | "High"
  industry: string
  category: TokenCategory
  description: string
  status?: string
  purchaseDate?: string
  image?: string
  popularity?: number
  region?: string
  trending?: boolean
  verified?: boolean
}

export function Marketplace() {
  const { toast } = useToast()
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [yieldRange, setYieldRange] = useState([2, 8])
  const [selectedRisks, setSelectedRisks] = useState<string[]>(["Low", "Medium", "High"])
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("price-asc")
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [purchaseAmount, setPurchaseAmount] = useState("")
  const [bidAmount, setBidAmount] = useState("")
  const [showBidDialog, setShowBidDialog] = useState(false)
  const [activeTokenId, setActiveTokenId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<TokenCategory>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [canRender3D, setCanRender3D] = useState(false)
  const [showTokenDetails, setShowTokenDetails] = useState(false)
  const [purchaseProgress, setPurchaseProgress] = useState(0)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [showTrending, setShowTrending] = useState(false)
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)
  const marketplaceRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(marketplaceRef, { once: true, amount: 0.1 })

  // Check if we can render 3D content
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      setCanRender3D(!!gl)
    } catch (e) {
      setCanRender3D(false)
    }
  }, [])

  // Get marketplace listings from the store
  const { marketplaceListings, refreshData } = useAppStore()

  // Convert marketplace listings to tokens format
  const tokens: Token[] = marketplaceListings.map((listing) => ({
    id: listing.tokenId,
    amount: listing.faceValue,
    dueDate: listing.maturityDate,
    price: listing.currentValue,
    yield: `${listing.discountRate.toFixed(1)}%`,
    issuer: listing.issuer,
    risk: listing.riskRating.startsWith("A") ? "Low" : listing.riskRating.startsWith("B") ? "Medium" : "High",
    industry: listing.category,
    category: mapCategoryToTokenCategory(listing.tokenType, listing.category),
    description: listing.description,
    status: listing.status === "active" ? "Listed" : listing.status === "sold" ? "Sold" : "Expired",
    image: listing.imageUrl,
    popularity: Math.floor(Math.random() * 100),
    region: ["Asia", "Europe", "North America", "South America", "Africa", "Australia"][Math.floor(Math.random() * 6)],
    trending: Math.random() > 0.7,
    verified: Math.random() > 0.3,
  }))

  // Mock data for my listings and purchases
  const myListings: Token[] = tokens.slice(0, 3)
  const myPurchases: Token[] = tokens.slice(3, 5).map((token) => ({
    ...token,
    purchaseDate: "2025-04-01",
  }))

  // Helper function to map token type and category to TokenCategory
  function mapCategoryToTokenCategory(tokenType: string, category: string): TokenCategory {
    switch (tokenType) {
      case "invoice":
        return "receivables"
      case "loc":
        return "letters-of-credit"
      case "guarantee":
        return "guarantees"
      case "ebol":
        return "ebol"
      default:
        if (category === "Banking") return "bonds"
        if (category === "Technology") return "trade-finance"
        if (category === "Logistics") return "supply-chain"
        return "all"
    }
  }

  // Simulate loading state
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [selectedCategory, currentPage, itemsPerPage])

  // Categories with icons
  const categories: { id: TokenCategory; name: string; icon: JSX.Element }[] = [
    { id: "all", name: "All Tokens", icon: <BarChart className="h-4 w-4" /> },
    { id: "receivables", name: "Receivables", icon: <FileText className="h-4 w-4" /> },
    { id: "letters-of-credit", name: "Letters of Credit", icon: <Briefcase className="h-4 w-4" /> },
    { id: "guarantees", name: "Guarantees", icon: <Shield className="h-4 w-4" /> },
    { id: "ebol", name: "Electronic BoL", icon: <Ship className="h-4 w-4" /> },
    { id: "bonds", name: "Bonds", icon: <Landmark className="h-4 w-4" /> },
    { id: "trade-finance", name: "Trade Finance", icon: <DollarSign className="h-4 w-4" /> },
    { id: "supply-chain", name: "Supply Chain", icon: <Banknote className="h-4 w-4" /> },
  ]

  // Regions
  const regions = ["Asia", "Europe", "North America", "South America", "Africa", "Australia"]

  // Filter tokens based on search, filters, and category
  const filteredTokens = tokens
    .filter((token) => {
      // Category filter
      if (selectedCategory !== "all" && token.category !== selectedCategory) {
        return false
      }

      // Search term filter
      if (
        searchTerm &&
        !token.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !token.issuer.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      // Price range filter
      if (token.price < priceRange[0] || token.price > priceRange[1]) {
        return false
      }

      // Yield range filter
      const tokenYield = Number.parseFloat(token.yield.replace("%", ""))
      if (tokenYield < yieldRange[0] || tokenYield > yieldRange[1]) {
        return false
      }

      // Risk filter
      if (!selectedRisks.includes(token.risk)) {
        return false
      }

      // Industry filter
      if (selectedIndustries.length > 0 && !selectedIndustries.includes(token.industry)) {
        return false
      }

      // Region filter
      if (selectedRegions.length > 0 && token.region && !selectedRegions.includes(token.region)) {
        return false
      }

      // Trending filter
      if (showTrending && !token.trending) {
        return false
      }

      // Verified filter
      if (showVerifiedOnly && !token.verified) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price
      if (sortBy === "price-desc") return b.price - a.price
      if (sortBy === "yield-asc") return Number.parseFloat(a.yield) - Number.parseFloat(b.yield)
      if (sortBy === "yield-desc") return Number.parseFloat(b.yield) - Number.parseFloat(a.yield)
      if (sortBy === "date-asc") return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      if (sortBy === "date-desc") return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
      if (sortBy === "popularity") return (b.popularity || 0) - (a.popularity || 0)
      return 0
    })

  // Pagination
  const totalPages = Math.ceil(filteredTokens.length / itemsPerPage)
  const paginatedTokens = filteredTokens.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const toggleRisk = (risk: string) => {
    if (selectedRisks.includes(risk)) {
      setSelectedRisks(selectedRisks.filter((r) => r !== risk))
    } else {
      setSelectedRisks([...selectedRisks, risk])
    }
  }

  const toggleIndustry = (industry: string) => {
    if (selectedIndustries.includes(industry)) {
      setSelectedIndustries(selectedIndustries.filter((i) => i !== industry))
    } else {
      setSelectedIndustries([...selectedIndustries, industry])
    }
  }

  const toggleRegion = (region: string) => {
    if (selectedRegions.includes(region)) {
      setSelectedRegions(selectedRegions.filter((r) => r !== region))
    } else {
      setSelectedRegions([...selectedRegions, region])
    }
  }

  const handleBuy = () => {
    if (!selectedToken) return

    setIsPurchasing(true)
    setPurchaseProgress(0)

    // Simulate a purchase process
    const interval = setInterval(() => {
      setPurchaseProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 300)

    // Simulate completion
    setTimeout(() => {
      clearInterval(interval)
      setPurchaseProgress(100)
      setIsPurchasing(false)
      setShowSuccessMessage(true)

      setTimeout(() => {
        setShowSuccessMessage(false)
        setSelectedToken(null)

        toast({
          title: "Purchase Successful",
          description: `You have purchased ${selectedToken.id} for $${selectedToken.price.toLocaleString()}.`,
          variant: "success",
        })

        refreshData()
      }, 1500)
    }, 3500)
  }

  const handleBid = () => {
    if (!activeTokenId || !bidAmount) return

    toast({
      title: "Bid Placed",
      description: `Your bid of $${bidAmount} for ${activeTokenId} has been placed.`,
      variant: "success",
    })

    setShowBidDialog(false)
    setBidAmount("")
    setActiveTokenId(null)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "Medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getYieldColor = (yieldValue: string) => {
    const value = Number.parseFloat(yieldValue)
    if (value < 4) return "text-blue-600 dark:text-blue-400"
    if (value < 6) return "text-green-600 dark:text-green-400"
    return "text-amber-600 dark:text-amber-400"
  }

  // Token card skeleton for loading state
  const TokenCardSkeleton = () => (
    <div className="glassmorphism rounded-lg overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
        </div>
        <div className="space-y-1">
          <Skeleton className="h-4 w-16 mb-1" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="pt-2 flex gap-2">
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8" ref={marketplaceRef}>
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text font-heading">Marketplace</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Buy and sell Coinvoice Tokens (CVT) with our enhanced trading experience
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-800/50 group"
          >
            <Filter className="h-4 w-4 transition-transform group-hover:rotate-180" />
            Filters
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </Button>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-800/50">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="yield-asc">Yield: Low to High</SelectItem>
              <SelectItem value="yield-desc">Yield: High to Low</SelectItem>
              <SelectItem value="date-asc">Due Date: Earliest</SelectItem>
              <SelectItem value="date-desc">Due Date: Latest</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>
          <div className="hidden md:flex border rounded-md overflow-hidden shadow-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "rounded-none border-r h-10 w-10",
                      viewMode === "grid" ? "bg-blue-50 dark:bg-blue-900/20" : "",
                    )}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Grid View</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "rounded-none h-10 w-10",
                      viewMode === "list" ? "bg-blue-50 dark:bg-blue-900/20" : "",
                    )}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>List View</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        className="flex overflow-x-auto pb-2 gap-2 scrollbar-thin"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
          >
            <Button
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              className={cn(
                "flex items-center gap-2 whitespace-nowrap",
                selectedCategory === category.id && "bg-gradient-to-r from-blue-600 to-blue-500 text-white",
              )}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon}
              {category.name}
            </Button>
          </motion.div>
        ))}
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by token ID or issuer..."
            className="pl-10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-800/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="glassmorphism rounded-lg p-4 shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Price Range</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                    </span>
                  </div>
                  <Slider value={priceRange} min={0} max={50000} step={1000} onValueChange={setPriceRange} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Yield Range</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {yieldRange[0]}% - {yieldRange[1]}%
                    </span>
                  </div>
                  <Slider value={yieldRange} min={0} max={10} step={0.1} onValueChange={setYieldRange} />
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Risk Level</h3>
                  <div className="space-y-2">
                    {["Low", "Medium", "High"].map((risk) => (
                      <div key={risk} className="flex items-center gap-2">
                        <Switch checked={selectedRisks.includes(risk)} onCheckedChange={() => toggleRisk(risk)} />
                        <Label className="flex items-center gap-2">
                          {risk}
                          <Badge variant="outline" className={getRiskColor(risk)}>
                            {risk}
                          </Badge>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Industry</h3>
                  <div className="space-y-2">
                    {["Technology", "Manufacturing", "Healthcare", "Retail", "Energy"].map((industry) => (
                      <div key={industry} className="flex items-center gap-2">
                        <Switch
                          checked={selectedIndustries.includes(industry)}
                          onCheckedChange={() => toggleIndustry(industry)}
                        />
                        <Label>{industry}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Region</h3>
                    <div className="space-y-2">
                      {regions.map((region) => (
                        <div key={region} className="flex items-center gap-2">
                          <Switch
                            checked={selectedRegions.includes(region)}
                            onCheckedChange={() => toggleRegion(region)}
                          />
                          <Label>{region}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Special Filters</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Switch checked={showTrending} onCheckedChange={setShowTrending} />
                        <Label className="flex items-center gap-2">
                          Trending Only
                          <TrendingUp className="h-4 w-4 text-amber-500" />
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={showVerifiedOnly} onCheckedChange={setShowVerifiedOnly} />
                        <Label className="flex items-center gap-2">
                          Verified Only
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          >
                            <Check className="h-3 w-3 mr-1" /> Verified
                          </Badge>
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPriceRange([0, 50000])
                    setYieldRange([2, 8])
                    setSelectedRisks(["Low", "Medium", "High"])
                    setSelectedIndustries([])
                    setSelectedRegions([])
                    setShowTrending(false)
                    setShowVerifiedOnly(false)
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Marketplace Tabs */}
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1">
          <TabsTrigger value="browse" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            Browse Marketplace
          </TabsTrigger>
          <TabsTrigger
            value="my-listings"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950"
          >
            My Listings
          </TabsTrigger>
          <TabsTrigger
            value="my-purchases"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950"
          >
            My Purchases
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="mt-6">
          {viewMode === "grid" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  // Loading skeletons
                  Array.from({ length: itemsPerPage }).map((_, index) => <TokenCardSkeleton key={index} />)
                ) : paginatedTokens.length > 0 ? (
                  paginatedTokens.map((token, index) => (
                    <motion.div
                      key={token.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="glassmorphism rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-blue-600 dark:text-blue-400 text-lg">{token.id}</h3>
                              {token.verified && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 h-5 flex items-center gap-1">
                                        <Check className="h-3 w-3" /> Verified
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>This token has been verified by our team</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              {token.trending && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 h-5 flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3" /> Trending
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>This token is trending in the marketplace</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Building className="h-3 w-3 inline" /> {token.issuer}
                              {token.region && (
                                <Badge variant="outline" className="ml-1 text-xs h-5 px-1.5">
                                  {token.region}
                                </Badge>
                              )}
                            </p>
                          </div>
                          <Badge className={`${getYieldColor(token.yield)} bg-opacity-10 dark:bg-opacity-20`}>
                            {token.yield} Yield
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              Face Value
                            </div>
                            <div className="font-medium">${token.amount.toLocaleString()}</div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              Current Price
                            </div>
                            <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                              ${token.price.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Due Date
                            </div>
                            <div className="font-medium">{token.dueDate}</div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              Risk Level
                            </div>
                            <div>
                              <Badge className={getRiskColor(token.risk)}>{token.risk}</Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            Industry
                          </div>
                          <div className="font-medium">{token.industry}</div>
                        </div>

                        <div className="pt-2 flex gap-2">
                          <Drawer>
                            <DrawerTrigger asChild>
                              <Button
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-sm hover:shadow-md transition-all"
                                onClick={() => setSelectedToken(token)}
                              >
                                Buy Now
                              </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                              <DrawerHeader>
                                <DrawerTitle>Purchase {selectedToken?.id}</DrawerTitle>
                                <DrawerDescription>
                                  You are about to purchase this Coinvoice Token (CVT).
                                </DrawerDescription>
                              </DrawerHeader>

                              {selectedToken && (
                                <div className="px-4 py-2">
                                  <div className="flex flex-col md:flex-row gap-6">
                                    <div className="md:w-1/3 h-[200px] flex items-center justify-center">
                                      {canRender3D ? (
                                        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                                          <ambientLight intensity={0.5} />
                                          <spotLight
                                            position={[10, 10, 10]}
                                            angle={0.15}
                                            penumbra={1}
                                            intensity={1}
                                            castShadow
                                          />
                                          <PresentationControls
                                            global
                                            rotation={[0, 0, 0]}
                                            polar={[-Math.PI / 4, Math.PI / 4]}
                                            azimuth={[-Math.PI / 4, Math.PI / 4]}
                                            config={{ mass: 2, tension: 500 }}
                                            snap={{ mass: 4, tension: 1500 }}
                                          >
                                            <Float rotationIntensity={0.5} floatIntensity={0.5} speed={1.5}>
                                              <Center>
                                                <Text3D
                                                  font="/inter-bold.json"
                                                  size={0.5}
                                                  height={0.1}
                                                  curveSegments={12}
                                                >
                                                  {selectedToken.id}
                                                  <meshStandardMaterial color="#3b82f6" />
                                                </Text3D>
                                              </Center>
                                            </Float>
                                          </PresentationControls>
                                          <Environment preset="city" />
                                        </Canvas>
                                      ) : (
                                        <TokenFallback text={selectedToken.id} />
                                      )}
                                    </div>
                                    <div className="md:w-2/3 space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                          <div className="text-sm text-gray-500 dark:text-gray-400">Token ID:</div>
                                          <div className="font-medium">{selectedToken.id}</div>
                                        </div>

                                        <div className="space-y-1">
                                          <div className="text-sm text-gray-500 dark:text-gray-400">Issuer:</div>
                                          <div className="font-medium">{selectedToken.issuer}</div>
                                        </div>

                                        <div className="space-y-1">
                                          <div className="text-sm text-gray-500 dark:text-gray-400">Face Value:</div>
                                          <div className="font-medium">${selectedToken.amount.toLocaleString()}</div>
                                        </div>

                                        <div className="space-y-1">
                                          <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Purchase Price:
                                          </div>
                                          <div className="font-bold text-blue-600 dark:text-blue-400">
                                            ${selectedToken.price.toLocaleString()}
                                          </div>
                                        </div>

                                        <div className="space-y-1">
                                          <div className="text-sm text-gray-500 dark:text-gray-400">Due Date:</div>
                                          <div className="font-medium">{selectedToken.dueDate}</div>
                                        </div>

                                        <div className="space-y-1">
                                          <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Expected Yield:
                                          </div>
                                          <div className={`font-medium ${getYieldColor(selectedToken.yield)}`}>
                                            {selectedToken.yield}
                                          </div>
                                        </div>

                                        <div className="space-y-1">
                                          <div className="text-sm text-gray-500 dark:text-gray-400">Risk Level:</div>
                                          <div>
                                            <Badge className={getRiskColor(selectedToken.risk)}>
                                              {selectedToken.risk}
                                            </Badge>
                                          </div>
                                        </div>

                                        <div className="space-y-1">
                                          <div className="text-sm text-gray-500 dark:text-gray-400">Region:</div>
                                          <div className="font-medium">{selectedToken.region}</div>
                                        </div>
                                      </div>

                                      <div className="pt-4">
                                        <Label htmlFor="amount">Purchase Amount (USD)</Label>
                                        <Input
                                          id="amount"
                                          value={purchaseAmount || selectedToken.price}
                                          onChange={(e) => setPurchaseAmount(e.target.value)}
                                          type="number"
                                          className="mt-1 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-800/50"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {isPurchasing && (
                                    <div className="mt-6 space-y-2">
                                      <div className="flex justify-between text-sm">
                                        <span>Processing purchase...</span>
                                        <span>{purchaseProgress}%</span>
                                      </div>
                                      <Progress value={purchaseProgress} className="h-2" />
                                    </div>
                                  )}

                                  {showSuccessMessage && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-400 flex items-center gap-2"
                                    >
                                      <Check className="h-5 w-5" />
                                      <span>Purchase successful! Token added to your portfolio.</span>
                                    </motion.div>
                                  )}
                                </div>
                              )}

                              <DrawerFooter>
                                <Button
                                  onClick={handleBuy}
                                  disabled={isPurchasing}
                                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                                >
                                  {isPurchasing ? "Processing..." : "Confirm Purchase"}
                                </Button>
                                <DrawerClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DrawerClose>
                              </DrawerFooter>
                            </DrawerContent>
                          </Drawer>

                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              setActiveTokenId(token.id)
                              setShowBidDialog(true)
                            }}
                          >
                            Place Bid
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 glassmorphism rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium">No tokens found</h3>
                    <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search term</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {!isLoading && filteredTokens.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-2 mx-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="glassmorphism rounded-lg overflow-hidden">
                <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800 p-3">
                  <div className="font-medium">Token ID</div>
                  <div className="font-medium">Issuer</div>
                  <div className="font-medium">Face Value</div>
                  <div className="font-medium">Price</div>
                  <div className="font-medium">Due Date</div>
                  <div className="font-medium">Yield</div>
                  <div className="font-medium text-right">Actions</div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {isLoading ? (
                    // Loading skeletons for list view
                    Array.from({ length: itemsPerPage }).map((_, index) => (
                      <div key={index} className="grid grid-cols-7 p-3 items-center">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-12" />
                        <div className="flex justify-end gap-2">
                          <Skeleton className="h-8 w-16 rounded-md" />
                          <Skeleton className="h-8 w-16 rounded-md" />
                        </div>
                      </div>
                    ))
                  ) : paginatedTokens.length > 0 ? (
                    paginatedTokens.map((token, index) => (
                      <motion.div
                        key={token.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="grid grid-cols-7 p-3 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <div className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                          {token.id}
                          {token.verified && <Check className="h-3 w-3 text-blue-500" />}
                          {token.trending && <TrendingUp className="h-3 w-3 text-amber-500" />}
                        </div>
                        <div className="text-sm">{token.issuer}</div>
                        <div>${token.amount.toLocaleString()}</div>
                        <div className="font-medium">${token.price.toLocaleString()}</div>
                        <div>{token.dueDate}</div>
                        <div className={getYieldColor(token.yield)}>{token.yield}</div>
                        <div className="flex justify-end gap-2">
                          <Drawer>
                            <DrawerTrigger asChild>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-sm hover:shadow-md transition-all"
                                onClick={() => setSelectedToken(token)}
                              >
                                Buy
                              </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                              <DrawerHeader>
                                <DrawerTitle>Purchase {selectedToken?.id}</DrawerTitle>
                                <DrawerDescription>
                                  You are about to purchase this Coinvoice Token (CVT).
                                </DrawerDescription>
                              </DrawerHeader>

                              {selectedToken && (
                                <div className="px-4 py-2">
                                  <div className="flex flex-col md:flex-row gap-6">
                                    <div className="md:w-1/3 h-[200px] flex items-center justify-center">
                                      {canRender3D ? (
                                        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                                          <ambientLight intensity={0.5} />
                                          <spotLight
                                            position={[10, 10, 10]}
                                            angle={0.15}
                                            penumbra={1}
                                            intensity={1}
                                            castShadow
                                          />
                                          <PresentationControls
                                            global
                                            rotation={[0, 0, 0]}
                                            polar={[-Math.PI / 4, Math.PI / 4]}
                                            azimuth={[-Math.PI / 4, Math.PI / 4]}
                                            config={{ mass: 2, tension: 500 }}
                                            snap={{ mass: 4, tension: 1500 }}
                                          >
                                            <Float rotationIntensity={0.5} floatIntensity={0.5} speed={1.5}>
                                              <Center>
                                                <Text3D
                                                  font="/inter-bold.json"
                                                  size={0.5}
                                                  height={0.1}
                                                  curveSegments={12}
                                                >
                                                  {selectedToken.id}
                                                  <meshStandardMaterial color="#3b82f6" />
                                                </Text3D>
                                              </Center>
                                            </Float>
                                          </PresentationControls>
                                          <Environment preset="city" />
                                        </Canvas>
                                      ) : (
                                        <TokenFallback text={selectedToken.id} />
                                      )}
                                    </div>
                                    <div className="md:w-2/3 space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                          <div className="text-sm text-gray-500 dark:text-gray-400">Token ID:</div>
                                          <div className="font-medium">{selectedToken.id}</div>
                                        </div>

                                        <div className="space-y-1">
                                          <div className="text-sm text-gray-500 dark:text-gray-400">Issuer:</div>
                                          <div className="font-medium">{selectedToken.issuer}</div>
                                        </div>

                                        <div className="space-y-1">
                                          <div className="text-sm text-gray-500 dark:text-gray-400">Face Value:</div>
                                          <div className="font-medium">${selectedToken.amount.toLocaleString()}</div>
                                        </div>

                                        <div className="space-y-1">
                                          <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Purchase Price:
                                          </div>
                                          <div className="font-bold text-blue-600 dark:text-blue-400">
                                            ${selectedToken.price.toLocaleString()}
                                          </div>
                                        </div>

                                        <div className="space-y-1">
                                          <div className="text-sm text-gray-500 dark:text-gray-400">Due Date:</div>
                                          <div className="font-medium">{selectedToken.dueDate}</div>
                                        </div>

                                        <div className="space-y-1">
                                          <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Expected Yield:
                                          </div>
                                          <div className={`font-medium ${getYieldColor(selectedToken.yield)}`}>
                                            {selectedToken.yield}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="pt-4">
                                        <Label htmlFor="amount">Purchase Amount (USD)</Label>
                                        <Input
                                          id="amount"
                                          value={purchaseAmount || selectedToken.price}
                                          onChange={(e) => setPurchaseAmount(e.target.value)}
                                          type="number"
                                          className="mt-1 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-800/50"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {isPurchasing && (
                                    <div className="mt-6 space-y-2">
                                      <div className="flex justify-between text-sm">
                                        <span>Processing purchase...</span>
                                        <span>{purchaseProgress}%</span>
                                      </div>
                                      <Progress value={purchaseProgress} className="h-2" />
                                    </div>
                                  )}

                                  {showSuccessMessage && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-400 flex items-center gap-2"
                                    >
                                      <Check className="h-5 w-5" />
                                      <span>Purchase successful! Token added to your portfolio.</span>
                                    </motion.div>
                                  )}
                                </div>
                              )}

                              <DrawerFooter>
                                <Button
                                  onClick={handleBuy}
                                  disabled={isPurchasing}
                                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                                >
                                  {isPurchasing ? "Processing..." : "Confirm Purchase"}
                                </Button>
                                <DrawerClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DrawerClose>
                              </DrawerFooter>
                            </DrawerContent>
                          </Drawer>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setActiveTokenId(token.id)
                              setShowBidDialog(true)
                            }}
                          >
                            Bid
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="h-8 w-8 text-gray-400 mb-2" />
                        <h3 className="text-lg font-medium">No tokens found</h3>
                        <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search term</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pagination for list view */}
              {!isLoading && filteredTokens.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-2 mx-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="my-listings" className="mt-6">
          <Card className="glassmorphism">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>My Listed Tokens</CardTitle>
                  <CardDescription>Manage your tokens listed on the marketplace</CardDescription>
                </div>
                <Button
                  onClick={() => toast({ title: "Coming Soon", description: "This feature will be available soon." })}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-sm hover:shadow-md transition-all"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  List New Token
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {myListings.length > 0 ? (
                <div className="rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800 p-3">
                    <div className="font-medium">Token ID</div>
                    <div className="font-medium">Face Value</div>
                    <div className="font-medium">List Price</div>
                    <div className="font-medium">Due Date</div>
                    <div className="font-medium">Yield</div>
                    <div className="font-medium">Status</div>
                    <div className="font-medium text-right">Actions</div>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {myListings.map((token, index) => (
                      <motion.div
                        key={token.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="grid grid-cols-7 p-3 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <div className="font-medium text-blue-600 dark:text-blue-400">{token.id}</div>
                        <div>${token.amount.toLocaleString()}</div>
                        <div>${token.price.toLocaleString()}</div>
                        <div>{token.dueDate}</div>
                        <div className={getYieldColor(token.yield)}>{token.yield}</div>
                        <div>
                          <Badge
                            className={
                              token.status === "Listed"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                : token.status === "Pending"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            }
                          >
                            {token.status}
                          </Badge>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              toast({
                                title: "Edit Listing",
                                description: `Editing listing for ${token.id}`,
                              })
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              toast({
                                title: "Listing Removed",
                                description: `${token.id} has been removed from the marketplace.`,
                              })
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <DollarSign className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium">No tokens listed</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    You haven't listed any tokens on the marketplace yet
                  </p>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-sm hover:shadow-md transition-all">
                    <Plus className="h-4 w-4 mr-2" />
                    List a Token
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-purchases" className="mt-6">
          <Card className="glassmorphism">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>My Purchased Tokens</CardTitle>
                  <CardDescription>Tokens you have purchased from the marketplace</CardDescription>
                </div>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {myPurchases.length > 0 ? (
                <div className="rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="grid grid-cols-6 bg-gray-50 dark:bg-gray-800 p-3">
                    <div className="font-medium">Token ID</div>
                    <div className="font-medium">Face Value</div>
                    <div className="font-medium">Purchase Price</div>
                    <div className="font-medium">Due Date</div>
                    <div className="font-medium">Yield</div>
                    <div className="font-medium">Purchase Date</div>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {myPurchases.map((token, index) => (
                      <motion.div
                        key={token.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="grid grid-cols-6 p-3 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <div className="font-medium text-blue-600 dark:text-blue-400">{token.id}</div>
                        <div>${token.amount.toLocaleString()}</div>
                        <div>${token.price.toLocaleString()}</div>
                        <div>{token.dueDate}</div>
                        <div className={getYieldColor(token.yield)}>{token.yield}</div>
                        <div>{token.purchaseDate}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium">No purchased tokens</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't purchased any tokens yet</p>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-sm hover:shadow-md transition-all">
                    Browse Marketplace
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bid Dialog */}
      <Dialog open={showBidDialog} onOpenChange={setShowBidDialog}>
        <DialogContent className="sm:max-w-md glassmorphism">
          <DialogHeader>
            <DialogTitle>Place a Bid</DialogTitle>
            <DialogDescription>Enter your bid amount for {activeTokenId}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bid-amount">Bid Amount (USD)</Label>
              <Input
                id="bid-amount"
                type="number"
                placeholder="Enter your bid amount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-800/50"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Your bid will be active for 24 hours</span>
            </div>
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 cursor-help">
                  <Info className="h-4 w-4" />
                  <span>How bidding works</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Bidding Process</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    When you place a bid, the token issuer will be notified. If they accept your bid, the token will be
                    transferred to your account and the funds will be deducted from your wallet.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    You can cancel your bid at any time before it's accepted.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBidDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleBid}
              disabled={!bidAmount}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-sm hover:shadow-md transition-all"
            >
              Place Bid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

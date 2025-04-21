"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatEther } from "ethers"
import { formatDistanceToNow } from "date-fns"

interface Pool {
  id: string
  name: string
  description: string
  totalLiquidity: string
  apy: number
  riskLevel: "low" | "medium" | "high"
  createdAt: Date
  status: "active" | "closed" | "full"
}

export default function PoolsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("apy")

  // Mock data - replace with actual data fetching
  const pools: Pool[] = [
    {
      id: "1",
      name: "Stable Pool",
      description: "Low-risk pool with stable returns",
      totalLiquidity: "1000000",
      apy: 5.2,
      riskLevel: "low",
      createdAt: new Date(),
      status: "active",
    },
    // Add more mock pools
  ]

  const filteredPools = pools
    .filter((pool) => {
      const matchesSearch = pool.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRisk = riskFilter === "all" || pool.riskLevel === riskFilter
      const matchesStatus = statusFilter === "all" || pool.status === statusFilter
      return matchesSearch && matchesRisk && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "apy":
          return b.apy - a.apy
        case "liquidity":
          return Number(b.totalLiquidity) - Number(a.totalLiquidity)
        case "date":
          return b.createdAt.getTime() - a.createdAt.getTime()
        default:
          return 0
      }
    })

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Liquidity Pools</h1>
          <p className="text-muted-foreground">
            Discover and invest in liquidity pools
          </p>
        </div>
        <Button>Create Pool</Button>
      </div>

      <div className="grid gap-4 mb-8 md:grid-cols-4">
        <Input
          placeholder="Search pools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="low">Low Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="full">Full</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apy">APY</SelectItem>
            <SelectItem value="liquidity">Liquidity</SelectItem>
            <SelectItem value="date">Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPools.map((pool) => (
          <Card key={pool.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{pool.name}</CardTitle>
                <Badge
                  variant={
                    pool.riskLevel === "low"
                      ? "default"
                      : pool.riskLevel === "medium"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {pool.riskLevel}
                </Badge>
              </div>
              <CardDescription>{pool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Liquidity</span>
                  <span className="font-medium">
                    {formatEther(pool.totalLiquidity)} ETH
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">APY</span>
                  <span className="font-medium">{pool.apy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {formatDistanceToNow(pool.createdAt, { addSuffix: true })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    variant={
                      pool.status === "active"
                        ? "default"
                        : pool.status === "closed"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {pool.status}
                  </Badge>
                </div>
                <Button className="w-full">Invest</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatEther } from "viem"
import { formatDistanceToNow } from "date-fns"

interface PoolPerformanceProps {
  poolId: string
}

const investmentHistory = [
  {
    id: "1",
    amount: "1.5",
    timestamp: new Date("2024-01-15"),
    returns: "0.15",
    status: "active",
  },
  {
    id: "2",
    amount: "2.0",
    timestamp: new Date("2024-02-20"),
    returns: "0.20",
    status: "active",
  },
  {
    id: "3",
    amount: "1.0",
    timestamp: new Date("2024-03-10"),
    returns: "0.10",
    status: "withdrawn",
  },
]

export function PoolPerformance({ poolId }: PoolPerformanceProps) {
  const totalInvested = investmentHistory.reduce(
    (sum, investment) => sum + parseFloat(investment.amount),
    0
  )
  const totalReturns = investmentHistory.reduce(
    (sum, investment) => sum + parseFloat(investment.returns),
    0
  )

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Investment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Invested</span>
                <span className="font-medium">{totalInvested} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Returns</span>
                <span className="font-medium text-green-600">
                  +{totalReturns} ETH
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ROI</span>
                <span className="font-medium text-green-600">
                  +{((totalReturns / totalInvested) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Investment</span>
                <span className="font-medium">
                  {totalInvested - parseFloat(investmentHistory[2].amount)} ETH
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Value</span>
                <span className="font-medium">
                  {totalInvested - parseFloat(investmentHistory[2].amount) + totalReturns} ETH
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unrealized P&L</span>
                <span className="font-medium text-green-600">
                  +{totalReturns} ETH
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Investment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Returns</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investmentHistory.map((investment) => (
                <TableRow key={investment.id}>
                  <TableCell>{investment.amount} ETH</TableCell>
                  <TableCell>
                    {formatDistanceToNow(investment.timestamp, { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-green-600">
                    +{investment.returns} ETH
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        investment.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {investment.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 
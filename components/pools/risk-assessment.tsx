"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, AlertTriangle, Info } from "lucide-react"

interface RiskFactor {
  name: string
  level: "low" | "medium" | "high"
  description: string
  mitigation: string
}

interface RiskAssessmentProps {
  poolId: string
}

const riskFactors: RiskFactor[] = [
  {
    name: "Smart Contract Risk",
    level: "medium",
    description:
      "Potential vulnerabilities in the smart contract code that could lead to fund loss.",
    mitigation:
      "Contracts are audited by multiple security firms and have a bug bounty program.",
  },
  {
    name: "Market Risk",
    level: "low",
    description:
      "Exposure to market volatility and price fluctuations of underlying assets.",
    mitigation:
      "Diversified portfolio and dynamic rebalancing to maintain stable returns.",
  },
  {
    name: "Liquidity Risk",
    level: "low",
    description:
      "Risk of not being able to withdraw funds due to insufficient liquidity.",
    mitigation:
      "Maintains high liquidity reserves and implements withdrawal limits during high volatility.",
  },
  {
    name: "Regulatory Risk",
    level: "medium",
    description:
      "Potential changes in regulations affecting the operation of the pool.",
    mitigation:
      "Compliant with current regulations and maintains legal counsel for guidance.",
  },
]

export function RiskAssessment({ poolId }: RiskAssessmentProps) {
  const overallRisk = "medium"
  const riskScore = 65

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Overall Risk Level</span>
              </div>
              <Badge
                variant={
                  overallRisk === "low"
                    ? "default"
                    : overallRisk === "medium"
                    ? "secondary"
                    : "destructive"
                }
              >
                {overallRisk}
              </Badge>
            </div>
            <Progress value={riskScore} className="h-2" />
            <div className="text-sm text-muted-foreground">
              Risk Score: {riskScore}/100
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {riskFactors.map((factor) => (
          <Card key={factor.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{factor.name}</CardTitle>
                <Badge
                  variant={
                    factor.level === "low"
                      ? "default"
                      : factor.level === "medium"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {factor.level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Risk Description</AlertTitle>
                  <AlertDescription>{factor.description}</AlertDescription>
                </Alert>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Mitigation Strategy</AlertTitle>
                  <AlertDescription>{factor.mitigation}</AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risk Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium">Insurance Coverage</h4>
              <p className="text-sm text-muted-foreground">
                This pool is covered by smart contract insurance up to $10M.
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium">Emergency Procedures</h4>
              <p className="text-sm text-muted-foreground">
                In case of critical issues, the pool has emergency withdrawal
                procedures and a governance mechanism for quick response.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
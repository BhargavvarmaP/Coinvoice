"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, FileText, Shield, Ship, CreditCard, ArrowRight, Clock, AlertCircle } from "lucide-react"

const services = [
  {
    id: "letters-of-credit",
    title: "Letters of Credit",
    icon: FileText,
    description: "Secure international trade transactions with our digital Letters of Credit",
    features: [
      "Instant issuance and verification",
      "Smart contract automation",
      "Real-time tracking",
      "Multi-currency support"
    ]
  },
  {
    id: "guarantees",
    title: "Guarantees",
    icon: Shield,
    description: "Digital guarantees for secure business transactions",
    features: [
      "Automated risk assessment",
      "Smart contract execution",
      "Real-time monitoring",
      "Multi-party verification"
    ]
  },
  {
    id: "electronic-bol",
    title: "Electronic BoL",
    icon: Ship,
    description: "Digital Bill of Lading for efficient trade documentation",
    features: [
      "Instant document creation",
      "Secure digital signatures",
      "Real-time tracking",
      "Automated compliance"
    ]
  },
  {
    id: "marketplace-payments",
    title: "Marketplace Payments",
    icon: CreditCard,
    description: "Secure and efficient payment solutions for marketplace transactions",
    features: [
      "Multi-currency support",
      "Instant settlements",
      "Smart escrow services",
      "Automated dispute resolution"
    ]
  }
]

export function FinancialServices() {
  const [activeService, setActiveService] = useState(services[0].id)
  const [isCreating, setIsCreating] = useState(false)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financial Services</h2>
          <p className="text-muted-foreground">
            Access our comprehensive suite of financial services
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          Create New Service
        </Button>
      </div>

      <Tabs value={activeService} onValueChange={setActiveService}>
        <TabsList className="grid grid-cols-4">
          {services.map((service) => (
            <TabsTrigger key={service.id} value={service.id}>
              <service.icon className="mr-2 h-4 w-4" />
              {service.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {services.map((service) => (
          <TabsContent key={service.id} value={service.id} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Service Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="express">Express</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input type="number" placeholder="Enter amount" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea placeholder="Enter service description" />
                    </div>
                    <Button className="w-full">
                      Create {service.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                        <div>
                          <p className="font-medium">{feature}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <service.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Transaction #{item}</p>
                          <p className="text-sm text-muted-foreground">
                            Created on {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="secondary">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
} 
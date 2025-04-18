"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon, ArrowLeft, ArrowRight, Check, FileText, Building, DollarSign, Package, Shield, AlertCircle, FileSpreadsheet, FileCheck, History, Truck, Ship, Box, Warehouse, Factory, Globe } from "lucide-react"

export default function CreateSupplyChainFinancePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    clientName: "",
    transactionType: "",
    amount: "",
    currency: "USD",
    description: "",
    issueDate: new Date(),
    dueDate: new Date(),
    documents: [] as File[],
    riskAssessment: {
      score: 0,
      factors: [] as string[],
    },
    supplyChainDetails: {
      origin: "",
      destination: "",
      goods: "",
      transportMode: "",
      incoterms: "",
    },
  })

  const steps = [
    {
      title: "Basic Information",
      description: "Enter the basic details of the supply chain finance transaction",
      icon: FileText,
    },
    {
      title: "Client Details",
      description: "Provide information about the client",
      icon: Building,
    },
    {
      title: "Financial Details",
      description: "Specify the financial aspects",
      icon: DollarSign,
    },
    {
      title: "Supply Chain Details",
      description: "Enter supply chain information",
      icon: Truck,
    },
    {
      title: "Documentation",
      description: "Upload required documents",
      icon: FileSpreadsheet,
    },
    {
      title: "Risk Assessment",
      description: "Complete the risk assessment",
      icon: Shield,
    },
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Handle form submission
      console.log("Form submitted:", formData)
      router.push("/financial-services/supply-chain-finance")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.back()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Supply Chain Finance Transaction</h1>
          <p className="text-muted-foreground">Complete the form to create a new supply chain finance transaction</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="space-y-4">
        <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        <div className="grid gap-4 md:grid-cols-6">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            return (
              <div
                key={index}
                className={`flex items-center gap-2 p-4 rounded-lg ${
                  currentStep === index + 1
                    ? "bg-primary text-primary-foreground"
                    : currentStep > index + 1
                    ? "bg-muted"
                    : "bg-muted/50"
                }`}
              >
                <StepIcon className="h-5 w-5" />
                <div className="hidden md:block">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs">{step.description}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="transactionType">Transaction Type</Label>
                  <Select
                    value={formData.transactionType}
                    onValueChange={(value) => handleInputChange("transactionType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchaseOrder">Purchase Order Finance</SelectItem>
                      <SelectItem value="inventory">Inventory Finance</SelectItem>
                      <SelectItem value="receivables">Receivables Finance</SelectItem>
                      <SelectItem value="preShipment">Pre-shipment Finance</SelectItem>
                      <SelectItem value="postShipment">Post-shipment Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => handleInputChange("currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="JPY">JPY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter a description of the supply chain finance transaction"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange("clientName", e.target.value)}
                  placeholder="Enter client name"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Issue Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.issueDate ? (
                          format(formData.issueDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.issueDate}
                        onSelect={(date) => handleInputChange("issueDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dueDate ? (
                          format(formData.dueDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dueDate}
                        onSelect={(date) => handleInputChange("dueDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    className="pl-8"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="advanceRate">Advance Rate (%)</Label>
                <Input
                  id="advanceRate"
                  type="number"
                  placeholder="Enter advance rate percentage"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountRate">Discount Rate (%)</Label>
                <Input
                  id="discountRate"
                  type="number"
                  placeholder="Enter discount rate percentage"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="origin">Origin</Label>
                  <Input
                    id="origin"
                    value={formData.supplyChainDetails.origin}
                    onChange={(e) => handleInputChange("supplyChainDetails", {
                      ...formData.supplyChainDetails,
                      origin: e.target.value,
                    })}
                    placeholder="Enter origin location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    value={formData.supplyChainDetails.destination}
                    onChange={(e) => handleInputChange("supplyChainDetails", {
                      ...formData.supplyChainDetails,
                      destination: e.target.value,
                    })}
                    placeholder="Enter destination location"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goods">Goods Description</Label>
                <Textarea
                  id="goods"
                  value={formData.supplyChainDetails.goods}
                  onChange={(e) => handleInputChange("supplyChainDetails", {
                    ...formData.supplyChainDetails,
                    goods: e.target.value,
                  })}
                  placeholder="Describe the goods being financed"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="transportMode">Transport Mode</Label>
                  <Select
                    value={formData.supplyChainDetails.transportMode}
                    onValueChange={(value) => handleInputChange("supplyChainDetails", {
                      ...formData.supplyChainDetails,
                      transportMode: value,
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transport mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="air">Air</SelectItem>
                      <SelectItem value="sea">Sea</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="rail">Rail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incoterms">Incoterms</Label>
                  <Select
                    value={formData.supplyChainDetails.incoterms}
                    onValueChange={(value) => handleInputChange("supplyChainDetails", {
                      ...formData.supplyChainDetails,
                      incoterms: value,
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select incoterms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FOB">FOB</SelectItem>
                      <SelectItem value="CIF">CIF</SelectItem>
                      <SelectItem value="EXW">EXW</SelectItem>
                      <SelectItem value="DDP">DDP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Required Documents</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Purchase Order</CardTitle>
                      <CardDescription>Upload the purchase order</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload PO
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Invoice</CardTitle>
                      <CardDescription>Upload the invoice</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Invoice
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Bill of Lading</CardTitle>
                      <CardDescription>Upload the bill of lading</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload B/L
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Other Documents</CardTitle>
                      <CardDescription>Upload any additional documents</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Documents
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Risk Assessment</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Score</CardTitle>
                      <CardDescription>Overall risk assessment</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-primary">85</div>
                      <div className="text-sm text-muted-foreground">Good</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Factors</CardTitle>
                      <CardDescription>Key risk considerations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Good client history</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          <span>Moderate market risk</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Strong documentation</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext}>
              {currentStep === steps.length ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Submit
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
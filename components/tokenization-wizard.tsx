"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FileText, Upload, CheckCircle, AlertCircle, Loader2, FileCheck, FileSpreadsheet, FilePlus, History, ListChecks, Package, PackageCheck, Truck, FileStack, ShieldCheck, ShieldAlert, FileWarning, ChevronDown, Briefcase, Ship, Building, Wallet, TrendingUp, FileSpreadsheet as FileSpreadsheetIcon, FileText as FileTextIcon, ShoppingCart, Calendar as CalendarIcon, Check, Activity, ArrowRight, ArrowLeft, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TokenizationWizardProps {
  onComplete?: () => void
}

export function TokenizationWizard({ onComplete }: TokenizationWizardProps) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [verificationProgress, setVerificationProgress] = useState(0)
  const [tokenizationProgress, setTokenizationProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [date, setDate] = useState<Date>()
  const [dragActive, setDragActive] = useState(false)
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    amount: "",
    company: "",
    description: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === "application/pdf") {
        setSelectedFile(file)
        setPreviewUrl(URL.createObjectURL(file))
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        })
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === "application/pdf") {
        setSelectedFile(file)
        setPreviewUrl(URL.createObjectURL(file))
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        })
      }
    }
  }

  const handleUpload = () => {
    setUploadProgress(0)
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval)
          setCurrentStep(2)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleVerification = () => {
    setVerificationProgress(0)
    const verifyInterval = setInterval(() => {
      setVerificationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(verifyInterval)
          setCurrentStep(3)
          return 100
        }
        return prev + 5
      })
    }, 300)
  }

  const handleTokenization = () => {
    setTokenizationProgress(0)
    const tokenizeInterval = setInterval(() => {
      setTokenizationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(tokenizeInterval)
          toast({
            title: "Invoice Tokenized Successfully",
            description: "Your invoice has been converted to a Coinvoice Token (CVT).",
          })
          onComplete?.()
          return 100
        }
        return prev + 4
      })
    }, 150)
  }

  const steps = [
    {
      title: "Upload Invoice",
      description: "Upload your invoice PDF file",
      content: (
        <div className="space-y-6">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <input
              id="file-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag and drop your invoice PDF here, or click to select
              </p>
              {selectedFile && (
                <div className="mt-2 flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4" />
                  <span>{selectedFile.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                <Input
                  id="invoiceNumber"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleInputChange}
                  placeholder="INV-001"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD) *</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="1000.00"
                  className="bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Acme Inc."
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Invoice for services rendered"
                rows={3}
                className="bg-background"
              />
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleUpload}
            disabled={!selectedFile || !formData.invoiceNumber || !formData.amount || !formData.company || !date}
          >
            Upload & Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
    },
    {
      title: "Verify Invoice",
      description: "Verify invoice details and authenticity",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Invoice Details</h3>
                <p className="text-sm text-muted-foreground">
                  Review and confirm the invoice information
                </p>
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-lg border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Invoice Number:</span>
                <span className="font-medium">{formData.invoiceNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">${formData.amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Company:</span>
                <span className="font-medium">{formData.company}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Due Date:</span>
                <span className="font-medium">{date ? format(date, "PPP") : "Not set"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-amber-500/5">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-medium">Verification Process</h3>
                <p className="text-sm text-muted-foreground">
                  Verifying invoice authenticity and details
                </p>
              </div>
            </div>

            <Progress value={verificationProgress} className="h-2" />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setCurrentStep(1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              className="flex-1"
              onClick={handleVerification}
              disabled={verificationProgress > 0}
            >
              Verify & Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Tokenize Invoice",
      description: "Convert invoice to a Coinvoice Token (CVT)",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-green-500/5">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium">Tokenization Process</h3>
                <p className="text-sm text-muted-foreground">
                  Converting your invoice to a digital asset
                </p>
              </div>
            </div>

            <Progress value={tokenizationProgress} className="h-2" />

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-40 h-40 mx-auto relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 rounded-full opacity-20"></div>
              <div className="absolute inset-0 border-4 border-primary rounded-full"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <div className="text-xl font-bold text-primary">
                  CVT-{Math.floor(1000 + Math.random() * 9000)}
                </div>
                <div className="text-sm font-medium">${formData.amount}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Due: {date ? format(date, "PPP") : "Not set"}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setCurrentStep(2)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              className="flex-1"
              onClick={handleTokenization}
              disabled={tokenizationProgress > 0}
            >
              {tokenizationProgress > 0 ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tokenizing...
                </>
              ) : (
                <>
                  Tokenize Invoice
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                currentStep > index
                  ? "bg-green-500 text-white"
                  : currentStep === index + 1
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {currentStep > index ? <CheckCircle className="h-4 w-4" /> : index + 1}
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium">{step.title}</p>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-8 mx-2",
                  currentStep > index + 1 ? "bg-green-500" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>{steps[currentStep - 1].content}</CardContent>
      </Card>
    </div>
  )
} 
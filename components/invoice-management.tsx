"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  CheckCircle,
  CreditCard,
  FileText,
  Upload,
  Download,
  Plus,
  Search,
  ArrowUpDown,
  Eye,
  Trash2,
  Edit,
  Calendar,
  Building,
  DollarSign,
  FileUp,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAppStore, type Invoice } from "@/lib/store"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function InvoiceManagement() {
  const { toast } = useToast()
  const { invoices, addInvoice, updateInvoice, deleteInvoice } = useAppStore()

  const [uploadProgress, setUploadProgress] = useState(0)
  const [verificationProgress, setVerificationProgress] = useState(0)
  const [tokenizationProgress, setTokenizationProgress] = useState(0)
  const [currentStatus, setCurrentStatus] = useState<"idle" | "uploading" | "verifying" | "tokenizing" | "complete">(
    "idle",
  )
  const [dragActive, setDragActive] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Invoice>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | null>(null)

  // Form state
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "",
    amount: "",
    dueDate: "",
    issueDate: "",
    company: "",
    description: "",
  })

  // Reset form when tab changes
  useEffect(() => {
    resetProcess()
    setInvoiceData({
      invoiceNumber: "",
      amount: "",
      dueDate: "",
      issueDate: "",
      company: "",
      description: "",
    })
    setSelectedFile(null)
    setPreviewUrl(null)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setInvoiceData((prev) => ({ ...prev, [name]: value }))
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
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF, PNG, or JPG file",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }

    // Auto-fill invoice number if not already filled
    if (!invoiceData.invoiceNumber) {
      const randomNum = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")
      setInvoiceData((prev) => ({
        ...prev,
        invoiceNumber: `INV-${randomNum}`,
      }))
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (currentStatus !== "idle") return

    setCurrentStatus("uploading")
    setUploadProgress(0)

    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval)
          setCurrentStatus("verifying")
          handleVerification()
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
          return 100
        }
        return prev + 5
      })
    }, 200)

    // Simulate AI verification completion
    setTimeout(() => {
      setCurrentStatus("tokenizing")
      handleTokenization()
    }, 4000)
  }

  const handleTokenization = () => {
    setTokenizationProgress(0)

    const tokenizeInterval = setInterval(() => {
      setTokenizationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(tokenizeInterval)
          setCurrentStatus("complete")

          // Add the tokenized invoice to the store
          const newInvoice: Invoice = {
            id: `inv${Math.random().toString(36).substring(2, 9)}`,
            invoiceNumber: invoiceData.invoiceNumber,
            amount: Number.parseFloat(invoiceData.amount),
            dueDate: invoiceData.dueDate,
            issueDate: invoiceData.issueDate || new Date().toISOString().split("T")[0],
            company: invoiceData.company,
            description: invoiceData.description,
            status: "tokenized",
            tokenId: `CVT-${Math.floor(1000 + Math.random() * 9000)}`,
            attachmentUrl: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
          }

          addInvoice(newInvoice)

          toast({
            title: "Invoice Tokenized Successfully",
            description: "Your invoice has been converted to a Coinvoice Token (CVT).",
          })
          return 100
        }
        return prev + 4
      })
    }, 150)
  }

  const resetProcess = () => {
    setCurrentStatus("idle")
    setUploadProgress(0)
    setVerificationProgress(0)
    setTokenizationProgress(0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!invoiceData.invoiceNumber || !invoiceData.amount || !invoiceData.dueDate || !invoiceData.company) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    handleUpload()
  }

  const handleSort = (field: keyof Invoice) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleDeleteInvoice = (id: string) => {
    setInvoiceToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteInvoice = () => {
    if (invoiceToDelete) {
      deleteInvoice(invoiceToDelete)
      setIsDeleteDialogOpen(false)
      setInvoiceToDelete(null)
      toast({
        title: "Invoice Deleted",
        description: "The invoice has been permanently deleted.",
      })
    }
  }

  const handleEditInvoice = (invoice: Invoice) => {
    setInvoiceToEdit(invoice)
    setIsEditDialogOpen(true)
  }

  const confirmEditInvoice = () => {
    if (invoiceToEdit) {
      updateInvoice(invoiceToEdit.id, invoiceToEdit)
      setIsEditDialogOpen(false)
      setInvoiceToEdit(null)
      toast({
        title: "Invoice Updated",
        description: "The invoice has been successfully updated.",
      })
    }
  }

  // Filter and sort invoices
  const filteredInvoices = invoices
    .filter((invoice) => {
      // Filter by status
      if (filterStatus !== "all" && invoice.status !== filterStatus) {
        return false
      }

      // Filter by search term
      if (
        searchTerm &&
        !invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !invoice.company.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !invoice.description?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // Handle different field types
      if (sortField === "amount") {
        return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount
      } else if (sortField === "createdAt" || sortField === "updatedAt") {
        const dateA = new Date(a[sortField]).getTime()
        const dateB = new Date(b[sortField]).getTime()
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA
      } else {
        const valueA = String(a[sortField]).toLowerCase()
        const valueB = String(b[sortField]).toLowerCase()
        return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
      }
    })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)

  // Status badge styling
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
      case "tokenized":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "paid":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent">
          Invoice Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Upload, verify, and tokenize your invoices.</p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1">
          <TabsTrigger value="upload" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            Upload & Tokenize
          </TabsTrigger>
          <TabsTrigger value="manage" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            Manage Invoices
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Invoice</CardTitle>
                <CardDescription>Upload an invoice to tokenize it</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                        dragActive
                          ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20"
                          : "border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600/50",
                      )}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => {
                        if (currentStatus === "idle") {
                          document.getElementById("file-upload")?.click()
                        }
                      }}
                    >
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileInputChange}
                        disabled={currentStatus !== "idle"}
                      />

                      {currentStatus === "idle" ? (
                        <div className="flex flex-col items-center justify-center py-4">
                          {selectedFile ? (
                            <>
                              <div className="relative mb-2">
                                {previewUrl ? (
                                  <img
                                    src={previewUrl || "/placeholder.svg"}
                                    alt="Invoice preview"
                                    className="h-20 w-auto object-contain rounded border border-gray-200 dark:border-gray-700"
                                  />
                                ) : (
                                  <FileText className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                                )}
                                <Badge className="absolute -top-2 -right-2 bg-green-500 text-white">Selected</Badge>
                              </div>
                              <p className="text-sm font-medium">{selectedFile.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedFile(null)
                                  setPreviewUrl(null)
                                }}
                              >
                                Change File
                              </Button>
                            </>
                          ) : (
                            <>
                              <Upload className="h-10 w-10 text-gray-400 mb-2" />
                              <p className="text-sm font-medium">
                                Drag and drop your invoice file here, or click to select
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Supports PDF, PNG, JPG (Max 10MB)
                              </p>
                            </>
                          )}
                        </div>
                      ) : currentStatus === "uploading" ? (
                        <div className="space-y-2 py-4">
                          <div className="flex items-center justify-center">
                            <FileUp className="h-10 w-10 text-blue-600 dark:text-blue-400 animate-pulse" />
                          </div>
                          <p className="text-sm font-medium">Uploading invoice...</p>
                          <Progress value={uploadProgress} className="h-2" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">{uploadProgress}% complete</p>
                        </div>
                      ) : currentStatus === "verifying" ? (
                        <div className="space-y-2 py-4">
                          <div className="flex items-center justify-center">
                            <div className="relative">
                              <FileText className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                              <div className="absolute -top-1 -right-1 h-4 w-4 bg-amber-500 dark:bg-amber-400 rounded-full animate-pulse"></div>
                            </div>
                          </div>
                          <p className="text-sm font-medium">AI Verification in progress...</p>
                          <Progress value={verificationProgress} className="h-2" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">Analyzing invoice data</p>
                        </div>
                      ) : currentStatus === "tokenizing" ? (
                        <div className="space-y-2 py-4">
                          <div className="flex items-center justify-center">
                            <div className="relative">
                              <CreditCard className="h-10 w-10 text-blue-600 dark:text-blue-400 animate-spin-slow" />
                            </div>
                          </div>
                          <p className="text-sm font-medium">Tokenizing invoice...</p>
                          <Progress value={tokenizationProgress} className="h-2" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">Creating Coinvoice Token (CVT)</p>
                        </div>
                      ) : (
                        <div className="space-y-2 py-4">
                          <div className="flex items-center justify-center">
                            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                          </div>
                          <p className="text-sm font-medium">Invoice Tokenized Successfully!</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Your invoice is now a tradable CVT token
                          </p>
                          <Button variant="outline" size="sm" className="mt-2" onClick={resetProcess}>
                            Upload Another Invoice
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="invoiceNumber">Invoice Number</Label>
                          <Input
                            id="invoiceNumber"
                            name="invoiceNumber"
                            value={invoiceData.invoiceNumber}
                            onChange={handleInputChange}
                            placeholder="INV-001"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount (USD)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              id="amount"
                              name="amount"
                              value={invoiceData.amount}
                              onChange={handleInputChange}
                              placeholder="5000"
                              type="number"
                              className="pl-8"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="issueDate">Issue Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !invoiceData.issueDate && "text-muted-foreground",
                                )}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {invoiceData.issueDate ? format(new Date(invoiceData.issueDate), "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={invoiceData.issueDate ? new Date(invoiceData.issueDate) : undefined}
                                onSelect={(date) =>
                                  setInvoiceData((prev) => ({
                                    ...prev,
                                    issueDate: date ? format(date, "yyyy-MM-dd") : "",
                                  }))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dueDate">Due Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !invoiceData.dueDate && "text-muted-foreground",
                                )}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {invoiceData.dueDate ? format(new Date(invoiceData.dueDate), "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={invoiceData.dueDate ? new Date(invoiceData.dueDate) : undefined}
                                onSelect={(date) =>
                                  setInvoiceData((prev) => ({
                                    ...prev,
                                    dueDate: date ? format(date, "yyyy-MM-dd") : "",
                                  }))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <div className="relative">
                          <Building className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            id="company"
                            name="company"
                            value={invoiceData.company}
                            onChange={handleInputChange}
                            placeholder="Acme Inc."
                            className="pl-8"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={invoiceData.description}
                          onChange={handleInputChange}
                          placeholder="Invoice for services rendered"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                    disabled={currentStatus !== "idle"}
                  >
                    {currentStatus === "idle" ? "Upload & Tokenize Invoice" : "Processing..."}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tokenization Preview</CardTitle>
                <CardDescription>See how your invoice will be tokenized</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                {currentStatus === "idle" || currentStatus === "uploading" ? (
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 relative">
                      <div className="absolute inset-0 border-4 border-dashed border-gray-300 dark:border-gray-700 rounded-full"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText className="h-12 w-12 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Upload an invoice to see the tokenization preview
                    </p>
                  </div>
                ) : currentStatus === "verifying" ? (
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 relative">
                      <div className="absolute inset-0 border-4 border-dashed border-blue-300 dark:border-blue-700 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <p className="font-medium">Verifying Invoice Data</p>
                    <div className="mt-4 space-y-2 max-w-xs mx-auto">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Invoice Number:</span>
                        <span className="text-sm font-medium">{invoiceData.invoiceNumber || "Detecting..."}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Amount:</span>
                        <span className="text-sm font-medium">${invoiceData.amount || "Detecting..."}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Due Date:</span>
                        <span className="text-sm font-medium">{invoiceData.dueDate || "Detecting..."}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Company:</span>
                        <span className="text-sm font-medium">{invoiceData.company || "Detecting..."}</span>
                      </div>
                    </div>
                  </div>
                ) : currentStatus === "tokenizing" ? (
                  <div className="text-center">
                    <motion.div
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-40 h-40 mx-auto mb-4 relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 rounded-full opacity-20"></div>
                      <div className="absolute inset-0 border-4 border-blue-600 dark:border-blue-400 rounded-full"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">CVT</div>
                      </div>
                    </motion.div>
                    <p className="font-medium">Creating Coinvoice Token</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Generating smart contract...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-40 h-40 mx-auto mb-4 relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 rounded-full opacity-20"></div>
                      <div className="absolute inset-0 border-4 border-blue-600 dark:border-blue-400 rounded-full"></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          CVT-{Math.floor(1000 + Math.random() * 9000)}
                        </div>
                        <div className="text-sm font-medium">${invoiceData.amount || "5,000"}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Due: {invoiceData.dueDate || "2025-05-15"}
                        </div>
                      </div>
                    </motion.div>
                    <p className="font-medium">Tokenization Complete!</p>
                    <div className="mt-4 space-y-2 max-w-xs mx-auto text-left">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Token ID:</span>
                        <span className="text-sm font-medium">CVT-{Math.floor(1000 + Math.random() * 9000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Face Value:</span>
                        <span className="text-sm font-medium">${invoiceData.amount || "5,000"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Maturity Date:</span>
                        <span className="text-sm font-medium">{invoiceData.dueDate || "2025-05-15"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Issuer:</span>
                        <span className="text-sm font-medium">{invoiceData.company || "Acme Inc."}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toast({
                            title: "Token Listed",
                            description: "Your token has been listed on the marketplace.",
                          })
                        }
                      >
                        List on Marketplace
                      </Button>
                      <Button
                        size="sm"
                        onClick={resetProcess}
                        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                      >
                        Tokenize Another
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <CardTitle>My Invoices</CardTitle>
                  <CardDescription>Manage your invoices and tokens</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="relative w-full sm:w-[200px]">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search invoices..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full sm:w-[140px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Invoices</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="tokenized">Tokenized</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                    <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white">
                      <Plus className="h-4 w-4" />
                      Create Invoice
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800 p-3">
                  <div
                    className="font-medium flex items-center gap-1 cursor-pointer"
                    onClick={() => handleSort("invoiceNumber")}
                  >
                    Invoice ID
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                  <div
                    className="font-medium flex items-center gap-1 cursor-pointer"
                    onClick={() => handleSort("company")}
                  >
                    Company
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                  <div
                    className="font-medium flex items-center gap-1 cursor-pointer"
                    onClick={() => handleSort("amount")}
                  >
                    Amount
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                  <div
                    className="font-medium flex items-center gap-1 cursor-pointer"
                    onClick={() => handleSort("issueDate")}
                  >
                    Issue Date
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                  <div
                    className="font-medium flex items-center gap-1 cursor-pointer"
                    onClick={() => handleSort("dueDate")}
                  >
                    Due Date
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                  <div
                    className="font-medium flex items-center gap-1 cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    Status
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                  <div className="font-medium text-right">Actions</div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  <AnimatePresence>
                    {currentItems.length > 0 ? (
                      currentItems.map((invoice, index) => (
                        <motion.div
                          key={invoice.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="grid grid-cols-7 p-3 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <div className="font-medium text-blue-600 dark:text-blue-400">{invoice.invoiceNumber}</div>
                          <div>{invoice.company}</div>
                          <div>${invoice.amount.toLocaleString()}</div>
                          <div>{format(new Date(invoice.issueDate), "MMM d, yyyy")}</div>
                          <div>{format(new Date(invoice.dueDate), "MMM d, yyyy")}</div>
                          <div>
                            <Badge className={getStatusBadgeStyles(invoice.status)}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                toast({
                                  title: "Invoice details",
                                  description: `Viewing details for ${invoice.invoiceNumber}`,
                                })
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditInvoice(invoice)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteInvoice(invoice.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-8 text-center col-span-7">
                        <div className="flex flex-col items-center justify-center">
                          <Search className="h-8 w-8 text-gray-400 mb-2" />
                          <h3 className="text-lg font-medium">No invoices found</h3>
                          <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search term</p>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredInvoices.length)} of{" "}
                {filteredInvoices.length} invoices
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink isActive={currentPage === page} onClick={() => setCurrentPage(page)}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this invoice? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteInvoice} className="bg-red-600 hover:bg-red-700">
              Delete Invoice
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Invoice Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogDescription>Make changes to your invoice details below.</DialogDescription>
          </DialogHeader>
          {invoiceToEdit && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-invoiceNumber">Invoice Number</Label>
                  <Input
                    id="edit-invoiceNumber"
                    value={invoiceToEdit.invoiceNumber}
                    onChange={(e) => setInvoiceToEdit({ ...invoiceToEdit, invoiceNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-amount">Amount (USD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="edit-amount"
                      type="number"
                      className="pl-8"
                      value={invoiceToEdit.amount}
                      onChange={(e) =>
                        setInvoiceToEdit({ ...invoiceToEdit, amount: Number.parseFloat(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-issueDate">Issue Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {format(new Date(invoiceToEdit.issueDate), "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={new Date(invoiceToEdit.issueDate)}
                        onSelect={(date) =>
                          setInvoiceToEdit({
                            ...invoiceToEdit,
                            issueDate: date ? format(date, "yyyy-MM-dd") : invoiceToEdit.issueDate,
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dueDate">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {format(new Date(invoiceToEdit.dueDate), "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={new Date(invoiceToEdit.dueDate)}
                        onSelect={(date) =>
                          setInvoiceToEdit({
                            ...invoiceToEdit,
                            dueDate: date ? format(date, "yyyy-MM-dd") : invoiceToEdit.dueDate,
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-company">Company</Label>
                <div className="relative">
                  <Building className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="edit-company"
                    className="pl-8"
                    value={invoiceToEdit.company}
                    onChange={(e) => setInvoiceToEdit({ ...invoiceToEdit, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={invoiceToEdit.status}
                  onValueChange={(value) => setInvoiceToEdit({ ...invoiceToEdit, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="tokenized">Tokenized</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  rows={3}
                  value={invoiceToEdit.description || ""}
                  onChange={(e) => setInvoiceToEdit({ ...invoiceToEdit, description: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmEditInvoice}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

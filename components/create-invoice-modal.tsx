"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface CreateInvoiceModalProps {
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function CreateInvoiceModal({ onSuccess, trigger }: CreateInvoiceModalProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date>()

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    amount: "",
    client: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.invoiceNumber || !formData.amount || !formData.client || !date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Create invoice logic would go here
    toast({
      title: "Invoice Created",
      description: `Invoice ${formData.invoiceNumber} has been created successfully.`,
    })

    // Reset form and close modal
    setFormData({
      invoiceNumber: "",
      amount: "",
      client: "",
      description: "",
    })
    setDate(undefined)
    setOpen(false)

    // Call onSuccess callback if provided
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new invoice. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                <Input
                  id="invoiceNumber"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleChange}
                  placeholder="INV-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD) *</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="1000.00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Client Name *</Label>
              <Input
                id="client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                placeholder="Acme Inc."
              />
            </div>
            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Invoice for services rendered"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Invoice</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

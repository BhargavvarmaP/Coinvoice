"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, Filter, FileText, FileStack, Download, Send, Edit } from "lucide-react"

interface Invoice {
  id: string
  client: string
  amount: number
  status: "draft" | "sent" | "paid" | "overdue"
  dueDate: string
  issueDate: string
  progress: number
  attachments: number
}

interface InvoiceListProps {
  status: "all" | "draft" | "sent" | "paid" | "overdue"
}

export function InvoiceList({ status }: InvoiceListProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Sample data - replace with actual data fetching
  const invoices: Invoice[] = [
    {
      id: "INV-2024-001",
      client: "Acme Corporation",
      amount: 15000,
      status: "paid",
      dueDate: "2024-04-20",
      issueDate: "2024-04-01",
      progress: 100,
      attachments: 3,
    },
    {
      id: "INV-2024-002",
      client: "Tech Solutions Ltd",
      amount: 25000,
      status: "sent",
      dueDate: "2024-04-25",
      issueDate: "2024-04-05",
      progress: 60,
      attachments: 2,
    },
    {
      id: "INV-2024-003",
      client: "Global Industries",
      amount: 35000,
      status: "overdue",
      dueDate: "2024-04-15",
      issueDate: "2024-03-30",
      progress: 30,
      attachments: 1,
    },
  ]

  const filteredInvoices = invoices.filter((invoice) => {
    if (status === "all") return true
    return invoice.status === status
  }).filter((invoice) => {
    if (!searchQuery) return true
    return (
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>
              {status === "all" ? "All invoices" : `${status.charAt(0).toUpperCase() + status.slice(1)} invoices`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                className="pl-8 w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Attachments</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.client}</TableCell>
                <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      invoice.status === "paid"
                        ? "default"
                        : invoice.status === "sent"
                        ? "secondary"
                        : invoice.status === "overdue"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={invoice.progress} className="w-[100px]" />
                    <span className="text-sm text-muted-foreground">
                      {invoice.progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <FileStack className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{invoice.attachments}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/invoices/${invoice.id}`)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    {invoice.status === "draft" && (
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {invoice.status === "draft" && (
                      <Button variant="ghost" size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 
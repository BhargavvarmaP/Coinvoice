"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
  FileText,
  FileSpreadsheet,
  FileCheck,
  FileWarning,
  FileSearch,
  FileBarChart,
  FilePlus,
  History,
  Settings,
  ChevronRight,
  ChevronLeft,
  Menu,
  Search,
  Filter,
  Download,
  Upload,
  Bell,
  User,
  LogOut,
  HelpCircle,
  RefreshCw,
  Plus,
  X,
  Check,
  AlertCircle,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  Briefcase,
  Shield,
  Ship,
  Package,
  Truck,
  FileStack,
  DollarSign,
  Calendar,
  Clock,
  Tag,
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  CreditCard,
  Banknote,
  Coins,
  Edit,
  Trash2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { motion } from "framer-motion"

export default function DraftInvoicesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")

  // Sample data for draft invoices
  const draftInvoices = [
    {
      id: "INV-2024-004",
      client: "Tech Solutions Ltd",
      amount: 15000,
      status: "draft",
      lastModified: "2024-04-18T10:30:00",
      createdDate: "2024-04-15",
      items: 5,
      attachments: 2,
    },
    {
      id: "INV-2024-005",
      client: "Global Industries",
      amount: 25000,
      status: "draft",
      lastModified: "2024-04-17T15:45:00",
      createdDate: "2024-04-16",
      items: 8,
      attachments: 3,
    },
    {
      id: "INV-2024-006",
      client: "Acme Corporation",
      amount: 35000,
      status: "draft",
      lastModified: "2024-04-16T09:20:00",
      createdDate: "2024-04-15",
      items: 12,
      attachments: 1,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Draft Invoices</h1>
          <p className="text-muted-foreground">Manage your draft invoices</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push("/invoices/create")}>
            <FilePlus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Draft Invoices</CardTitle>
              <CardDescription>Your unsent invoice drafts</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search drafts..."
                  className="pl-8 w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
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
                <TableHead>Items</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Attachments</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {draftInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{invoice.items} items</Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(invoice.createdDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(invoice.lastModified), "MMM d, yyyy HH:mm")}
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
                        onClick={() => router.push(`/invoices/${invoice.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/invoices/${invoice.id}`)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
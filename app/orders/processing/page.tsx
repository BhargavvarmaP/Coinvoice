"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Package,
  PackageCheck,
  PackageX,
  PackageSearch,
  PackagePlus,
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
} from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { motion } from "framer-motion"

export default function ProcessingOrdersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")

  // Sample data for processing orders
  const processingOrders = [
    {
      id: "ORD-2024-007",
      client: "Tech Solutions Ltd",
      amount: 15000,
      status: "processing",
      orderDate: "2024-04-18",
      dueDate: "2024-04-25",
      priority: "high",
      items: 5,
      progress: 60,
      currentStage: "Packaging",
      estimatedCompletion: "2024-04-22",
      attachments: 2,
    },
    {
      id: "ORD-2024-008",
      client: "Global Industries",
      amount: 25000,
      status: "processing",
      orderDate: "2024-04-17",
      dueDate: "2024-04-24",
      priority: "medium",
      items: 8,
      progress: 30,
      currentStage: "Quality Check",
      estimatedCompletion: "2024-04-23",
      attachments: 3,
    },
    {
      id: "ORD-2024-009",
      client: "Acme Corporation",
      amount: 35000,
      status: "processing",
      orderDate: "2024-04-16",
      dueDate: "2024-04-23",
      priority: "low",
      items: 12,
      progress: 80,
      currentStage: "Shipping",
      estimatedCompletion: "2024-04-21",
      attachments: 1,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Processing Orders</h1>
          <p className="text-muted-foreground">Track your orders in progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push("/orders/create")}>
            <PackagePlus className="mr-2 h-4 w-4" />
            New Order
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
              <CardTitle>Processing Orders</CardTitle>
              <CardDescription>Orders currently being processed</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search processing orders..."
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
                <TableHead>Order ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Current Stage</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Est. Completion</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processingOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.client}</TableCell>
                  <TableCell>${order.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.priority === "high"
                          ? "destructive"
                          : order.priority === "medium"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {order.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{order.currentStage}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={order.progress} className="w-[100px]" />
                      <span className="text-sm text-muted-foreground">
                        {order.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.dueDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.estimatedCompletion), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.items} items</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/orders/${order.id}`)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/orders/${order.id}/track`)}
                      >
                        <Truck className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/orders/${order.id}/complete`)}
                      >
                        <PackageCheck className="h-4 w-4" />
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
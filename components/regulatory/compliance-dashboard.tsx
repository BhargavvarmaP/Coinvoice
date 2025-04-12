"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CheckCircle,
  AlertTriangle,
  FileText,
  Search,
  Download,
  Upload,
  ClipboardCheck,
  Shield,
  Clock,
  Calendar,
  BarChart4,
  Users,
  Building,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function ComplianceDashboard() {
  const { toast } = useToast()
  const [complianceFilter, setComplianceFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [timeframe, setTimeframe] = useState("month")

  // Mock compliance data
  const complianceStats = {
    overall: 92,
    kyc: 98,
    aml: 95,
    reporting: 89,
    dataProtection: 87,
  }

  const complianceIssues = [
    {
      id: "issue1",
      title: "Missing KYC Documentation",
      entity: "Global Trade Partners Ltd.",
      severity: "high",
      status: "open",
      dueDate: "2025-04-20",
      assignedTo: "Sarah Johnson",
      description:
        "Customer onboarded without complete KYC documentation. Missing proof of address and source of funds declaration.",
    },
    {
      id: "issue2",
      title: "Suspicious Transaction Pattern",
      entity: "TechVentures Inc.",
      severity: "medium",
      status: "investigating",
      dueDate: "2025-04-18",
      assignedTo: "Michael Chen",
      description: "Multiple high-value transactions in short succession with unusual counterparties.",
    },
    {
      id: "issue3",
      title: "Regulatory Report Delay",
      entity: "Internal",
      severity: "low",
      status: "resolved",
      dueDate: "2025-04-10",
      assignedTo: "Emma Rodriguez",
      description: "Quarterly regulatory report submission delayed by 2 days due to data validation issues.",
    },
    {
      id: "issue4",
      title: "Potential Sanctions List Match",
      entity: "EastWest Shipping Co.",
      severity: "high",
      status: "investigating",
      dueDate: "2025-04-15",
      assignedTo: "James Wilson",
      description: "Potential partial match with sanctioned entity. Requires enhanced due diligence.",
    },
    {
      id: "issue5",
      title: "Data Protection Consent Missing",
      entity: "Multiple Entities",
      severity: "medium",
      status: "open",
      dueDate: "2025-04-25",
      assignedTo: "Olivia Parker",
      description: "Updated data protection consent forms not collected from 15 business customers.",
    },
  ]

  // Filter compliance issues
  const filteredIssues = complianceIssues.filter((issue) => {
    if (complianceFilter !== "all" && issue.status !== complianceFilter) {
      return false
    }

    if (
      searchTerm &&
      !issue.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !issue.entity.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    return true
  })

  // Get severity badge styling
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">High</Badge>
      case "medium":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Low</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Open</Badge>
      case "investigating":
        return (
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            Investigating
          </Badge>
        )
      case "resolved":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Resolved</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "investigating":
        return <Clock className="h-5 w-5 text-purple-500" />
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-500 dark:to-purple-300 bg-clip-text text-transparent">
          Compliance Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Monitor and manage regulatory compliance across the platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Overall Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{complianceStats.overall}%</div>
              <div className="relative h-12 w-12">
                <svg className="h-12 w-12" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-gray-200 dark:stroke-gray-700"
                    strokeWidth="2"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-purple-500 dark:stroke-purple-400"
                    strokeWidth="2"
                    strokeDasharray="100"
                    strokeDashoffset={100 - complianceStats.overall}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">KYC Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">{complianceStats.kyc}%</span>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <Progress value={complianceStats.kyc} className="h-2 bg-gray-100 dark:bg-gray-800">
                <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
              </Progress>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">AML Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">{complianceStats.aml}%</span>
                <Shield className="h-5 w-5 text-green-500" />
              </div>
              <Progress value={complianceStats.aml} className="h-2 bg-gray-100 dark:bg-gray-800">
                <div className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full" />
              </Progress>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Reporting Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">{complianceStats.reporting}%</span>
                <FileText className="h-5 w-5 text-amber-500" />
              </div>
              <Progress value={complianceStats.reporting} className="h-2 bg-gray-100 dark:bg-gray-800">
                <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" />
              </Progress>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Data Protection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">{complianceStats.dataProtection}%</span>
                <ClipboardCheck className="h-5 w-5 text-red-500" />
              </div>
              <Progress value={complianceStats.dataProtection} className="h-2 bg-gray-100 dark:bg-gray-800">
                <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full" />
              </Progress>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1">
          <TabsTrigger value="issues" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            Compliance Issues
          </TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            Compliance Tasks
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            Compliance Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <CardTitle>Compliance Issues</CardTitle>
                  <CardDescription>Track and resolve compliance issues</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="relative w-full sm:w-[200px]">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search issues..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={complianceFilter} onValueChange={setComplianceFilter}>
                      <SelectTrigger className="w-full sm:w-[140px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Issues</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="investigating">Investigating</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                    <Button className="gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white">
                      <Upload className="h-4 w-4" />
                      Report Issue
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredIssues.length > 0 ? (
                  filteredIssues.map((issue, index) => (
                    <motion.div
                      key={issue.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-shrink-0">{getStatusIcon(issue.status)}</div>
                            <div className="flex-grow space-y-1">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <h3 className="font-medium">{issue.title}</h3>
                                <div className="flex flex-wrap gap-2">
                                  {getSeverityBadge(issue.severity)}
                                  {getStatusBadge(issue.status)}
                                </div>
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-medium">Entity:</span> {issue.entity}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{issue.description}</p>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Due: {issue.dueDate}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  <span>Assigned to: {issue.assignedTo}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0 flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  toast({
                                    title: "Issue details",
                                    description: `Viewing details for ${issue.title}`,
                                  })
                                }
                              >
                                View
                              </Button>
                              {issue.status !== "resolved" && (
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white"
                                  onClick={() =>
                                    toast({
                                      title: "Action taken",
                                      description: `Taking action on ${issue.title}`,
                                    })
                                  }
                                >
                                  Take Action
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No compliance issues found</h3>
                    <p className="text-gray-500 dark:text-gray-400">All clear! No issues match your current filters.</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredIssues.length} of {complianceIssues.length} compliance issues
              </div>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last 7 days</SelectItem>
                  <SelectItem value="month">Last 30 days</SelectItem>
                  <SelectItem value="quarter">Last quarter</SelectItem>
                  <SelectItem value="year">Last year</SelectItem>
                </SelectContent>
              </Select>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Tasks</CardTitle>
              <CardDescription>Scheduled and ongoing compliance activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 flex justify-between items-center">
                    <h3 className="font-medium">Quarterly Regulatory Reporting</h3>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      In Progress
                    </Badge>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Prepare and submit quarterly regulatory reports to relevant authorities.
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Due: 2025-04-30</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>Assigned to: Compliance Team</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart4 className="h-3 w-3" />
                        <span>Progress: 65%</span>
                      </div>
                    </div>
                    <Progress value={65} className="h-2 mt-4" />
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 flex justify-between items-center">
                    <h3 className="font-medium">KYC Documentation Review</h3>
                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                      Pending
                    </Badge>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Review and update KYC documentation for high-value clients.
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Due: 2025-05-15</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>Assigned to: KYC Team</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        <span>Entities: 24</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 flex justify-between items-center">
                    <h3 className="font-medium">AML Training Program</h3>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      Scheduled
                    </Badge>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Conduct annual AML training for all staff members.
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Scheduled: 2025-06-10</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>Facilitator: External Consultant</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Duration: 2 days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white">
                View All Tasks
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>Generated compliance reports and documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <FileText className="h-10 w-10 text-purple-500" />
                  <div className="flex-grow">
                    <h3 className="font-medium">Q1 2025 Regulatory Compliance Report</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Generated on April 10, 2025</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <FileText className="h-10 w-10 text-purple-500" />
                  <div className="flex-grow">
                    <h3 className="font-medium">Annual AML Risk Assessment</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Generated on March 15, 2025</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <FileText className="h-10 w-10 text-purple-500" />
                  <div className="flex-grow">
                    <h3 className="font-medium">KYC Compliance Audit Report</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Generated on February 28, 2025</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <FileText className="h-10 w-10 text-purple-500" />
                  <div className="flex-grow">
                    <h3 className="font-medium">Data Protection Compliance Review</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Generated on January 20, 2025</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white">
                Generate New Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

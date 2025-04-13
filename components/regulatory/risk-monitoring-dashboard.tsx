"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, Download, Filter, AlertTriangle, AlertOctagon, ShieldAlert } from "lucide-react"

export function RiskMonitoringDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Risk Monitoring</h1>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search alerts..." className="pl-8" />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
            <p className="text-sm text-muted-foreground">3 high priority</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">72/100</div>
            <p className="text-sm text-muted-foreground">Moderate risk level</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monitored Entities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">156</div>
            <p className="text-sm text-muted-foreground">Active monitoring</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Risk Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert Type</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Detected</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <AlertOctagon className="h-4 w-4 text-red-500" />
                    Suspicious Transaction
                  </div>
                </TableCell>
                <TableCell>Acme Corp</TableCell>
                <TableCell>High</TableCell>
                <TableCell>2024-04-15 14:30</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <ShieldAlert className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              {/* Add more rows as needed */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 
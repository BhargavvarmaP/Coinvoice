"use client"

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { PlayIcon, CheckCircle, XCircle, Clock, Filter, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { generateTestData } from "@/lib/test-utils"
import { TestList } from "./test-list"
import { TestDetails } from "./test-details"

// Define TestStatus as an enum-like type
export type TestStatus = "pending" | "running" | "passed" | "failed"

interface TestCase {
  id: string
  name: string
  description: string
  component: string
  steps: string[]
  expectedResult: string
  status: TestStatus
  lastRun?: Date
  duration?: number
  error?: string
}

export function TestRunner() {
  const [tests, setTests] = useState<TestCase[]>([
    {
      id: "test-1",
      name: "Invoice Creation",
      description: "Test the creation of a new invoice",
      component: "InvoiceForm",
      steps: [
        "Navigate to the invoice creation page",
        "Fill in all required fields",
        "Click the 'Create Invoice' button",
        "Verify the invoice is created successfully"
      ],
      expectedResult: "Invoice should be created and appear in the invoice list",
      status: "pending" as TestStatus
    },
    {
      id: "test-2",
      name: "Payment Processing",
      description: "Test the payment processing workflow",
      component: "PaymentProcessor",
      steps: [
        "Select an unpaid invoice",
        "Click 'Pay Now' button",
        "Connect wallet",
        "Confirm transaction",
        "Wait for blockchain confirmation"
      ],
      expectedResult: "Payment should be processed and invoice status should change to 'Paid'",
      status: "passed" as TestStatus
    },
    {
      id: "test-3",
      name: "User Authentication",
      description: "Test user login functionality",
      component: "LoginForm",
      steps: [
        "Navigate to login page",
        "Enter valid credentials",
        "Click 'Login' button"
      ],
      expectedResult: "User should be authenticated and redirected to dashboard",
      status: "failed" as TestStatus,
      error: "Authentication failed: Invalid credentials"
    },
    {
      id: "test-4",
      name: "Dark Mode Toggle",
      description: "Test the dark mode toggle functionality",
      component: "ThemeToggle",
      steps: [
        "Navigate to any page",
        "Click the theme toggle button"
      ],
      expectedResult: "Theme should switch between light and dark mode",
      status: "passed" as TestStatus
    },
    {
      id: "test-5",
      name: "Invoice Export",
      description: "Test exporting invoices to PDF",
      component: "InvoiceExport",
      steps: [
        "Select an invoice",
        "Click 'Export to PDF' button",
        "Wait for PDF generation"
      ],
      expectedResult: "PDF should be generated and downloaded",
      status: "pending" as TestStatus
    }
  ])

  const [selectedTests, setSelectedTests] = useState<string[]>([])
  const [selectedTestDetails, setSelectedTestDetails] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  const handleSelectTest = useCallback((testId: string) => {
    setSelectedTests(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    )
  }, [])

  const handleRunTests = useCallback(() => {
    const testsToRun = selectedTests.length > 0 
      ? selectedTests 
      : tests.map(test => test.id)
    
    // Set selected tests to "running" status
    setTests(prev => prev.map(test => 
      testsToRun.includes(test.id) 
        ? { ...test, status: "running" as TestStatus } 
        : test
    ))
    
    // Simulate test running with setTimeout
    testsToRun.forEach(testId => {
      const delay = Math.random() * 2000 + 1000 // Random delay between 1-3 seconds
      
      setTimeout(() => {
        setTests(prev => prev.map(test => {
          if (test.id === testId) {
            const passed = Math.random() > 0.3 // 70% chance of passing
            return {
              ...test,
              status: passed ? "passed" as TestStatus : "failed" as TestStatus,
              duration: Math.random() * 1000 + 500,
              error: passed ? undefined : "Test assertion failed: Expected result not achieved"
            }
          }
          return test
        }))
      }, delay)
    })
  }, [selectedTests, tests])

  const handleResetTests = useCallback(() => {
    setTests(prev => prev.map(test => ({
      ...test,
      status: "pending" as TestStatus,
      duration: undefined,
      error: undefined
    })))
  }, [])

  const filteredTests = tests.filter(test => {
    if (activeTab === "all") return true
    return test.status === activeTab
  })

  const selectedTest = selectedTestDetails 
    ? tests.find(test => test.id === selectedTestDetails) 
    : null

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Test Runner</h2>
          <p className="text-muted-foreground">Run and manage test cases</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleResetTests}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button 
            size="sm"
            onClick={handleRunTests}
            disabled={tests.some(test => test.status === "running")}
          >
            <PlayIcon className="mr-2 h-4 w-4" />
            Run {selectedTests.length > 0 ? `Selected (${selectedTests.length})` : "All"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Test Cases</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="flex items-center mr-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span>{tests.filter(t => t.status === "passed").length} Passed</span>
                  </div>
                  <div className="flex items-center mr-3">
                    <XCircle className="h-4 w-4 text-destructive mr-1" />
                    <span>{tests.filter(t => t.status === "failed").length} Failed</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                    <span>{tests.filter(t => t.status === "pending").length} Pending</span>
                  </div>
                </div>
              </div>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="passed">Passed</TabsTrigger>
                  <TabsTrigger value="failed">Failed</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <TestList 
                tests={filteredTests}
                selectedTests={selectedTests}
                onSelectTest={handleSelectTest}
                onSelectTestDetails={setSelectedTestDetails}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Test Details</CardTitle>
              <CardDescription>
                {selectedTest 
                  ? `Viewing details for ${selectedTest.name}`
                  : "Select a test to view details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedTest ? (
                <TestDetails 
                  test={selectedTest}
                  onClose={() => setSelectedTestDetails(null)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <div className="rounded-full bg-muted p-3">
                    <Filter className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">No test selected</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Select a test from the list to view its details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

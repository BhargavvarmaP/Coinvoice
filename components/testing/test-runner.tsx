"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { generateTestData } from "@/lib/test-utils"
import { useToast } from "@/components/ui/use-toast"
import { Play, CheckCircle, XCircle, Clock, FileText, RefreshCw } from "lucide-react"

type TestStatus = "pending" | "running" | "passed" | "failed"

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
  const [tests, setTests] = useState<TestCase[]>([])
  const [selectedTests, setSelectedTests] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("all")

  const { toast } = useToast()

  // Generate some test cases on mount
  useEffect(() => {
    const testCases: TestCase[] = [
      generateTestData.generateTestCase("LoginForm", {
        name: "Login form validation",
        description: "Verify that the login form validates user input correctly",
        steps: [
          "Render the login form",
          "Submit the form without entering any data",
          "Verify that validation errors are displayed",
          "Enter valid email and password",
          "Submit the form",
          "Verify that the form submits successfully",
        ],
        expectedResult: "Form should display validation errors and submit successfully with valid data",
      }),
      generateTestData.generateTestCase("SignupForm", {
        name: "Signup form validation",
        description: "Verify that the signup form validates user input correctly",
        steps: [
          "Render the signup form",
          "Submit the form without entering any data",
          "Verify that validation errors are displayed",
          "Enter valid name, email, and password",
          "Submit the form",
          "Verify that the form submits successfully",
        ],
        expectedResult: "Form should display validation errors and submit successfully with valid data",
      }),
      generateTestData.generateTestCase("WalletConnection", {
        name: "Wallet connection flow",
        description: "Verify that users can connect their wallet and sign in",
        steps: [
          "Render the wallet login component",
          "Click the connect wallet button",
          "Mock the wallet connection",
          "Verify that the wallet address is displayed",
          "Click the sign in button",
          "Verify that the user is authenticated",
        ],
        expectedResult: "User should be able to connect their wallet and sign in successfully",
      }),
      generateTestData.generateTestCase("InvoiceCreation", {
        name: "Invoice creation flow",
        description: "Verify that users can create a new invoice",
        steps: [
          "Render the invoice creation form",
          "Fill in all required fields",
          "Submit the form",
          "Verify that the invoice is created successfully",
        ],
        expectedResult: "Invoice should be created and added to the user's invoices",
      }),
      generateTestData.generateTestCase("TokenListing", {
        name: "Token listing flow",
        description: "Verify that users can list a token on the marketplace",
        steps: [
          "Render the token listing form",
          "Select an invoice to tokenize",
          "Fill in the listing details",
          "Submit the form",
          "Verify that the token is listed on the marketplace",
        ],
        expectedResult: "Token should be listed on the marketplace with the correct details",
      }),
    ]

    setTests(testCases)
  }, [])

  const handleSelectTest = (testId: string) => {
    setSelectedTests((prev) => (prev.includes(testId) ? prev.filter((id) => id !== testId) : [...prev, testId]))
  }

  const handleSelectAll = () => {
    if (selectedTests.length === filteredTests.length) {
      setSelectedTests([])
    } else {
      setSelectedTests(filteredTests.map((test) => test.id))
    }
  }

  const handleRunTests = async () => {
    if (selectedTests.length === 0) {
      toast({
        title: "No tests selected",
        description: "Please select at least one test to run",
        variant: "destructive",
      })
      return
    }

    setIsRunning(true)
    setProgress(0)

    // Reset status of selected tests
    setTests((prev) =>
      prev.map((test) => (selectedTests.includes(test.id) ? { ...test, status: "running" as TestStatus } : test)),
    )

    // Run tests sequentially
    for (let i = 0; i < selectedTests.length; i++) {
      const testId = selectedTests[i]
      const progress = Math.round((i / selectedTests.length) * 100)
      setProgress(progress)

      // Find the test
      const test = tests.find((t) => t.id === testId)
      if (!test) continue

      // Simulate test running
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

      // Update test status
      const passed = Math.random() > 0.3 // 70% chance of passing
      const duration = Math.round(500 + Math.random() * 1500)

      setTests((prev) =>
        prev.map((t) =>
          t.id === testId
            ? {
                ...t,
                status: passed ? "passed" : "failed",
                lastRun: new Date(),
                duration,
                error: passed ? undefined : "Test assertion failed: Expected element to be visible",
              }
            : t,
        ),
      )
    }

    setProgress(100)
    setIsRunning(false)

    toast({
      title: "Tests completed",
      description: `Ran ${selectedTests.length} tests`,
    })
  }

  // Filter tests based on active tab
  const filteredTests = tests.filter((test) => {
    if (activeTab === "all") return true
    if (activeTab === "passed") return test.status === "passed"
    if (activeTab === "failed") return test.status === "failed"
    if (activeTab === "pending") return test.status === "pending"
    return true
  })

  // Calculate test stats
  const passedCount = tests.filter((test) => test.status === "passed").length
  const failedCount = tests.filter((test) => test.status === "failed").length
  const pendingCount = tests.filter((test) => test.status === "pending" || test.status === "running").length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Runner</CardTitle>
        <CardDescription>Run and manage automated tests</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
              <CheckCircle className="mr-1 h-3 w-3" />
              {passedCount} Passed
            </Badge>
            <Badge variant="outline" className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
              <XCircle className="mr-1 h-3 w-3" />
              {failedCount} Failed
            </Badge>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
              <Clock className="mr-1 h-3 w-3" />
              {pendingCount} Pending
            </Badge>
          </div>

          <Button size="sm" onClick={handleRunTests} disabled={isRunning || selectedTests.length === 0}>
            {isRunning ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Tests
              </>
            )}
          </Button>
        </div>

        {isRunning && <Progress value={progress} className="h-2" />}

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All Tests</TabsTrigger>
            <TabsTrigger value="passed">Passed</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="border rounded-md">
              <div className="flex items-center p-2 border-b bg-muted/50">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={selectedTests.length === filteredTests.length && filteredTests.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all" className="text-xs font-medium">
                    Select All
                  </Label>
                </div>
              </div>

              <ScrollArea className="h-[300px]">
                {filteredTests.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No tests found</div>
                ) : (
                  <div className="divide-y">
                    {filteredTests.map((test) => (
                      <div key={test.id} className="p-3 hover:bg-muted/50">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id={`test-${test.id}`}
                            checked={selectedTests.includes(test.id)}
                            onCheckedChange={() => handleSelectTest(test.id)}
                            disabled={isRunning && test.status === "running"}
                          />

                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <Label htmlFor={`test-${test.id}`} className="font-medium cursor-pointer">
                                {test.name}
                              </Label>

                              <div className="flex items-center space-x-2">
                                {test.status === "passed" && (
                                  <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                    Passed
                                  </Badge>
                                )}
                                {test.status === "failed" && (
                                  <Badge variant="outline" className="bg-red-500/10 text-red-500">
                                    Failed
                                  </Badge>
                                )}
                                {test.status === "pending" && (
                                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                                    Pending
                                  </Badge>
                                )}
                                {test.status === "running" && (
                                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                                    <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                                    Running
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground">{test.description}</p>

                            {test.lastRun && (
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span>Last run: {test.lastRun.toLocaleString()}</span>
                                {test.duration && <span>Duration: {test.duration}ms</span>}
                              </div>
                            )}

                            {test.error && (
                              <div className="mt-2 p-2 bg-red-500/10 text-red-500 text-xs rounded">{test.error}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">{tests.length} total tests</div>
        <Button variant="outline" size="sm" disabled={isRunning}>
          <FileText className="mr-2 h-4 w-4" />
          Export Results
        </Button>
      </CardFooter>
    </Card>
  )
}

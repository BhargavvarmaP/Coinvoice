import React from "react"
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { type TestStatus } from "./test-runner"

interface TestCase {
  id: string
  name: string
  description: string
  component: string
  status: TestStatus
  duration?: number
}

interface TestListProps {
  tests: TestCase[]
  selectedTests: string[]
  onSelectTest: (testId: string) => void
  onSelectTestDetails: (testId: string) => void
}

export function TestList({ tests, selectedTests, onSelectTest, onSelectTestDetails }: TestListProps) {
  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "running":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: TestStatus) => {
    switch (status) {
      case "passed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Passed</Badge>
      case "failed":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>
      case "running":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Running</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  return (
    <div className="space-y-2">
      {tests.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          No tests found matching the current filter
        </div>
      ) : (
        tests.map((test) => (
          <div 
            key={test.id}
            className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Checkbox 
                checked={selectedTests.includes(test.id)}
                onCheckedChange={() => onSelectTest(test.id)}
                aria-label={`Select ${test.name} test`}
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  {getStatusIcon(test.status)}
                  <span className="font-medium">{test.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{test.component}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(test.status)}
              {test.duration && (
                <span className="text-sm text-muted-foreground">
                  {(test.duration / 1000).toFixed(2)}s
                </span>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onSelectTestDetails(test.id)}
                aria-label={`View details for ${test.name}`}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
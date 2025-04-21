import React from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, X } from "lucide-react"
import { type TestStatus } from "./test-runner"

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

interface TestDetailsProps {
  test: TestCase
  onClose: () => void
}

export function TestDetails({ test, onClose }: TestDetailsProps) {
  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-destructive" />
      case "running":
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusText = (status: TestStatus) => {
    switch (status) {
      case "passed":
        return "Passed"
      case "failed":
        return "Failed"
      case "running":
        return "Running"
      default:
        return "Pending"
    }
  }

  const getStatusColor = (status: TestStatus) => {
    switch (status) {
      case "passed":
        return "text-green-700"
      case "failed":
        return "text-red-700"
      case "running":
        return "text-blue-700"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{test.name}</h3>
          <p className="text-sm text-muted-foreground">{test.component}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {getStatusIcon(test.status)}
          <span className={`font-medium ${getStatusColor(test.status)}`}>
            {getStatusText(test.status)}
          </span>
        </div>
        {test.duration && (
          <Badge variant="outline" className="ml-2">
            {(test.duration / 1000).toFixed(2)}s
          </Badge>
        )}
      </div>

      <div>
        <h4 className="text-sm font-medium mb-1">Description</h4>
        <p className="text-sm">{test.description}</p>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-1">Steps</h4>
        <ScrollArea className="h-[120px] border rounded-md p-3">
          <ol className="list-decimal list-inside space-y-1">
            {test.steps.map((step, index) => (
              <li key={index} className="text-sm">{step}</li>
            ))}
          </ol>
        </ScrollArea>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-1">Expected Result</h4>
        <p className="text-sm">{test.expectedResult}</p>
      </div>

      {test.error && (
        <div>
          <h4 className="text-sm font-medium mb-1 text-destructive">Error</h4>
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
            {test.error}
          </div>
        </div>
      )}
    </div>
  )
}
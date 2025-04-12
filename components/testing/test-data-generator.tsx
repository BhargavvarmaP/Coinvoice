"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { generateMockData, testData } from "@/lib/mock-data"
import { useToast } from "@/components/ui/use-toast"
import { Download, RefreshCw, Database } from "lucide-react"

export function TestDataGenerator() {
  const [dataType, setDataType] = useState("all")
  const [count, setCount] = useState(10)
  const [includeErrors, setIncludeErrors] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedData, setGeneratedData] = useState<any>(null)

  const { toast } = useToast()

  const handleGenerateData = () => {
    setIsGenerating(true)

    // Simulate async operation
    setTimeout(() => {
      let data

      switch (dataType) {
        case "tokens":
          data = Array.from({ length: count }, () =>
            testData.generateToken({
              status: includeErrors ? (Math.random() > 0.7 ? "error" : undefined) : undefined,
            }),
          )
          break
        case "invoices":
          data = Array.from({ length: count }, () =>
            testData.generateInvoice({
              status: includeErrors ? (Math.random() > 0.7 ? "error" : undefined) : undefined,
            }),
          )
          break
        case "marketplace":
          data = Array.from({ length: count }, () =>
            testData.generateMarketplaceListing({
              status: includeErrors ? (Math.random() > 0.7 ? "expired" : undefined) : undefined,
            }),
          )
          break
        case "transactions":
          data = Array.from({ length: count }, () =>
            testData.generateTransaction({
              status: includeErrors ? (Math.random() > 0.7 ? "failed" : undefined) : undefined,
            }),
          )
          break
        case "users":
          data = Array.from({ length: count }, () => testData.generateUserProfile())
          break
        case "all":
        default:
          data = generateMockData(true)
          break
      }

      setGeneratedData(data)
      setIsGenerating(false)

      toast({
        title: "Data generated",
        description: `Successfully generated ${dataType === "all" ? "all" : count} ${dataType} test data items`,
      })
    }, 1000)
  }

  const handleDownloadData = () => {
    if (!generatedData) return

    const dataStr = JSON.stringify(generatedData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const a = document.createElement("a")
    a.href = url
    a.download = `coinvoice-test-data-${dataType}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Data downloaded",
      description: "Test data has been downloaded as a JSON file",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Data Generator</CardTitle>
        <CardDescription>Generate mock data for testing and development</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="generate">Generate Data</TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedData}>
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dataType">Data Type</Label>
              <Select value={dataType} onValueChange={setDataType}>
                <SelectTrigger id="dataType">
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Data</SelectItem>
                  <SelectItem value="tokens">Tokens</SelectItem>
                  <SelectItem value="invoices">Invoices</SelectItem>
                  <SelectItem value="marketplace">Marketplace Listings</SelectItem>
                  <SelectItem value="transactions">Transactions</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dataType !== "all" && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="count">Count: {count}</Label>
                </div>
                <Slider
                  id="count"
                  min={1}
                  max={100}
                  step={1}
                  value={[count]}
                  onValueChange={(value) => setCount(value[0])}
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch id="includeErrors" checked={includeErrors} onCheckedChange={setIncludeErrors} />
              <Label htmlFor="includeErrors">Include error states</Label>
            </div>

            <Button onClick={handleGenerateData} className="w-full" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Generate Data
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="preview">
            {generatedData && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md max-h-96 overflow-auto">
                  <pre className="text-xs">{JSON.stringify(generatedData, null, 2)}</pre>
                </div>

                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    {dataType === "all" ? "Complete dataset generated" : `${count} ${dataType} items generated`}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleDownloadData}>
                    <Download className="mr-2 h-4 w-4" />
                    Download JSON
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setGeneratedData(null)}>
          Clear
        </Button>
        <Button variant="secondary" onClick={handleGenerateData} disabled={isGenerating}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
          Regenerate
        </Button>
      </CardFooter>
    </Card>
  )
}

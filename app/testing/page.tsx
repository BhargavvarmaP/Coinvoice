"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TestDataGenerator } from "@/components/testing/test-data-generator"
import { TestRunner } from "@/components/testing/test-runner"
import { ProtectedRoute } from "@/components/protected-route"

export default function TestingPage() {
  return (
    <ProtectedRoute requiredPermissions={["manage_users"]}>
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Testing Tools</h1>
          <p className="text-muted-foreground">Tools for testing and development of the Coinvoice platform</p>
        </div>

        <Tabs defaultValue="data-generator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="data-generator">Data Generator</TabsTrigger>
            <TabsTrigger value="test-runner">Test Runner</TabsTrigger>
          </TabsList>

          <TabsContent value="data-generator" className="mt-6">
            <TestDataGenerator />
          </TabsContent>

          <TabsContent value="test-runner" className="mt-6">
            <TestRunner />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}

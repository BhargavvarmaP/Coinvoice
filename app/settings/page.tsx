"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotificationPreferences } from "@/components/settings/notification-preferences"
import { SecuritySettings } from "@/components/settings/security-settings"
import { DisplayPreferences } from "@/components/settings/display-preferences"
import { ApiKeyManagement } from "@/components/settings/api-key-management"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications")

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <NotificationPreferences />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="display">
          <DisplayPreferences />
        </TabsContent>

        <TabsContent value="api">
          <ApiKeyManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}

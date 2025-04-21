"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Bell, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function NotificationsTabContent() {
  const { toast } = useToast()
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    marketplaceAlerts: true,
    paymentConfirmations: true,
    securityAlerts: true,
    marketingEmails: false,
  })

  const handleNotificationChange = (setting: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [setting]: value }))
  }

  const saveSettings = () => {
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated successfully.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Manage how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="font-medium">Email Notifications</div>
              <div className="text-sm text-muted-foreground">Receive email notifications</div>
            </div>
          </div>
          <Switch
            checked={notificationSettings.emailNotifications}
            onCheckedChange={(value) => handleNotificationChange("emailNotifications", value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="font-medium">Marketplace Alerts</div>
              <div className="text-sm text-muted-foreground">Get notified about marketplace activities</div>
            </div>
          </div>
          <Switch
            checked={notificationSettings.marketplaceAlerts}
            onCheckedChange={(value) => handleNotificationChange("marketplaceAlerts", value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
              <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="font-medium">Payment Confirmations</div>
              <div className="text-sm text-muted-foreground">Receive payment confirmation notifications</div>
            </div>
          </div>
          <Switch
            checked={notificationSettings.paymentConfirmations}
            onCheckedChange={(value) => handleNotificationChange("paymentConfirmations", value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
              <Bell className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <div className="font-medium">Security Alerts</div>
              <div className="text-sm text-muted-foreground">Get notified about security events</div>
            </div>
          </div>
          <Switch
            checked={notificationSettings.securityAlerts}
            onCheckedChange={(value) => handleNotificationChange("securityAlerts", value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="font-medium">Marketing Emails</div>
              <div className="text-sm text-muted-foreground">Receive marketing and promotional emails</div>
            </div>
          </div>
          <Switch
            checked={notificationSettings.marketingEmails}
            onCheckedChange={(value) => handleNotificationChange("marketingEmails", value)}
          />
        </div>

        <Button onClick={saveSettings} className="gap-2">
          <Save className="h-4 w-4" />
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  )
}
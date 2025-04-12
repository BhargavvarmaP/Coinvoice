"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Globe, Lock, Moon, Paintbrush, Save, Shield, Sun } from 'lucide-react'
import { useTheme } from "next-themes"

export function Settings() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState("en")

  const [generalSettings, setGeneralSettings] = useState({
    darkMode: theme === "dark",
    compactMode: false,
    animations: true,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketplaceAlerts: true,
    paymentAlerts: true,
    securityAlerts: true,
  })

  const [privacySettings, setPrivacySettings] = useState({
    shareUsageData: true,
    showProfilePublicly: true,
    showWalletAddress: false,
  })

  const handleGeneralChange = (setting: string, value: boolean) => {
    if (setting === "darkMode") {
      setTheme(value ? "dark" : "light")
    }
    setGeneralSettings((prev) => ({ ...prev, [setting]: value }))
  }

  const handleNotificationChange = (setting: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [setting]: value }))
  }

  const handlePrivacyChange = (setting: string, value: boolean) => {
    setPrivacySettings((prev) => ({ ...prev, [setting]: value }))
  }

  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Settings</h1>
        <p className="text-foreground/70">Manage your application settings and preferences.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your application appearance and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
                    <Paintbrush className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Theme</div>
                    <div className="text-sm text-muted-foreground">Choose your preferred theme</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-muted p-1 rounded-full">
                  <Button
                    variant={theme === "light" ? "default" : "ghost"}
                    size="sm"
                    className={theme === "light" ? "bg-background shadow-sm" : ""}
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-4 w-4 mr-1" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "ghost"}
                    size="sm"
                    className={theme === "dark" ? "bg-background shadow-sm" : ""}
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-4 w-4 mr-1" />
                    Dark
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                    <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium">Language</div>
                    <div className="text-sm text-muted-foreground">Select your preferred language</div>
                  </div>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <Moon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="font-medium">Dark Mode</div>
                    <div className="text-sm text-muted-foreground">Enable dark mode for the application</div>
                  </div>
                </div>
                <Switch
                  checked={generalSettings.darkMode}
                  onCheckedChange={(value) => handleGeneralChange("darkMode", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Paintbrush className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium">Compact Mode</div>
                    <div className="text-sm text-muted-foreground">Use a more compact UI layout</div>
                  </div>
                </div>
                <Switch
                  checked={generalSettings.compactMode}
                  onCheckedChange={(value) => handleGeneralChange("compactMode", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
                    <Paintbrush className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Animations</div>
                    <div className="text-sm text-muted-foreground">Enable UI animations</div>
                  </div>
                </div>
                <Switch
                  checked={generalSettings.animations}
                  onCheckedChange={(value) => handleGeneralChange("animations", value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} className="gap-2">
                <Save className="h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive notifications via email</div>
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(value) => handleNotificationChange("emailNotifications", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                    <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive push notifications in your browser</div>
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(value) => handleNotificationChange("pushNotifications", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="font-medium">Marketplace Alerts</div>
                    <div className="text-sm text-muted-foreground">Get notified about marketplace activity</div>
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.marketplaceAlerts}
                  onCheckedChange={(value) => handleNotificationChange("marketplaceAlerts", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium">Payment Alerts</div>
                    <div className="text-sm text-muted-foreground">Get notified about payment activity</div>
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.paymentAlerts}
                  onCheckedChange={(value) => handleNotificationChange("paymentAlerts", value)}
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
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} className="gap-2">
                <Save className="h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your privacy preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Share Usage Data</div>
                    
                    <div className="text-sm text-muted-foreground">
                      Allow us to collect anonymous usage data to improve the app
                    </div>
                  </div>
                </div>
                <Switch
                  checked={privacySettings.shareUsageData}
                  onCheckedChange={(value) => handlePrivacyChange("shareUsageData", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                    <Lock className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium">Public Profile</div>
                    <div className="text-sm text-muted-foreground">Make your profile visible to other users</div>
                  </div>
                </div>
                <Switch
                  checked={privacySettings.showProfilePublicly}
                  onCheckedChange={(value) => handlePrivacyChange("showProfilePublicly", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="font-medium">Show Wallet Address</div>
                    <div className="text-sm text-muted-foreground">Display your wallet address on your public profile</div>
                  </div>
                </div>
                <Switch
                  checked={privacySettings.showWalletAddress}
                  onCheckedChange={(value) => handlePrivacyChange("showWalletAddress", value)}
                />
              </div>

              <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                  These actions are irreversible. Please proceed with caution.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50">
                    Delete All Data
                  </Button>
                  <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50">
                    Close Account
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} className="gap-2">
                <Save className="h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

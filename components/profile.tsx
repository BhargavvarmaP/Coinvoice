"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import {
  Bell,
  Copy,
  Edit,
  Key,
  Lock,
  Save,
  Shield,
  User,
  ShoppingCart,
  DollarSign,
  Loader2,
  Upload,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function Profile() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    company: user?.company || "Acme Inc.",
    walletAddress: user?.walletAddress || "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    marketplaceAlerts: true,
    paymentConfirmations: true,
    securityAlerts: true,
    marketingEmails: false,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    biometricLogin: false,
    sessionTimeout: "30",
    loginNotifications: true,
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (setting: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [setting]: value }))
  }

  const handleSecurityChange = (setting: string, value: boolean | string) => {
    setSecuritySettings((prev) => ({ ...prev, [setting]: value }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsEditing(false)
    setIsSaving(false)

    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: "The wallet address has been copied to your clipboard.",
    })
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
                  className="flex items-center gap-1"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : isEditing ? (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={user?.avatar || "/placeholder.svg?height=128&width=128"} alt="Profile" />
                    <AvatarFallback className="text-3xl">{getInitials(profileData.name)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Upload className="h-4 w-4" />
                      Change Avatar
                    </Button>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        disabled={!isEditing || isSaving}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        disabled={!isEditing || isSaving}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        value={profileData.company}
                        onChange={handleProfileChange}
                        disabled={!isEditing || isSaving}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="walletAddress">Wallet Address</Label>
                      <div className="relative">
                        <Input
                          id="walletAddress"
                          name="walletAddress"
                          value={profileData.walletAddress}
                          onChange={handleProfileChange}
                          disabled
                          className="pr-10"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => copyToClipboard(profileData.walletAddress)}
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              {isEditing && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
              <CardDescription>Overview of your account activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-card rounded-lg p-4 border border-border"
                >
                  <div className="text-sm text-muted-foreground mb-1">Total Invoices</div>
                  <div className="text-2xl font-bold text-primary">24</div>
                  <div className="text-xs text-green-600 dark:text-green-500 mt-1">+3 this month</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-card rounded-lg p-4 border border-border"
                >
                  <div className="text-sm text-muted-foreground mb-1">Total Value</div>
                  <div className="text-2xl font-bold text-primary">$45,780</div>
                  <div className="text-xs text-green-600 dark:text-green-500 mt-1">+$12,500 this month</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-card rounded-lg p-4 border border-border"
                >
                  <div className="text-sm text-muted-foreground mb-1">CoinPoints</div>
                  <div className="text-2xl font-bold gradient-text-orange">{user?.coinPoints || 1250}</div>
                  <div className="text-xs text-amber-600 dark:text-amber-500 mt-1">250 until next tier</div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
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
                    <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                      <ShoppingCart className="h-5 w-5 text-amber-600 dark:text-amber-400" />
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
                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                      <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
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
                      <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
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
                      <div className="text-sm text-muted-foreground">Receive promotional emails and updates</div>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(value) => handleNotificationChange("marketingEmails", value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() =>
                  toast({
                    title: "Notification Settings Saved",
                    description: "Your notification preferences have been updated.",
                  })
                }
              >
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(value) => handleSecurityChange("twoFactorAuth", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                      <User className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <div className="font-medium">Biometric Login</div>
                      <div className="text-sm text-muted-foreground">Use fingerprint or face recognition to log in</div>
                    </div>
                  </div>
                  <Switch
                    checked={securitySettings.biometricLogin}
                    onCheckedChange={(value) => handleSecurityChange("biometricLogin", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                      <Key className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium">Change Password</div>
                      <div className="text-sm text-muted-foreground">Update your account password</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast({
                        title: "Feature Coming Soon",
                        description: "Password change functionality will be available soon.",
                      })
                    }
                  >
                    Change
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                      <Bell className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <div className="font-medium">Login Notifications</div>
                      <div className="text-sm text-muted-foreground">
                        Get notified when someone logs into your account
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={securitySettings.loginNotifications}
                    onCheckedChange={(value) => handleSecurityChange("loginNotifications", value)}
                  />
                </div>

                <div className="border-t border-border pt-6">
                  <div className="font-medium mb-4">Recent Activity</div>
                  <div className="space-y-4">
                    {[
                      {
                        action: "Login",
                        device: "Chrome on Windows",
                        location: "New York, USA",
                        time: "Today, 10:30 AM",
                      },
                      {
                        action: "Password Changed",
                        device: "Firefox on MacOS",
                        location: "New York, USA",
                        time: "Yesterday, 3:15 PM",
                      },
                      {
                        action: "Login",
                        device: "Safari on iPhone",
                        location: "Boston, USA",
                        time: "Apr 8, 2025, 9:20 AM",
                      },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-card rounded-lg border border-border"
                      >
                        <div>
                          <div className="font-medium">{activity.action}</div>
                          <div className="text-sm text-muted-foreground">
                            {activity.device} • {activity.location}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">{activity.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() =>
                  toast({
                    title: "Security Settings Saved",
                    description: "Your security preferences have been updated.",
                  })
                }
              >
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="wallet" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Information</CardTitle>
              <CardDescription>Manage your blockchain wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-400 rounded-lg text-white">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-sm opacity-80">Coinvoice Wallet</div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                      <div className="text-sm">Connected</div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="text-sm opacity-80 mb-1">Wallet Address</div>
                    <div className="flex items-center gap-2">
                      <div className="font-mono text-sm truncate max-w-[300px]">{profileData.walletAddress}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full bg-white/20 hover:bg-white/30"
                        onClick={() => copyToClipboard(profileData.walletAddress)}
                      >
                        <Copy className="h-3 w-3" />
                        <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm opacity-80 mb-1">Balance</div>
                      <div className="text-xl font-bold">2.45 ETH</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-80 mb-1">USD Value</div>
                      <div className="text-xl font-bold">$4,532.50</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <div className="font-medium mb-2">Tokens</div>
                    <div className="space-y-3">
                      {[
                        { name: "CVT-1001", amount: "5,000", value: "$4,850" },
                        { name: "CVT-1002", amount: "12,000", value: "$11,520" },
                        { name: "CVT-1003", amount: "8,500", value: "$8,075" },
                      ].map((token, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="font-medium">{token.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {token.amount} ({token.value})
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card rounded-lg p-4 border border-border">
                    <div className="font-medium mb-2">Recent Transactions</div>
                    <div className="space-y-3">
                      {[
                        { type: "Sent", amount: "0.5 ETH", date: "Apr 10, 2025" },
                        { type: "Received", amount: "1.2 ETH", date: "Apr 5, 2025" },
                        { type: "Sent", amount: "0.3 ETH", date: "Mar 28, 2025" },
                      ].map((tx, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${tx.type === "Sent" ? "bg-amber-500" : "bg-green-500"}`}
                            ></div>
                            <div className="font-medium">{tx.type}</div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {tx.amount} • {tx.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 dark:from-blue-500 dark:to-blue-400 dark:hover:from-blue-600 dark:hover:to-blue-500"
                    onClick={() =>
                      toast({
                        title: "Feature Coming Soon",
                        description: "Deposit functionality will be available soon.",
                      })
                    }
                  >
                    Deposit
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 dark:from-amber-400 dark:to-yellow-300 dark:hover:from-amber-500 dark:hover:to-yellow-400"
                    onClick={() =>
                      toast({
                        title: "Feature Coming Soon",
                        description: "Withdraw functionality will be available soon.",
                      })
                    }
                  >
                    Withdraw
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      toast({
                        title: "Feature Coming Soon",
                        description: "Swap functionality will be available soon.",
                      })
                    }
                  >
                    Swap
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

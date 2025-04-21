"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lock, Shield, Key, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function SecurityTabContent() {
  const { toast } = useToast()
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    biometricLogin: false,
    sessionTimeout: "30",
    loginNotifications: true,
  })

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSecurityChange = (setting: string, value: boolean | string) => {
    setSecuritySettings((prev) => ({ ...prev, [setting]: value }))
  }

  const saveSettings = () => {
    toast({
      title: "Security Settings Saved",
      description: "Your security preferences have been updated successfully.",
    })
  }

  const changePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all password fields.",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    })

    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your account security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
              </div>
            </div>
            <Switch
              checked={securitySettings.twoFactorAuth}
              onCheckedChange={(value) => handleSecurityChange("twoFactorAuth", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="font-medium">Biometric Login</div>
                <div className="text-sm text-muted-foreground">Use fingerprint or face recognition</div>
              </div>
            </div>
            <Switch
              checked={securitySettings.biometricLogin}
              onCheckedChange={(value) => handleSecurityChange("biometricLogin", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <Key className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <div className="font-medium">Session Timeout</div>
                <div className="text-sm text-muted-foreground">Automatically log out after inactivity</div>
              </div>
            </div>
            <Select
              value={securitySettings.sessionTimeout}
              onValueChange={(value) => handleSecurityChange("sessionTimeout", value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select timeout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="font-medium">Login Notifications</div>
                <div className="text-sm text-muted-foreground">Get notified of new login attempts</div>
              </div>
            </div>
            <Switch
              checked={securitySettings.loginNotifications}
              onCheckedChange={(value) => handleSecurityChange("loginNotifications", value)}
            />
          </div>

          <Button onClick={saveSettings} className="gap-2">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button onClick={changePassword}>Change Password</Button>
        </CardContent>
      </Card>
    </div>
  )
}
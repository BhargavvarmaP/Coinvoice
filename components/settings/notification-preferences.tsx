"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface NotificationSettings {
  email: {
    enabled: boolean
    types: {
      transactions: boolean
      security: boolean
      marketing: boolean
    }
  }
  push: {
    enabled: boolean
    types: {
      transactions: boolean
      security: boolean
    }
  }
  telegram: {
    enabled: boolean
    types: {
      transactions: boolean
      security: boolean
    }
  }
}

export function NotificationPreferences() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      enabled: true,
      types: {
        transactions: true,
        security: true,
        marketing: false,
      },
    },
    push: {
      enabled: true,
      types: {
        transactions: true,
        security: true,
      },
    },
    telegram: {
      enabled: false,
      types: {
        transactions: false,
        security: false,
      },
    },
  })

  const handleSave = async () => {
    try {
      // TODO: Implement API call to save settings
      toast.success("Notification preferences saved")
    } catch (error) {
      toast.error("Failed to save preferences")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Manage your email notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-enabled">Enable Email Notifications</Label>
            <Switch
              id="email-enabled"
              checked={settings.email.enabled}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  email: { ...settings.email, enabled: checked },
                })
              }
            />
          </div>
          {settings.email.enabled && (
            <div className="space-y-4 pl-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-transactions">Transaction Updates</Label>
                <Switch
                  id="email-transactions"
                  checked={settings.email.types.transactions}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      email: {
                        ...settings.email,
                        types: {
                          ...settings.email.types,
                          transactions: checked,
                        },
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-security">Security Alerts</Label>
                <Switch
                  id="email-security"
                  checked={settings.email.types.security}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      email: {
                        ...settings.email,
                        types: {
                          ...settings.email.types,
                          security: checked,
                        },
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-marketing">Marketing Updates</Label>
                <Switch
                  id="email-marketing"
                  checked={settings.email.types.marketing}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      email: {
                        ...settings.email,
                        types: {
                          ...settings.email.types,
                          marketing: checked,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>
            Manage your push notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="push-enabled">Enable Push Notifications</Label>
            <Switch
              id="push-enabled"
              checked={settings.push.enabled}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  push: { ...settings.push, enabled: checked },
                })
              }
            />
          </div>
          {settings.push.enabled && (
            <div className="space-y-4 pl-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-transactions">Transaction Updates</Label>
                <Switch
                  id="push-transactions"
                  checked={settings.push.types.transactions}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      push: {
                        ...settings.push,
                        types: {
                          ...settings.push.types,
                          transactions: checked,
                        },
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-security">Security Alerts</Label>
                <Switch
                  id="push-security"
                  checked={settings.push.types.security}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      push: {
                        ...settings.push,
                        types: {
                          ...settings.push.types,
                          security: checked,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Telegram Notifications</CardTitle>
          <CardDescription>
            Connect your Telegram account for notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="telegram-enabled">Enable Telegram Notifications</Label>
            <Switch
              id="telegram-enabled"
              checked={settings.telegram.enabled}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  telegram: { ...settings.telegram, enabled: checked },
                })
              }
            />
          </div>
          {settings.telegram.enabled && (
            <div className="space-y-4 pl-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="telegram-transactions">Transaction Updates</Label>
                <Switch
                  id="telegram-transactions"
                  checked={settings.telegram.types.transactions}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      telegram: {
                        ...settings.telegram,
                        types: {
                          ...settings.telegram.types,
                          transactions: checked,
                        },
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="telegram-security">Security Alerts</Label>
                <Switch
                  id="telegram-security"
                  checked={settings.telegram.types.security}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      telegram: {
                        ...settings.telegram,
                        types: {
                          ...settings.telegram.types,
                          security: checked,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  )
} 
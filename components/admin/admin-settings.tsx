"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function AdminSettings() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Admin Settings</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input id="site-name" defaultValue="Coinvoice" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
              <Switch id="maintenance-mode" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="2fa-required">Require 2FA</Label>
              <Switch id="2fa-required" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="kyc-required">Require KYC</Label>
              <Switch id="kyc-required" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
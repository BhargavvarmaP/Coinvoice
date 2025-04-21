"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Copy, Edit, Loader2, Save, Upload } from "lucide-react"

export function ProfileTabContent({ user }: { user: any }) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    company: user?.company || "Acme Inc.",
    walletAddress: user?.walletAddress || "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
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
    </Card>
  )
}
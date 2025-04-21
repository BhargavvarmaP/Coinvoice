"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Key, Plus, Trash2, Eye, EyeOff } from "lucide-react"

interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: Date
  lastUsed?: Date
  permissions: string[]
}

export function ApiKeyManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Development Key",
      key: "sk_test_1234567890abcdef",
      createdAt: new Date("2024-01-01"),
      lastUsed: new Date("2024-03-15"),
      permissions: ["read", "write"],
    },
  ])
  const [showKey, setShowKey] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  const handleCreateKey = async () => {
    if (!newKeyName) {
      toast.error("Please enter a key name")
      return
    }

    try {
      // TODO: Implement API key creation
      const newKey: ApiKey = {
        id: Math.random().toString(36).substr(2, 9),
        name: newKeyName,
        key: "sk_test_" + Math.random().toString(36).substr(2, 24),
        createdAt: new Date(),
        permissions: selectedPermissions,
      }

      setApiKeys([...apiKeys, newKey])
      setIsCreateDialogOpen(false)
      setNewKeyName("")
      setSelectedPermissions([])
      toast.success("API key created successfully")
    } catch (error) {
      toast.error("Failed to create API key")
    }
  }

  const handleDeleteKey = async (id: string) => {
    try {
      // TODO: Implement API key deletion
      setApiKeys(apiKeys.filter((key) => key.id !== id))
      toast.success("API key deleted successfully")
    } catch (error) {
      toast.error("Failed to delete API key")
    }
  }

  const toggleShowKey = (id: string) => {
    setShowKey(showKey === id ? null : id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">API Keys</h2>
          <p className="text-sm text-muted-foreground">
            Manage your API keys for programmatic access
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Key
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell>{key.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-muted px-2 py-1">
                        {showKey === key.id
                          ? key.key
                          : "••••••••" + key.key.slice(-4)}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleShowKey(key.id)}
                      >
                        {showKey === key.id ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {key.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {key.lastUsed
                      ? key.lastUsed.toLocaleDateString()
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {key.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="rounded-full bg-muted px-2 py-1 text-xs"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteKey(key.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
            <DialogDescription>
              Create a new API key for programmatic access to your account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="key-name">Key Name</Label>
              <Input
                id="key-name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Development Key"
              />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="space-y-2">
                {["read", "write", "admin"].map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      id={permission}
                      checked={selectedPermissions.includes(permission)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPermissions([
                            ...selectedPermissions,
                            permission,
                          ])
                        } else {
                          setSelectedPermissions(
                            selectedPermissions.filter((p) => p !== permission)
                          )
                        }
                      }}
                    />
                    <Label htmlFor={permission}>{permission}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateKey}>Create Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
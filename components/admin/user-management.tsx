"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, MoreHorizontal, Search, UserPlus, Edit, Trash, Lock, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

// Mock user data
const MOCK_USERS = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    status: "active",
    walletAddress: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
    company: "Acme Inc.",
    coinPoints: 1250,
    createdAt: "2025-01-15T10:30:00Z",
    lastLogin: "2025-04-10T08:45:00Z",
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    walletAddress: "0x9a8b7c6d5e4f3g2h1i0j9k8l7m6n5o4p3q2r1s0t",
    company: "Coinvoice",
    coinPoints: 5000,
    createdAt: "2024-12-01T09:00:00Z",
    lastLogin: "2025-04-11T07:30:00Z",
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    status: "active",
    walletAddress: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u",
    company: "Tech Solutions",
    coinPoints: 850,
    createdAt: "2025-02-20T14:15:00Z",
    lastLogin: "2025-04-09T16:20:00Z",
  },
  {
    id: "4",
    name: "Robert Johnson",
    email: "robert@example.com",
    role: "user",
    status: "inactive",
    walletAddress: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v",
    company: "Global Enterprises",
    coinPoints: 320,
    createdAt: "2025-03-05T11:45:00Z",
    lastLogin: "2025-03-28T10:10:00Z",
  },
  {
    id: "5",
    name: "Emily Davis",
    email: "emily@example.com",
    role: "user",
    status: "active",
    walletAddress: "0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w",
    company: "Creative Solutions",
    coinPoints: 1780,
    createdAt: "2025-01-30T09:30:00Z",
    lastLogin: "2025-04-10T14:50:00Z",
  },
  {
    id: "6",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "user",
    status: "pending",
    walletAddress: "0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x",
    company: "Brown & Associates",
    coinPoints: 0,
    createdAt: "2025-04-09T15:20:00Z",
    lastLogin: null,
  },
]

export function UserManagement() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<(typeof MOCK_USERS)[0] | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { toast } = useToast()

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.company?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleEditUser = (user: (typeof MOCK_USERS)[0]) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleDeleteUser = (user: (typeof MOCK_USERS)[0]) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteUser = () => {
    if (!selectedUser) return

    setUsers(users.filter((user) => user.id !== selectedUser.id))
    setIsDeleteDialogOpen(false)

    toast({
      title: "User Deleted",
      description: `${selectedUser.name} has been deleted successfully.`,
    })
  }

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would create a new user via API
    setIsCreateDialogOpen(false)

    toast({
      title: "User Created",
      description: "New user has been created successfully.",
    })
  }

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would update the user via API
    setIsEditDialogOpen(false)

    toast({
      title: "User Updated",
      description: `${selectedUser?.name}'s information has been updated.`,
    })
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"

    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage users, roles, and permissions for your platform.</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage your platform users and their permissions.</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>CoinPoints</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    No users found matching your search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "outline"}>
                        {user.role === "admin" ? "Admin" : "User"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.status === "active"
                            ? "border-green-500 text-green-500"
                            : user.status === "inactive"
                              ? "border-red-500 text-red-500"
                              : "border-amber-500 text-amber-500"
                        }
                      >
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.coinPoints.toLocaleString()}</TableCell>
                    <TableCell>{formatDate(user.lastLogin)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteUser(user)}>
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Lock className="h-4 w-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <Button variant="outline" size="icon" disabled>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and permissions.</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input id="edit-name" defaultValue={selectedUser.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" type="email" defaultValue={selectedUser.email} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select defaultValue={selectedUser.role}>
                    <SelectTrigger id="edit-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select defaultValue={selectedUser.status}>
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-company">Company</Label>
                <Input id="edit-company" defaultValue={selectedUser.company || ""} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-coinpoints">CoinPoints</Label>
                <Input id="edit-coinpoints" type="number" defaultValue={selectedUser.coinPoints.toString()} />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={selectedUser.name} />
                  <AvatarFallback>{getInitials(selectedUser.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedUser.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDeleteUser}>
                  Delete User
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>Add a new user to your platform.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-name">Name</Label>
                <Input id="create-name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-email">Email</Label>
                <Input id="create-email" type="email" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-role">Role</Label>
                <Select defaultValue="user">
                  <SelectTrigger id="create-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-status">Status</Label>
                <Select defaultValue="active">
                  <SelectTrigger id="create-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-company">Company</Label>
              <Input id="create-company" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-password">Temporary Password</Label>
              <Input id="create-password" type="password" required />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

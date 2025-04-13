"use client"

import { Bell, Search, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample notifications data - in production this would come from your backend
const sampleNotifications = [
  {
    id: 1,
    type: "invoice",
    message: "New invoice received from Apple Inc",
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
    user: {
      name: "John Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
    }
  },
  {
    id: 2,
    type: "payment",
    message: "Payment of $5,000 received",
    createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: false,
    user: {
      name: "Sarah Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    }
  },
  {
    id: 3,
    type: "system",
    message: "System maintenance scheduled for tonight",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    user: {
      name: "System",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=System"
    }
  }
]

export function DashboardHeader() {
  const { unreadNotificationsCount } = useAppStore()

  const formatNotificationDate = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return 'Just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes}m ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours}h ago`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }
  }

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full",
      "border-b border-gray-200/50 dark:border-gray-800/50",
      "bg-white/75 dark:bg-gray-950/75 backdrop-blur-md",
      "supports-[backdrop-filter]:bg-white/60",
      "supports-[backdrop-filter]:dark:bg-gray-950/60"
    )}>
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <div className="flex flex-1 items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <form className="flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search transactions, invoices, users..."
                  className="w-[300px] pl-9 bg-white dark:bg-gray-900"
                />
              </div>
            </form>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                    2
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[380px]">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[400px] overflow-y-auto">
                  <AnimatePresence>
                    {sampleNotifications.length > 0 ? (
                      sampleNotifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={cn(
                            "flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors",
                            !notification.read && "bg-muted/30"
                          )}
                        >
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                            <AvatarFallback>
                              {notification.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm leading-none">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatNotificationDate(notification.createdAt)}
                            </p>
                          </div>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-primary hover:text-primary/80"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No new notifications
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
} 
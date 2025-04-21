"use client"

import type React from "react"
import { useState, lazy, Suspense, memo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
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
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// Lazy load tab contents
const ProfileTabContent = lazy(() => import('./profile/profile-tab').then(mod => ({ default: mod.ProfileTabContent })))
const NotificationsTabContent = lazy(() => import('@/components/profile/notifications-tab').then(mod => ({ default: mod.NotificationsTabContent })))
const SecurityTabContent = lazy(() => import('@/components/profile/security-tab').then(mod => ({ default: mod.SecurityTabContent })))
const WalletTabContent = lazy(() => import('@/components/profile/wallet-tab').then(mod => ({ default: mod.WalletTabContent })))

// Fallback component for lazy loading
const LazyLoadFallback = memo(() => (
  <div className="w-full h-40 flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
  </div>
))

// Memoized header component
const ProfileHeader = memo(({ title, description }: { title: string; description: string }) => (
  <div>
    <h1 className="text-3xl font-bold text-primary">{title}</h1>
    <p className="text-muted-foreground">{description}</p>
  </div>
))

export function Profile() {
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")

  // Prefetch critical paths
  useEffect(() => {
    router.prefetch("/wallet")
    router.prefetch("/settings")
    router.prefetch("/dashboard")
  }, [router])

  // Register service worker for caching
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(
          (registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          },
          (err) => {
            console.log('ServiceWorker registration failed: ', err);
          }
        );
      });
    }
  }, []);

  return (
    <div className="space-y-8">
      <ProfileHeader 
        title="Profile" 
        description="Manage your account settings and preferences." 
      />

      <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Suspense fallback={<LazyLoadFallback />}>
            <ProfileTabContent user={user} />
          </Suspense>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Suspense fallback={<LazyLoadFallback />}>
            <NotificationsTabContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Suspense fallback={<LazyLoadFallback />}>
            <SecurityTabContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="wallet" className="mt-6">
          <Suspense fallback={<LazyLoadFallback />}>
            <WalletTabContent />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

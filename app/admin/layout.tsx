import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute adminOnly>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8 pt-6 overflow-y-auto">{children}</main>
      </div>
    </ProtectedRoute>
  )
}

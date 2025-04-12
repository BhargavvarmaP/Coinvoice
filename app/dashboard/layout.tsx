import type React from "react"
import { EnhancedAppLayout } from "@/components/enhanced-app-layout"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <EnhancedAppLayout>{children}</EnhancedAppLayout>
}

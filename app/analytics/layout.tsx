import type React from "react"
import { AppLayoutAlt } from "@/components/app-layout-alt"

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayoutAlt>{children}</AppLayoutAlt>
}

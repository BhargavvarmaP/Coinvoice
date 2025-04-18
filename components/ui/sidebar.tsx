"use client"

import * as React from "react"
import { createContext, useContext, useState } from "react"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Context for sidebar state
type SidebarContextType = {
  open: boolean
  setOpen: (open: boolean) => void
  toggleOpen: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

// Sidebar Provider
interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
}

export function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  const [open, setOpen] = useState(defaultOpen)

  const toggleOpen = () => setOpen(!open)

  return <SidebarContext.Provider value={{ open, setOpen, toggleOpen }}>{children}</SidebarContext.Provider>
}

// Sidebar component
const sidebarVariants = cva(
  "fixed top-0 bottom-0 z-40 flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "w-64",
        sidebar: "w-64",
        minimal: "w-20",
      },
      side: {
        left: "left-0",
        right: "right-0",
      },
    },
    defaultVariants: {
      variant: "default",
      side: "left",
    },
  },
)

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "sidebar" | "minimal"
  side?: "left" | "right"
}

export function Sidebar({ className, variant, side, ...props }: SidebarProps) {
  const { open } = useSidebar()

  return <div className={cn(sidebarVariants({ variant, side }), open ? "w-64" : "w-20", className)} {...props} />
}

// Sidebar Header
interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  return <div className={cn("h-16 px-4 flex items-center border-b border-sidebar-border", className)} {...props} />
}

// Sidebar Content
interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarContent({ className, ...props }: SidebarContentProps) {
  return <div className={cn("flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent", className)} {...props} />
}

// Sidebar Footer
interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  return <div className={cn("h-16 px-4 flex items-center border-t border-sidebar-border", className)} {...props} />
}

// Sidebar Trigger
interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function SidebarTrigger({ className, ...props }: SidebarTriggerProps) {
  const { open, toggleOpen } = useSidebar()

  return (
    <Button variant="ghost" size="icon" className={cn("h-8 w-8", className)} onClick={toggleOpen} {...props}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={open ? "open" : "closed"}
          initial={{ opacity: 0, rotate: 180 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: -180 }}
          transition={{ duration: 0.2 }}
        >
          {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </motion.div>
      </AnimatePresence>
    </Button>
  )
}

// Sidebar Rail (thin line on the side when collapsed)
interface SidebarRailProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarRail({ className, ...props }: SidebarRailProps) {
  const { open } = useSidebar()

  return (
    <AnimatePresence>
      {!open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn("absolute top-0 bottom-0 right-0 w-0.5 bg-sidebar-border", className)}
          {...props}
        />
      )}
    </AnimatePresence>
  )
}

// Sidebar Inset (main content area)
interface SidebarInsetProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarInset({ className, ...props }: SidebarInsetProps) {
  const { open } = useSidebar()

  return (
    <div
      className={cn(
        "min-h-screen transition-all duration-300 ease-in-out",
        open ? "ml-64" : "ml-20",
        className
      )}
      {...props}
    />
  )
}

// Sidebar Menu
interface SidebarMenuProps extends React.HTMLAttributes<HTMLUListElement> {}

export function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  return <ul className={cn("space-y-1 px-2", className)} {...props} />
}

// Sidebar Menu Item
interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {}

export function SidebarMenuItem({ className, ...props }: SidebarMenuItemProps) {
  return <li className={cn("", className)} {...props} />
}

// Sidebar Menu Button
interface SidebarMenuButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string
}

export function SidebarMenuButton({
  className,
  asChild = false,
  isActive = false,
  tooltip,
  ...props
}: SidebarMenuButtonProps) {
  const { open } = useSidebar()
  const Comp = asChild ? React.Fragment : "div"
  const content = (
    <Comp
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors relative overflow-hidden hover:bg-sidebar-accent/50",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full before:bg-primary",
        className
      )}
      {...props}
    />
  )

  if (!open && tooltip) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return content
}

// Sidebar Group
interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroup({ className, ...props }: SidebarGroupProps) {
  return <div className={cn("px-3 py-2", className)} {...props} />
}

// Sidebar Group Label
interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroupLabel({ className, ...props }: SidebarGroupLabelProps) {
  const { open } = useSidebar()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className={cn("text-xs font-medium text-muted-foreground mb-2", className)}
          {...props}
        />
      )}
    </AnimatePresence>
  )
}

// Sidebar Separator
interface SidebarSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarSeparator({ className, ...props }: SidebarSeparatorProps) {
  return <div className={cn("h-px bg-sidebar-border my-2", className)} {...props} />
}

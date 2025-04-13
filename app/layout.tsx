import type { Metadata } from "next"
import { Inter, Montserrat, Roboto_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { AppSidebar } from "@/components/sidebar"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" })
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-roboto-mono" })

export const metadata: Metadata = {
  title: "Coinvoice",
  description: "Modern invoice financing platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${montserrat.variable} ${robotoMono.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="flex h-screen">
              <AppSidebar />
              <div className="flex-1">
                <header className="flex items-center justify-between border-b px-6 py-3">
                  <SearchBar />
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                        2
                      </Badge>
                    </Button>
                    <ThemeToggle />
                  </div>
                </header>
                <main className="h-[calc(100vh-4rem)] overflow-y-auto">
                  {children}
                </main>
              </div>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'
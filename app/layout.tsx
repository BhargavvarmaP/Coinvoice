import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { SessionProvider } from "next-auth/react"
import { Web3AuthProvider } from "@/contexts/web3auth-context"
import { DynamicProvider } from "@/components/providers/dynamic-provider"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CoInvoice",
  description: "Decentralized Invoice Management Platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <DynamicProvider>
            <Web3AuthProvider>
              <Providers>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  {children}
                  <Toaster />
                </ThemeProvider>
              </Providers>
            </Web3AuthProvider>
          </DynamicProvider>
        </SessionProvider>
      </body>
    </html>
  )
}


import './globals.css'
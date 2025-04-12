"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Briefcase, Shield, Ship, ArrowRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function InstrumentSupport() {
  const instruments = [
    {
      title: "Receivables (Invoices)",
      description:
        "Coinvoice Network offers a De-Centralized way to manage invoices. The technology revolutionizes how transactions are issued, validated, invoices are issued and payments are made.",
      icon: <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
      href: "/invoices",
      cta: "Tokenize Invoice",
      color: "from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10",
      borderColor: "border-blue-200/50 dark:border-blue-800/50",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      ctaColor: "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700",
    },
    {
      title: "Letter of Credit",
      description:
        "Coinvoice Network offers a De-Centralized way to manage letters of credit and electronic presentations. Buyers, sellers, banks and carriers can electronically exchange letters of credit, Electronic Bill of Lading (eBoL), insurance certificates and other trade documentation over a decentralized Blockchain network.",
      icon: <Briefcase className="h-8 w-8 text-purple-600 dark:text-purple-400" />,
      href: "/letters-of-credit",
      cta: "Issue Letter of Credit",
      color: "from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10",
      borderColor: "border-purple-200/50 dark:border-purple-800/50",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      ctaColor: "bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-600 dark:hover:bg-purple-700",
    },
    {
      title: "Guarantees",
      description:
        "Coinvoice Network enables organizations to create and manage guarantees and bonds from multiple financial institutions with full control and visibility. This reduces the risk of potential fraud, errors and cost of credit and administration.",
      icon: <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />,
      href: "/guarantees",
      cta: "Create Guarantee",
      color: "from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10",
      borderColor: "border-green-200/50 dark:border-green-800/50",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      ctaColor: "bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700",
    },
    {
      title: "Electronic Bill of Lading (eBoL)",
      description:
        "Coinvoice pioneers smart contract standards in collaboration with governments, supply chains, and port authorities, enhancing global trade transparency, efficiency, and security through MLTR and XDC Network.",
      icon: <Ship className="h-8 w-8 text-amber-600 dark:text-amber-400" />,
      href: "/ebol",
      cta: "Issue eBoL",
      color: "from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10",
      borderColor: "border-amber-200/50 dark:border-amber-800/50",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      ctaColor: "bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-600 dark:hover:bg-amber-700",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent">
          Instrument Support
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Manage and tokenize various trade finance instruments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {instruments.map((instrument, index) => (
          <motion.div
            key={instrument.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <Card
              className={cn(
                "h-full overflow-hidden border backdrop-blur-md",
                `bg-gradient-to-br ${instrument.color}`,
                instrument.borderColor,
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className={cn("p-3 rounded-lg", instrument.iconBg)}>{instrument.icon}</div>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="w-16 h-16 rounded-full bg-white/10 dark:bg-gray-900/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="text-xs font-medium text-center">
                      <span className="block">Tokenize</span>
                      <ArrowRight className="h-4 w-4 mx-auto mt-1" />
                    </div>
                  </motion.div>
                </div>
                <CardTitle className="mt-4">{instrument.title}</CardTitle>
                <CardDescription className="line-clamp-2">{instrument.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">{instrument.description}</p>
              </CardContent>
              <CardFooter>
                <Link href={instrument.href} className="w-full">
                  <Button className={cn("w-full", instrument.ctaColor)}>{instrument.cta}</Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 backdrop-blur-md border border-emerald-200/50 dark:border-emerald-800/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Explore Bonds</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Discover our securitization platform for bonds and other financial instruments
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 text-lg px-6">
                  Explore Bonds
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

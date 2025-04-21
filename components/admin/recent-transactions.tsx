"use client"

import { prisma } from "@/lib/prisma"
import { formatDistanceToNow } from "date-fns"

export async function RecentTransactions() {
  const transactions = await prisma.transaction.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      fromWallet: true,
      toWallet: true,
      user: true,
    },
  })

  return (
    <div className="space-y-8">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              {transaction.fromWallet.address.slice(0, 6)}...{transaction.fromWallet.address.slice(-4)}
              {" → "}
              {transaction.toWallet.address.slice(0, 6)}...{transaction.toWallet.address.slice(-4)}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(transaction.createdAt, { addSuffix: true })}
            </p>
          </div>
          <div className="ml-auto font-medium">
            ${transaction.amount.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
} 